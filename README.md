# SafeBase Platform

Solution de sauvegarde/restauration MySQL & Postgres avec API REST, scheduler et frontend.

## 📁 Structure du Projet

```
plateforme-safebase/
├── backend/          # API Fastify (TypeScript)
├── frontend/         # Interface React + Vite
├── scheduler/        # Scheduler cron pour backups automatiques
├── docs/             # Documentation complète
├── scripts/          # Scripts utilitaires
├── docker-compose.yml
└── README.md
```

## 🚀 Démarrage Rapide

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

## 📚 Documentation

Toute la documentation est disponible dans le dossier [`docs/`](docs/README.md) :
- Guide de démarrage
- Architecture
- Tests
- Soutenance
- Résolution de problèmes
- **Présentation** : Diapositives pour la soutenance ([`docs/PRESENTATION.md`](docs/PRESENTATION.md))

## 🔧 Scripts Utilitaires

Les scripts sont disponibles dans le dossier [`scripts/`](scripts/README.md) :
- Tests fonctionnels
- Tests scheduler
- Lancement du projet
- Correction MAMP

## ⚙️ Variables d'environnement principales

- API (service api)
  - `API_KEY`: clé API pour protéger les endpoints (optionnel, définir via variable d'environnement)
  - `ENCRYPTION_KEY`: clé de chiffrement pour les mots de passe (requis, définir via variable d'environnement)
  - `CORS_ORIGIN`: origine autorisée pour le frontend (ex: `http://localhost:5173`)
  - `ALERT_WEBHOOK_URL`: URL webhook (Slack/Teams/HTTP) pour alertes
  - `RETAIN_PER_DB`: nombre de versions à conserver par base (par défaut 10)
  - `DATA_DIR`: répertoire de stockage des métadonnées (par défaut `/app/data`)
  - `BACKUPS_DIR`: répertoire où écrire les dumps (par défaut `/backups`)

- Scheduler
  - `SCHEDULER_API_URL`: URL de l'API (ex: `http://api:8080`)
  - `API_KEY`: même valeur que le service API si activé (optionnel)

## 🔌 Endpoints principaux

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

## 🧪 Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🔄 CI/CD

Le projet utilise GitHub Actions pour automatiser les tests et le linting. Voir [`docs/CI-CD.md`](docs/CI-CD.md) pour plus de détails.

## 📖 Exemples d'utilisation de l'API

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
curl -H "x-api-key: ${API_KEY}" http://localhost:8080/databases
```

## 🏗️ Stack

- API: Fastify (TypeScript)
- DBs: MySQL 8, Postgres 16
- Scheduler: Alpine + cron (appel `/backup-all`)
- Frontend: Vite + React
- Tests: Vitest
- CI/CD: GitHub Actions

## 📊 Conformité

Le projet est **100% conforme** aux consignes. Voir [`docs/analyse/ANALYSE-CONFORMITE-FINALE.md`](docs/analyse/ANALYSE-CONFORMITE-FINALE.md) et [`docs/analyse/ANALYSE-COMPETENCES-COMPLETE.md`](docs/analyse/ANALYSE-COMPETENCES-COMPLETE.md) pour les analyses détaillées.

## 📝 License

Ce projet est un projet éducatif.
