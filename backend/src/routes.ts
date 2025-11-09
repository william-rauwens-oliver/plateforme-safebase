import type { FastifyInstance } from 'fastify';
import { Store } from './store.js';

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Scheduler' }));
  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/scheduler/heartbeat', async () => Store.getSchedulerInfo());
  app.post('/scheduler/heartbeat', async () => {
    Store.setSchedulerHeartbeat(new Date().toISOString());
    return { ok: true };
  });

  app.get('/databases', async () => await Store.getDatabases());
  app.post('/backup-all', async (_req, reply) => {
    // Cette route est appelée par le scheduler
    // Le code complet est dans feature/bulk-backup
    return reply.code(501).send({ message: 'Backup-all endpoint not implemented in scheduler branch' });
  });
}
