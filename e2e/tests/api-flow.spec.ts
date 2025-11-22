import { test, expect } from '@playwright/test';

test.describe('API Flow E2E Tests', () => {
  const API_URL = process.env.API_URL || 'http://localhost:8080';

  test('should check API health endpoint', async ({ request }) => {
    const response = await request.get(`${API_URL}/health`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('status');
  });

  test('should list databases via API', async ({ request }) => {
    const response = await request.get(`${API_URL}/databases`);
    expect(response.ok()).toBeTruthy();
    const databases = await response.json();
    expect(Array.isArray(databases)).toBeTruthy();
  });

  test('should handle invalid database registration', async ({ request }) => {
    const response = await request.post(`${API_URL}/databases`, {
      data: {
        name: 'Test',
        engine: 'invalid',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'test'
      }
    });
    expect(response.status()).toBe(400);
  });

  test('should get scheduler heartbeat', async ({ request }) => {
    const response = await request.get(`${API_URL}/scheduler/heartbeat`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('lastHeartbeat');
  });

  test('should list alerts', async ({ request }) => {
    const response = await request.get(`${API_URL}/alerts`);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('alerts');
    expect(Array.isArray(body.alerts)).toBeTruthy();
  });
});

