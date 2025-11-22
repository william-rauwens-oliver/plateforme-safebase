import pg from 'pg';
import { Alert, BackupVersionMeta, RegisteredDatabase } from './types.js';
import { encrypt, decrypt } from './crypto.js';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getDbPool(): pg.Pool {
  if (!pool) {
    // En développement local, essayer localhost si postgres n'est pas accessible
    // Détecter automatiquement si on est dans Docker ou en local
    const isDocker = process.env.DB_HOST === 'postgres' || process.env.DB_HOST === undefined;
    const dbHost = process.env.DB_HOST || (isDocker ? 'postgres' : 'localhost');
    const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
    const dbName = process.env.DB_NAME || 'safebase';
    const dbUser = process.env.DB_USER || 'safebase';
    const dbPassword = process.env.DB_PASSWORD || 'safebase';

    console.log(`🔌 Connexion PostgreSQL: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);

    pool = new Pool({
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000, // Réduit à 5s pour échouer plus vite si PostgreSQL n'est pas disponible
    });

    pool.on('error', (err) => {
      console.error('❌ Erreur PostgreSQL sur client inactif:', err);
    });
  }
  return pool;
}

export async function initDatabase(): Promise<void> {
  const pool = getDbPool();
  
  // Tester la connexion d'abord avec retries
  let connected = false;
  const maxRetries = 3; // Réduit à 3 tentatives pour démarrer plus vite
  const retryDelay = 3000; // 3 secondes entre chaque tentative
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      await pool.query('SELECT 1');
      connected = true;
      break;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (i < maxRetries - 1) {
        console.log(`⏳ Tentative de connexion PostgreSQL ${i + 1}/${maxRetries}... (${errorMsg})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error(`❌ Impossible de se connecter à PostgreSQL après ${maxRetries} tentatives`);
        console.error(`   Erreur: ${errorMsg}`);
        console.error('💡 Vérifiez que le service PostgreSQL est démarré et accessible');
        console.error('💡 Variables d\'environnement: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD');
        throw new Error(`Connexion PostgreSQL échouée: ${errorMsg}`);
      }
    }
  }
  
  if (!connected) {
    throw new Error('Connexion PostgreSQL impossible');
  }
  
  console.log('✅ Connexion PostgreSQL établie');
  
  // Lire et exécuter le schéma SQL
  const { readFileSync, existsSync } = await import('fs');
  const { join, dirname } = await import('path');
  const { fileURLToPath } = await import('url');
  
  // Trouver le chemin du fichier schema.sql
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const schemaPath = join(__dirname, 'schema.sql');
  
  // Essayer aussi depuis process.cwd() si le fichier n'existe pas
  let schema: string;
  let schemaFound = false;
  
  if (existsSync(schemaPath)) {
    schema = readFileSync(schemaPath, 'utf-8');
    schemaFound = true;
  } else {
    // Fallback: essayer depuis le répertoire de travail
    const fallbackPath = join(process.cwd(), 'backend', 'src', 'schema.sql');
    if (existsSync(fallbackPath)) {
      schema = readFileSync(fallbackPath, 'utf-8');
      schemaFound = true;
    } else {
      // Dernier fallback: depuis le répertoire dist
      const distPath = join(process.cwd(), 'dist', 'schema.sql');
      if (existsSync(distPath)) {
        schema = readFileSync(distPath, 'utf-8');
        schemaFound = true;
      }
    }
  }
  
  if (!schemaFound) {
    console.warn('⚠️  Fichier schema.sql non trouvé, les tables peuvent déjà exister');
    return;
  }
  
  try {
    // Exécuter chaque commande SQL séparément
    const statements = schema.split(';').filter(s => s.trim().length > 0 && !s.trim().startsWith('--'));
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        try {
          await pool.query(trimmed);
        } catch (err: any) {
          // Ignorer les erreurs "already exists" pour les tables/index
          if (err?.code !== '42P07' && err?.code !== '42710') {
            console.warn('Avertissement lors de l\'exécution SQL:', err.message);
          }
        }
      }
    }
    console.log('✅ Schéma PostgreSQL initialisé avec succès');
  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation du schéma:', err);
    // Ne pas faire planter l'application, les tables peuvent déjà exister
    console.warn('⚠️  Continuation malgré l\'erreur (les tables peuvent déjà exister)');
  }
}

