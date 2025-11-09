# 🏗️ Architecture - Plateforme SafeBase

## Vue d'ensemble

SafeBase est une plateforme de sauvegarde et restauration de bases de données MySQL et PostgreSQL, organisée en architecture modulaire avec séparation des responsabilités.

## Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Interface utilisateur (Vite + React + TypeScript)    │   │
│  │  - Gestion des bases de données                      │   │
│  │  - Gestion des versions                              │   │
│  │  - Backup/Restore                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP REST API
┌───────────────────────▼─────────────────────────────────────┐
│                    Backend (Fastify)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API REST (TypeScript)                                │   │
│  │  - Routes (routes.ts)                                 │   │
│  │  - Store (store.ts) - Gestion des données             │   │
│  │  - Types (types.ts) - Définitions TypeScript          │   │
│  │  - Server (server.ts) - Configuration Fastify         │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
│   MySQL      │ │  PostgreSQL  │ │  Scheduler  │
│   (mysqldump)│ │  (pg_dump)   │ │   (cron)    │
└──────────────┘ └──────────────┘ └─────────────┘
```

## Structure Modulaire Backend

### 1. **server.ts** - Point d'entrée
- Configuration Fastify
- Middleware CORS
- Hooks de sécurité (headers, API Key)
- Initialisation du Store

### 2. **routes.ts** - Logique métier
- Définition de tous les endpoints REST
- Validation avec Zod
- Exécution des commandes système (mysqldump, pg_dump)
- Gestion des erreurs et alertes

### 3. **store.ts** - Couche de données
- Gestion du stockage JSON (databases.json, versions.json)
- Abstraction du système de fichiers
- Fallback automatique si permissions insuffisantes

### 4. **types.ts** - Définitions TypeScript
- Interfaces pour RegisteredDatabase
- Interfaces pour BackupVersionMeta
- Types pour DatabaseEngine

## Flux de Données

### Ajout d'une base de données
```
Frontend → POST /databases → Validation Zod → Store.saveDatabases() → JSON file
```

### Backup
```
Frontend/API → POST /backup/:id → mysqldump/pg_dump → Fichier SQL → Store.saveVersions()
```

### Restauration
```
Frontend → POST /restore/:versionId → mysql/psql < backup.sql → Base restaurée
```

### Scheduler automatique
```
Cron (toutes les heures) → backup_all.sh → POST /backup-all → Backup de toutes les bases
```

## Sécurité

### 1. Authentification API Key
- Middleware Fastify vérifiant le header `x-api-key`
- Configurable via variable d'environnement `API_KEY`
- Exceptions pour `/health` et `/scheduler/heartbeat`

### 2. Headers de sécurité
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `X-XSS-Protection: 0`

### 3. Validation des entrées
- Schémas Zod pour valider toutes les données d'entrée
- Types stricts TypeScript

### 4. Gestion des erreurs
- Try/catch sur toutes les opérations critiques
- Codes HTTP appropriés (400, 401, 404, 500)
- Alertes webhook en cas d'échec

## Stockage des Données

### Format JSON (file-based)
- **databases.json** : Liste des bases enregistrées
- **versions.json** : Métadonnées des backups
- **scheduler.json** : État du scheduler (heartbeat)

### Structure des répertoires
```
backups/
  └── {database-id}/
      └── {database-name}_{timestamp}.sql
```

## Politique de Rétention

- Par défaut : 10 versions par base de données
- Configurable via `RETAIN_PER_DB`
- Versions épinglées (`pinned: true`) jamais supprimées
- Suppression automatique des versions excédentaires (plus anciennes d'abord)

## Conteneurisation

### Services Docker
1. **api** : Backend Fastify (port 8080)
2. **frontend** : Interface React (port 5173)
3. **mysql** : Base MySQL 8 (port 3306)
4. **postgres** : Base PostgreSQL 16 (port 5432)
5. **scheduler** : Container Alpine avec cron

### Volumes
- `backups` : Stockage des fichiers SQL
- `mysql_data` : Données MySQL persistantes
- `postgres_data` : Données PostgreSQL persistantes

## Choix Techniques

### Pourquoi Fastify ?
- Performance supérieure à Express
- Support TypeScript natif
- Logger intégré
- Architecture modulaire avec plugins

### Pourquoi React + Vite ?
- React : Framework moderne et populaire
- Vite : Build tool rapide avec HMR
- TypeScript : Typage statique pour la robustesse

### Pourquoi JSON file-based ?
- Simplicité pour un MVP
- Pas de dépendance à une base de données externe
- Facile à migrer vers une vraie DB si nécessaire

### Pourquoi mysqldump/pg_dump ?
- Outils standards et fiables
- Support natif par MySQL/PostgreSQL
- Format SQL portable

## Points d'Extension Futurs

1. **Base de données relationnelle** : Migrer de JSON vers PostgreSQL/MySQL
2. **Authentification utilisateurs** : Système de login/roles
3. **Compression** : Gzip des backups
4. **Chiffrement** : Chiffrer les backups sensibles
5. **Monitoring** : Dashboard avec métriques
6. **Notifications** : Email/SMS en plus des webhooks

## Tests

### Backend
- Tests unitaires avec Vitest
- Tests d'intégration des endpoints
- Mock des commandes système

### Frontend
- Tests unitaires des composants React
- Tests d'intégration avec Testing Library

## Performance

- **Backend** : Fastify optimisé pour la performance
- **Frontend** : Code splitting avec Vite
- **Backups** : Exécution asynchrone pour ne pas bloquer l'API
- **Rétention** : Suppression automatique pour limiter l'espace disque

