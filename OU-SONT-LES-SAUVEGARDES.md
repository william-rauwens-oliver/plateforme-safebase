# 📁 Où sont sauvegardées les bases de données ?

## 📍 Emplacement Principal

**Toutes les sauvegardes** (MySQL et PostgreSQL) sont stockées dans :

```
/Applications/MAMP/htdocs/plateforme-safebase/backend/backups/
```

---

## 📂 Structure

Chaque base de données a **son propre dossier** identifié par son **ID unique** :

```
backend/backups/
  └── {id-de-la-base}/
      ├── NomBase_2025-11-09T12-00-00-000Z.sql
      ├── NomBase_2025-11-09T13-00-00-000Z.sql
      └── ...
```

### Exemple Réel

Vous avez actuellement plusieurs bases sauvegardées :
- `240eb50f-461a-4fe3-9d64-d4d010c0182c/`
- `28101b7e-7d9a-431e-9d86-26c6750a7f7d/`
- `34da716b-14f0-4da4-b635-ecbab8a02cc8/`
- `4585a5c3-9a24-44e0-923f-7971db223333/`
- `515e7d29-a6ad-4be2-9b18-53b5c6ff6dd1/`
- `666e3d0d-73fd-4daa-8d14-1ce50380d8a8/`
- `775a34f4-45db-4d98-982f-4df99926ecb1/`
- `bbd1aa7c-55d7-4e4a-9ed6-44da5d6dcad7/` (avec plusieurs sauvegardes)

---

## 🔍 Comment Voir Vos Sauvegardes

### Via Terminal

```bash
# Voir toutes les bases
cd /Applications/MAMP/htdocs/plateforme-safebase/backend/backups
ls -la

# Voir les sauvegardes d'une base
ls -la backups/{id-de-la-base}/

# Compter les sauvegardes
find backups/ -name "*.sql" | wc -l
```

### Via Finder

1. Ouvrir Finder
2. Aller dans : `/Applications/MAMP/htdocs/plateforme-safebase/backend/`
3. Ouvrir le dossier `backups/`
4. Ouvrir le dossier avec l'ID de votre base
5. Voir tous les fichiers `.sql`

---

## 📝 Format des Fichiers

### Nom

Format : `{NomBase}_{DateISO}.sql`

Exemple : `Base PostgreSQL Demo_2025-11-09T13-09-39-223Z.sql`

### Contenu

- **MySQL** : Fichiers `.sql` avec les commandes SQL pour recréer la base
- **PostgreSQL** : Fichiers `.sql` avec les commandes SQL pour recréer la base

**Les deux formats sont identiques** (fichiers `.sql`), mais le contenu diffère selon le moteur.

---

## 🎯 Résumé

| Type | Emplacement | Format |
|------|-------------|--------|
| **MySQL** | `backend/backups/{id}/*.sql` | Fichiers SQL |
| **PostgreSQL** | `backend/backups/{id}/*.sql` | Fichiers SQL |
| **Métadonnées** | `backend/data/versions.json` | JSON |

---

## ⚠️ Important

- Les fichiers SQL contiennent **toutes les données** de la base
- **Ne partagez pas** ces fichiers sans précaution
- Les sauvegardes sont **stockées localement** sur votre ordinateur

---

**Toutes les sauvegardes MySQL et PostgreSQL sont dans : `backend/backups/` !**
