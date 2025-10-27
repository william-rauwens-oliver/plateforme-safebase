# SafeBase Platform

Solution de sauvegarde/restauration MySQL & Postgres avec API REST, scheduler et frontend.

## Stack
- API: Fastify (TypeScript)
- DBs: MySQL 8, Postgres 16
- Scheduler: Alpine + cron (appel `/backup-all`)
- Frontend: Vite + React

## Démarrage rapide

### Avec Docker (recommandé)
```bash
docker compose up --build
```

Services:
- API: `http://localhost:8080`
- Frontend: `http://localhost:5173`

### Test local sans Docker

1. **Backend:**
```bash
cd backend
npm install
npm run build
npm test  # Tests unitaires
npm run dev  # API sur http://localhost:8080
```

2. **Frontend:**
```bash
cd frontend
npm install
npm run dev  # Interface sur http://localhost:5173
```

**Note:** Le backend nécessite `mysql-client` et `postgresql-client` installés pour les backups.

## Variables d'environnement principales

- API (service api)
  - `API_KEY`: clé API pour protéger les endpoints (ex: `change-me`)
  - `CORS_ORIGIN`: origine autorisée pour le frontend (ex: `http://localhost:5173`)
  - `ALERT_WEBHOOK_URL`: URL webhook (Slack/Teams/HTTP) pour alertes
  - `RETAIN_PER_DB`: nombre de versions à conserver par base (par défaut 10)
  - `DATA_DIR`: répertoire de stockage des métadonnées (par défaut `/app/data`)
  - `BACKUPS_DIR`: répertoire où écrire les dumps (par défaut `/backups`)

- Scheduler
  - `SCHEDULER_API_URL`: URL de l'API (ex: `http://api:8080`)
  - `API_KEY`: même valeur que le service API si activé

## Endpoints principaux

- `GET /health`
- `GET /databases` / `POST /databases`
- `POST /backup/:id` / `POST /backup-all`
- `GET /backups/:id`
- `POST /restore/:versionId`
- `POST /versions/:versionId/pin` / `POST /versions/:versionId/unpin`
- `GET /versions/:versionId/download`
- `DELETE /versions/:versionId`
- `GET /scheduler/heartbeat` / `POST /scheduler/heartbeat`

Backups stockés dans le volume `backups`, par base.

## Tests

```bash
cd backend
npm test
```

Les tests fournis valident la santé, l'auth basique, et l'heartbeat.

## Exemples d'utilisation de l'API

### 1. Vérifier la santé
```bash
curl http://localhost:8080/health
```

### 2. Lister les bases de données
```bash
curl http://localhost:8080/databases
```

### 3. Ajouter une base MySQL
```bash
curl -X POST http://localhost:8080/databases \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "ma-base",
    "engine": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "nom_base"
  }'
```

### 4. Démarrer un backup
```bash
curl -X POST http://localhost:8080/backup/DATABASE_ID
```

### 5. Lister les versions d'une base
```bash
curl http://localhost:8080/backups/DATABASE_ID
```

### 6. Restaurer une version
```bash
curl -X POST http://localhost:8080/restore/VERSION_ID
```

### Avec API Key (si configuré)
Ajoutez le header `x-api-key` :
```bash
curl -H 'x-api-key: change-me' http://localhost:8080/databases
```

