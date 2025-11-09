#!/usr/bin/env python3
"""
Script pour créer des versions simplifiées de routes.ts pour chaque branche feature/
"""
import re

# Lire le fichier routes.ts complet depuis main
with open('backend/src/routes.ts', 'r', encoding='utf-8') as f:
    full_routes = f.read()

# Extraire les sections nécessaires
def extract_section(content, start_pattern, end_pattern):
    """Extrait une section entre deux patterns"""
    start_match = re.search(start_pattern, content)
    if not start_match:
        return None
    start_pos = start_match.start()
    
    end_match = re.search(end_pattern, content, pos=start_pos)
    if not end_match:
        return content[start_pos:]
    return content[start_pos:end_match.end()]

# Pour feature/manual-backup: garder uniquement POST /backup/:id
manual_backup_code = """
import { randomUUID } from 'crypto';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { statSync, rmSync, existsSync } from 'fs';
import type { FastifyInstance } from 'fastify';
import { Store } from './store.js';
import { BackupVersionMeta, RegisteredDatabase } from './types.js';
import pg from 'pg';

const exec = promisify(execCb);
const { Client: PgClient } = pg;

async function tryGrantPostgresPermissions(db: RegisteredDatabase): Promise<boolean> {
  if (db.engine !== 'postgres') return true;
  try {
    const hostForConnection = db.host === 'localhost' ? '127.0.0.1' : db.host;
    const client = new PgClient({
      host: hostForConnection,
      port: db.port,
      user: db.username,
      password: db.password || '',
      database: db.database,
      connectionTimeoutMillis: 5000,
    });
    await client.connect();
    const superCheck = await client.query('SELECT usesuper FROM pg_user WHERE usename = current_user');
    const isSuper = superCheck.rows[0]?.usesuper === true;
    if (isSuper) {
      try {
        await client.query('GRANT SELECT ON ALL TABLES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
        await client.query('GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
        await client.end();
        return true;
      } catch {
        await client.end();
        return false;
      }
    }
    await client.end();
    return false;
  } catch {
    return false;
  }
}

async function sendAlert(type: string, payload: unknown) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    const body = JSON.stringify({ type, timestamp: new Date().toISOString(), payload });
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch {}
}

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
      await sendAlert('backup_failed', { id, error: errorMsg });
      return reply.code(500).send({ 
        message: 'backup failed',
        error: errorMsg
      });
    }
  });
}
"""

print("Script créé pour générer les routes simplifiées")

