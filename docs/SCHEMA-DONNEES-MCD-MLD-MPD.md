# 📊 Schéma de Données - SafeBase (MCD / MLD / MPD)

**Date** : 9 janvier 2025  
**Statut** : ✅ **Schéma complet et conforme**

---

## 🎯 Vue d'Ensemble

SafeBase utilise un **stockage JSON file-based** pour les métadonnées des bases de données enregistrées et des versions de sauvegarde. Ce document présente le schéma conceptuel (MCD), logique (MLD) et physique (MPD).

---

## 📐 MCD (Modèle Conceptuel de Données)

### Entités

#### 1. RegisteredDatabase (Base de données enregistrée)

**Description** : Représente une connexion à une base de données MySQL ou PostgreSQL enregistrée dans SafeBase.

**Attributs** :
- `id` : Identifiant unique (UUID)
- `name` : Nom de la connexion (ex: "FitTracker Production")
- `engine` : Moteur de base de données (`mysql` | `postgres`)
- `host` : Adresse du serveur (ex: "127.0.0.1")
- `port` : Port de connexion (ex: 8889 pour MAMP MySQL, 5432 pour PostgreSQL)
- `username` : Nom d'utilisateur
- `password` : Mot de passe (chiffré avec AES-256-GCM)
- `database` : Nom de la base de données
- `createdAt` : Date de création (ISO 8601)

**Contraintes** :
- `id` : Clé primaire, unique, non null
- `name` : Non null, unique (par utilisateur)
- `engine` : Valeur énumérée (`mysql` | `postgres`)
- `port` : Entier positif
- `password` : Chiffré avant stockage

---

#### 2. BackupVersionMeta (Métadonnées de version de sauvegarde)

**Description** : Représente une version sauvegardée d'une base de données.

**Attributs** :
- `id` : Identifiant unique (UUID)
- `databaseId` : Référence à RegisteredDatabase (clé étrangère)
- `createdAt` : Date de création de la sauvegarde (ISO 8601)
- `path` : Chemin du fichier SQL de sauvegarde
- `engine` : Moteur de base de données (`mysql` | `postgres`)
- `sizeBytes` : Taille du fichier en octets (optionnel)
- `pinned` : Indicateur d'épinglage (optionnel, défaut: false)

**Contraintes** :
- `id` : Clé primaire, unique, non null
- `databaseId` : Clé étrangère vers RegisteredDatabase, non null
- `path` : Non null, unique
- `pinned` : Booléen (true = version protégée de suppression)

---

### Relations

#### Relation : RegisteredDatabase → BackupVersionMeta

**Type** : **1,N** (Une base de données peut avoir plusieurs versions de sauvegarde)

**Cardinalité** :
- RegisteredDatabase (1) : Une base de données peut avoir 0 à N versions
- BackupVersionMeta (N) : Une version appartient à exactement 1 base de données

**Règle métier** :
- Si une base de données est supprimée, toutes ses versions sont supprimées
- Les versions épinglées (`pinned: true`) ne sont pas supprimées automatiquement par la politique de rétention

---

## 📋 MLD (Modèle Logique de Données)

### Transformation MCD → MLD

Le MLD transforme les entités et relations du MCD en structure logique adaptée au stockage JSON.

### Structure Logique

#### Table : RegisteredDatabase

```typescript
interface RegisteredDatabase {
  id: string;                    // UUID, clé primaire
  name: string;                  // Nom de la connexion
  engine: 'mysql' | 'postgres'; // Moteur de base
  host: string;                  // Adresse serveur
  port: number;                  // Port de connexion
  username: string;              // Utilisateur
  password: string;              // Mot de passe (chiffré)
  database: string;              // Nom de la base
  createdAt: string;             // Date création (ISO 8601)
}
```

**Index** :
- Index primaire : `id`
- Index secondaire : `name` (pour recherche rapide)

---

#### Table : BackupVersionMeta

```typescript
interface BackupVersionMeta {
  id: string;                    // UUID, clé primaire
  databaseId: string;            // FK vers RegisteredDatabase.id
  createdAt: string;              // Date création (ISO 8601)
  path: string;                   // Chemin fichier SQL
  engine: 'mysql' | 'postgres';  // Moteur de base
  sizeBytes?: number;             // Taille en octets (optionnel)
  pinned?: boolean;               // Épinglé (optionnel, défaut: false)
}
```

**Index** :
- Index primaire : `id`
- Index secondaire : `databaseId` (pour recherche par base)
- Index secondaire : `createdAt` (pour tri chronologique)
- Index secondaire : `pinned` (pour filtrage)

**Relation** :
- `databaseId` → `RegisteredDatabase.id` (clé étrangère)

---

## 💾 MPD (Modèle Physique de Données)

### Implémentation : Stockage JSON File-Based

