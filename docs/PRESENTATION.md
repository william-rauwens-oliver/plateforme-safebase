---
marp: true
theme: default
paginate: true
header: 'SafeBase'
footer: 'Soutenance Projet'
style: |
  section {
    font-family: 'Inter', system-ui, sans-serif;
    background: #ffffff;
    color: #1e293b;
    padding: 50px 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 1.4rem;
  }

  h1 {
    font-size: 4rem;
    font-weight: 800;
    margin: 0 0 30px 0;
    color: #2563eb;
    text-align: center;
  }

  h2 {
    font-size: 2.8rem;
    font-weight: 700;
    margin: 0 0 35px 0;
    color: #0f172a;
    text-align: center;
  }

  h3 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 20px 0;
    color: #1e293b;
  }

  p {
    font-size: 1.5rem;
    color: #475569;
    margin: 12px 0;
    line-height: 1.6;
  }

  ul {
    margin: 20px 0;
    padding-left: 25px;
  }

  li {
    margin: 12px 0;
    font-size: 1.4rem;
    color: #334155;
    line-height: 1.6;
  }

  strong {
    color: #2563eb;
    font-weight: 700;
  }

  code {
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Menlo', monospace;
    font-size: 1.2rem;
  }

  pre {
    background: #f8fafc;
    padding: 25px;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    font-size: 1.1rem;
    line-height: 1.7;
    margin: 20px 0;
    overflow-x: auto;
    text-align: left;
  }

  .card {
    background: #ffffff;
    border-radius: 12px;
    padding: 30px;
    border: 2px solid #e2e8f0;
    margin: 20px 0;
  }

  .diagram-box {
    background: #f8fafc;
    border: 3px solid #2563eb;
    border-radius: 12px;
    padding: 30px;
    margin: 25px 0;
    text-align: left;
  }

  .entity {
    background: #eff6ff;
    border: 2px solid #2563eb;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }

  .entity-title {
    font-size: 1.6rem;
    font-weight: 700;
    color: #1e40af;
    margin-bottom: 15px;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 8px;
  }

  .attr {
    font-size: 1.2rem;
    color: #334155;
    margin: 8px 0;
    padding-left: 20px;
  }

  .pk {
    font-weight: 700;
    color: #1e40af;
  }

  .fk {
    font-weight: 600;
    color: #7c3aed;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin: 30px 0;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 25px;
    margin: 30px 0;
  }

  .badge {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 1.2rem;
    font-weight: 600;
    margin: 5px;
  }

  .badge-blue { background: #dbeafe; color: #1e40af; }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-orange { background: #fed7aa; color: #9a3412; }
  .badge-purple { background: #e9d5ff; color: #6b21a8; }
---

<!-- Slide 1 -->
<!-- _class: lead -->

# SafeBase

## Plateforme de sauvegarde automatisée
### pour bases de données MySQL & PostgreSQL

---

<!-- Slide 2 -->

# Contexte et Problématique

## Enjeux Critiques

- **Perte de données** : Erreur SQL irréversible (DROP DATABASE)
- **Sauvegardes manuelles** : Processus oublié ou non fiable
- **Organisation** : Fichiers dispersés, pas de versioning
- **Risque métier** : Coût financier et perte de confiance

## Besoins Entreprise

- **Automatisation** : Sauvegardes régulières sans intervention
- **Centralisation** : Gestion unifiée de toutes les bases
- **Traçabilité** : Historique complet des versions
- **Restauration rapide** : Récupération en cas d'incident

---

<!-- Slide 3 -->

# Solution SafeBase

## Vision

Plateforme centralisée pour automatiser la sauvegarde et la restauration de bases de données existantes

## Valeurs

- **Simplicité** : Interface intuitive
- **Fiabilité** : Automatisation complète
- **Sécurité** : Chiffrement et isolation
- **Performance** : Architecture optimisée

## Résultats

- **13 endpoints REST** opérationnels
- **100% des tests** passent
- **Documentation** complète
- **Prêt pour production**

---

<!-- Slide 4 -->

# Architecture Système

## Composants

- **Frontend** : React 18 + Vite (port 5173)
- **Backend** : Fastify + TypeScript (port 8080)
- **Scheduler** : Conteneur Alpine + Cron
- **Bases** : MySQL 8 + PostgreSQL 16

## Communication

- Frontend ↔ Backend : **HTTP REST API**
- Scheduler → Backend : **POST /backup-all**
- Backend → Bases : **mysqldump / pg_dump**

```
┌─────────────┐
│  Frontend   │
│   React     │
└──────┬──────┘
       │ HTTP REST
┌──────▼──────┐
│   Backend   │
│   Fastify   │
└──────┬──────┘
       │
  ┌────┴────┐
┌─▼──┐  ┌──▼──┐
│MySQL│  │PostgreSQL│
└────┘  └──────┘
```

---

<!-- Slide 5 -->

# API REST : Architecture Backend

## Endpoints Principaux

**Gestion des Bases**
- `GET /databases` - Liste des bases
- `POST /databases` - Ajouter une base
- `GET /databases/available` - Bases disponibles

**Sauvegardes**
- `POST /backup/:id` - Backup unitaire
- `POST /backup-all` - Backup global
- `GET /backups/:id` - Liste des versions

**Versions**
- `POST /restore/:versionId` - Restaurer
- `POST /versions/:versionId/pin` - Épingler
- `GET /versions/:versionId/download` - Télécharger
- `DELETE /versions/:versionId` - Supprimer

**Monitoring**
- `GET /health` - Santé de l'API
- `GET /scheduler/heartbeat` - État scheduler

---

<!-- Slide 6 -->

# Frontend : Interface Utilisateur

## Design Moderne

- **React 18** : Framework UI moderne
- **Vite** : Build tool ultra-rapide
- **TypeScript** : Sécurité de types
- **Responsive** : Adaptatif mobile/desktop
- **Thème** : Clair/sombre

## Fonctionnalités

- Formulaire d'ajout de base
- Liste interactive des bases
- Boutons Backup / Restore
- Modal de gestion des versions
- Statut API en temps réel
- Messages de succès/erreur

## Flux Utilisateur

1. Configuration : URL API et clé
2. Enregistrement : Ajout base MySQL/PostgreSQL
3. Sauvegarde : Backup manuel ou automatique
4. Consultation : Liste des versions
5. Restauration : Récupération en 1 clic

---

<!-- Slide 7 -->

# Automatisation : Scheduler

## Planification

- **Fréquence** : Toutes les heures (`0 * * * *`)
- **Script** : `backup_all.sh`
- **Action** : Appel `POST /backup-all`
- **Isolation** : Conteneur Docker dédié
- **Fiabilité** : Redémarrage automatique

## Monitoring

- **Heartbeat** : Mise à jour toutes les 5 min
- **Endpoint** : `/scheduler/heartbeat`
- **État** : Stocké dans `scheduler.json`
- **Alertes** : Webhook en cas d'échec
- **Logs** : Traçabilité complète

## Flux Automatique

```
Cron (toutes les heures)
    ↓
backup_all.sh
    ↓
POST /backup-all
    ↓
Backup de toutes les bases
    ↓
Mise à jour versions.json
    ↓
Nettoyage (rétention)
```

---

<!-- Slide 8 -->

# Sécurité et Protection

## Authentification

- **API Key** : Protection des endpoints
- **Header** : `x-api-key` requis
- **Exceptions** : `/health` et `/scheduler/heartbeat`
- **Configuration** : Variable d'environnement

## Chiffrement

- **Algorithme** : AES-256-GCM
- **Champ** : Mots de passe bases
- **Clé** : Variable `ENCRYPTION_KEY`
- **Stockage** : Jamais en clair
- **Déchiffrement** : À la volée

## Headers Sécurisés

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `CORS` : Origine configurable

## Validation

- **Zod** : Schémas stricts
- **TypeScript** : Typage compilation
- **Test connexion** : Avant enregistrement

---

<!-- Slide 9 : MCD -->

# Modèle Conceptuel de Données (MCD)

## Entités et Attributs

<div class="diagram-box">

### Entité : RegisteredDatabase

**Description** : Base de données MySQL ou PostgreSQL enregistrée dans SafeBase

<div class="entity">
<div class="entity-title">RegisteredDatabase</div>
<div class="attr"><span class="pk">id</span> : UUID (Clé Primaire)</div>
<div class="attr">name : string (Nom de la connexion)</div>
<div class="attr">engine : enum (mysql | postgres)</div>
<div class="attr">host : string (Adresse serveur)</div>
<div class="attr">port : number (Port de connexion)</div>
<div class="attr">username : string (Nom d'utilisateur)</div>
<div class="attr">password : string (Chiffré AES-256-GCM)</div>
<div class="attr">database : string (Nom de la base)</div>
<div class="attr">createdAt : ISO 8601 (Date création)</div>
</div>

### Entité : BackupVersionMeta

**Description** : Version sauvegardée d'une base de données

<div class="entity">
<div class="entity-title">BackupVersionMeta</div>
<div class="attr"><span class="pk">id</span> : UUID (Clé Primaire)</div>
<div class="attr"><span class="fk">databaseId</span> : UUID (Clé Étrangère → RegisteredDatabase.id)</div>
<div class="attr">createdAt : ISO 8601 (Date sauvegarde)</div>
<div class="attr">path : string (Chemin fichier SQL)</div>
<div class="attr">engine : enum (mysql | postgres)</div>
<div class="attr">sizeBytes : number (Taille en octets, optionnel)</div>
<div class="attr">pinned : boolean (Épinglé, optionnel, défaut: false)</div>
</div>

</div>

---

<!-- Slide 10 : MCD Relations -->

# Modèle Conceptuel de Données (MCD)
## Relations et Cardinalités

<div class="diagram-box">

### Relation entre les Entités

```
┌─────────────────────────────────────┐
│      RegisteredDatabase              │
├─────────────────────────────────────┤
│ id : UUID (PK)                       │
│ name : string                        │
│ engine : enum                        │
│ host : string                        │
│ port : number                        │
│ username : string                    │
│ password : string (encrypted)       │
│ database : string                    │
│ createdAt : ISO 8601                │
└──────────────┬──────────────────────┘
               │
               │ Relation 1,N
               │ (Une base peut avoir
               │  plusieurs versions)
               │
               │ Cardinalité :
               │ - RegisteredDatabase : 1
               │ - BackupVersionMeta : N (0..*)
               │
┌──────────────▼──────────────────────┐
│      BackupVersionMeta              │
├─────────────────────────────────────┤
│ id : UUID (PK)                       │
│ databaseId : UUID (FK)               │
│ createdAt : ISO 8601                │
│ path : string                        │
│ engine : enum                        │
│ sizeBytes : number (opt)            │
│ pinned : boolean (opt)              │
└─────────────────────────────────────┘
```

### Règles Métier

- **Intégrité référentielle** : Si une base est supprimée, toutes ses versions sont supprimées
- **Protection** : Versions épinglées (`pinned: true`) jamais supprimées automatiquement
- **Contrainte** : Une version appartient à exactement 1 base de données
- **Unicité** : `id` unique pour chaque entité

</div>

---

<!-- Slide 11 : MLD -->

# Modèle Logique de Données (MLD)

## Structure Logique

<div class="diagram-box">

### Table : RegisteredDatabase

**Type** : Table principale  
**Clé Primaire** : `id`  
**Index Secondaires** : `name`

```typescript
interface RegisteredDatabase {
  id: string;                    // UUID, PK
  name: string;                  // Nom connexion
  engine: 'mysql' | 'postgres'; // Moteur
  host: string;                  // Serveur
  port: number;                  // Port
  username: string;              // Utilisateur
  password: string;              // Chiffré AES-256
  database: string;              // Nom base
  createdAt: string;             // ISO 8601
}
```

**Contraintes** :
- `id` : UNIQUE, NOT NULL
- `name` : NOT NULL
- `engine` : ENUM('mysql', 'postgres')
- `port` : INTEGER > 0
- `password` : Chiffré avant stockage

</div>

---

<!-- Slide 12 : MLD Suite -->

# Modèle Logique de Données (MLD)
## Structure Logique (Suite)

<div class="diagram-box">

### Table : BackupVersionMeta

**Type** : Table de relation  
**Clé Primaire** : `id`  
**Clé Étrangère** : `databaseId` → `RegisteredDatabase.id`  
**Index Secondaires** : `databaseId`, `createdAt`, `pinned`

```typescript
interface BackupVersionMeta {
  id: string;                    // UUID, PK
  databaseId: string;            // FK → RegisteredDatabase.id
  createdAt: string;             // ISO 8601
  path: string;                   // Chemin fichier SQL
  engine: 'mysql' | 'postgres';  // Moteur
  sizeBytes?: number;             // Taille (optionnel)
  pinned?: boolean;               // Épinglé (optionnel, défaut: false)
}
```

**Contraintes** :
- `id` : UNIQUE, NOT NULL
- `databaseId` : NOT NULL, FOREIGN KEY
- `path` : UNIQUE, NOT NULL
- `pinned` : BOOLEAN (défaut: false)

**Relation** :
- `databaseId` → `RegisteredDatabase.id` (CASCADE DELETE)

</div>

---

<!-- Slide 13 : MPD -->

# Modèle Physique de Données (MPD)

## Implémentation : Stockage JSON File-Based

<div class="diagram-box">

### Fichiers de Stockage

**1. databases.json**
- **Structure** : Tableau de `RegisteredDatabase`
- **Emplacement** : `/app/data/databases.json`
- **Format** : JSON array
- **Sécurité** : Mots de passe chiffrés (AES-256-GCM)

**2. versions.json**
- **Structure** : Tableau de `BackupVersionMeta`
- **Emplacement** : `/app/data/versions.json`
- **Format** : JSON array
- **Relation** : `databaseId` référence `RegisteredDatabase.id`

**3. scheduler.json**
- **Structure** : Objet avec `lastHeartbeat`
- **Emplacement** : `/app/data/scheduler.json`
- **Format** : JSON object

### Structure des Répertoires

```
/app/data/
├── databases.json      # Métadonnées bases
├── versions.json       # Métadonnées versions
└── scheduler.json      # État scheduler

/backups/
├── {database-id-1}/
│   ├── Base_Name_2025-01-09T12-00-00.sql
│   └── Base_Name_2025-01-09T13-00-00.sql
└── {database-id-2}/
    └── Base_Name_2025-01-09T14-00-00.sql
```

</div>

---

<!-- Slide 14 : MPD Détails -->

# Modèle Physique de Données (MPD)
## Détails d'Implémentation

<div class="diagram-box">

### Exemple : databases.json

```json
[
  {
    "id": "uuid-1",
    "name": "FitTracker Production",
    "engine": "mysql",
    "host": "127.0.0.1",
    "port": 8889,
    "username": "root",
    "password": "iv:salt:ciphertext:tag",
    "database": "fittracker",
    "createdAt": "2025-01-09T10:00:00.000Z"
  }
]
```

### Exemple : versions.json

```json
[
  {
    "id": "version-uuid-1",
    "databaseId": "uuid-1",
    "createdAt": "2025-01-09T12:00:00.000Z",
    "path": "/backups/uuid-1/FitTracker_2025-01-09T12-00-00.sql",
    "engine": "mysql",
    "sizeBytes": 1048576,
    "pinned": false
  }
]
```

### Politique de Rétention

- **Par défaut** : 10 versions par base
- **Configurable** : Variable `RETAIN_PER_DB`
- **Protection** : Versions épinglées jamais supprimées
- **Nettoyage** : Automatique (plus anciennes d'abord)

</div>

---

<!-- Slide 15 -->

# Gestion des Versions

## Stockage

- **Format** : Fichiers `.sql` horodatés
- **Structure** : `backups/{db-id}/{name}_{timestamp}.sql`
- **Métadonnées** : `versions.json`
- **Volumes** : Persistance Docker

## Fonctionnalités

- **Pin/Unpin** : Protéger versions importantes
- **Download** : Télécharger un backup
- **Delete** : Supprimer une version
- **Liste** : Historique chronologique
- **Tri** : Épinglées en premier

## Politique de Rétention

- **Par défaut** : 10 versions par base
- **Configurable** : Variable `RETAIN_PER_DB`
- **Protection** : Versions épinglées jamais supprimées
- **Nettoyage** : Automatique (plus anciennes d'abord)

---

<!-- Slide 16 -->

# Stack Technique

## Technologies Backend

<span class="badge badge-blue">TypeScript 5.4</span>
<span class="badge badge-green">Node.js 20</span>
<span class="badge badge-blue">Fastify 4.28</span>
<span class="badge badge-blue">Zod</span>
<span class="badge badge-green">Vitest</span>

## Technologies Frontend

<span class="badge badge-green">React 18.3</span>
<span class="badge badge-purple">Vite</span>
<span class="badge badge-blue">TypeScript</span>

## Infrastructure

<span class="badge badge-orange">Docker Compose</span>
<span class="badge badge-green">MySQL 8</span>
<span class="badge badge-purple">PostgreSQL 16</span>

## Choix Techniques

- **Fastify** : Performance > Express (2x plus rapide)
- **TypeScript** : Sécurité de types, maintenabilité
- **Vite** : Build ultra-rapide, HMR instantané
- **Docker** : Isolation, portabilité, scalabilité

---

<!-- Slide 17 -->

# Tests et Qualité

## Résultats

**100% des tests passent**

## Tests Backend

- **Framework** : Vitest
- **Coverage** : Santé API, sécurité, scheduler
- **Intégration** : Endpoints REST complets
- **Mocks** : Commandes système isolées

## Tests Frontend

- **Framework** : Vitest + Testing Library
- **Composants** : Rendu et interactions
- **Scénarios** : Flux utilisateur complets

## CI/CD

- **GitHub Actions** : Tests automatiques à chaque push
- **Linting** : ESLint + TypeScript strict
- **Build** : Vérification compilation
- **Déploiement** : Prêt pour production

---

<!-- Slide 18 -->

# Déploiement Docker

## Services Docker

1. **api** : Backend Fastify (port 8080)
2. **frontend** : Interface React (port 5173)
3. **mysql** : MySQL 8 (port 3306)
4. **postgres** : PostgreSQL 16 (port 5432)
5. **scheduler** : Alpine + Cron

## Volumes

- `backups` : Stockage fichiers SQL
- `mysql_data` : Données MySQL persistantes
- `postgres_data` : Données PostgreSQL persistantes
- `data` : Métadonnées JSON

## Démarrage

```bash
docker compose up --build
```

## Avantages

- **Isolation** : Chaque service isolé
- **Portabilité** : Fonctionne partout
- **Simplicité** : Une seule commande
- **Production-ready** : Configuration optimisée

---

<!-- Slide 19 -->

# Démonstration

## Scénario de Démo

**1. Vérification Santé**
- Ouvrir `http://localhost:5173`
- Vérifier statut API (vert)

**2. Ajout d'une Base**
- Formulaire : MySQL, host `mysql`, port `3306`
- Test de connexion automatique
- Enregistrement réussi

**3. Backup Manuel**
- Clic sur "Backup"
- Message de confirmation
- Vérification dans "Versions"

**4. Restauration**
- Ouvrir modal "Versions"
- Sélectionner une version
- Clic "Restore"
- Confirmation succès

**5. Scheduler**
- Vérifier heartbeat : `GET /scheduler/heartbeat`
- Logs Docker : `docker logs scheduler`

---

<!-- Slide 20 -->

# Conclusion et Perspectives

## Réalisations

- **13 endpoints REST** opérationnels
- **Interface moderne** et intuitive
- **Automatisation complète** via cron
- **Sécurité** : API Key + chiffrement AES-256
- **Tests** : 100% de réussite
- **Documentation** : Complète et détaillée
- **Docker** : Déploiement simplifié

## Évolutions Possibles

- **Base de données** : Migrer JSON → PostgreSQL
- **Authentification** : Système utilisateurs/roles
- **Compression** : Gzip des backups
- **Cloud** : Stockage S3/Azure Blob
- **Monitoring** : Dashboard avec métriques
- **Notifications** : Email/SMS/Slack
- **Multi-tenant** : Support plusieurs organisations

## SafeBase

**Une solution complète, sécurisée et prête pour la production**

---

<!-- Slide 21 -->

# Questions ?

## Merci pour votre attention

**SafeBase** - Plateforme de sauvegarde automatisée
