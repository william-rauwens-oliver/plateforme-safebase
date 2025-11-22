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

### Tests Unitaires et d'Intégration

#### Backend
```bash
cd backend
npm test
```

#### Frontend
```bash
cd frontend
npm test
```

### Tests E2E (End-to-End)

```bash
cd e2e
npm install
npm test
```

Options E2E :
- `npm run test:ui` - Interface graphique
- `npm run test:headed` - Mode visible
- `npm run test:debug` - Mode debug

### Tests Fonctionnels (Scripts Shell)

```bash
# Tests fonctionnels complets
./scripts/test-fonctionnalites.sh

# Tests du scheduler
./scripts/test-scheduler.sh
```

### Documentation Complète

Voir [`TESTS.md`](TESTS.md) pour la documentation complète des tests.

## Architecture

### Vue d'ensemble

SafeBase suit une **architecture modulaire monolithique** organisée en couches, adaptée à la taille et aux besoins du projet. Cette architecture permet une séparation claire des responsabilités tout en restant simple à maintenir et déployer.

### Architecture en Couches

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│     Interface utilisateur moderne       │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────────┐
│      API REST (Fastify + TypeScript)     │
│  ┌──────────────────────────────────┐   │
│  │  Routes (routes.ts)               │   │
│  │  - Validation (Zod)               │   │
│  │  - Gestion d'erreurs              │   │
│  │  - Logging                         │   │
│  └──────────┬─────────────────────────┘   │
│             │                             │
│  ┌──────────▼─────────────────────────┐   │
│  │  Store (store.ts)                  │   │
│  │  - Abstraction d'accès aux données │   │
│  │  - Fallback automatique             │   │
│  └──────────┬─────────────────────────┘   │
└──────────────┼──────────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼──────┐      ┌───────▼────────┐
│PostgreSQL│      │  Fallback JSON │
│  (db.ts) │      │(store-fallback) │
└──────────┘      └────────────────┘
```

### Choix Architecturaux

#### 1. Architecture Modulaire Monolithique

**Pourquoi ?**
- Projet de taille moyenne avec besoins clairement définis
- Simplicité de déploiement (un seul conteneur API)
- Communication inter-modules efficace
- Facile à maintenir et tester

**Avantages :**
- Déploiement simplifié
- Pas de latence réseau entre modules
- Cohérence transactionnelle
- Debugging facilité

#### 2. Séparation en Couches

**Couche Présentation (Frontend)**
- React 18 avec hooks
- Vite pour le build rapide
- CSS intégré avec variables pour thèmes

**Couche Application (API)**
- Fastify pour les performances
- TypeScript pour la sécurité de types
- Validation avec Zod
- Middleware de sécurité (CORS, headers)

**Couche Données (Store)**
- Abstraction via `Store` interface
- Support PostgreSQL (production)
- Fallback JSON (développement/test)
- Chiffrement des données sensibles

#### 3. Techniques d'Optimisation

**Base de Données :**
- Index sur colonnes fréquemment requêtées (`created_at`, `database_id`, `type`, `resolved`)
- Clés étrangères avec CASCADE pour l'intégrité
- Pool de connexions PostgreSQL (max 20 connexions)
- Requêtes optimisées avec jointures

**API :**
- Validation précoce avec Zod (évite les requêtes inutiles)
- Logging structuré pour le debugging
- Gestion d'erreurs centralisée
- Headers de sécurité (XSS, CSRF, etc.)

**Frontend :**
- Lazy loading des composants
- Mémoization avec `useMemo`
- État local avec localStorage
- Design responsive avec CSS Grid

**Scheduler :**
- Cron pour la planification
- Scripts shell légers
- Heartbeat pour monitoring

### Flux de Données

#### Ajout d'une Base de Données
```
Frontend → API POST /databases
  → Validation Zod
  → Test de connexion
  → Chiffrement du mot de passe
  → Store.saveDatabases()
    → PostgreSQL (ou fallback JSON)
  → Retour avec ID
```

#### Sauvegarde
```
Scheduler (cron) → API POST /backup-all
  → Store.getDatabases()
  → Pour chaque DB:
    → mysqldump/pg_dump
    → Création fichier .sql
    → Store.addVersion()
    → Nettoyage anciennes versions
    → Alertes (succès/échec)
```

#### Restauration
```
Frontend → API POST /restore/:versionId
  → Store.asyncGetVersions()
  → Vérification fichier existe
  → mysql/psql < fichier.sql
  → Alerte de succès/échec
