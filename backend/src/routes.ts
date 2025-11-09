import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import type { FastifyInstance } from 'fastify';
import { Store } from './store.js';

const exec = promisify(execCb);

async function sendAlert(type: string, payload: unknown) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    const body = JSON.stringify({ type, timestamp: new Date().toISOString(), payload });
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch {}
}

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Restore' }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/databases', async () => await Store.getDatabases());
  app.get('/backups/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const versions = Store.getVersions().filter(v => v.databaseId === id);
    return versions.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  });

  app.post('/restore/:versionId', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const v = Store.getVersions().find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    const allDbs = await Store.getDatabases();
    const db = allDbs.find(d => d.id === v.databaseId);
    if (!db) return reply.code(404).send({ message: 'database not found' });

    const escapeShell = (str: string) => {
      return str.replace(/'/g, "'\\''").replace(/([;&|`$<>])/g, '\\$1');
    };

    const cmd = db.engine === 'mysql'
      ? `mysql -h ${db.host} -P ${db.port} -u ${escapeShell(db.username)} -p'${escapeShell(db.password)}' ${escapeShell(db.database)} < ${v.path}`
      : (db.password ? `PGPASSWORD='${escapeShell(db.password)}' psql` : `psql`) + ` -h ${db.host} -p ${db.port} -U ${escapeShell(db.username)} -d ${escapeShell(db.database)} -f ${v.path}`;

    try {
      const useFakeDump = process.env.FAKE_DUMP === '1';
      if (useFakeDump) {
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
        error: errorMsg
      });
    }
  });
}
