# 📁 Où sont sauvegardées les données ?

## 📍 Emplacement des fichiers

### 1. Métadonnées des bases de données

**Fichier** : `backend/data/databases.json`

**Chemin complet** :
```
/Applications/MAMP/htdocs/plateforme-safebase/backend/data/databases.json
```

**Taille actuelle** : ~825 octets

**Contenu** : Liste de toutes les bases de données enregistrées avec leurs informations de connexion.

**Exemple** :
```json
[
  {
    "id": "xxx-xxx-xxx",
    "name": "Ma Base",
    "engine": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "test",
    "createdAt": "2025-11-09T..."
  }
]
```

---

### 2. Métadonnées des versions de backup

**Fichier** : `backend/data/versions.json`

**Chemin complet** :
```
/Applications/MAMP/htdocs/plateforme-safebase/backend/data/versions.json
```

**Taille actuelle** : ~12 Ko

**Contenu** : Liste de toutes les versions de backup créées.

**Exemple** :
```json
[
  {
    "id": "yyy-yyy-yyy",
    "databaseId": "xxx-xxx-xxx",
    "createdAt": "2025-11-09T...",
    "path": "/Applications/MAMP/htdocs/plateforme-safebase/backend/backups/xxx-xxx-xxx/Base_2025-11-09T...sql",
    "engine": "mysql",
    "sizeBytes": 138,
    "pinned": false
  }
]
```

---

### 3. Fichiers de backup SQL

**Dossier** : `backend/backups/`

**Chemin complet** :
```
/Applications/MAMP/htdocs/plateforme-safebase/backend/backups/
```

**Structure** :
```
backups/
  └── {database-id}/
      ├── Base_2025-11-09T12-00-00-000Z.sql
      ├── Base_2025-11-09T13-00-00-000Z.sql
      └── ...
```

**Exemple concret** :
```
/Applications/MAMP/htdocs/plateforme-safebase/backend/backups/
  └── 240eb50f-461a-4fe3-9d64-d4d010c0182c/
      ├── Test_2025-11-03T12-51-42-968Z.sql
      ├── Test_2025-11-03T12-53-23-181Z.sql
      └── ...
```

**Pour voir vos backups** :
```bash
cd /Applications/MAMP/htdocs/plateforme-safebase/backend/backups
ls -la
# Vous verrez des dossiers avec des IDs (un par base de données)
```

Chaque base de données a son propre dossier (identifié par son ID unique).

---

### 4. État du scheduler

**Fichier** : `backend/data/scheduler.json`

**Chemin complet** :
```
/Applications/MAMP/htdocs/plateforme-safebase/backend/data/scheduler.json
```

**Contenu** : Dernier heartbeat du scheduler.

**Exemple** :
```json
{
  "lastHeartbeat": "2025-11-09T13:00:00.000Z"
}
```

---

## 🔍 Comment trouver ces fichiers

### Méthode 1 : Via le terminal

```bash
# Aller dans le dossier du projet
cd /Applications/MAMP/htdocs/plateforme-safebase/backend

# Voir les métadonnées
cat data/databases.json
cat data/versions.json

# Voir les backups
ls -la backups/
ls -la backups/*/
```

### Méthode 2 : Via Finder (macOS)

1. Ouvrir Finder
2. Aller dans : `/Applications/MAMP/htdocs/plateforme-safebase/backend/`
3. Ouvrir le dossier `data/` pour les métadonnées
4. Ouvrir le dossier `backups/` pour les fichiers SQL

---

## 📊 Résumé

| Type de données | Emplacement | Format |
|----------------|-------------|--------|
| **Bases enregistrées** | `backend/data/databases.json` | JSON |
| **Versions de backup** | `backend/data/versions.json` | JSON |
| **Fichiers SQL** | `backend/backups/{db-id}/*.sql` | SQL |
| **Scheduler** | `backend/data/scheduler.json` | JSON |

---

## ⚠️ Important

- Les **mots de passe** sont stockés en **clair** dans `databases.json`
- Les **fichiers SQL** contiennent toutes les données de la base
- **Ne partagez pas** ces fichiers sans précaution
- En production, pensez à **chiffrer** les mots de passe

---

## 🔧 Variables d'environnement

Si vous voulez changer l'emplacement :

```bash
# Pour les métadonnées
export DATA_DIR="/autre/chemin/data"

# Pour les backups
export BACKUPS_DIR="/autre/chemin/backups"
```

Par défaut :
- `DATA_DIR` = `backend/data/` (ou `/app/data` en Docker)
- `BACKUPS_DIR` = `backend/backups/` (ou `/backups` en Docker)

---

**Tous les fichiers sont dans le dossier `backend/` de votre projet !**

