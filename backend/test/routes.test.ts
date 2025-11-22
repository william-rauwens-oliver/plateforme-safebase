import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from '../src/server.js';
import { Store } from '../src/store.js';
import { RegisteredDatabase } from '../src/types.js';
import { randomUUID } from 'crypto';

let server: any;

describe('Routes - Integration Tests', () => {
  beforeAll(async () => {
    server = await createServer();
    await Store.init();
  }, 20000); // Timeout de 20 secondes pour le hook

  afterAll(async () => {
    await server.close();
  });

  describe('Health Endpoints', () => {
    it('should return health status', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/health'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('status');
    });

    it('should return root message', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('message');
    });
  });

  describe('Database Endpoints', () => {
    it('should list databases', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/databases'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(Array.isArray(body)).toBe(true);
    });

    it('should validate database registration schema', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/databases',
        payload: {
          name: '',
          engine: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'test'
        }
      });

      expect(res.statusCode).toBe(400);
    });

    it('should reject invalid engine', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/databases',
        payload: {
          name: 'Test',
          engine: 'invalid',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'test'
        }
      });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('Backup Endpoints', () => {
    it('should return 404 for non-existent database', async () => {
      const fakeId = randomUUID();
      const res = await server.inject({
        method: 'POST',
        url: `/backup/${fakeId}`
      });

      expect(res.statusCode).toBe(404);
    });

    it('should handle backup-all endpoint', async () => {
      process.env.FAKE_DUMP = '1';
      const res = await server.inject({
        method: 'POST',
        url: '/backup-all'
      });
      delete process.env.FAKE_DUMP;

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('results');
      expect(Array.isArray(body.results)).toBe(true);
    });
  });

  describe('Version Endpoints', () => {
    it('should return 404 for non-existent version', async () => {
      const fakeId = randomUUID();
      const res = await server.inject({
        method: 'POST',
        url: `/restore/${fakeId}`
      });

      expect(res.statusCode).toBe(404);
    });

    it('should return 404 for non-existent version download', async () => {
      const fakeId = randomUUID();
      const res = await server.inject({
        method: 'GET',
        url: `/versions/${fakeId}/download`
      });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('Alert Endpoints', () => {
    it('should list alerts with filters', async () => {
      const res = await server.inject({
        method: 'GET',
        url: '/alerts?type=backup_failed&resolved=false&limit=10'
      });

      expect(res.statusCode).toBe(200);
      const body = JSON.parse(res.body);
      expect(body).toHaveProperty('alerts');
      expect(body).toHaveProperty('total');
    });

    it('should return 404 for non-existent alert', async () => {
      const fakeId = randomUUID();
      const res = await server.inject({
        method: 'POST',
        url: `/alerts/${fakeId}/resolve`
      });

      expect(res.statusCode).toBe(404);
    });
  });
});

