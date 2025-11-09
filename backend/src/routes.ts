import type { FastifyInstance } from 'fastify';

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Scheduler' }));
  app.get('/health', async () => ({ status: 'ok' }));

  // Endpoints pour le monitoring du scheduler
  app.get('/scheduler/heartbeat', async () => {
    // Le scheduler envoie un heartbeat via POST
    // Ici on retourne juste un endpoint pour vérifier l'état
    return { lastHeartbeat: null };
  });

  app.post('/scheduler/heartbeat', async () => {
    // Le scheduler envoie un heartbeat ici
    // Le code complet de gestion est dans le scheduler lui-même
    return { ok: true };
  });

  // Le scheduler appelle /backup-all qui doit être implémenté dans feature/bulk-backup
}
