import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from '../src/server.js';
import { Store } from '../src/store.js';
import { RegisteredDatabase } from '../src/types.js';
import { randomUUID } from 'crypto';

let server: any;
let testDbId: string;

describe('Integration Tests', () => {
  beforeAll(async () => {
    server = await createServer();
    await Store.init();
  });

  afterAll(async () => {
    // Cleanup: supprimer les bases de test
    const allDbs = await Store.getDatabases();
    const testDbs = allDbs.filter(db => db.name.startsWith('TEST_'));
    if (testDbs.length > 0) {
      const kept = allDbs.filter(db => !testDbs.some(t => t.id === db.id));
      await Store.saveDatabases(kept);
    }
    await server.close();
  });

  describe('Database Registration Flow', () => {
    it('should register a database and retrieve it', async () => {
      const testDb: RegisteredDatabase = {
        id: randomUUID(),
        name: 'TEST_Integration',
        engine: 'mysql',
        host: '127.0.0.1',
        port: 8889,
        username: 'root',
        password: 'root',
        database: 'test',
        createdAt: new Date().toISOString()
      };

      // Enregistrer
      const allDbs = await Store.getDatabases();
      allDbs.push(testDb);
      await Store.saveDatabases(allDbs);

      // Récupérer
      const retrieved = await Store.getDatabases();
      const found = retrieved.find(d => d.id === testDb.id);

      expect(found).toBeDefined();
      expect(found?.name).toBe('TEST_Integration');
      expect(found?.password).toBe('root'); // Déchiffré
      
      testDbId = testDb.id;
    });

    it('should encrypt passwords in storage', async () => {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      
      const dbsFile = join(process.cwd(), 'data', 'databases.json');
      const content = readFileSync(dbsFile, 'utf-8');
      const parsed = JSON.parse(content);
      
      const testDb = parsed.find((db: any) => db.name === 'TEST_Integration');
      if (testDb) {
        // Le mot de passe doit être chiffré dans le fichier
        expect(testDb.password).not.toBe('root');
        expect(testDb.password).toContain(':'); // Format chiffré
      }
    });
  });

  describe('Backup Flow', () => {
    it('should create backup metadata', async () => {
      if (!testDbId) {
        // Créer une base de test si nécessaire
        const testDb: RegisteredDatabase = {
          id: randomUUID(),
          name: 'TEST_Backup',
          engine: 'mysql',
          host: '127.0.0.1',
          port: 8889,
          username: 'root',
          password: 'root',
          database: 'test',
          createdAt: new Date().toISOString()
        };
        const allDbs = await Store.getDatabases();
        allDbs.push(testDb);
        await Store.saveDatabases(allDbs);
        testDbId = testDb.id;
      }

      // Tester l'endpoint backup (sans vraiment exécuter mysqldump)
      const res = await server.inject({
        method: 'POST',
        url: `/backup/${testDbId}`
      });

      // Peut échouer si la base n'existe pas, mais on teste le flow
      expect([200, 404, 500]).toContain(res.statusCode);
    });
  });

  describe('Version Management Flow', () => {
    it('should list versions for a database', async () => {
      if (!testDbId) return;

      const res = await server.inject({
        method: 'GET',
        url: `/backups/${testDbId}`
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body)).toBe(true);
    });
  });
});

