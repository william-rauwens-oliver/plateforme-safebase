#!/usr/bin/env node
/**
 * Script de migration des données JSON vers PostgreSQL
 * Usage: tsx src/migrate.ts
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Alert, BackupVersionMeta, RegisteredDatabase } from './types.js';
import * as db from './db.js';
import { decrypt } from './crypto.js';

async function migrateFromJson(): Promise<void> {
  console.log('🚀 Démarrage de la migration JSON → PostgreSQL...\n');

  const dataDir = process.env.DATA_DIR || join(process.cwd(), 'backend', 'data');
  const dbsFile = join(dataDir, 'databases.json');
  const versionsFile = join(dataDir, 'versions.json');
  const alertsFile = join(dataDir, 'alerts.json');
  const schedulerFile = join(dataDir, 'scheduler.json');

  try {
    // Initialiser la base de données
    await db.initDatabase();
    console.log('✅ Schéma PostgreSQL initialisé\n');

    // Migrer les bases de données
    if (existsSync(dbsFile)) {
      console.log('📦 Migration des bases de données...');
      const dbsContent = readFileSync(dbsFile, 'utf-8');
      const dbs: RegisteredDatabase[] = JSON.parse(dbsContent);
      
      // Déchiffrer les mots de passe avant migration
      const decryptedDbs = await Promise.all(
        dbs.map(async (db) => ({
          ...db,
          password: await decrypt(db.password),
        }))
      );
      
      await db.saveDatabases(decryptedDbs);
      console.log(`✅ ${decryptedDbs.length} base(s) de données migrée(s)\n`);
    } else {
      console.log('⚠️  Aucun fichier databases.json trouvé\n');
    }

    // Migrer les versions
    if (existsSync(versionsFile)) {
      console.log('📦 Migration des versions de backup...');
      const versionsContent = readFileSync(versionsFile, 'utf-8');
      const versions: BackupVersionMeta[] = JSON.parse(versionsContent);
      await db.saveVersions(versions);
      console.log(`✅ ${versions.length} version(s) migrée(s)\n`);
    } else {
      console.log('⚠️  Aucun fichier versions.json trouvé\n');
    }

    // Migrer les alertes
    if (existsSync(alertsFile)) {
      console.log('📦 Migration des alertes...');
      const alertsContent = readFileSync(alertsFile, 'utf-8');
      const alerts: Alert[] = JSON.parse(alertsContent);
      
      // Limiter à 1000 comme dans l'ancien code
      const sorted = alerts.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      const limited = sorted.slice(0, 1000);
      
      for (const alert of limited) {
        await db.addAlert(alert);
      }
      console.log(`✅ ${limited.length} alerte(s) migrée(s)\n`);
    } else {
      console.log('⚠️  Aucun fichier alerts.json trouvé\n');
    }

    // Migrer le scheduler info
    if (existsSync(schedulerFile)) {
      console.log('📦 Migration des informations du scheduler...');
      const schedulerContent = readFileSync(schedulerFile, 'utf-8');
      const schedulerInfo: { lastHeartbeat: string | null } = JSON.parse(schedulerContent);
      
      if (schedulerInfo.lastHeartbeat) {
        await db.setSchedulerHeartbeat(schedulerInfo.lastHeartbeat);
        console.log('✅ Informations du scheduler migrées\n');
      } else {
        console.log('⚠️  Aucune information de heartbeat à migrer\n');
      }
    } else {
      console.log('⚠️  Aucun fichier scheduler.json trouvé\n');
    }

    console.log('✨ Migration terminée avec succès !');
    console.log('\n💡 Vous pouvez maintenant supprimer les fichiers JSON dans backend/data/ si vous le souhaitez.');
  } catch (err) {
    console.error('❌ Erreur lors de la migration:', err);
    process.exit(1);
  }
}

// Exécuter la migration
migrateFromJson().catch((err) => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});

