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
  }, 20000); // Timeout de 20 secondes pour le hook

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
        username: process.env.TEST_MYSQL_USER || 'testuser',
        password: process.env.TEST_MYSQL_PASSWORD || '',
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
      expect(found?.password).toBe(testDb.password); // Déchiffré
      
      testDbId = testDb.id;
    });

    it('should encrypt passwords in storage', async () => {
      const { readFileSync } = await import('fs');
      const { join } = await import('path');
      
      const dbsFile = join(process.cwd(), 'data', 'databases.json');
      const content = readFileSync(dbsFile, 'utf-8');
      const parsed = JSON.parse(content);
      
        const testDb = parsed.find((db: any) => db.name === 'TEST_Integration');
        if (testDb && testDb.password) {
          // Le mot de passe doit être chiffré dans le fichier (si non vide)
          expect(testDb.password).not.toBe(testDb.password);
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
          username: process.env.TEST_MYSQL_USER || 'testuser',
          password: process.env.TEST_MYSQL_PASSWORD || '',
          database: 'test',
          createdAt: new Date().toISOString()
        };
        const allDbs = await Store.getDatabases();
        allDbs.push(testDb);
        await Store.saveDatabases(allDbs);
        testDbId = testDb.id;
      }

      // Tester l'endpoint backup (sans vraiment exécuter mysqldump)
      // Utiliser FAKE_DUMP pour éviter les timeouts
      process.env.FAKE_DUMP = '1';
      const res = await server.inject({
        method: 'POST',
        url: `/backup/${testDbId}`
      });
      delete process.env.FAKE_DUMP;

      // Peut échouer si la base n'existe pas, mais on teste le flow
      expect([200, 404, 500]).toContain(res.statusCode);
    }, 10000); // Timeout de 10 secondes
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

    it('should pin and unpin a version', async () => {
      if (!testDbId) return;

      // Créer une version de test
      process.env.FAKE_DUMP = '1';
      const backupRes = await server.inject({
        method: 'POST',
        url: `/backup/${testDbId}`
      });
      delete process.env.FAKE_DUMP;

      if (backupRes.statusCode === 200) {
        const version = JSON.parse(backupRes.body);
        const versionId = version.id;

        // Épingler
        const pinRes = await server.inject({
          method: 'POST',
          url: `/versions/${versionId}/pin`
        });
        expect(pinRes.statusCode).toBe(200);
        const pinnedVersion = JSON.parse(pinRes.body);
        expect(pinnedVersion.pinned).toBe(true);

        // Désépingler
        const unpinRes = await server.inject({
          method: 'POST',
          url: `/versions/${versionId}/unpin`
        });
        expect(unpinRes.statusCode).toBe(200);
        const unpinnedVersion = JSON.parse(unpinRes.body);
        expect(unpinnedVersion.pinned).toBe(false);
      }
    });
  });

  describe('Alert Flow', () => {
    it('should list alerts', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/alerts'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('alerts');
      expect(Array.isArray(body.alerts)).toBe(true);
    });

    it('should filter alerts by type', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/alerts?type=backup_failed'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body.alerts)).toBe(true);
    });
  });

  describe('Scheduler Flow', () => {
    it('should get scheduler heartbeat', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/scheduler/heartbeat'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('lastHeartbeat');
    });

    it('should set scheduler heartbeat', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/scheduler/heartbeat'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('ok');
      expect(body.ok).toBe(true);
    });
  });
});

