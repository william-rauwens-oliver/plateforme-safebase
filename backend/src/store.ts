import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Alert, BackupVersionMeta, RegisteredDatabase } from './types.js';
import * as db from './db.js';
import { StoreFallback } from './store-fallback.js';

let backupsDir = process.env.BACKUPS_DIR || '/backups';
let usePostgres = true; // Flag pour savoir si on utilise PostgreSQL ou le fallback

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
  backupsDir = ensureDirPath(backupsDir, 'backups');
}

export const Store = {
  async init(): Promise<void> {
    ensureDirs();
    // Initialiser le schéma PostgreSQL avec gestion d'erreurs
    // Ne pas bloquer le démarrage si PostgreSQL n'est pas disponible
    try {
      await db.initDatabase();
      usePostgres = true;
      console.log('✅ Mode PostgreSQL activé');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn('⚠️  PostgreSQL non disponible, utilisation du mode fallback (fichiers JSON)');
      console.warn(`   Erreur: ${errorMsg}`);
      console.warn('💡 Pour utiliser PostgreSQL, démarrez-le et configurez DB_HOST, DB_PORT, etc.');
      usePostgres = false;
      // Initialiser le fallback
      await StoreFallback.init();
      console.log('✅ Mode fallback (JSON) activé');
    }
  },
  
  async getDatabases(): Promise<RegisteredDatabase[]> {
    if (usePostgres) {
      try {
        return await db.getDatabases();
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
        return await StoreFallback.getDatabases();
      }
    }
    return await StoreFallback.getDatabases();
  },
  
  async saveDatabases(dbs: RegisteredDatabase[]): Promise<void> {
    if (usePostgres) {
      try {
        await db.saveDatabases(dbs);
        return;
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
      }
    }
    await StoreFallback.saveDatabases(dbs);
  },
  
  getVersions(): BackupVersionMeta[] {
    // Cette méthode est synchrone dans routes.ts, on doit la rendre async
    // Pour compatibilité, on retourne un tableau vide et on utilisera asyncGetVersions
    return [];
  },
  
  async asyncGetVersions(): Promise<BackupVersionMeta[]> {
    if (usePostgres) {
      try {
        return await db.asyncGetVersions();
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
        return await StoreFallback.asyncGetVersions();
      }
    }
    return await StoreFallback.asyncGetVersions();
  },
  
  async saveVersions(v: BackupVersionMeta[]): Promise<void> {
    if (usePostgres) {
      try {
        await db.saveVersions(v);
        return;
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
      }
    }
    await StoreFallback.saveVersions(v);
  },
  
  async addVersion(version: BackupVersionMeta): Promise<void> {
    if (usePostgres) {
      try {
        const { addVersion } = await import('./db.js');
        await addVersion(version);
        return;
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
      }
    }
    // En mode fallback, récupérer toutes les versions, ajouter la nouvelle, et sauvegarder
    const versions = await StoreFallback.asyncGetVersions();
    versions.push(version);
    await StoreFallback.saveVersions(versions);
  },
  
  async getSchedulerInfo(): Promise<{ lastHeartbeat: string | null }> {
    if (usePostgres) {
      try {
        return await db.getSchedulerInfo();
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
        return await StoreFallback.getSchedulerInfo();
      }
    }
    return await StoreFallback.getSchedulerInfo();
  },
  
  async setSchedulerHeartbeat(isoDate: string): Promise<void> {
    if (usePostgres) {
      try {
        await db.setSchedulerHeartbeat(isoDate);
        return;
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
      }
    }
    await StoreFallback.setSchedulerHeartbeat(isoDate);
  },
  
  async getAlerts(filters?: { type?: string; resolved?: boolean; limit?: number }): Promise<Alert[]> {
    if (usePostgres) {
      try {
        return await db.getAlerts(filters);
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
        return await StoreFallback.getAlerts(filters);
      }
    }
    return await StoreFallback.getAlerts(filters);
  },
  
  async addAlert(alert: Alert): Promise<void> {
    if (usePostgres) {
      try {
        await db.addAlert(alert);
        return;
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
      }
    }
    await StoreFallback.addAlert(alert);
  },
  
  async resolveAlert(alertId: string): Promise<void> {
    if (usePostgres) {
      try {
        await db.resolveAlert(alertId);
        return;
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
      }
    }
    await StoreFallback.resolveAlert(alertId);
  },
  
  async deleteAlert(alertId: string): Promise<void> {
    if (usePostgres) {
      try {
        await db.deleteAlert(alertId);
        return;
      } catch (err) {
        console.warn('Erreur PostgreSQL, basculement vers fallback:', err);
        usePostgres = false;
      }
    }
    await StoreFallback.deleteAlert(alertId);
  },
  
  paths: {
    get backupsDir() {
      return backupsDir;
    },
  },
};
