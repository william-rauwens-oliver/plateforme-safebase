import type { FastifyInstance } from 'fastify';
import { encrypt, decrypt } from './crypto.js';

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Encryption' }));
  app.get('/health', async () => ({ status: 'ok' }));

  // Exemple d'utilisation du chiffrement
  app.post('/encrypt-test', async (req, reply) => {
    const { text } = req.body as { text: string };
    const encrypted = await encrypt(text);
    return { encrypted };
  });

  app.post('/decrypt-test', async (req, reply) => {
    const { encrypted } = req.body as { encrypted: string };
    const decrypted = await decrypt(encrypted);
    return { decrypted };
  });
}
