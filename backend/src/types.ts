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

export type AlertType = 'backup_failed' | 'restore_failed' | 'scheduler_down' | 'database_inaccessible' | 'backup_success' | 'restore_success';

export interface Alert {
  id: string;
  type: AlertType;
  timestamp: string;
  payload: {
    databaseId?: string;
    databaseName?: string;
    versionId?: string;
    error?: string;
    message?: string;
    [key: string]: unknown;
  };
  resolved?: boolean;
  resolvedAt?: string;
}
