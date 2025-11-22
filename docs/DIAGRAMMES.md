# Diagrammes de Flux - Plateforme SafeBase

## 1. Flux d'Ajout d'une Base de Données

```
┌─────────────┐
│  Utilisateur│
└──────┬──────┘
       │
       │ 1. Saisit les informations
       ▼
┌─────────────────┐
│  Frontend React  │
│  Formulaire      │
└──────┬───────────┘
       │
       │ 2. POST /databases
       ▼
┌─────────────────┐
│   API Fastify    │
│   routes.ts      │
└──────┬───────────┘
       │
       │ 3. Validation Zod
       ▼
┌─────────────────┐
│  RegisterSchema  │
│  Validation      │
└──────┬───────────┘
       │
       │ 4. Test connexion
       ▼
┌─────────────────┐
│ testDatabase     │
│ Connection()     │
└──────┬───────────┘
       │
       ├─► MySQL/PostgreSQL
       │   (test ping + query)
       │
       │ 5. Chiffrement mot de passe
       ▼
┌─────────────────┐
│  crypto.encrypt()│
└──────┬───────────┘
       │
       │ 6. Sauvegarde
       ▼
┌─────────────────┐
│  Store.save      │
│  Databases()    │
└──────┬───────────┘
       │
       ├─► PostgreSQL (db.ts)
       │   OU
       └─► JSON (store-fallback.ts)
       │
       │ 7. Retour succès
       ▼
┌─────────────────┐
│  Frontend        │
│  Toast + Refresh │
└─────────────────┘
```

## 2. Flux de Sauvegarde Automatique

```
┌─────────────────┐
│  Cron (scheduler)│
│  0 * * * *       │
└──────┬───────────┘
       │
       │ 1. Toutes les heures
       ▼
┌─────────────────┐
│ backup_all.sh    │
└──────┬───────────┘
       │
       │ 2. POST /backup-all
       ▼
┌─────────────────┐
│   API Fastify    │
│   /backup-all    │
└──────┬───────────┘
       │
       │ 3. Store.getDatabases()
       ▼
┌─────────────────┐
│  Pour chaque DB  │
└──────┬───────────┘
       │
       │ 4. Exécution mysqldump/pg_dump
       ▼
┌─────────────────┐
│  exec(cmd)       │
│  mysqldump ...   │
│  ou pg_dump ...  │
└──────┬───────────┘
       │
       │ 5. Fichier .sql créé
       ▼
┌─────────────────┐
│  Store.addVersion│
│  (métadonnées)   │
└──────┬───────────┘
       │
       │ 6. Nettoyage anciennes versions
       ▼
┌─────────────────┐
│  Suppression     │
│  versions > 10   │
│  (non épinglées) │
└──────┬───────────┘
       │
       │ 7. Alerte succès/échec
       ▼
┌─────────────────┐
│  sendAlert()     │
│  Store.addAlert()│
└──────┬───────────┘
       │
       │ 8. Heartbeat
       ▼
┌─────────────────┐
│ POST /scheduler  │
│ /heartbeat       │
└─────────────────┘
```

## 3. Flux de Restauration

```
┌─────────────┐
│  Utilisateur│
└──────┬──────┘
       │
       │ 1. Sélectionne une version
       ▼
┌─────────────────┐
│  Frontend        │
│  Modal Versions  │
└──────┬───────────┘
       │
       │ 2. Confirmation
       │    "Restaurer cette version ?"
       │
       │ 3. POST /restore/:versionId
       ▼
┌─────────────────┐
│   API Fastify    │
│   /restore       │
└──────┬───────────┘
       │
       │ 4. Store.asyncGetVersions()
       │    Trouve la version
       ▼
┌─────────────────┐
│  Vérification    │
│  - Fichier existe│
│  - DB existe     │
└──────┬───────────┘
       │
       │ 5. Exécution mysql/psql
       ▼
┌─────────────────┐
│  exec(cmd)       │
│  mysql < file.sql│
│  ou psql -f file │
└──────┬───────────┘
       │
       ├─► Succès
       │   │
       │   ▼
       │   ┌─────────────────┐
       │   │ sendAlert()     │
       │   │ restore_success │
       │   └─────────────────┘
       │
       └─► Échec
           │
           ▼
           ┌─────────────────┐
           │ sendAlert()     │
           │ restore_failed  │
           └─────────────────┘
```

## 4. Flux de Gestion des Alertes

