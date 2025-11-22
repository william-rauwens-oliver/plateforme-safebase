import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from '../src/server.js';

let server: any;

describe('health', () => {
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.close();
  });

  it('returns ok', async () => {
    const res = await server.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body).status).toBe('ok');
  });

  it('requires API key for protected endpoints when configured', async () => {
    const testApiKey = process.env.TEST_API_KEY || 'test-api-key-' + Date.now();
    process.env.API_KEY = testApiKey;
    const srv = await createServer();
    const res = await srv.inject({ method: 'GET', url: '/databases' });
    expect(res.statusCode).toBe(401);
    await srv.close();
    delete process.env.API_KEY;
  });

  it('scheduler heartbeat read/write', async () => {
    const resPost = await server.inject({ method: 'POST', url: '/scheduler/heartbeat' });
    expect(resPost.statusCode).toBe(200);
    const resGet = await server.inject({ method: 'GET', url: '/scheduler/heartbeat' });
    expect(resGet.statusCode).toBe(200);
    const body = JSON.parse(resGet.body);
    expect(body.lastHeartbeat).toBeTypeOf('string');
  });
});


