import type { FastifyInstance } from 'fastify';
import { Store } from './store.js';

async function sendAlert(type: string, payload: unknown) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    const body = JSON.stringify({ type, timestamp: new Date().toISOString(), payload });
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch {}
}

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Alerts System' }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/databases', async () => await Store.getDatabases());

  // Exemple d'utilisation des alertes
  app.post('/test-alert', async (req, reply) => {
    await sendAlert('test', { message: 'Test alert from API' });
    return { sent: true };
  });
}
