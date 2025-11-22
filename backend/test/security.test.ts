import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createServer } from '../src/server.js';
import { encrypt, decrypt, isEncrypted } from '../src/crypto.js';

let server: any;

describe('Security Tests', () => {
  beforeEach(async () => {
    server = await createServer();
  });

  afterEach(async () => {
    await server.close();
  });

  describe('Password Encryption', () => {
    it('should encrypt passwords', async () => {
      const password = 'test-password-123';
      const encrypted = await encrypt(password);
      
      expect(encrypted).not.toBe(password);
      expect(encrypted).toContain(':');
      expect(isEncrypted(encrypted)).toBe(true);
    });

    it('should decrypt passwords correctly', async () => {
      const password = 'test-password-123';
      const encrypted = await encrypt(password);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(password);
    });

    it('should handle empty passwords', async () => {
      const encrypted = await encrypt('');
      expect(encrypted).toBe('');
      
      const decrypted = await decrypt('');
      expect(decrypted).toBe('');
    });

    it('should handle special characters in passwords', async () => {
      const password = "test'password\"with$special&chars";
      const encrypted = await encrypt(password);
      const decrypted = await decrypt(encrypted);
      
      expect(decrypted).toBe(password);
    });
  });

  describe('API Security', () => {
    it('should require API key when configured', async () => {
      const testApiKey = process.env.TEST_API_KEY || 'test-api-key-' + Date.now();
      process.env.API_KEY = testApiKey;
      const srv = await createServer();
      
      const res = await srv.inject({ 
        method: 'GET', 
        url: '/databases' 
      });
      
      expect(res.statusCode).toBe(401);
      await srv.close();
      delete process.env.API_KEY;
    }, 15000); // Timeout de 15 secondes

    it('should accept requests with valid API key', async () => {
      const testApiKey = process.env.TEST_API_KEY || 'test-api-key-' + Date.now();
      process.env.API_KEY = testApiKey;
      const srv = await createServer();
      
      const res = await srv.inject({ 
        method: 'GET', 
        url: '/databases',
        headers: {
          'x-api-key': testApiKey
        }
      });
      
      expect(res.statusCode).toBe(200);
      await srv.close();
      delete process.env.API_KEY;
    }, 15000); // Timeout de 15 secondes

    it('should reject requests with invalid API key', async () => {
      const testApiKey = process.env.TEST_API_KEY || 'test-api-key-' + Date.now();
      process.env.API_KEY = testApiKey;
      const srv = await createServer();
      
      const res = await srv.inject({ 
        method: 'GET', 
        url: '/databases',
        headers: {
          'x-api-key': 'invalid-key-' + Date.now()
        }
      });
      
      expect(res.statusCode).toBe(401);
      await srv.close();
      delete process.env.API_KEY;
    }, 15000); // Timeout de 15 secondes
  });

  describe('Input Validation', () => {
    it('should reject invalid database engine', async () => {
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

    it('should reject missing required fields', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/databases',
        payload: {
          name: 'Test',
          engine: 'mysql'
          // Missing other required fields
        }
      });
      
      expect(res.statusCode).toBe(400);
    });

    it('should reject invalid port numbers', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/databases',
        payload: {
          name: 'Test',
          engine: 'mysql',
          host: 'localhost',
          port: -1, // Invalid port
          username: 'root',
          password: 'root',
          database: 'test'
        }
      });
      
      expect(res.statusCode).toBe(400);
    });
  });
});

