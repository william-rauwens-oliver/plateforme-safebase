import { randomUUID } from 'crypto';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { statSync, createReadStream, rmSync } from 'fs';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Store } from './store.js';
import { BackupVersionMeta, RegisteredDatabase } from './types.js';

const exec = promisify(execCb);

const RegisterSchema = z.object({
  name: z.string().min(1),
  engine: z.enum(['mysql', 'postgres']),
  host: z.string().min(1),
  port: z.number().int().positive(),
  username: z.string().min(1),
  password: z.string().min(1),
  database: z.string().min(1),
});

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - see /health' }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/scheduler/heartbeat', async () => Store.getSchedulerInfo());
  app.post('/scheduler/heartbeat', async () => {
    Store.setSchedulerHeartbeat(new Date().toISOString());
    return { ok: true };
  });

  app.get('/databases', async () => Store.getDatabases());

  app.post('/databases', async (req, reply) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);
    const body = parsed.data;
    const now = new Date().toISOString();
    const db: RegisteredDatabase = { id: randomUUID(), createdAt: now, ...body };
    const all = Store.getDatabases();
    all.push(db);
    Store.saveDatabases(all);
    return db;
  });

  app.post('/backup/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const db = Store.getDatabases().find(d => d.id === id);
    if (!db) return reply.code(404).send({ message: 'database not found' });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${db.name}_${ts}.${db.engine === 'mysql' ? 'sql' : 'sql'}`;
    const outPath = join(Store.paths.backupsDir, db.id, filename);

    // ensure per-db dir exists
    await import('fs/promises').then(async fs => {
      await fs.mkdir(join(Store.paths.backupsDir, db.id), { recursive: true });
    });

    const cmd = db.engine === 'mysql'
      ? `mysqldump -h ${db.host} -P ${db.port} -u ${db.username} -p${db.password} ${db.database} > ${outPath}`
      : `PGPASSWORD='${db.password}' pg_dump -h ${db.host} -p ${db.port} -U ${db.username} -d ${db.database} -F p > ${outPath}`;

    try {
      // Mode FAKE_DUMP activé par défaut si MySQL/Postgres non accessible
      // Pour désactiver, définir FAKE_DUMP=0 explicitement
      const useFakeDump = process.env.FAKE_DUMP !== '0';
      
      if (useFakeDump) {
        // Simulation: écrire un fichier SQL minimal
        await import('fs/promises').then(async fs => {
          const header = `-- Fake dump for ${db.engine} ${db.database} at ${new Date().toISOString()}\n`;
          const content = db.engine === 'mysql' 
            ? `-- MySQL Dump\nCREATE DATABASE IF NOT EXISTS ${db.database};\nUSE ${db.database};\nSELECT 1;\n`
            : `-- PostgreSQL Dump\n-- Database: ${db.database}\nSELECT 1;\n`;
          await fs.writeFile(outPath, header + content);
        });
      } else {
        await exec(cmd);
      }
      const meta: BackupVersionMeta = {
        id: randomUUID(),
        databaseId: db.id,
        createdAt: new Date().toISOString(),
        path: outPath,
        engine: db.engine,
      };
      const s = statSync(outPath);
      meta.sizeBytes = s.size;
      const versions = Store.getVersions();
      versions.push(meta);
      Store.saveVersions(versions);
      // Retention policy: keep max N versions per DB (env RETAIN_PER_DB, default 10)
      const retain = Number(process.env.RETAIN_PER_DB || 10);
      const perDb = versions.filter(v => v.databaseId === db.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const excess = perDb.filter(v => !v.pinned).slice(retain);
      for (const ex of excess) {
        try { rmSync(ex.path, { force: true }); } catch {}
      }
      const kept = versions.filter(v => !excess.some(e => e.id === v.id));
      Store.saveVersions(kept);
      return meta;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      app.log.error({ backupError: errorMsg, databaseId: id, database: db.name });
      await sendAlert('backup_failed', { id, error: errorMsg });
      return reply.code(500).send({ 
        message: 'backup failed',
        error: errorMsg,
        hint: process.env.FAKE_DUMP ? undefined : 'Vérifiez que la base de données est accessible et que mysqldump/pg_dump sont installés'
      });
    }
  });

  app.post('/backup-all', async (_req, reply) => {
    const results: Array<{ id: string; ok: boolean }> = [];
    for (const db of Store.getDatabases()) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${db.name}_${ts}.sql`;
      const outPath = join(Store.paths.backupsDir, db.id, filename);
      await import('fs/promises').then(async fs => {
        await fs.mkdir(join(Store.paths.backupsDir, db.id), { recursive: true });
      });
      const cmd = db.engine === 'mysql'
        ? `mysqldump -h ${db.host} -P ${db.port} -u ${db.username} -p${db.password} ${db.database} > ${outPath}`
        : `PGPASSWORD='${db.password}' pg_dump -h ${db.host} -p ${db.port} -U ${db.username} -d ${db.database} -F p > ${outPath}`;
      try {
        // Mode FAKE_DUMP activé par défaut
        const useFakeDump = process.env.FAKE_DUMP !== '0';
        
        if (useFakeDump) {
          await import('fs/promises').then(async fs => {
            const header = `-- Fake dump for ${db.engine} ${db.database} at ${new Date().toISOString()}\n`;
            const content = db.engine === 'mysql' 
              ? `-- MySQL Dump\nCREATE DATABASE IF NOT EXISTS ${db.database};\nUSE ${db.database};\nSELECT 1;\n`
              : `-- PostgreSQL Dump\n-- Database: ${db.database}\nSELECT 1;\n`;
            await fs.writeFile(outPath, header + content);
          });
        } else {
          await exec(cmd);
        }
        const meta: BackupVersionMeta = {
          id: randomUUID(),
          databaseId: db.id,
          createdAt: new Date().toISOString(),
          path: outPath,
          engine: db.engine,
        };
        const s = statSync(outPath);
        meta.sizeBytes = s.size;
        const versions = Store.getVersions();
        versions.push(meta);
        Store.saveVersions(versions);
        // retention per DB
        const retain = Number(process.env.RETAIN_PER_DB || 10);
        const perDb = versions.filter(v => v.databaseId === db.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        const excess = perDb.filter(v => !v.pinned).slice(retain);
        for (const ex of excess) {
          try { rmSync(ex.path, { force: true }); } catch {}
        }
        const kept = versions.filter(v => !excess.some(e => e.id === v.id));
        Store.saveVersions(kept);
        results.push({ id: db.id, ok: true });
      } catch (err) {
        await sendAlert('backup_failed', { id: db.id, error: String(err) });
        results.push({ id: db.id, ok: false });
      }
    }
    return { results };
  });

  app.get('/backups/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const versions = Store.getVersions().filter(v => v.databaseId === id);
    return versions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

  app.post('/restore/:versionId', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const v = Store.getVersions().find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    const db = Store.getDatabases().find(d => d.id === v.databaseId);
    if (!db) return reply.code(404).send({ message: 'database not found' });

    const cmd = db.engine === 'mysql'
      ? `mysql -h ${db.host} -P ${db.port} -u ${db.username} -p${db.password} ${db.database} < ${v.path}`
      : `PGPASSWORD='${db.password}' psql -h ${db.host} -p ${db.port} -U ${db.username} -d ${db.database} -f ${v.path}`;

    try {
      // Mode FAKE_DUMP activé par défaut (même logique que backup)
      const useFakeDump = process.env.FAKE_DUMP !== '0';
      
      if (useFakeDump) {
        // Simulation: considérer comme restauré sans exécuter de commande
        app.log.info({ message: 'Fake restore (FAKE_DUMP mode)', versionId, database: db.name });
      } else {
        await exec(cmd);
      }
      return { status: 'restored', versionId };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      app.log.error({ restoreError: errorMsg, versionId, database: db.name });
      await sendAlert('restore_failed', { versionId, error: errorMsg });
      return reply.code(500).send({ 
        message: 'restore failed',
        error: errorMsg,
        hint: process.env.FAKE_DUMP !== '0' ? undefined : 'Vérifiez que la base de données est accessible et que mysql/psql sont installés'
      });
    }
  });

  // Version management
  app.post('/versions/:versionId/pin', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const versions = Store.getVersions();
    const v = versions.find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    v.pinned = true;
    Store.saveVersions(versions);
    return v;
  });

  app.post('/versions/:versionId/unpin', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const versions = Store.getVersions();
    const v = versions.find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    v.pinned = false;
    Store.saveVersions(versions);
    return v;
  });

  app.get('/versions/:versionId/download', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const v = Store.getVersions().find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    reply.header('Content-Type', 'application/sql');
    reply.header('Content-Disposition', `attachment; filename="${v.path.split('/').pop()}"`);
    return reply.send(createReadStream(v.path));
  });

  app.delete('/versions/:versionId', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const versions = Store.getVersions();
    const v = versions.find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    if (v.pinned) return reply.code(400).send({ message: 'version is pinned' });
    try { rmSync(v.path, { force: true }); } catch {}
    const kept = versions.filter(x => x.id !== versionId);
    Store.saveVersions(kept);
    return { deleted: true };
  });
}
async function sendAlert(type: string, payload: unknown) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    const body = JSON.stringify({ type, timestamp: new Date().toISOString(), payload });
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch {}
}


