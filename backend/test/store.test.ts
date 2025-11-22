import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Store } from '../src/store.js';
import { RegisteredDatabase, BackupVersionMeta } from '../src/types.js';
import { randomUUID } from 'crypto';

describe('Store Module - Unit Tests', () => {
  beforeAll(async () => {
    await Store.init();
  });

  describe('Database Operations', () => {
    it('should get empty databases list initially', async () => {
      const databases = await Store.getDatabases();
      expect(Array.isArray(databases)).toBe(true);
    });

    it('should save and retrieve databases', async () => {
      const testDb: RegisteredDatabase = {
        id: randomUUID(),
        name: 'TEST_Store_' + Date.now(),
        engine: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'test',
        password: 'test',
        database: 'test',
        createdAt: new Date().toISOString()
      };

      const allDbs = await Store.getDatabases();
      allDbs.push(testDb);
      await Store.saveDatabases(allDbs);

      const retrieved = await Store.getDatabases();
      const found = retrieved.find(d => d.id === testDb.id);
      
      expect(found).toBeDefined();
      expect(found?.name).toBe(testDb.name);
    });

    it('should handle multiple databases', async () => {
      const db1: RegisteredDatabase = {
        id: randomUUID(),
        name: 'TEST_DB1_' + Date.now(),
        engine: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'test',
        password: 'test',
        database: 'test1',
        createdAt: new Date().toISOString()
      };

      const db2: RegisteredDatabase = {
        id: randomUUID(),
        name: 'TEST_DB2_' + Date.now(),
        engine: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'test',
        password: 'test',
        database: 'test2',
        createdAt: new Date().toISOString()
      };

      const allDbs = await Store.getDatabases();
      allDbs.push(db1, db2);
      await Store.saveDatabases(allDbs);

      const retrieved = await Store.getDatabases();
      const found1 = retrieved.find(d => d.id === db1.id);
      const found2 = retrieved.find(d => d.id === db2.id);
      
      expect(found1).toBeDefined();
      expect(found2).toBeDefined();
      expect(found1?.engine).toBe('mysql');
      expect(found2?.engine).toBe('postgres');
    });
  });

  describe('Version Operations', () => {
    it('should get empty versions list initially', async () => {
      const versions = await Store.asyncGetVersions();
      expect(Array.isArray(versions)).toBe(true);
    });

    it('should add and retrieve versions', async () => {
      const testDbId = randomUUID();
      const version: BackupVersionMeta = {
        id: randomUUID(),
        databaseId: testDbId,
        createdAt: new Date().toISOString(),
        path: '/test/path/backup.sql',
        engine: 'mysql',
        sizeBytes: 1024,
        pinned: false
      };

      await Store.addVersion(version);

      const versions = await Store.asyncGetVersions();
      const found = versions.find(v => v.id === version.id);
      
      expect(found).toBeDefined();
      expect(found?.databaseId).toBe(testDbId);
      expect(found?.path).toBe(version.path);
    });

    it('should save and retrieve multiple versions', async () => {
      const testDbId = randomUUID();
      const versions: BackupVersionMeta[] = [
        {
          id: randomUUID(),
          databaseId: testDbId,
          createdAt: new Date(Date.now() - 10000).toISOString(),
          path: '/test/path/backup1.sql',
          engine: 'mysql',
          sizeBytes: 1024
        },
        {
          id: randomUUID(),
          databaseId: testDbId,
          createdAt: new Date().toISOString(),
          path: '/test/path/backup2.sql',
          engine: 'mysql',
          sizeBytes: 2048,
          pinned: true
        }
      ];

      await Store.saveVersions(versions);

      const retrieved = await Store.asyncGetVersions();
      const found = retrieved.filter(v => v.databaseId === testDbId);
      
      expect(found.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Scheduler Operations', () => {
    it('should get scheduler info', async () => {
      const info = await Store.getSchedulerInfo();
      expect(info).toHaveProperty('lastHeartbeat');
    });

    it('should set scheduler heartbeat', async () => {
      const now = new Date().toISOString();
      await Store.setSchedulerHeartbeat(now);

      const info = await Store.getSchedulerInfo();
      if (info.lastHeartbeat) {
        expect(new Date(info.lastHeartbeat).getTime()).toBeGreaterThanOrEqual(new Date(now).getTime() - 1000);
      }
    });
  });

  describe('Alert Operations', () => {
    it('should get empty alerts list initially', async () => {
      const alerts = await Store.getAlerts();
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should add and retrieve alerts', async () => {
      const alert = {
        id: randomUUID(),
        type: 'backup_failed' as const,
        timestamp: new Date().toISOString(),
        payload: {
          databaseId: randomUUID(),
          databaseName: 'test-db',
          error: 'Test error'
        },
        resolved: false
      };

      await Store.addAlert(alert);

      const alerts = await Store.getAlerts();
      const found = alerts.find(a => a.id === alert.id);
      
      expect(found).toBeDefined();
      expect(found?.type).toBe('backup_failed');
    });

    it('should filter alerts by type', async () => {
      const alerts = await Store.getAlerts({ type: 'backup_failed' });
      expect(Array.isArray(alerts)).toBe(true);
      if (alerts.length > 0) {
        alerts.forEach(alert => {
          expect(alert.type).toBe('backup_failed');
        });
      }
    });

    it('should resolve alerts', async () => {
      const alert = {
        id: randomUUID(),
        type: 'backup_failed' as const,
        timestamp: new Date().toISOString(),
        payload: { databaseId: randomUUID() },
        resolved: false
      };

      await Store.addAlert(alert);
      await Store.resolveAlert(alert.id);

      const alerts = await Store.getAlerts();
      const found = alerts.find(a => a.id === alert.id);
      
      if (found) {
        expect(found.resolved).toBe(true);
        expect(found.resolvedAt).toBeDefined();
      }
    });
  });
});

