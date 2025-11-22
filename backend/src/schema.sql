-- Schéma de base de données relationnelle pour SafeBase
-- MCD/MLD/MPD conforme aux consignes

-- Table : registered_databases
-- Entité : RegisteredDatabase
CREATE TABLE IF NOT EXISTS registered_databases (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    engine VARCHAR(20) NOT NULL CHECK (engine IN ('mysql', 'postgres')),
    host VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL CHECK (port > 0),
    username VARCHAR(255) NOT NULL,
    password TEXT NOT NULL, -- Chiffré AES-256-GCM
    database VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_name UNIQUE (name)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_registered_databases_engine ON registered_databases(engine);
CREATE INDEX IF NOT EXISTS idx_registered_databases_created_at ON registered_databases(created_at);

-- Table : backup_versions
-- Entité : BackupVersionMeta
CREATE TABLE IF NOT EXISTS backup_versions (
    id UUID PRIMARY KEY,
    database_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    path VARCHAR(1000) NOT NULL,
    engine VARCHAR(20) NOT NULL CHECK (engine IN ('mysql', 'postgres')),
    size_bytes BIGINT,
    pinned BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_backup_versions_database FOREIGN KEY (database_id) 
        REFERENCES registered_databases(id) ON DELETE CASCADE,
    CONSTRAINT unique_path UNIQUE (path)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_backup_versions_database_id ON backup_versions(database_id);
CREATE INDEX IF NOT EXISTS idx_backup_versions_created_at ON backup_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backup_versions_pinned ON backup_versions(pinned);
CREATE INDEX IF NOT EXISTS idx_backup_versions_database_pinned ON backup_versions(database_id, pinned);

-- Table : alerts
-- Entité : Alert
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'backup_failed', 'restore_failed', 'scheduler_down', 
        'database_inaccessible', 'backup_success', 'restore_success'
    )),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    payload JSONB NOT NULL DEFAULT '{}',
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_type_resolved ON alerts(type, resolved);

-- Table : scheduler_info
-- Pour stocker les informations du scheduler
CREATE TABLE IF NOT EXISTS scheduler_info (
    id INTEGER PRIMARY KEY DEFAULT 1, -- Une seule ligne
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insertion de la ligne par défaut
INSERT INTO scheduler_info (id, last_heartbeat) 
VALUES (1, NULL) 
ON CONFLICT (id) DO NOTHING;

-- Fonction pour nettoyer les anciennes alertes (garder les 1000 dernières)
CREATE OR REPLACE FUNCTION cleanup_old_alerts()
RETURNS void AS $$
BEGIN
    DELETE FROM alerts
    WHERE id NOT IN (
        SELECT id FROM alerts
        ORDER BY timestamp DESC
        LIMIT 1000
    );
END;
$$ LANGUAGE plpgsql;

