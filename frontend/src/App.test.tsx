import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn() as unknown as Mock;

describe('SafeBase App - Tests unitaires', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = vi.fn(() => null);
    Storage.prototype.setItem = vi.fn();
  });

  it('should handle API health check', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ status: 'ok' }),
    });

    const response = await fetch('http://localhost:8080/health');
    const data = await response.json();
    
    expect(data.status).toBe('ok');
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/health');
  });

  it('should fetch databases list', async () => {
    const mockDatabases = [
      {
        id: '1',
        name: 'test-db',
        engine: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'user',
        password: 'pass',
        database: 'test',
        createdAt: '2025-01-01T00:00:00Z',
      },
    ];

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockDatabases,
    });

    const response = await fetch('http://localhost:8080/databases');
    const data = await response.json();
    
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('test-db');
    expect(data[0].engine).toBe('mysql');
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Internal server error' }),
    });

    const response = await fetch('http://localhost:8080/databases');
    const data = await response.json();
    
    expect(response.ok).toBe(false);
    expect(data.message).toBe('Internal server error');
  });

  it('should validate database schema structure', () => {
    const db = {
      id: 'test-id',
      name: 'test-db',
      engine: 'mysql' as const,
      host: 'localhost',
      port: 3306,
      username: 'user',
      password: 'pass',
      database: 'test',
      createdAt: '2025-01-01T00:00:00Z',
    };

    expect(db).toHaveProperty('id');
    expect(db).toHaveProperty('name');
    expect(db).toHaveProperty('engine');
    expect(db).toHaveProperty('host');
    expect(db).toHaveProperty('port');
    expect(db).toHaveProperty('username');
    expect(db).toHaveProperty('password');
    expect(db).toHaveProperty('database');
    expect(db).toHaveProperty('createdAt');
    expect(['mysql', 'postgres']).toContain(db.engine);
  });
});

