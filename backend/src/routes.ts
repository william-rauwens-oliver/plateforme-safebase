import { randomUUID } from 'crypto';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { statSync, rmSync, existsSync } from 'fs';
import type { FastifyInstance } from 'fastify';
import { Store } from './store.js';
import { BackupVersionMeta } from './types.js';

const exec = promisify(execCb);

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Manual Backup' }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/databases', async () => await Store.getDatabases());

  app.post('/backup/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const allDbs = await Store.getDatabases();
    const db = allDbs.find(d => d.id === id);
    if (!db) return reply.code(404).send({ message: 'database not found' });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${db.name}_${ts}.${db.engine === 'mysql' ? 'sql' : 'sql'}`;
    const outPath = join(Store.paths.backupsDir, db.id, filename);

    await import('fs/promises').then(async fs => {
      await fs.mkdir(join(Store.paths.backupsDir, db.id), { recursive: true });
    });

    const findMysqldump = () => {
      const mamp80 = '/Applications/MAMP/Library/bin/mysql80/bin/mysqldump';
      const mamp57 = '/Applications/MAMP/Library/bin/mysql57/bin/mysqldump';
      if (existsSync(mamp80)) return mamp80;
      if (existsSync(mamp57)) return mamp57;
      return 'mysqldump';
    };

    const escapeShell = (str: string) => {
      return str.replace(/'/g, "'\\''").replace(/([;&|`$<>])/g, '\\$1');
    };

    const escapePath = (path: string) => {
      return path.replace(/'/g, "'\\''").replace(/([;&|`$<>()])/g, '\\$1');
    };

    const hostForBackup = db.engine === 'postgres' && db.host === 'localhost' ? '127.0.0.1' : db.host;

    let cmd: string;
    if (db.engine === 'mysql') {
      cmd = `${findMysqldump()} -h ${escapeShell(db.host)} -P ${db.port} -u ${escapeShell(db.username)} -p'${escapeShell(db.password)}' ${escapeShell(db.database)} > ${escapePath(outPath)}`;
    } else {
      const pgDumpBase = db.password ? `PGPASSWORD='${escapeShell(db.password)}' pg_dump` : `pg_dump`;
      cmd = `${pgDumpBase} -h ${escapeShell(hostForBackup)} -p ${db.port} -U ${escapeShell(db.username)} -d ${escapeShell(db.database)} -F p --no-owner --no-privileges -f ${escapePath(outPath)}`;
    }

    try {
      const useFakeDump = process.env.FAKE_DUMP === '1';
      if (useFakeDump) {
        app.log.warn({ message: 'Using FAKE_DUMP mode (testing only)', database: db.name });
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
      return reply.code(500).send({ 
        message: 'backup failed',
        error: errorMsg
      });
    }
  });
}