Le MPD décrit l'implémentation physique du stockage dans des fichiers JSON.

### Fichiers de Stockage

#### 1. `databases.json`

**Structure** : Tableau de `RegisteredDatabase`

**Format** :
```json
[
  {
    "id": "uuid-1",
    "name": "FitTracker Production",
    "engine": "mysql",
    "host": "127.0.0.1",
    "port": 8889,
    "username": "root",
    "password": "iv:salt:ciphertext:tag",  // Chiffré AES-256-GCM
    "database": "fittracker",
    "createdAt": "2025-01-09T10:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "name": "Symfony-e Production",
    "engine": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "iv:salt:ciphertext:tag",  // Chiffré AES-256-GCM
    "database": "symfony_e",
    "createdAt": "2025-01-09T11:00:00.000Z"
  }
]
```

**Emplacement** : `/app/data/databases.json` (ou `./data/databases.json` en développement)

**Sécurité** :
- Mots de passe chiffrés avec AES-256-GCM
- Clé de chiffrement : Variable d'environnement `ENCRYPTION_KEY`

---

#### 2. `versions.json`

**Structure** : Tableau de `BackupVersionMeta`

**Format** :
```json
[
  {
    "id": "version-uuid-1",
    "databaseId": "uuid-1",
    "createdAt": "2025-01-09T12:00:00.000Z",
    "path": "/backups/uuid-1/FitTracker_Production_2025-01-09T12-00-00.sql",
    "engine": "mysql",
    "sizeBytes": 1048576,
    "pinned": false
  },
  {
    "id": "version-uuid-2",
    "databaseId": "uuid-1",
    "createdAt": "2025-01-09T13:00:00.000Z",
    "path": "/backups/uuid-1/FitTracker_Production_2025-01-09T13-00-00.sql",
    "engine": "mysql",
    "sizeBytes": 2097152,
    "pinned": true
  },
  {
    "id": "version-uuid-3",
    "databaseId": "uuid-2",
    "createdAt": "2025-01-09T14:00:00.000Z",
    "path": "/backups/uuid-2/Symfony-e_Production_2025-01-09T14-00-00.sql",
    "engine": "postgres",
    "sizeBytes": 3145728,
    "pinned": false
  }
]
```

**Emplacement** : `/app/data/versions.json` (ou `./data/versions.json` en développement)

**Relation** :
- `databaseId` référence `RegisteredDatabase.id` dans `databases.json`

---

### Structure des Répertoires

```
/app/data/
├── databases.json      # Métadonnées des bases enregistrées
├── versions.json       # Métadonnées des versions de sauvegarde
└── scheduler.json      # État du scheduler (heartbeat)

/backups/
├── {database-id-1}/
│   ├── Base_Name_2025-01-09T12-00-00.sql
│   └── Base_Name_2025-01-09T13-00-00.sql
└── {database-id-2}/
    └── Base_Name_2025-01-09T14-00-00.sql
```

---

### Opérations CRUD

#### Create (Création)

**RegisteredDatabase** :
```typescript
// Ajout d'une nouvelle base
const newDb: RegisteredDatabase = {
  id: randomUUID(),
  name: "Nouvelle Base",
  engine: "mysql",
  host: "127.0.0.1",
  port: 8889,
  username: "root",
  password: await encrypt("password"),  // Chiffrement
  database: "mabase",
  createdAt: new Date().toISOString()
};
```

**BackupVersionMeta** :
```typescript
// Création d'une nouvelle version
const newVersion: BackupVersionMeta = {
  id: randomUUID(),
  databaseId: "uuid-1",
  createdAt: new Date().toISOString(),
  path: "/backups/uuid-1/Base_Name_2025-01-09T15-00-00.sql",
  engine: "mysql",
  sizeBytes: 1048576,
  pinned: false
};
```

---

#### Read (Lecture)

**RegisteredDatabase** :
```typescript
// Lecture de toutes les bases
const databases = await Store.getDatabases();
// Les mots de passe sont automatiquement déchiffrés

// Recherche par ID
const db = databases.find(d => d.id === "uuid-1");
```

**BackupVersionMeta** :
```typescript
// Lecture de toutes les versions
const versions = Store.getVersions();

// Recherche par base
const dbVersions = versions.filter(v => v.databaseId === "uuid-1");

// Tri : épinglées en premier, puis par date
const sorted = dbVersions.sort((a, b) => {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return b.createdAt.localeCompare(a.createdAt);
});
```

---

#### Update (Mise à jour)

**RegisteredDatabase** :
```typescript
// Mise à jour d'une base
const allDbs = await Store.getDatabases();
const db = allDbs.find(d => d.id === "uuid-1");
if (db) {
  db.name = "Nouveau Nom";
  await Store.saveDatabases(allDbs);
}
```

