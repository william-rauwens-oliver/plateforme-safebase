import { randomUUID } from 'crypto';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Store } from './store.js';
import { RegisteredDatabase } from './types.js';
import mysql from 'mysql2/promise';
import pg from 'pg';

const { Client: PgClient } = pg;

/**
 * Teste la connexion à une base de données MySQL ou PostgreSQL
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
        connectTimeout: 10000,
        enableKeepAlive: false,
      });
      await connection.ping();
      await connection.query('SELECT 1');
      await connection.end();
      return { success: true };
    } else {
      const hostForConnection = db.host === 'localhost' ? '127.0.0.1' : db.host;
      const client = new PgClient({
        host: hostForConnection,
        port: db.port,
        user: db.username,
        password: db.password || '',
        database: db.database,
        connectionTimeoutMillis: 10000,
      });
      await client.connect();
      const result = await client.query('SELECT current_user, current_database()');
      await client.end();
      return { success: true };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ENOTFOUND')) {
      return { success: false, error: `Impossible de se connecter au serveur ${db.host}:${db.port}` };
    }
    if (errorMsg.includes('Access denied') || errorMsg.includes('password authentication failed')) {
      return { success: false, error: 'Identifiants incorrects' };
    }
    if (errorMsg.includes('Unknown database') || errorMsg.includes('does not exist')) {
      return { success: false, error: `La base de données "${db.database}" n'existe pas` };
    }
    return { success: false, error: errorMsg };
  }
}

const RegisterSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  engine: z.enum(['mysql', 'postgres']),
  host: z.string().min(1, 'L\'hôte est requis'),
  port: z.number().int().positive('Le port doit être un nombre positif'),
  username: z.string().min(1, 'L\'utilisateur est requis'),
  password: z.string(),
  database: z.string().min(1, 'Le nom de la base de données est requis'),
});

export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - Database Registration' }));
  app.get('/health', async () => ({ status: 'ok' }));

  app.get('/databases', async () => await Store.getDatabases());

  app.get('/databases/available', async (req, reply) => {
    const { engine, host, port, username, password } = req.query as {
      engine?: string;
      host?: string;
      port?: string;
      username?: string;
      password?: string;
    };

    if (!engine || !host || !port || !username) {
      return reply.code(400).send({ 
        message: 'Paramètres manquants',
        error: 'engine, host, port et username sont requis'
      });
    }

    if (engine !== 'mysql' && engine !== 'postgres') {
      return reply.code(400).send({ 
        message: 'Moteur invalide',
        error: 'engine doit être "mysql" ou "postgres"'
      });
    }

    try {
      if (engine === 'mysql') {
        const hostForConnection = host === 'localhost' ? '127.0.0.1' : host;
        const connection = await mysql.createConnection({
          host: hostForConnection,
          port: Number(port),
          user: username,
          password: password || '',
          connectTimeout: 10000,
          enableKeepAlive: false,
        });
        const [rows] = await connection.query('SHOW DATABASES');
        await connection.end();
        const databases = (rows as Array<{ Database: string }>)
          .map(row => row.Database)
          .filter(db => !['information_schema', 'performance_schema', 'mysql', 'sys'].includes(db));
        return { databases };
      } else {
        const hostForConnection = host === 'localhost' ? '127.0.0.1' : host;
        const client = new PgClient({
          host: hostForConnection,
          port: Number(port),
          user: username,
          password: password || '',
          database: 'postgres',
          connectionTimeoutMillis: 10000,
        });
        await client.connect();
        const result = await client.query<{ datname: string }>(
          "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname"
        );
        await client.end();
        const databases = result.rows.map(row => row.datname);
        return { databases };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return reply.code(400).send({ 
        message: 'Impossible de lister les bases de données',
        error: errorMsg
      });
    }
  });

  app.post('/databases', async (req, reply) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);
    const body = parsed.data;
    const now = new Date().toISOString();
    const db: RegisteredDatabase = { id: randomUUID(), createdAt: now, ...body };
    
    const testResult = await testDatabaseConnection(db);
    if (!testResult.success) {
      return reply.code(400).send({ 
        message: 'Connexion à la base de données échouée',
        error: testResult.error || 'Impossible de se connecter à la base de données'
      });
    }
    
    const all = await Store.getDatabases();
    all.push(db);
    await Store.saveDatabases(all);
    return db;
  });
}

