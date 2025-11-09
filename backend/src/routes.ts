import { createReadStream, rmSync } from 'fs';
import type { FastifyInstance } from 'fastify';
import { Store } from './store.js';

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Version Management' }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/databases', async () => await Store.getDatabases());

  app.get('/backups/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const versions = Store.getVersions().filter(v => v.databaseId === id);
    return versions.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
  });

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