// Fonctions pour les bases de données enregistrées
export async function getDatabases(): Promise<RegisteredDatabase[]> {
  try {
    const pool = getDbPool();
    const result = await pool.query<{
    id: string;
    name: string;
    engine: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    created_at: Date;
  }>('SELECT * FROM registered_databases ORDER BY created_at DESC');
  
  // Déchiffrer les mots de passe
  const databases = await Promise.all(
    result.rows.map(async (row) => ({
      id: row.id,
      name: row.name,
      engine: row.engine as 'mysql' | 'postgres',
      host: row.host,
      port: row.port,
      username: row.username,
      password: await decrypt(row.password),
      database: row.database,
      createdAt: row.created_at.toISOString(),
    }))
  );
  
  return databases;
  } catch (err) {
    console.error('Erreur lors de la récupération des bases de données:', err);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

export async function saveDatabases(dbs: RegisteredDatabase[]): Promise<void> {
  try {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Supprimer toutes les bases existantes
      await client.query('DELETE FROM registered_databases');
      
      // Insérer les nouvelles bases avec mots de passe chiffrés
      for (const db of dbs) {
        const encryptedPassword = await encrypt(db.password);
        await client.query(
          `INSERT INTO registered_databases 
           (id, name, engine, host, port, username, password, database, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           engine = EXCLUDED.engine,
           host = EXCLUDED.host,
           port = EXCLUDED.port,
           username = EXCLUDED.username,
           password = EXCLUDED.password,
           database = EXCLUDED.database`,
          [
            db.id,
            db.name,
            db.engine,
            db.host,
            db.port,
            db.username,
            encryptedPassword,
            db.database,
            db.createdAt,
          ]
        );
      }
      
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Erreur lors de la sauvegarde des bases de données:', errorMsg);
    throw err; // Re-lancer l'erreur
  }
}

export async function addDatabase(db: RegisteredDatabase): Promise<void> {
  try {
    const pool = getDbPool();
    const encryptedPassword = await encrypt(db.password);
    
    await pool.query(
      `INSERT INTO registered_databases 
       (id, name, engine, host, port, username, password, database, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       engine = EXCLUDED.engine,
       host = EXCLUDED.host,
       port = EXCLUDED.port,
       username = EXCLUDED.username,
       password = EXCLUDED.password,
       database = EXCLUDED.database`,
      [
        db.id,
        db.name,
        db.engine,
        db.host,
        db.port,
        db.username,
        encryptedPassword,
        db.database,
        db.createdAt,
      ]
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('Erreur lors de l\'ajout de la base de données:', errorMsg);
    throw err; // Re-lancer l'erreur pour que routes.ts puisse la gérer
  }
}

export async function deleteDatabase(id: string): Promise<void> {
  const pool = getDbPool();
  await pool.query('DELETE FROM registered_databases WHERE id = $1', [id]);
  // Les versions seront supprimées automatiquement via CASCADE
}

// Fonctions pour les versions de backup
export function getVersions(): BackupVersionMeta[] {
  // Cette fonction doit être async mais on garde la compatibilité
  // On va la rendre async dans le Store
  throw new Error('getVersions must be called via asyncGetVersions');
}

export async function asyncGetVersions(): Promise<BackupVersionMeta[]> {
  try {
    const pool = getDbPool();
    const result = await pool.query<{
      id: string;
      database_id: string;
      created_at: Date;
      path: string;
      engine: string;
      size_bytes: number | null;
      pinned: boolean;
    }>('SELECT * FROM backup_versions ORDER BY created_at DESC');
    
    return result.rows.map((row) => ({
      id: row.id,
      databaseId: row.database_id,
      createdAt: row.created_at.toISOString(),
      path: row.path,
      engine: row.engine as 'mysql' | 'postgres',
      sizeBytes: row.size_bytes ?? undefined,
      pinned: row.pinned || undefined,
    }));
  } catch (err) {
    console.error('Erreur lors de la récupération des versions:', err);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

export async function saveVersions(versions: BackupVersionMeta[]): Promise<void> {
  const pool = getDbPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Supprimer toutes les versions existantes
    await client.query('DELETE FROM backup_versions');
    
    // Insérer les nouvelles versions
    for (const v of versions) {
      await client.query(
        `INSERT INTO backup_versions 
         (id, database_id, created_at, path, engine, size_bytes, pinned)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO UPDATE SET
         database_id = EXCLUDED.database_id,
         created_at = EXCLUDED.created_at,
         path = EXCLUDED.path,
         engine = EXCLUDED.engine,
         size_bytes = EXCLUDED.size_bytes,
         pinned = EXCLUDED.pinned`,
        [
          v.id,
          v.databaseId,
          v.createdAt,
          v.path,
          v.engine,
          v.sizeBytes ?? null,
          v.pinned ?? false,
        ]
      );
    }
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function addVersion(version: BackupVersionMeta): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `INSERT INTO backup_versions 
     (id, database_id, created_at, path, engine, size_bytes, pinned)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET
     database_id = EXCLUDED.database_id,
     created_at = EXCLUDED.created_at,
     path = EXCLUDED.path,
     engine = EXCLUDED.engine,
     size_bytes = EXCLUDED.size_bytes,
     pinned = EXCLUDED.pinned`,
    [
      version.id,
      version.databaseId,
      version.createdAt,
      version.path,
      version.engine,
      version.sizeBytes ?? null,
      version.pinned ?? false,
    ]
  );
}

export async function updateVersionPinned(id: string, pinned: boolean): Promise<void> {
  const pool = getDbPool();
  await pool.query('UPDATE backup_versions SET pinned = $1 WHERE id = $2', [pinned, id]);
}

export async function deleteVersion(id: string): Promise<void> {
  const pool = getDbPool();
  await pool.query('DELETE FROM backup_versions WHERE id = $1', [id]);
}

// Fonctions pour les alertes
export async function getAlerts(filters?: {
  type?: string;
  resolved?: boolean;
  limit?: number;
}): Promise<Alert[]> {
  try {
    const pool = getDbPool();
    let query = 'SELECT * FROM alerts WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;
    
    if (filters?.type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(filters.type);
    }
    
    if (filters?.resolved !== undefined) {
      paramCount++;
      query += ` AND resolved = $${paramCount}`;
      params.push(filters.resolved);
    }
    
    query += ' ORDER BY timestamp DESC';
    
    if (filters?.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      params.push(filters.limit);
    } else {
      query += ' LIMIT 100';
    }
    
    const result = await pool.query<{
      id: string;
      type: string;
      timestamp: Date;
      payload: any;
      resolved: boolean;
      resolved_at: Date | null;
    }>(query, params);
    
    return result.rows.map((row) => ({
      id: row.id,
      type: row.type as Alert['type'],
      timestamp: row.timestamp.toISOString(),
      payload: row.payload,
      resolved: row.resolved,
      resolvedAt: row.resolved_at?.toISOString(),
    }));
  } catch (err) {
    console.error('Erreur lors de la récupération des alertes:', err);
    return []; // Retourner un tableau vide en cas d'erreur
  }
}

export async function addAlert(alert: Alert): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `INSERT INTO alerts (id, type, timestamp, payload, resolved, resolved_at)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      alert.id,
      alert.type,
      alert.timestamp,
      JSON.stringify(alert.payload),
      alert.resolved ?? false,
      alert.resolvedAt ?? null,
    ]
  );
  
  // Nettoyer les anciennes alertes
  await pool.query('SELECT cleanup_old_alerts()');
}

export async function resolveAlert(id: string): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    'UPDATE alerts SET resolved = TRUE, resolved_at = NOW() WHERE id = $1',
    [id]
  );
}

export async function deleteAlert(id: string): Promise<void> {
  const pool = getDbPool();
  await pool.query('DELETE FROM alerts WHERE id = $1', [id]);
}

// Fonctions pour le scheduler
export async function getSchedulerInfo(): Promise<{ lastHeartbeat: string | null }> {
  try {
    const pool = getDbPool();
    const result = await pool.query<{ last_heartbeat: Date | null }>(
      'SELECT last_heartbeat FROM scheduler_info WHERE id = 1'
    );
    
    return {
      lastHeartbeat: result.rows[0]?.last_heartbeat?.toISOString() ?? null,
    };
  } catch (err) {
    console.error('Erreur lors de la récupération des infos du scheduler:', err);
    return { lastHeartbeat: null }; // Retourner null en cas d'erreur
  }
}

export async function setSchedulerHeartbeat(isoDate: string): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    'UPDATE scheduler_info SET last_heartbeat = $1 WHERE id = 1',
    [isoDate]
  );
}

