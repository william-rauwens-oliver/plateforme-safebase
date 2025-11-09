import { randomUUID } from 'crypto';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { statSync, createReadStream, rmSync, existsSync } from 'fs';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Store } from './store.js';
import { BackupVersionMeta, RegisteredDatabase } from './types.js';
import mysql from 'mysql2/promise';
import pg from 'pg';

const exec = promisify(execCb);
const { Client: PgClient } = pg;

/**
 * Teste la connexion à une base de données MySQL ou PostgreSQL
 * @param db - Base de données à tester
 * @returns Résultat du test avec succès ou message d'erreur
 */
async function testDatabaseConnection(db: RegisteredDatabase): Promise<{ success: boolean; error?: string }> {
  try {
    if (db.engine === 'mysql') {
      const connection = await mysql.createConnection({
        host: db.host,
        port: db.port,
        user: db.username,
        password: db.password,
        database: db.database,
        connectTimeout: 10000, // 10 secondes max
        enableKeepAlive: false,
      });
      // Test réel : ping + requête simple pour vérifier que la base existe
      await connection.ping();
      await connection.query('SELECT 1');
      await connection.end();
      return { success: true };
    } else {
      // PostgreSQL
      // Forcer l'authentification par mot de passe en utilisant TCP/IP
      // Utiliser 127.0.0.1 au lieu de localhost pour éviter le socket Unix
      const hostForConnection = db.host === 'localhost' ? '127.0.0.1' : db.host;
      
      const client = new PgClient({
        host: hostForConnection,
        port: db.port,
        user: db.username,
        password: db.password || '', // Permettre mot de passe vide
        database: db.database,
        connectionTimeoutMillis: 10000, // 10 secondes max
      });
      
      try {
        await client.connect();
      } catch (connectErr) {
        // Si la connexion échoue, c'est probablement une erreur d'authentification
        const errorMsg = connectErr instanceof Error ? connectErr.message : String(connectErr);
        if (errorMsg.includes('password authentication failed') || errorMsg.includes('authentication failed')) {
          return { success: false, error: 'Identifiants incorrects : utilisateur ou mot de passe invalide' };
        }
        throw connectErr; // Relancer pour traitement normal
      }
      
      // Test réel : requête simple pour vérifier que la base existe ET que l'authentification fonctionne
      const result = await client.query('SELECT current_user, current_database(), has_database_privilege($1, $2, $3) as can_connect', [db.username, db.database, 'CONNECT']);
      
      // Vérifier que l'utilisateur connecté correspond bien à celui demandé
      const connectedUser = result.rows[0]?.current_user;
      if (connectedUser !== db.username) {
        await client.end();
        return { success: false, error: `Utilisateur connecté (${connectedUser}) ne correspond pas à l'utilisateur demandé (${db.username})` };
      }
      
      // Vérifier que la base de données existe et que l'utilisateur a les droits
      const connectedDb = result.rows[0]?.current_database;
      if (connectedDb !== db.database) {
        await client.end();
        return { success: false, error: `Base de données connectée (${connectedDb}) ne correspond pas à celle demandée (${db.database})` };
      }
      
      // Test supplémentaire : essayer une opération qui nécessite des privilèges
      try {
        await client.query('SELECT pg_backend_pid()');
      } catch (privErr) {
        await client.end();
        return { success: false, error: 'Connexion réussie mais l\'utilisateur n\'a pas les privilèges nécessaires' };
      }
      
      await client.end();
      return { success: true };
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Messages d'erreur plus clairs selon le type d'erreur
    if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ENOTFOUND') || errorMsg.includes('getaddrinfo')) {
      return { success: false, error: `Impossible de se connecter au serveur ${db.host}:${db.port}. Vérifiez que le serveur MySQL/PostgreSQL est démarré.` };
    }
    if (errorMsg.includes('Access denied') || errorMsg.includes('password authentication failed') || errorMsg.includes('authentication failed')) {
      return { success: false, error: 'Identifiants incorrects : utilisateur ou mot de passe invalide' };
    }
    if (errorMsg.includes('Unknown database') || (errorMsg.includes('database') && errorMsg.includes('does not exist'))) {
      return { success: false, error: `La base de données "${db.database}" n'existe pas. Créez-la d'abord dans votre serveur.` };
    }
    if (errorMsg.includes('ETIMEDOUT') || errorMsg.includes('timeout')) {
      return { success: false, error: `Timeout : le serveur ${db.host}:${db.port} ne répond pas. Vérifiez qu'il est démarré.` };
    }
    return { success: false, error: errorMsg };
  }
}

/**
 * Essaie de donner les permissions nécessaires pour PostgreSQL avant un backup
 * @param db - Base de données PostgreSQL
 * @returns true si les permissions ont été données (ou si l'utilisateur est superuser)
 */
