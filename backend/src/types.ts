export type DatabaseEngine = 'mysql' | 'postgres';

export interface RegisteredDatabase {
  id: string;
  name: string;
  engine: DatabaseEngine;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  createdAt: string;
}

export interface BackupVersionMeta {
  id: string;
  databaseId: string;
  createdAt: string;
  path: string;
  engine: DatabaseEngine;
  sizeBytes?: number;
  pinned?: boolean;
}

