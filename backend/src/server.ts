import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Store } from './store.js';
import { routes } from './routes.js';

export async function createServer() {
  const server = Fastify({ logger: true });
  Store.init();
  const corsOrigin = process.env.CORS_ORIGIN || true;
  await server.register(cors, { origin: corsOrigin as any });

  server.addHook('onSend', async (_req, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');
    reply.header('Referrer-Policy', 'no-referrer');
    reply.header('X-XSS-Protection', '0');
    return payload;
  });

  server.addHook('onRequest', async (req, reply) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;
    const url = req.url;
    if (url === '/health') return;
    if (url.startsWith('/scheduler/heartbeat')) return;
    const provided = req.headers['x-api-key'];
    if (provided !== apiKey) {
      return reply.code(401).send({ message: 'unauthorized' });
    }
  });
  await routes(server);
  return server;
}
