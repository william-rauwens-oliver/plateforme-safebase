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

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    if (!existsSync(file)) return fallback;
    const raw = readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw) as T;
    
    // Si c'est un tableau de bases de données, déchiffrer les mots de passe
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
  // Si c'est un tableau de bases de données, chiffrer les mots de passe
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

/**
 * Store pour la gestion des données persistantes (JSON file-based)
 * Gère les bases de données, versions de backup et état du scheduler
 */
export const Store = {
  /**
   * Initialise le store en créant les répertoires et fichiers nécessaires
   */
  async init(): Promise<void> {
    ensureDirs();
    if (!existsSync(dbsFile)) await writeJson(dbsFile, [] as RegisteredDatabase[]);
    if (!existsSync(versionsFile)) writeFileSync(versionsFile, JSON.stringify([], null, 2));
    if (!existsSync(schedulerFile)) writeFileSync(schedulerFile, JSON.stringify({ lastHeartbeat: null as string | null }, null, 2));
  },
  /**
   * Récupère toutes les bases de données enregistrées (mots de passe déchiffrés)
   * @returns Liste des bases de données
   */
  async getDatabases(): Promise<RegisteredDatabase[]> {
    return await readJson<RegisteredDatabase[]>(dbsFile, []);
  },
  /**
   * Sauvegarde la liste des bases de données (mots de passe seront chiffrés)
   * @param dbs - Liste des bases de données à sauvegarder
   */
  async saveDatabases(dbs: RegisteredDatabase[]): Promise<void> {
    await writeJson(dbsFile, dbs);
  },
  /**
   * Récupère toutes les versions de backup
   * @returns Liste des versions de backup
   */
  getVersions(): BackupVersionMeta[] {
    try {
      if (!existsSync(versionsFile)) return [];
      const raw = readFileSync(versionsFile, 'utf-8');
      return JSON.parse(raw) as BackupVersionMeta[];
    } catch {
      return [];
    }
  },
  /**
   * Sauvegarde la liste des versions de backup
   * @param v - Liste des versions à sauvegarder
   */
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