```

### Sécurité

- **Chiffrement** : AES-256-GCM pour les mots de passe
- **Validation** : Zod pour toutes les entrées
- **Authentification** : API Key optionnelle
- **Headers** : Protection XSS, CSRF, clickjacking
- **CORS** : Configurable par origine

### Scalabilité

L'architecture actuelle convient pour :
- Jusqu'à 100 bases de données
- Jusqu'à 1000 versions par base
- Sauvegardes horaires

Pour une montée en charge, considérer :
- Microservices (API séparée du scheduler)
- Queue pour les backups (RabbitMQ/Redis)
- Stockage distribué (S3, etc.)

## Stack Technique

- **Backend** : Fastify (TypeScript)
- **Frontend** : React 18 + Vite
- **Bases de données** : MySQL 8, PostgreSQL 16
- **Scheduler** : Alpine Linux + cron
- **Tests** : Vitest
- **CI/CD** : GitHub Actions

## Déploiement

### Prérequis

- Docker et Docker Compose installés
- 2 Go d'espace disque minimum
- Ports disponibles : 8080 (API), 5173 (Frontend), 3306 (MySQL), 5432 (PostgreSQL)

### Déploiement avec Docker (Recommandé)

#### 1. Cloner le projet
```bash
git clone https://github.com/prenom-nom/plateforme-safebase.git
cd plateforme-safebase
```

#### 2. Configuration des variables d'environnement

Créer un fichier `.env` à la racine :
```bash
# Clé de chiffrement (OBLIGATOIRE)
ENCRYPTION_KEY=votre-cle-secrete-tres-longue-et-aleatoire

# API Key (optionnel mais recommandé en production)
API_KEY=votre-api-key-secrete

# Configuration PostgreSQL pour SafeBase
DB_HOST=postgres
DB_PORT=5432
DB_NAME=safebase
DB_USER=safebase
DB_PASSWORD=safebase

# Webhook pour alertes (optionnel)
ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...
```

**Important :** Générer une clé de chiffrement sécurisée :
```bash
openssl rand -base64 32
```

#### 3. Démarrer les services

```bash
docker compose up -d --build
```

#### 4. Vérifier le déploiement

```bash
# Vérifier que tous les services sont en cours d'exécution
docker compose ps

# Vérifier les logs
docker compose logs -f api

# Tester l'API
curl http://localhost:8080/health
```

#### 5. Accéder à l'interface

- **Frontend** : http://localhost:5173
- **API** : http://localhost:8080
- **Health Check** : http://localhost:8080/health

### Déploiement en Production

#### 1. Configuration Production

Modifier `docker-compose.yml` :
- Changer les mots de passe par défaut
- Configurer les volumes persistants
- Activer l'API Key
- Configurer les limites de ressources

#### 2. Sauvegarde de la Base SafeBase

La base PostgreSQL de SafeBase contient les métadonnées. Pour la sauvegarder :

```bash
# Depuis le conteneur PostgreSQL
docker exec safebase-postgres pg_dump -U safebase safebase > safebase_backup.sql

# Restauration
docker exec -i safebase-postgres psql -U safebase safebase < safebase_backup.sql
```

#### 3. Sauvegarde des Fichiers de Backup

Les fichiers de backup sont dans le volume `backups`. Pour les sauvegarder :

```bash
# Copier le volume
docker run --rm -v plateforme-safebase_backups:/data -v $(pwd):/backup alpine tar czf /backup/backups.tar.gz /data
```

#### 4. Monitoring

- **Logs** : `docker compose logs -f`
- **Métriques** : Endpoint `/health` et `/scheduler/heartbeat`
- **Alertes** : Configurer `ALERT_WEBHOOK_URL`

### Déploiement Local (Sans Docker)

#### Backend

```bash
cd backend
npm install
npm run build

# Configurer les variables d'environnement
export ENCRYPTION_KEY=votre-cle
export DB_HOST=localhost
export DB_PORT=5432
# ...

# Démarrer PostgreSQL localement
# Puis :
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run build
npm run preview
```

### Troubleshooting

Voir [`backend/TROUBLESHOOTING.md`](backend/TROUBLESHOOTING.md) pour les problèmes courants.

## Documentation

- **Architecture** : Voir section [Architecture](#architecture) ci-dessus
- **Déploiement** : Voir section [Déploiement](#déploiement) ci-dessus
- **Cahier des charges** : Voir [`docs/CAHIER_DES_CHARGES.md`](docs/CAHIER_DES_CHARGES.md)
- **User Stories** : Voir [`docs/USER_STORIES.md`](docs/USER_STORIES.md)
- **Diagrammes de flux** : Voir [`docs/DIAGRAMMES.md`](docs/DIAGRAMMES.md)
- **Gestion de projet** : Voir [`docs/GESTION_PROJET.md`](docs/GESTION_PROJET.md)
- **Présentation** : Diapositives pour la soutenance disponibles dans [`docs/PRESENTATION.md`](docs/PRESENTATION.md) et [`docs/PRESENTATION.pdf`](docs/PRESENTATION.pdf)
- **Sécurité** : Voir [`SECURITY.md`](SECURITY.md) pour la politique de sécurité
- **Tests** : Voir [`TESTS.md`](TESTS.md) pour la documentation complète des tests
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