async function tryGrantPostgresPermissions(db: RegisteredDatabase): Promise<boolean> {
  if (db.engine !== 'postgres') return true; // Pas nécessaire pour MySQL
  
  try {
    const hostForConnection = db.host === 'localhost' ? '127.0.0.1' : db.host;
    const client = new PgClient({
      host: hostForConnection,
      port: db.port,
      user: db.username,
      password: db.password || '',
      database: db.database,
      connectionTimeoutMillis: 5000,
    });
    
    await client.connect();
    
    // Vérifier si l'utilisateur est superuser
    const superCheck = await client.query('SELECT usesuper FROM pg_user WHERE usename = current_user');
    const isSuper = superCheck.rows[0]?.usesuper === true;
    
    if (isSuper) {
      // Si superuser, donner les permissions directement
      try {
        await client.query('GRANT SELECT ON ALL TABLES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
        await client.query('GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
        await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ' + client.escapeIdentifier(db.username));
        await client.query('ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO ' + client.escapeIdentifier(db.username));
        await client.end();
        return true;
      } catch (grantErr) {
        await client.end();
        return false;
      }
    } else {
      // Si pas superuser, essayer de trouver le propriétaire de la base et utiliser SET ROLE
      try {
        const dbOwnerResult = await client.query('SELECT pg_catalog.pg_get_userbyid(datdba) as owner FROM pg_database WHERE datname = current_database()');
        const dbOwner = dbOwnerResult.rows[0]?.owner;
        
        if (dbOwner && dbOwner !== db.username) {
          // Essayer de se connecter en tant que propriétaire (nécessite que l'utilisateur actuel puisse SET ROLE)
          // Mais cela nécessite généralement d'être membre du rôle, donc on essaie juste de donner les permissions
          // avec l'utilisateur actuel (peut échouer si pas propriétaire)
          try {
            await client.query('GRANT SELECT ON ALL TABLES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
            await client.query('GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
            await client.end();
            return true;
          } catch (grantErr) {
            await client.end();
            return false;
          }
        } else {
          // L'utilisateur est le propriétaire, donner les permissions
          try {
            await client.query('GRANT SELECT ON ALL TABLES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
            await client.query('GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ' + client.escapeIdentifier(db.username));
            await client.end();
            return true;
          } catch (grantErr) {
            await client.end();
            return false;
          }
        }
      } catch (err) {
        await client.end();
        return false;
      }
    }
  } catch (err) {
    // En cas d'erreur de connexion, on continue quand même
    return false;
  }
}

/**
 * Liste les tables accessibles dans une base PostgreSQL
 * @param db - Base de données PostgreSQL
 * @returns Liste des noms de tables accessibles
 */
async function listAccessiblePostgresTables(db: RegisteredDatabase): Promise<string[]> {
  if (db.engine !== 'postgres') return [];
  
  try {
    const hostForConnection = db.host === 'localhost' ? '127.0.0.1' : db.host;
    const client = new PgClient({
      host: hostForConnection,
      port: db.port,
      user: db.username,
      password: db.password || '',
      database: db.database,
      connectionTimeoutMillis: 5000,
    });
    
    await client.connect();
    
    // Lister les tables où l'utilisateur a les permissions SELECT
    // Utiliser current_user au lieu de db.username pour éviter les problèmes de permissions
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      AND has_table_privilege(current_user, 'public.' || tablename, 'SELECT')
      ORDER BY tablename
    `);
    
    await client.end();
    return result.rows.map(row => row.tablename);
  } catch (err) {
    return [];
  }
}

/**
 * Schéma de validation Zod pour l'enregistrement d'une base de données
 */
const RegisterSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  engine: z.enum(['mysql', 'postgres'], { errorMap: () => ({ message: 'Le moteur doit être mysql ou postgres' }) }),
  host: z.string().min(1, 'L\'hôte est requis'),
  port: z.number().int().positive('Le port doit être un nombre positif'),
  username: z.string().min(1, 'L\'utilisateur est requis'),
  password: z.string(), // Permettre mot de passe vide pour PostgreSQL
  database: z.string().min(1, 'Le nom de la base de données est requis'),
});

/**
 * Définit toutes les routes de l'API SafeBase
 * @param app - Instance Fastify
 */
export async function routes(app: FastifyInstance): Promise<void> {
  app.get('/', async () => ({ message: 'SafeBase API - see /health' }));
  app.get('/health', async () => ({ status: 'ok' }));
  app.get('/scheduler/heartbeat', async () => Store.getSchedulerInfo());
  app.post('/scheduler/heartbeat', async () => {
    Store.setSchedulerHeartbeat(new Date().toISOString());
    return { ok: true };
  });

  app.get('/databases', async () => await Store.getDatabases());

  /**
   * Liste les bases de données disponibles sur un serveur MySQL ou PostgreSQL
   * @param query - Paramètres : engine, host, port, username, password
   */
  app.get('/databases/available', async (req, reply) => {
    const { engine, host, port, username, password } = req.query as {
      engine?: string;
      host?: string;
      port?: string;
      username?: string;
      password?: string;
    };

    if (!engine || !host || !port || !username) {
      return reply.code(400).send({ 
        message: 'Paramètres manquants',
        error: 'engine, host, port et username sont requis'
      });
    }

    if (engine !== 'mysql' && engine !== 'postgres') {
      return reply.code(400).send({ 
        message: 'Moteur invalide',
        error: 'engine doit être "mysql" ou "postgres"'
      });
    }

    try {
      if (engine === 'mysql') {
        // Convertir localhost en 127.0.0.1 pour MySQL (comme PostgreSQL)
        const hostForConnection = host === 'localhost' ? '127.0.0.1' : host;
        const connection = await mysql.createConnection({
          host: hostForConnection,
          port: Number(port),
          user: username,
          password: password || '',
          connectTimeout: 10000,
          enableKeepAlive: false,
        });
        const [rows] = await connection.query('SHOW DATABASES');
        await connection.end();
        // Filtrer les bases système
        const databases = (rows as Array<{ Database: string }>)
          .map(row => row.Database)
          .filter(db => !['information_schema', 'performance_schema', 'mysql', 'sys'].includes(db));
        return { databases };
      } else {
        // PostgreSQL
        const hostForConnection = host === 'localhost' ? '127.0.0.1' : host;
        const client = new PgClient({
          host: hostForConnection,
          port: Number(port),
          user: username,
          password: password || '',
          database: 'postgres', // Se connecter à postgres pour lister les bases
          connectionTimeoutMillis: 10000,
        });
        await client.connect();
        const result = await client.query<{ datname: string }>(
          "SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname"
        );
        await client.end();
        const databases = result.rows.map(row => row.datname);
        return { databases };
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      app.log.error({ message: 'Failed to list databases', error: errorMsg, engine, host, port });
      
      // Messages d'erreur plus clairs selon le type d'erreur
      let userMessage = 'Impossible de lister les bases de données';
      if (errorMsg.includes('ECONNREFUSED') || errorMsg.includes('ENOTFOUND') || errorMsg.includes('getaddrinfo')) {
        userMessage = `Impossible de se connecter au serveur ${host}:${port}. Vérifiez que le serveur MySQL/PostgreSQL est démarré (MAMP pour MySQL, service PostgreSQL pour Postgres).`;
      } else if (errorMsg.includes('Access denied') || errorMsg.includes('password authentication failed') || errorMsg.includes('authentication failed')) {
        userMessage = 'Identifiants incorrects : utilisateur ou mot de passe invalide';
      } else if (errorMsg.includes('ETIMEDOUT') || errorMsg.includes('timeout')) {
        userMessage = `Connexion au serveur ${host}:${port} expirée. Vérifiez que le serveur est accessible.`;
      }
      
      return reply.code(400).send({ 
        message: userMessage,
        error: errorMsg
      });
    }
  });

  app.delete('/databases/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const all = await Store.getDatabases();
    const db = all.find(d => d.id === id);
    if (!db) return reply.code(404).send({ message: 'database not found' });
    
    // Supprimer aussi toutes les versions de backup associées
    const versions = Store.getVersions();
    const versionsToDelete = versions.filter(v => v.databaseId === id);
    for (const v of versionsToDelete) {
      try {
        rmSync(v.path, { force: true });
      } catch {
        // Ignore si le fichier n'existe pas
      }
    }
    const keptVersions = versions.filter(v => v.databaseId !== id);
    Store.saveVersions(keptVersions);
    
    // Supprimer le dossier de backup
    try {
      const backupDir = join(Store.paths.backupsDir, id);
      rmSync(backupDir, { recursive: true, force: true });
    } catch {
      // Ignore si le dossier n'existe pas
    }
    
    // Supprimer la base de la liste
    const kept = all.filter(d => d.id !== id);
    await Store.saveDatabases(kept);
    return { deleted: true, id };
  });

  app.post('/databases', async (req, reply) => {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send(parsed.error);
    const body = parsed.data;
    const now = new Date().toISOString();
    const db: RegisteredDatabase = { id: randomUUID(), createdAt: now, ...body };
    
    // Vérifier la connexion avant d'enregistrer
    // La validation est TOUJOURS activée par défaut
    // Pour la désactiver (mode test uniquement), définir VALIDATE_CONNECTION=0 explicitement
    const skipValidation = process.env.VALIDATE_CONNECTION === '0';
    
    if (!skipValidation) {
      app.log.info({ message: 'Testing database connection', database: db.name, host: db.host, port: db.port, engine: db.engine });
      const testResult = await testDatabaseConnection(db);
      if (!testResult.success) {
        app.log.error({ message: 'Database connection failed', database: db.name, error: testResult.error });
        return reply.code(400).send({ 
          message: 'Connexion à la base de données échouée',
          error: testResult.error || 'Impossible de se connecter à la base de données',
          hint: 'Vérifiez que :\n- La base de données existe\n- Les identifiants sont corrects\n- Le serveur MySQL/PostgreSQL est démarré\n- Le port est correct (8889 pour MAMP MySQL, 3306 pour MySQL standard, 5432 pour PostgreSQL)'
        });
      }
      app.log.info({ message: 'Database connection successful', database: db.name });
    } else {
      app.log.warn({ message: 'Skipping database connection validation (VALIDATE_CONNECTION=0)', database: db.name });
    }
    
    const all = await Store.getDatabases();
    all.push(db);
    await Store.saveDatabases(all);
    return db;
  });

  app.post('/backup/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const allDbs = await Store.getDatabases();
    const db = allDbs.find(d => d.id === id);
    if (!db) return reply.code(404).send({ message: 'database not found' });
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${db.name}_${ts}.${db.engine === 'mysql' ? 'sql' : 'sql'}`;
    const outPath = join(Store.paths.backupsDir, db.id, filename);

    // ensure per-db dir exists
    await import('fs/promises').then(async fs => {
      await fs.mkdir(join(Store.paths.backupsDir, db.id), { recursive: true });
    });

    // Trouver mysqldump (MAMP en priorité, sinon système)
    const findMysqldump = () => {
      // MAMP utilise mysql80 ou mysql57
      const mamp80 = '/Applications/MAMP/Library/bin/mysql80/bin/mysqldump';
      const mamp57 = '/Applications/MAMP/Library/bin/mysql57/bin/mysqldump';
      if (existsSync(mamp80)) return mamp80;
      if (existsSync(mamp57)) return mamp57;
      return 'mysqldump'; // Fallback sur PATH système
    };

    // Échapper le mot de passe pour la commande shell
    const escapeShell = (str: string) => {
      return str.replace(/'/g, "'\\''").replace(/([;&|`$<>])/g, '\\$1');
    };

    // Échapper le chemin du fichier pour la commande shell
    const escapePath = (path: string) => {
      return path.replace(/'/g, "'\\''").replace(/([;&|`$<>()])/g, '\\$1');
    };

    // Pour PostgreSQL, utiliser 127.0.0.1 au lieu de localhost pour éviter les problèmes IPv6
    const hostForBackup = db.engine === 'postgres' && db.host === 'localhost' ? '127.0.0.1' : db.host;

    // Pour PostgreSQL, utiliser une approche qui gère les permissions : d'abord essayer avec --exclude-table-data pour les tables problématiques
    // Si cela échoue, utiliser --schema-only pour au moins sauvegarder le schéma
    let cmd: string;
    if (db.engine === 'mysql') {
      cmd = `${findMysqldump()} -h ${escapeShell(db.host)} -P ${db.port} -u ${escapeShell(db.username)} -p'${escapeShell(db.password)}' ${escapeShell(db.database)} > ${escapePath(outPath)}`;
    } else {
      // PostgreSQL : utiliser une approche qui gère les permissions
      // D'abord essayer avec les options standard, puis fallback sur schema-only si nécessaire
      const pgDumpBase = db.password ? `PGPASSWORD='${escapeShell(db.password)}' pg_dump` : `pg_dump`;
      // Essayer d'abord sans exclusion (pour les bases avec bonnes permissions)
      cmd = `${pgDumpBase} -h ${escapeShell(hostForBackup)} -p ${db.port} -U ${escapeShell(db.username)} -d ${escapeShell(db.database)} -F p --no-owner --no-privileges -f ${escapePath(outPath)}`;
    }

    try {
      // Mode FAKE_DUMP désactivé par défaut (uniquement pour tests)
      // Pour activer le mode fake (tests uniquement), définir FAKE_DUMP=1
      const useFakeDump = process.env.FAKE_DUMP === '1';
      
      if (useFakeDump) {
        app.log.warn({ message: 'Using FAKE_DUMP mode (testing only)', database: db.name });
        // Simulation: écrire un fichier SQL minimal
        await import('fs/promises').then(async fs => {
          const header = `-- Fake dump for ${db.engine} ${db.database} at ${new Date().toISOString()}\n`;
          const content = db.engine === 'mysql' 
            ? `-- MySQL Dump\nCREATE DATABASE IF NOT EXISTS ${db.database};\nUSE ${db.database};\nSELECT 1;\n`
            : `-- PostgreSQL Dump\n-- Database: ${db.database}\nSELECT 1;\n`;
          await fs.writeFile(outPath, header + content);
        });
      } else {
        app.log.info({ message: 'Starting backup', database: db.name, engine: db.engine, command: cmd.replace(/-p'[^']*'/, "-p'***'").replace(/PGPASSWORD='[^']*'/, "PGPASSWORD='***'") });
        try {
          await exec(cmd);
          app.log.info({ message: 'Backup completed', database: db.name, path: outPath });
        } catch (execErr: any) {
          const errorMsg = execErr instanceof Error ? execErr.message : String(execErr);
          const stderr = execErr?.stderr || '';
          app.log.error({ message: 'Backup command failed', database: db.name, engine: db.engine, error: errorMsg, stderr });
          
          // Pour PostgreSQL avec erreurs de permissions, utiliser une approche qui liste toutes les tables et essaie de les sauvegarder
          if (db.engine === 'postgres' && (stderr.includes('permission denied') || errorMsg.includes('permission denied'))) {
            app.log.warn({ message: 'Trying backup with all tables (may exclude problematic ones)', database: db.name });
            
            // Essayer de donner les permissions d'abord
            await tryGrantPostgresPermissions(db);
            
            // Lister toutes les tables de la base (pas seulement celles accessibles)
            try {
              const hostForConnection = db.host === 'localhost' ? '127.0.0.1' : db.host;
              const listClient = new PgClient({
                host: hostForConnection,
                port: db.port,
                user: db.username,
                password: db.password || '',
                database: db.database,
                connectionTimeoutMillis: 5000,
              });
              
              await listClient.connect();
              const allTablesResult = await listClient.query(`
                SELECT tablename 
                FROM pg_tables 
                WHERE schemaname = 'public' 
                ORDER BY tablename
              `);
              await listClient.end();
              
              const allTables = allTablesResult.rows.map(row => row.tablename);
              
              if (allTables.length > 0) {
                // Essayer de faire un dump de toutes les tables
                // Si certaines échouent, pg_dump continuera avec les autres
                try {
                  const pgDumpBase = db.password ? `PGPASSWORD='${escapeShell(db.password)}' pg_dump` : `pg_dump`;
                  const tableOptions = allTables.map(table => `--table=public.${escapeShell(table)}`).join(' ');
                  const tableOnlyCmd = `${pgDumpBase} -h ${escapeShell(hostForBackup)} -p ${db.port} -U ${escapeShell(db.username)} -d ${escapeShell(db.database)} -F p --no-owner --no-privileges ${tableOptions} -f ${escapePath(outPath)}`;
                  await exec(tableOnlyCmd);
                  app.log.info({ message: 'Backup completed with all tables', database: db.name, path: outPath, tablesCount: allTables.length });
                } catch (tableErr: any) {
                  // Si le dump avec toutes les tables échoue, essayer table par table
                  app.log.warn({ message: 'Full table dump failed, trying individual tables', database: db.name });
                  const successfulTables: string[] = [];
                  const failedTables: string[] = [];
                  
                  for (const table of allTables) {
                    try {
                      const pgDumpBase = db.password ? `PGPASSWORD='${escapeShell(db.password)}' pg_dump` : `pg_dump`;
                      const tempPath = `${outPath}.tmp.${table}`;
                      const singleTableCmd = `${pgDumpBase} -h ${escapeShell(hostForBackup)} -p ${db.port} -U ${escapeShell(db.username)} -d ${escapeShell(db.database)} -F p --no-owner --no-privileges --table=public.${escapeShell(table)} -f ${escapePath(tempPath)}`;
                      await exec(singleTableCmd);
                      successfulTables.push(table);
                      // Ajouter le contenu au fichier principal
                      await import('fs/promises').then(async fs => {
                        const content = await fs.readFile(tempPath, 'utf-8');
                        await fs.appendFile(outPath, content + '\n');
                        await fs.unlink(tempPath);
                      });
                    } catch (singleErr) {
                      failedTables.push(table);
                    }
                  }
                  
                  if (successfulTables.length > 0) {
                    app.log.info({ message: 'Backup completed with partial tables', database: db.name, path: outPath, successful: successfulTables.length, failed: failedTables.length, failedTables });
                  } else {
                    // Si toutes les tables échouent avec pg_dump, créer un backup avec le schéma au moins
                    app.log.warn({ message: 'All pg_dump attempts failed, creating schema-only backup', database: db.name });
                    
                    try {
                      const schemaClient = new PgClient({
                        host: hostForBackup,
                        port: db.port,
                        user: db.username,
                        password: db.password || '',
                        database: db.database,
                        connectionTimeoutMillis: 5000,
                      });
                      
                      await schemaClient.connect();
                      
                      // Créer un backup avec le schéma des tables (même sans données)
                      let backupContent = `-- Backup de ${db.database} à ${new Date().toISOString()}\n`;
                      backupContent += `-- ATTENTION: Ce backup ne contient que le schéma (structure) des tables.\n`;
                      backupContent += `-- Les données n'ont pas pu être sauvegardées à cause de permissions insuffisantes.\n\n`;
                      backupContent += `-- Pour sauvegarder les données, connectez-vous en tant que propriétaire des tables\n`;
                      backupContent += `-- et exécutez les commandes suivantes:\n`;
                      backupContent += `-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${db.username};\n`;
                      backupContent += `-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO ${db.username};\n\n`;
                      
                      // Récupérer le schéma de toutes les tables
                      for (const table of allTables) {
                        try {
                          // Utiliser pg_catalog qui est accessible même sans permissions spéciales
                          const schemaResult = await schemaClient.query(`
                            SELECT 
                              a.attname as column_name,
                              pg_catalog.format_type(a.atttypid, a.atttypmod) as data_type,
                              a.attnotnull as is_not_null,
                              pg_get_expr(adbin, adrelid) as column_default
                            FROM pg_catalog.pg_attribute a
                            LEFT JOIN pg_catalog.pg_attrdef ad ON a.attrelid = ad.adrelid AND a.attnum = ad.adnum
                            WHERE a.attrelid = $1::regclass
                            AND a.attnum > 0
                            AND NOT a.attisdropped
                            ORDER BY a.attnum
                          `, [`public.${table}`]);
                          
                          if (schemaResult.rows.length > 0) {
                            backupContent += `-- Table: ${table}\n`;
                            backupContent += `CREATE TABLE IF NOT EXISTS ${table} (\n`;
                            const columns = schemaResult.rows.map((col) => {
                              let colDef = `  ${col.column_name} ${col.data_type}`;
                              if (col.is_not_null) {
                                colDef += ' NOT NULL';
                              }
                              if (col.column_default) {
                                colDef += ` DEFAULT ${col.column_default}`;
                              }
                              return colDef;
                            }).join(',\n');
                            backupContent += columns + '\n);\n\n';
                            
                            // Essayer de récupérer le nombre de lignes (peut échouer)
                            try {
                              const countResult = await schemaClient.query(`SELECT COUNT(*) as count FROM ${schemaClient.escapeIdentifier(table)}`);
                              const rowCount = countResult.rows[0]?.count || 0;
                              backupContent += `-- Nombre de lignes dans ${table}: ${rowCount}\n`;
                              backupContent += `-- Les données n'ont pas pu être exportées à cause de permissions insuffisantes.\n\n`;
                            } catch (countErr) {
                              backupContent += `-- Impossible de compter les lignes (permissions insuffisantes)\n\n`;
                            }
                          }
                        } catch (schemaErr) {
                          backupContent += `-- Impossible de récupérer le schéma de la table ${table}\n\n`;
                        }
                      }
                      
                      await schemaClient.end();
                      
                      // Écrire le contenu dans le fichier
                      await import('fs/promises').then(async fs => {
                        await fs.writeFile(outPath, backupContent);
                      });
                      
                      app.log.info({ message: 'Schema-only backup created', database: db.name, path: outPath, tablesCount: allTables.length });
                    } catch (schemaErr: any) {
                      const schemaErrorMsg = schemaErr instanceof Error ? schemaErr.message : String(schemaErr);
                      throw new Error(`Backup failed: Impossible de créer même un backup de schéma. ${schemaErrorMsg}. L'utilisateur ${db.username} n'a pas les permissions nécessaires. Connectez-vous en tant que propriétaire et exécutez: GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${db.username};`);
                    }
                  }
                }
              } else {
                throw new Error(`Backup failed: Aucune table trouvée dans la base de données.`);
              }
            } catch (listErr: any) {
              const listErrorMsg = listErr instanceof Error ? listErr.message : String(listErr);
              throw new Error(`Backup failed: Impossible de lister les tables. ${listErrorMsg}`);
            }
          } else {
            throw new Error(`Backup failed: ${errorMsg}${stderr ? ` - ${stderr}` : ''}`);
          }
        }
      }
      const meta: BackupVersionMeta = {
        id: randomUUID(),
        databaseId: db.id,
        createdAt: new Date().toISOString(),
        path: outPath,
        engine: db.engine,
      };
      const s = statSync(outPath);
      meta.sizeBytes = s.size;
      const versions = Store.getVersions();
      versions.push(meta);
      Store.saveVersions(versions);
      // Retention policy: keep max N versions per DB (env RETAIN_PER_DB, default 10)
      const retain = Number(process.env.RETAIN_PER_DB || 10);
      const perDb = versions.filter(v => v.databaseId === db.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const excess = perDb.filter(v => !v.pinned).slice(retain);
      for (const ex of excess) {
        try { rmSync(ex.path, { force: true }); } catch {}
      }
      const kept = versions.filter(v => !excess.some(e => e.id === v.id));
      Store.saveVersions(kept);
      return meta;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      app.log.error({ backupError: errorMsg, databaseId: id, database: db.name });
      await sendAlert('backup_failed', { id, error: errorMsg });
      return reply.code(500).send({ 
        message: 'backup failed',
        error: errorMsg,
        hint: process.env.FAKE_DUMP === '1' ? undefined : 'Vérifiez que la base de données est accessible et que mysqldump/pg_dump sont installés'
      });
    }
  });

  app.post('/backup-all', async (_req, reply) => {
    const results: Array<{ id: string; ok: boolean }> = [];
    const allDbs = await Store.getDatabases();
    for (const db of allDbs) {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `${db.name}_${ts}.sql`;
      const outPath = join(Store.paths.backupsDir, db.id, filename);
      await import('fs/promises').then(async fs => {
        await fs.mkdir(join(Store.paths.backupsDir, db.id), { recursive: true });
      });
      // Trouver mysqldump (MAMP en priorité, sinon système)
      const findMysqldump = () => {
        // MAMP utilise mysql80 ou mysql57
        const mamp80 = '/Applications/MAMP/Library/bin/mysql80/bin/mysqldump';
        const mamp57 = '/Applications/MAMP/Library/bin/mysql57/bin/mysqldump';
        if (existsSync(mamp80)) return mamp80;
        if (existsSync(mamp57)) return mamp57;
        return 'mysqldump'; // Fallback sur PATH système
      };

      // Échapper le mot de passe pour la commande shell
      const escapeShell = (str: string) => {
        return str.replace(/'/g, "'\\''").replace(/([;&|`$<>])/g, '\\$1');
      };

      // Échapper le chemin du fichier pour la commande shell
      const escapePath = (path: string) => {
        return path.replace(/'/g, "'\\''").replace(/([;&|`$<>()])/g, '\\$1');
      };

      // Pour PostgreSQL, utiliser 127.0.0.1 au lieu de localhost pour éviter les problèmes IPv6
      const hostForBackup = db.engine === 'postgres' && db.host === 'localhost' ? '127.0.0.1' : db.host;

      const cmd = db.engine === 'mysql'
        ? `${findMysqldump()} -h ${escapeShell(db.host)} -P ${db.port} -u ${escapeShell(db.username)} -p'${escapeShell(db.password)}' ${escapeShell(db.database)} > ${escapePath(outPath)}`
        : (db.password ? `PGPASSWORD='${escapeShell(db.password)}' pg_dump` : `pg_dump`) + ` -h ${escapeShell(hostForBackup)} -p ${db.port} -U ${escapeShell(db.username)} -d ${escapeShell(db.database)} -F p --no-owner --no-privileges --lock-wait-timeout=0 -f ${escapePath(outPath)}`;
    try {
      // Mode FAKE_DUMP désactivé par défaut (uniquement pour tests)
      // Pour activer le mode fake (tests uniquement), définir FAKE_DUMP=1
      const useFakeDump = process.env.FAKE_DUMP === '1';
      
      if (useFakeDump) {
        app.log.warn({ message: 'Using FAKE_DUMP mode (testing only)', database: db.name });
        await import('fs/promises').then(async fs => {
          const header = `-- Fake dump for ${db.engine} ${db.database} at ${new Date().toISOString()}\n`;
          const content = db.engine === 'mysql' 
            ? `-- MySQL Dump\nCREATE DATABASE IF NOT EXISTS ${db.database};\nUSE ${db.database};\nSELECT 1;\n`
            : `-- PostgreSQL Dump\n-- Database: ${db.database}\nSELECT 1;\n`;
          await fs.writeFile(outPath, header + content);
        });
      } else {
        await exec(cmd);
      }
        const meta: BackupVersionMeta = {
          id: randomUUID(),
          databaseId: db.id,
          createdAt: new Date().toISOString(),
          path: outPath,
          engine: db.engine,
        };
        const s = statSync(outPath);
        meta.sizeBytes = s.size;
        const versions = Store.getVersions();
        versions.push(meta);
        Store.saveVersions(versions);
        // retention per DB
        const retain = Number(process.env.RETAIN_PER_DB || 10);
        const perDb = versions.filter(v => v.databaseId === db.id)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        const excess = perDb.filter(v => !v.pinned).slice(retain);
        for (const ex of excess) {
          try { rmSync(ex.path, { force: true }); } catch {}
        }
        const kept = versions.filter(v => !excess.some(e => e.id === v.id));
        Store.saveVersions(kept);
        results.push({ id: db.id, ok: true });
      } catch (err) {
        await sendAlert('backup_failed', { id: db.id, error: String(err) });
        results.push({ id: db.id, ok: false });
      }
    }
    return { results };
  });

  app.get('/backups/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const versions = Store.getVersions().filter(v => v.databaseId === id);
    // Trier : épinglées en premier, puis par date (plus récent d'abord)
    return versions.sort((a, b) => {
      // Si une est épinglée et l'autre non, l'épinglée vient en premier
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Sinon, trier par date (plus récent d'abord)
      return b.createdAt.localeCompare(a.createdAt);
    });
  });

  app.post('/restore/:versionId', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const v = Store.getVersions().find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    
    // Vérifier que le fichier de backup existe
    if (!existsSync(v.path)) {
      app.log.error({ message: 'Backup file not found', versionId, path: v.path });
      return reply.code(404).send({ 
        message: 'backup file not found',
        path: v.path,
        hint: 'Le fichier de backup a peut-être été supprimé ou déplacé'
      });
    }
    
    const allDbs = await Store.getDatabases();
    const db = allDbs.find(d => d.id === v.databaseId);
    if (!db) return reply.code(404).send({ message: 'database not found' });

    // Échapper le mot de passe pour la commande shell
    const escapeShell = (str: string) => {
      return str.replace(/'/g, "'\\''").replace(/([;&|`$<>])/g, '\\$1');
    };

    // Échapper le chemin du fichier pour la commande shell
    const escapePath = (path: string) => {
      return path.replace(/'/g, "'\\''").replace(/([;&|`$<>()])/g, '\\$1');
    };

    // Pour MySQL, utiliser le client MAMP si disponible
    const findMysql = () => {
      const mamp80 = '/Applications/MAMP/Library/bin/mysql80/bin/mysql';
      const mamp57 = '/Applications/MAMP/Library/bin/mysql57/bin/mysql';
      if (existsSync(mamp80)) return mamp80;
      if (existsSync(mamp57)) return mamp57;
      return 'mysql'; // Fallback sur PATH système
    };

    // Pour PostgreSQL, utiliser 127.0.0.1 au lieu de localhost
    const hostForRestore = db.engine === 'postgres' && db.host === 'localhost' ? '127.0.0.1' : db.host;

    const escapedPath = escapePath(v.path);
    const cmd = db.engine === 'mysql'
      ? `${findMysql()} -h ${escapeShell(db.host)} -P ${db.port} -u ${escapeShell(db.username)} -p'${escapeShell(db.password)}' ${escapeShell(db.database)} < ${escapedPath}`
      : (db.password ? `PGPASSWORD='${escapeShell(db.password)}' psql` : `psql`) + ` -h ${escapeShell(hostForRestore)} -p ${db.port} -U ${escapeShell(db.username)} -d ${escapeShell(db.database)} -f ${escapedPath}`;

    try {
      // Mode FAKE_DUMP désactivé par défaut (uniquement pour tests)
      const useFakeDump = process.env.FAKE_DUMP === '1';
      
      if (useFakeDump) {
        // Simulation: considérer comme restauré sans exécuter de commande
        app.log.info({ message: 'Fake restore (FAKE_DUMP mode)', versionId, database: db.name });
      } else {
        app.log.info({ message: 'Starting restore', versionId, database: db.name, engine: db.engine, path: v.path });
        await exec(cmd);
        app.log.info({ message: 'Restore completed', versionId, database: db.name });
      }
      return { status: 'restored', versionId };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const stderr = (err as any)?.stderr || '';
      app.log.error({ 
        restoreError: errorMsg, 
        versionId, 
        database: db.name,
        path: v.path,
        stderr,
        command: cmd.replace(/-p'[^']*'/, "-p'***'").replace(/PGPASSWORD='[^']*'/, "PGPASSWORD='***'")
      });
      await sendAlert('restore_failed', { versionId, error: errorMsg, database: db.name });
      return reply.code(500).send({ 
        message: 'restore failed',
        error: errorMsg,
        stderr: stderr || undefined,
        hint: process.env.FAKE_DUMP === '1' 
          ? undefined 
          : 'Vérifiez que la base de données est accessible, que mysql/psql sont installés, et que le fichier de backup est valide'
      });
    }
  });

  // Version management
  app.post('/versions/:versionId/pin', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const versions = Store.getVersions();
    const v = versions.find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    v.pinned = true;
    Store.saveVersions(versions);
    return v;
  });

  app.post('/versions/:versionId/unpin', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const versions = Store.getVersions();
    const v = versions.find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    v.pinned = false;
    Store.saveVersions(versions);
    return v;
  });

  app.get('/versions/:versionId/download', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const v = Store.getVersions().find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    reply.header('Content-Type', 'application/sql');
    reply.header('Content-Disposition', `attachment; filename="${v.path.split('/').pop()}"`);
    return reply.send(createReadStream(v.path));
  });

  app.delete('/versions/:versionId', async (req, reply) => {
    const { versionId } = req.params as { versionId: string };
    const versions = Store.getVersions();
    const v = versions.find(x => x.id === versionId);
    if (!v) return reply.code(404).send({ message: 'version not found' });
    if (v.pinned) return reply.code(400).send({ message: 'version is pinned' });
    try { rmSync(v.path, { force: true }); } catch {}
    const kept = versions.filter(x => x.id !== versionId);
    Store.saveVersions(kept);
    return { deleted: true };
  });
}
async function sendAlert(type: string, payload: unknown) {
  const url = process.env.ALERT_WEBHOOK_URL;
  if (!url) return;
  try {
    const body = JSON.stringify({ type, timestamp: new Date().toISOString(), payload });
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  } catch {}
}