**BackupVersionMeta** :
```typescript
// Épingler une version
const versions = Store.getVersions();
const version = versions.find(v => v.id === "version-uuid-1");
if (version) {
  version.pinned = true;
  Store.saveVersions(versions);
}
```

---

#### Delete (Suppression)

**RegisteredDatabase** :
```typescript
// Suppression d'une base (et de toutes ses versions)
const allDbs = await Store.getDatabases();
const kept = allDbs.filter(d => d.id !== "uuid-1");
await Store.saveDatabases(kept);

// Suppression des versions associées
const versions = Store.getVersions();
const keptVersions = versions.filter(v => v.databaseId !== "uuid-1");
Store.saveVersions(keptVersions);
```

**BackupVersionMeta** :
```typescript
// Suppression d'une version (si non épinglée)
const versions = Store.getVersions();
const kept = versions.filter(v => v.id !== "version-uuid-1");
Store.saveVersions(kept);
```

---

### Intégrité et Contraintes

#### Contraintes d'Intégrité Référentielle

1. **Cascade Delete** : Si une base est supprimée, toutes ses versions sont supprimées
2. **Orphan Prevention** : Une version ne peut pas exister sans base associée
3. **Unique Constraint** : `id` unique pour RegisteredDatabase et BackupVersionMeta

#### Contraintes de Domaine

1. **engine** : Valeur énumérée (`mysql` | `postgres`)
2. **port** : Entier positif (> 0)
3. **password** : Toujours chiffré avant stockage
4. **pinned** : Booléen (défaut: `false`)

#### Politique de Rétention

- **Par défaut** : 10 versions par base de données
- **Configurable** : Variable d'environnement `RETAIN_PER_DB`
- **Protection** : Versions épinglées (`pinned: true`) jamais supprimées automatiquement
- **Suppression** : Versions excédentaires (plus anciennes d'abord)

---

## 🔐 Sécurité des Données

### Chiffrement

**Algorithme** : AES-256-GCM

**Format** : `IV:SALT:CIPHERTEXT:TAG` (tous en base64)

**Clé** : Dérivée depuis `ENCRYPTION_KEY` via scrypt

**Champ chiffré** : `RegisteredDatabase.password`

**Preuve** :
- `backend/src/crypto.ts` : Implémentation du chiffrement
- `backend/src/store.ts` : Chiffrement/déchiffrement automatique

---

## 📊 Diagramme de Relations

```
┌─────────────────────────────┐
│   RegisteredDatabase        │
├─────────────────────────────┤
│ id (PK) : UUID              │
│ name : string               │
│ engine : enum                │
│ host : string               │
│ port : number               │
│ username : string           │
│ password : string (encrypted)│
│ database : string           │
│ createdAt : ISO 8601        │
└──────────────┬──────────────┘
               │
               │ 1
               │
               │ N
               │
┌──────────────▼──────────────┐
│   BackupVersionMeta         │
├─────────────────────────────┤
│ id (PK) : UUID              │
│ databaseId (FK) : UUID      │──┐
│ createdAt : ISO 8601       │  │
│ path : string               │  │
│ engine : enum                │  │
│ sizeBytes : number (opt)    │  │
│ pinned : boolean (opt)      │  │
└─────────────────────────────┘  │
                                  │
                                  │
                    Relation 1,N  │
                    (Une base peut avoir
                     plusieurs versions)
```

---

## ✅ Conformité aux Règles du Relationnel

### Règles Respectées

1. ✅ **Clé primaire** : Chaque entité a une clé primaire unique (`id`)
2. ✅ **Clé étrangère** : `BackupVersionMeta.databaseId` référence `RegisteredDatabase.id`
3. ✅ **Intégrité référentielle** : Suppression en cascade implémentée
4. ✅ **Normalisation** : Pas de redondance (chaque version référence une base)
5. ✅ **Contraintes** : Validation des types et valeurs
6. ✅ **Sécurité** : Données sensibles chiffrées

---

## 📝 Conclusion

Le schéma de données SafeBase respecte les règles du relationnel (MCD/MLD/MPD) :

- ✅ **MCD** : Entités et relations clairement définies
- ✅ **MLD** : Structure logique adaptée au stockage JSON
- ✅ **MPD** : Implémentation physique avec fichiers JSON
- ✅ **Intégrité** : Contraintes et règles métier respectées
- ✅ **Sécurité** : Chiffrement des données sensibles

**Le schéma est conforme aux besoins exprimés dans le cahier des charges.**

---

**Dernière mise à jour** : 9 janvier 2025  
**Fichiers de référence** :
- `backend/src/types.ts` : Interfaces TypeScript
- `backend/src/store.ts` : Gestion du stockage
- `backend/src/crypto.ts` : Chiffrement des données

