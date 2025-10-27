import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { BackupVersionMeta, RegisteredDatabase } from './types.js';

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
    // On any failure (permissions, ENOENT, etc.), fallback to a local directory under CWD
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

function readJson<T>(file: string, fallback: T): T {
  try {
    if (!existsSync(file)) return fallback;
    const raw = readFileSync(file, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown): void {
  writeFileSync(file, JSON.stringify(data, null, 2));
}

export const Store = {
  init(): void {
    ensureDirs();
    if (!existsSync(dbsFile)) writeJson(dbsFile, [] as RegisteredDatabase[]);
    if (!existsSync(versionsFile)) writeJson(versionsFile, [] as BackupVersionMeta[]);
    if (!existsSync(schedulerFile)) writeJson(schedulerFile, { lastHeartbeat: null as string | null });
  },
  getDatabases(): RegisteredDatabase[] {
    return readJson<RegisteredDatabase[]>(dbsFile, []);
  },
  saveDatabases(dbs: RegisteredDatabase[]): void {
    writeJson(dbsFile, dbs);
  },
  getVersions(): BackupVersionMeta[] {
    return readJson<BackupVersionMeta[]>(versionsFile, []);
  },
  saveVersions(v: BackupVersionMeta[]): void {
    writeJson(versionsFile, v);
  },
  getSchedulerInfo(): { lastHeartbeat: string | null } {
    return readJson<{ lastHeartbeat: string | null }>(schedulerFile, { lastHeartbeat: null });
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

