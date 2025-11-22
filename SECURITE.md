# 🔐 Sécurité - SafeBase

## ⚠️ Secrets et Variables d'Environnement

Ce projet utilise des **variables d'environnement** pour gérer les secrets. **Aucun secret n'est hardcodé dans le code**.

---

## 🔑 Variables Requises

### ENCRYPTION_KEY (Requis en production)

**Usage** : Chiffrement des mots de passe des bases de données

**Génération** :
```bash
openssl rand -base64 32
```

**Configuration** :
```bash
# Créer un fichier .env à la racine
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)" > .env
```

**En développement** : Une clé par défaut est utilisée (non sécurisée).

**En production** : ⚠️ **OBLIGATOIRE** - Le système refusera de démarrer sans cette clé.

---

### API_KEY (Optionnel)

**Usage** : Protection des endpoints API

**Génération** :
```bash
openssl rand -hex 32
```

**Configuration** :
```bash
# Dans .env
API_KEY=votre_cle_api_ici
```

**Si non défini** : L'API est accessible sans authentification (développement uniquement).

---

## 📝 Fichier .env

Créez un fichier `.env` à la racine (voir `.env.example`) :

```env
ENCRYPTION_KEY=votre_cle_securisee_32_bytes
API_KEY=votre_cle_api_optionnelle
CORS_ORIGIN=http://localhost:5173
```

**⚠️ IMPORTANT** : Le fichier `.env` est exclu de Git (voir `.gitignore`).

---

## 🚫 Ce qui est Exclu de Git

- ✅ `.env` (fichier avec vos secrets)
- ✅ `backend/data/databases.json` (contient les mots de passe chiffrés)
- ✅ `backend/data/versions.json`
- ✅ `backend/data/scheduler.json`
- ✅ `backend/backups/` (fichiers SQL de sauvegarde)

---

## ✅ Bonnes Pratiques

1. **Ne jamais commiter** :
   - ❌ Fichiers `.env` avec des secrets réels
   - ❌ Clés de chiffrement en clair
   - ❌ Mots de passe en clair

2. **Utiliser `.env.example`** : Template sans secrets réels

3. **Variables d'environnement** : Toujours utiliser des variables, jamais de valeurs hardcodées

4. **Rotation des clés** : Changer régulièrement les clés en production

---

## 🔍 Vérification

### Vérifier que les secrets ne sont pas dans Git

```bash
# Chercher des secrets dans l'historique
git log --all --full-history -S "password" -S "secret" -S "api_key" -p

# Chercher dans les fichiers actuels
git grep -i "password\|secret\|api_key" -- ':!node_modules' ':!*.md' ':!docs/'
```

---

**Pour plus de détails** : Voir [`docs/SECURITE-SECRETS.md`](docs/SECURITE-SECRETS.md)

