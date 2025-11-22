// Store de fallback utilisant les fichiers JSON si PostgreSQL n'est pas disponible
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Alert, BackupVersionMeta, RegisteredDatabase } from './types.js';
import { encrypt, decrypt } from './crypto.js';

let dataDir = process.env.DATA_DIR || join(process.cwd(), 'backend', 'data');
let backupsDir = process.env.BACKUPS_DIR || '/backups';
let dbsFile = join(dataDir, 'databases.json');
let versionsFile = join(dataDir, 'versions.json');
let schedulerFile = join(dataDir, 'scheduler.json');
let alertsFile = join(dataDir, 'alerts.json');

function ensureDirPath(current: string, fallbackName: string): string {
  try {
    if (!existsSync(current)) mkdirSync(current, { recursive: true });
    return current;
  } catch (err) {
    const fallback = join(process.cwd(), fallbackName);
    if (!existsSync(fallback)) mkdirSync(fallback, { recursive: true });
    return fallback;
  }
}

function ensureDirs(): void {
  dataDir = ensureDirPath(dataDir, 'data');
  backupsDir = ensureDirPath(backupsDir, 'backups');
  dbsFile = join(dataDir, 'databases.json');
  versionsFile = join(dataDir, 'versions.json');
  schedulerFile = join(dataDir, 'scheduler.json');
  alertsFile = join(dataDir, 'alerts.json');
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    if (!existsSync(file)) return fallback;
    const raw = readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw) as T;
    
    if (Array.isArray(parsed) && parsed.length > 0 && 'password' in (parsed[0] as any)) {
      const decrypted = await Promise.all(
        (parsed as RegisteredDatabase[]).map(async (db) => ({
          ...db,
          password: await decrypt(db.password)
        }))
      );
      return decrypted as T;
    }
    
    return parsed;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  if (Array.isArray(data) && data.length > 0 && 'password' in (data[0] as any)) {
    const encrypted = await Promise.all(
      (data as RegisteredDatabase[]).map(async (db) => ({
        ...db,
        password: await encrypt(db.password)
      }))
    );
    writeFileSync(file, JSON.stringify(encrypted, null, 2));
  } else {
    writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

export const StoreFallback = {
  async init(): Promise<void> {
    ensureDirs();
    if (!existsSync(dbsFile)) await writeJson(dbsFile, [] as RegisteredDatabase[]);
    if (!existsSync(versionsFile)) writeFileSync(versionsFile, JSON.stringify([], null, 2));
    if (!existsSync(schedulerFile)) writeFileSync(schedulerFile, JSON.stringify({ lastHeartbeat: null as string | null }, null, 2));
    if (!existsSync(alertsFile)) writeFileSync(alertsFile, JSON.stringify([], null, 2));
  },
  
  async getDatabases(): Promise<RegisteredDatabase[]> {
    return await readJson<RegisteredDatabase[]>(dbsFile, []);
  },
  
  async saveDatabases(dbs: RegisteredDatabase[]): Promise<void> {
    await writeJson(dbsFile, dbs);
  },
  
  async asyncGetVersions(): Promise<BackupVersionMeta[]> {
    try {
      if (!existsSync(versionsFile)) return [];
      const raw = readFileSync(versionsFile, 'utf-8');
      return JSON.parse(raw) as BackupVersionMeta[];
    } catch {
      return [];
    }
  },
  
  async saveVersions(v: BackupVersionMeta[]): Promise<void> {
    writeFileSync(versionsFile, JSON.stringify(v, null, 2));
  },
  
  async getSchedulerInfo(): Promise<{ lastHeartbeat: string | null }> {
    try {
      if (!existsSync(schedulerFile)) return { lastHeartbeat: null };
      const raw = readFileSync(schedulerFile, 'utf-8');
      return JSON.parse(raw) as { lastHeartbeat: string | null };
    } catch {
      return { lastHeartbeat: null };
    }
  },
  
  async setSchedulerHeartbeat(isoDate: string): Promise<void> {
    writeFileSync(schedulerFile, JSON.stringify({ lastHeartbeat: isoDate }, null, 2));
  },
  
  async getAlerts(filters?: { type?: string; resolved?: boolean; limit?: number }): Promise<Alert[]> {
    try {
      if (!existsSync(alertsFile)) return [];
      const raw = readFileSync(alertsFile, 'utf-8');
      let alerts = JSON.parse(raw) as Alert[];
      
      if (filters?.type) {
        alerts = alerts.filter(a => a.type === filters.type);
      }
      if (filters?.resolved !== undefined) {
        alerts = alerts.filter(a => a.resolved === filters.resolved);
      }
      
      alerts = alerts.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      
      if (filters?.limit) {
        alerts = alerts.slice(0, filters.limit);
      } else {
        alerts = alerts.slice(0, 100);
      }
      
      return alerts;
    } catch {
      return [];
    }
  },
  
  async addAlert(alert: Alert): Promise<void> {
    const alerts = await this.getAlerts();
    alerts.push(alert);
    const sorted = alerts.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const limited = sorted.slice(0, 1000);
    writeFileSync(alertsFile, JSON.stringify(limited, null, 2));
  },
  
  async resolveAlert(alertId: string): Promise<void> {
    const alerts = await this.getAlerts();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolvedAt = new Date().toISOString();
      writeFileSync(alertsFile, JSON.stringify(alerts, null, 2));
    }
  },
  
  async deleteAlert(alertId: string): Promise<void> {
    const alerts = await this.getAlerts();
    const kept = alerts.filter(a => a.id !== alertId);
    writeFileSync(alertsFile, JSON.stringify(kept, null, 2));
  },
  
  paths: {
    get backupsDir() {
      return backupsDir;
    },
  },
};

