import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { BackupVersionMeta, RegisteredDatabase } from './types.js';
import { encrypt, decrypt } from './crypto.js';

let dataDir = process.env.DATA_DIR || '/app/data';
let backupsDir = process.env.BACKUPS_DIR || '/backups';
let dbsFile = join(dataDir, 'databases.json');
let versionsFile = join(dataDir, 'versions.json');
let schedulerFile = join(dataDir, 'scheduler.json');

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

export const Store = {
  
  async init(): Promise<void> {
    ensureDirs();
    if (!existsSync(dbsFile)) await writeJson(dbsFile, [] as RegisteredDatabase[]);
    if (!existsSync(versionsFile)) writeFileSync(versionsFile, JSON.stringify([], null, 2));
    if (!existsSync(schedulerFile)) writeFileSync(schedulerFile, JSON.stringify({ lastHeartbeat: null as string | null }, null, 2));
  },
  
  async getDatabases(): Promise<RegisteredDatabase[]> {
    return await readJson<RegisteredDatabase[]>(dbsFile, []);
  },
  
  async saveDatabases(dbs: RegisteredDatabase[]): Promise<void> {
    await writeJson(dbsFile, dbs);
  },
  
  getVersions(): BackupVersionMeta[] {
    try {
      if (!existsSync(versionsFile)) return [];
      const raw = readFileSync(versionsFile, 'utf-8');
      return JSON.parse(raw) as BackupVersionMeta[];
    } catch {
      return [];
    }
  },
  
  saveVersions(v: BackupVersionMeta[]): void {
    writeFileSync(versionsFile, JSON.stringify(v, null, 2));
  },
  getSchedulerInfo(): { lastHeartbeat: string | null } {
    try {
      if (!existsSync(schedulerFile)) return { lastHeartbeat: null };
      const raw = readFileSync(schedulerFile, 'utf-8');
      return JSON.parse(raw) as { lastHeartbeat: string | null };
    } catch {
      return { lastHeartbeat: null };
    }
  },
  setSchedulerHeartbeat(isoDate: string): void {
    writeJson(schedulerFile, { lastHeartbeat: isoDate });
  },
  paths: {
    get backupsDir() {
      return backupsDir;
    },
  },
};
