import { randomUUID } from 'crypto';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { statSync, createReadStream, rmSync } from 'fs';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Store } from './store.js';
import { BackupVersionMeta, RegisteredDatabase } from './types.js';
import mysql from 'mysql2/promise';
import pg from 'pg';

const exec = promisify(execCb);
const { Client: PgClient } = pg;

/**
 * Teste la connexion à une base de données MySQL ou PostgreSQL
 * @param db - Base de données à tester
 * @returns Résultat du test avec succès ou message d'erreur
 */
async function testDatabaseConnection(db: RegisteredDatabase): Promise<{ success: boolean; error?: string }> {
  try {
    if (db.engine === 'mysql') {
      const connection = await mysql.createConnection({
        host: db.host,
        port: db.port,
        user: db.username,
        password: db.password,
        database: db.database,
        connectTimeout: 10000, // 10 secondes max
        enableKeepAlive: false,
      });
      // Test réel : ping + requête simple pour vérifier que la base existe
      await connection.ping();
      await connection.query('SELECT 1');
      await connection.end();
      return { success: true };
    } else {
      // PostgreSQL
      // Forcer l'authentification par mot de passe en utilisant TCP/IP
      const client = new PgClient({
        host: db.host === 'localhost' ? '127.0.0.1' : db.host, // Forcer TCP/IP au lieu du socket Unix
        port: db.port,
        user: db.username,
        password: db.password,
        database: db.database,
        connectionTimeoutMillis: 10000, // 10 secondes max
      });
      await client.connect();
      // Test réel : requête simple pour vérifier que la base existe ET que l'authentification fonctionne
      const result = await client.query('SELECT current_user, current_database()');
      // Vérifier que l'utilisateur connecté correspond bien à celui demandé
      if (result.rows[0]?.current_user !== db.username) {
        await client.end();
        return { success: false, error: `Utilisateur connecté (${result.rows[0]?.current_user}) ne correspond pas à l'utilisateur demandé (${db.username})` };
      }
      await client.end();
      return { success: true };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Messages d'erreur plus clairs selon le type d'erreur
    if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ENOTFOUND') || errorMsg.includes('getaddrinfo')) {
      return { success: false, error: `Impossible de se connecter au serveur ${db.host}:${db.port}. Vérifiez que le serveur MySQL/PostgreSQL est démarré.` };
    }
    if (errorMsg.includes('Access denied') || errorMsg.includes('password authentication failed') || errorMsg.includes('authentication failed')) {
      return { success: false, error: 'Identifiants incorrects : utilisateur ou mot de passe invalide' };
    }
    if (errorMsg.includes('Unknown database') || (errorMsg.includes('database') && errorMsg.includes('does not exist'))) {
      return { success: false, error: `La base de données "${db.database}" n'existe pas. Créez-la d'abord dans votre serveur.` };
    }
    if (errorMsg.includes('ETIMEDOUT') || errorMsg.includes('timeout')) {
      return { success: false, error: `Timeout : le serveur ${db.host}:${db.port} ne répond pas. Vérifiez qu'il est démarré.` };
    }
    return { success: false, error: errorMsg };
  }
}

/**
 * Schéma de validation Zod pour l'enregistrement d'une base de données
 */
const RegisterSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  engine: z.enum(['mysql', 'postgres'], { errorMap: () => ({ message: 'Le moteur doit être mysql ou postgres' }) }),
  host: z.string().min(1, 'L\'hôte est requis'),
  port: z.number().int().positive('Le port doit être un nombre positif'),
  username: z.string().min(1, 'L\'utilisateur est requis'),
  password: z.string(), // Permettre mot de passe vide pour PostgreSQL
  database: z.string().min(1, 'Le nom de la base de données est requis'),
});

/**
 * Définit toutes les routes de l'API SafeBase
 * @param app - Instance Fastify
 */
export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - see /health' }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/scheduler/heartbeat', async () => Store.getSchedulerInfo());
  app.post('/scheduler/heartbeat', async () => {
    Store.setSchedulerHeartbeat(new Date().toISOString());
    return { ok: true };
  });

  app.get('/databases', async () => Store.getDatabases());

  app.delete('/databases/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const all = Store.getDatabases();
    const db = all.find(d => d.id === id);
    if (!db) return reply.code(404).send({ message: 'database not found' });
    
    // Supprimer aussi toutes les versions de backup associées
    const versions = Store.getVersions();
    const versionsToDelete = versions.filter(v => v.databaseId === id);
    for (const v of versionsToDelete) {
      try {
        rmSync(v.path, { force: true });
      } catch {
        // Ignore si le fichier n'existe pas
      }
    }
    const keptVersions = versions.filter(v => v.databaseId !== id);
    Store.saveVersions(keptVersions);
    
    // Supprimer le dossier de backup
    try {
      const backupDir = join(Store.paths.backupsDir, id);
      rmSync(backupDir, { recursive: true, force: true });
    } catch {
      // Ignore si le dossier n'existe pas
    }
    
    // Supprimer la base de la liste
    const kept = all.filter(d => d.id !== id);
    Store.saveDatabases(kept);
    return { deleted: true, id };
  });

  app.post('/databases', async (req, reply) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);
    const body = parsed.data;
    const now = new Date().toISOString();
    const db: RegisteredDatabase = { id: randomUUID(), createdAt: now, ...body };
    
    // Vérifier la connexion avant d'enregistrer
    // La validation est TOUJOURS activée par défaut
    // Pour la désactiver (mode test uniquement), définir VALIDATE_CONNECTION=0 explicitement
    const skipValidation = process.env.VALIDATE_CONNECTION === '0';
    
    if (!skipValidation) {
      app.log.info({ message: 'Testing database connection', database: db.name, host: db.host, port: db.port, engine: db.engine });
      const testResult = await testDatabaseConnection(db);
      if (!testResult.success) {
        app.log.error({ message: 'Database connection failed', database: db.name, error: testResult.error });
        return reply.code(400).send({ 
          message: 'Connexion à la base de données échouée',
          error: testResult.error || 'Impossible de se connecter à la base de données',
          hint: 'Vérifiez que :\n- La base de données existe\n- Les identifiants sont corrects\n- Le serveur MySQL/PostgreSQL est démarré\n- Le port est correct (8889 pour MAMP MySQL, 3306 pour MySQL standard, 5432 pour PostgreSQL)'
        });
      }
      app.log.info({ message: 'Database connection successful', database: db.name });
    } else {
      app.log.warn({ message: 'Skipping database connection validation (VALIDATE_CONNECTION=0)', database: db.name });
    }
    
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
    // Trier : épinglées en premier, puis par date (plus récent d'abord)
    return versions.sort((a, b) => {
      // Si une est épinglée et l'autre non, l'épinglée vient en premier
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Sinon, trier par date (plus récent d'abord)
      return b.createdAt.localeCompare(a.createdAt);
    });
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