```
┌─────────────────┐
│  Événement       │
│  (backup failed, │
│   restore, etc.) │
└──────┬───────────┘
       │
       │ 1. sendAlert(type, payload)
       ▼
┌─────────────────┐
│  Création Alert  │
│  - id (UUID)     │
│  - type          │
│  - timestamp     │
│  - payload       │
│  - resolved:false│
└──────┬───────────┘
       │
       │ 2. Store.addAlert()
       ▼
┌─────────────────┐
│  PostgreSQL      │
│  Table alerts    │
└──────┬───────────┘
       │
       │ 3. Webhook (si configuré)
       ▼
┌─────────────────┐
│  POST webhook    │
│  Slack/Teams/etc │
└─────────────────┘
```

## 5. Architecture des Couches

```
┌─────────────────────────────────────────┐
│         COUCHE PRÉSENTATION              │
│  ┌───────────────────────────────────┐   │
│  │  Frontend React                   │   │
│  │  - Composants UI                  │   │
│  │  - Gestion d'état                 │   │
│  │  - Appels API                     │   │
│  └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    │
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────┐
│         COUCHE APPLICATION              │
│  ┌───────────────────────────────────┐   │
│  │  API Fastify (routes.ts)         │   │
│  │  - Validation (Zod)              │   │
│  │  - Gestion d'erreurs              │   │
│  │  - Logging                        │   │
│  │  - Middleware sécurité            │   │
│  └──────────┬────────────────────────┘   │
│             │                             │
│  ┌──────────▼────────────────────────┐   │
│  │  Store (store.ts)                  │   │
│  │  - Abstraction données              │   │
│  │  - Fallback automatique             │   │
│  └──────────┬─────────────────────────┘   │
└────────────┼─────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼──────┐  ┌───────▼────────┐
│PostgreSQL│  │  Fallback JSON  │
│  (db.ts) │  │(store-fallback) │
└──────────┘  └─────────────────┘
```

## 6. Flux de Chiffrement des Mots de Passe

```
┌─────────────────┐
│  Mot de passe   │
│  (plain text)   │
└──────┬───────────┘
       │
       │ 1. crypto.encrypt()
       ▼
┌─────────────────┐
│  Génération      │
│  - IV (16 bytes) │
│  - Salt (32 bytes)│
└──────┬───────────┘
       │
       │ 2. Scrypt (dérivation clé)
       ▼
┌─────────────────┐
│  AES-256-GCM     │
│  Chiffrement     │
└──────┬───────────┘
       │
       │ 3. Format final
       ▼
┌─────────────────┐
│  Base64 string   │
│  iv:salt:enc:tag │
└──────┬───────────┘
       │
       │ 4. Stockage
       ▼
┌─────────────────┐
│  PostgreSQL      │
│  password TEXT   │
└─────────────────┘
```

## 7. Flux de Fallback (PostgreSQL indisponible)

```
┌─────────────────┐
│  Store.init()    │
└──────┬───────────┘
       │
       │ 1. Tentative connexion PostgreSQL
       ▼
┌─────────────────┐
│  db.initDatabase│
└──────┬───────────┘
       │
       ├─► Succès
       │   │
       │   ▼
       │   ┌─────────────────┐
       │   │ usePostgres=true │
       │   │ db.ts            │
       │   └─────────────────┘
       │
       └─► Échec
           │
           ▼
           ┌─────────────────┐
           │ usePostgres=    │
           │ false           │
           │ StoreFallback   │
           │ (JSON files)    │
           └─────────────────┘
```

## 8. Diagramme de Séquence - Sauvegarde Complète

```
Utilisateur    Frontend      API          Store        PostgreSQL    mysqldump
    │             │           │            │              │              │
    │──POST───────>│           │            │              │              │
    │  /backup/:id│           │            │              │              │
    │             │──POST─────>│            │              │              │
    │             │           │            │              │              │
    │             │           │──getDB────>│              │              │
    │             │           │<───DB──────│              │              │
    │             │           │            │              │              │
    │             │           │──exec──────────────────────────────────>│
    │             │           │            │              │              │
    │             │           │<───file────┼──────────────┼──────────────│
    │             │           │            │              │              │
    │             │           │──addVersion>│              │              │
    │             │           │            │──INSERT──────>│              │
    │             │           │            │<───OK────────│              │
    │             │           │            │              │              │
    │             │           │──sendAlert>│              │              │
    │             │           │            │──INSERT──────>│              │
    │             │           │            │              │              │
    │             │<───200────│            │              │              │
    │<───Toast────│           │            │              │              │
```

---

*Diagrammes créés pour le projet SafeBase - Visualisation des flux principaux*

