# SafeBase Platform

[![CI/CD](https://github.com/william-rauwens-oliver/plateforme-safebase/actions/workflows/ci.yml/badge.svg)](https://github.com/william-rauwens-oliver/plateforme-safebase/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.28-green)](https://fastify.dev/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)

> **"Parce qu'un DROP DATABASE est vite arrivé... Safebase, I'll be back(up)."**

Solution complète de gestion de sauvegarde et restauration de bases de données MySQL & PostgreSQL avec API REST, scheduler automatique et interface utilisateur moderne.

## Structure du Projet

```
plateforme-safebase/
├── backend/          # API Fastify (TypeScript)
│   ├── src/          # Code source
│   ├── test/         # Tests unitaires
│   └── dist/         # Code compilé
├── frontend/         # Interface React + Vite
│   └── src/          # Code source
├── scheduler/         # Scheduler cron pour backups automatiques
│   └── scripts/      # Scripts de backup
├── docs/             # Documentation
│   ├── PRESENTATION.md    # Diaporama de présentation
│   └── PRESENTATION.pdf   # PDF de présentation
├── scripts/          # Scripts utilitaires
├── docker-compose.yml
└── README.md
```

## Démarrage Rapide

### Avec Docker (recommandé)

```bash
docker compose up --build
```

**Services disponibles :**
- **API** : `http://localhost:8080`
- **Frontend** : `http://localhost:5173`

### Installation locale

#### Backend

```bash
cd backend
npm install
npm run build
npm test        # Tests unitaires
npm run dev     # API sur http://localhost:8080
```

**Prérequis :** Le backend nécessite `mysql-client` et `postgresql-client` installés pour les backups.

#### Frontend

```bash
cd frontend
npm install
npm run dev     # Interface sur http://localhost:5173
```

## API REST - Endpoints

### Santé et Monitoring
- `GET /health` - Vérifier l'état de l'API
- `GET /scheduler/heartbeat` - État du scheduler
- `POST /scheduler/heartbeat` - Enregistrer un heartbeat

### Gestion des Bases de Données
- `GET /databases` - Lister toutes les bases de données
- `POST /databases` - Ajouter une nouvelle base de données
- `GET /backups/:id` - Lister les versions d'une base

### Sauvegardes
- `POST /backup/:id` - Créer une sauvegarde d'une base spécifique
- `POST /backup-all` - Créer une sauvegarde de toutes les bases

### Restauration
- `POST /restore/:versionId` - Restaurer une version spécifique
- `GET /versions/:versionId/download` - Télécharger un backup

### Gestion des Versions
- `POST /versions/:versionId/pin` - Épingler une version
- `POST /versions/:versionId/unpin` - Désépingler une version
- `DELETE /versions/:versionId` - Supprimer une version

### Alertes et Surveillance
- `GET /alerts` - Lister les alertes (filtres: `type`, `resolved`, `limit`)
- `POST /alerts/:alertId/resolve` - Marquer une alerte comme résolue
- `DELETE /alerts/:alertId` - Supprimer une alerte

## Exemples d'utilisation

### Vérifier la santé de l'API
```bash
curl http://localhost:8080/health
```

### Ajouter une base MySQL
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

### Créer une sauvegarde
```bash
curl -X POST http://localhost:8080/backup/DATABASE_ID
```

### Restaurer une version
```bash
curl -X POST http://localhost:8080/restore/VERSION_ID
```

### Avec API Key (si configuré)
```bash
curl -H "x-api-key: ${API_KEY}" http://localhost:8080/databases
```

## Configuration

### Variables d'environnement - API

| Variable | Description | Requis | Défaut |
|----------|-------------|--------|--------|
| `API_KEY` | Clé API pour protéger les endpoints | Non | - |
| `ENCRYPTION_KEY` | Clé de chiffrement pour les mots de passe | **Oui** | - |
| `CORS_ORIGIN` | Origine autorisée pour le frontend | Non | `http://localhost:5173` |
| `ALERT_WEBHOOK_URL` | URL webhook pour alertes (Slack/Teams/HTTP) | Non | - |
| `RETAIN_PER_DB` | Nombre de versions à conserver par base | Non | `10` |
| `DATA_DIR` | Répertoire de stockage des métadonnées | Non | `/app/data` |
| `BACKUPS_DIR` | Répertoire où écrire les dumps | Non | `/backups` |

### Variables d'environnement - Scheduler

| Variable | Description | Requis | Défaut |
|----------|-------------|--------|--------|
| `SCHEDULER_API_URL` | URL de l'API | **Oui** | `http://api:8080` |
| `API_KEY` | Même valeur que le service API si activé | Non | - |

## Scripts Utilitaires

Les scripts sont disponibles dans le dossier [`scripts/`](scripts/README.md) :

- **`test-fonctionnalites.sh`** - Test complet des fonctionnalités de l'API
- **`test-scheduler.sh`** - Test du scheduler et des sauvegardes automatiques
- **`LANCER-PROJET.sh`** - Script pour lancer le projet complet
- **`changer-mot-de-passe-postgres.sh`** - Changer le mot de passe PostgreSQL
- **`fix-postgres-permissions.sh`** - Corriger les permissions PostgreSQL

## Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

### Tests fonctionnels complets
```bash
./scripts/test-fonctionnalites.sh
```

### Tests du scheduler
```bash
./scripts/test-scheduler.sh
```

## Stack Technique

- **Backend** : Fastify (TypeScript)
- **Frontend** : React 18 + Vite
- **Bases de données** : MySQL 8, PostgreSQL 16
- **Scheduler** : Alpine Linux + cron
- **Tests** : Vitest
- **CI/CD** : GitHub Actions

## Documentation

- **Présentation** : Diapositives pour la soutenance disponibles dans [`docs/PRESENTATION.md`](docs/PRESENTATION.md) et [`docs/PRESENTATION.pdf`](docs/PRESENTATION.pdf)
- **Sécurité** : Voir [`SECURITY.md`](SECURITY.md) pour la politique de sécurité
- **Variables d'environnement** : Voir [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) pour la configuration
- **Contribution** : Voir [`CONTRIBUTING.md`](CONTRIBUTING.md) pour les guidelines de contribution
- **Changelog** : Voir [`CHANGELOG.md`](CHANGELOG.md) pour l'historique des changements

## CI/CD

Le projet utilise GitHub Actions pour automatiser :
- Les tests unitaires (backend et frontend)
- Le linting du code
- La vérification de la compilation TypeScript

## Contribution

Les contributions sont les bienvenues ! Veuillez lire le [Guide de Contribution](CONTRIBUTING.md) pour plus de détails.

## License

Ce projet est un projet éducatif.

## Auteurs

- **William Rauwens-Oliver** - [@william-rauwens-oliver](https://github.com/william-rauwens-oliver)
- **Chaima BEN FARHAT**

---

Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !
