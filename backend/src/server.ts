import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes.js';

/**
 * Crée et configure le serveur Fastify avec tous les middlewares et routes
 * @returns Instance Fastify configurée
 */
export async function createServer() {
  const server = Fastify({ logger: true });
  const corsOrigin = process.env.CORS_ORIGIN || true;
  await server.register(cors, { origin: corsOrigin as any });

  server.addHook('onSend', async (_req, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');
    reply.header('Referrer-Policy', 'no-referrer');
    reply.header('X-XSS-Protection', '0');
    return payload;
  });

  await routes(server);
  return server;
}
