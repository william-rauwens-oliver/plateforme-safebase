# 🔐 Sécurité des Secrets - SafeBase

## ⚠️ Important : Gestion des Secrets

Ce document explique comment gérer les secrets (API keys, clés de chiffrement) de manière sécurisée.

---

## 🔑 Secrets Requis

### 1. ENCRYPTION_KEY (Requis)

**Usage** : Chiffrement des mots de passe des bases de données

**Génération** :
```bash
# Générer une clé sécurisée (32 bytes)
openssl rand -base64 32
```

**Configuration** :
```bash
# Dans .env
ENCRYPTION_KEY=votre_cle_securisee_ici
```

**En production** : ⚠️ **OBLIGATOIRE** - Le système refusera de démarrer sans cette clé.

**En développement** : Une clé par défaut est utilisée (non sécurisée, uniquement pour le développement).

---

### 2. API_KEY (Optionnel)

**Usage** : Protection des endpoints API

**Génération** :
```bash
# Générer une clé API
openssl rand -hex 32
```

**Configuration** :
```bash
# Dans .env
API_KEY=votre_cle_api_ici
```

**Si non défini** : L'API est accessible sans authentification (développement uniquement).

---

## 📝 Configuration

### Fichier .env

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Puis éditez `.env` avec vos valeurs :

```env
# Clé de chiffrement (REQUIS)
ENCRYPTION_KEY=votre_cle_securisee_32_bytes

# API Key (optionnel)
API_KEY=votre_cle_api

# Autres variables
CORS_ORIGIN=http://localhost:5173
ALERT_WEBHOOK_URL=
RETAIN_PER_DB=10
```

### Docker Compose

Pour Docker, utilisez un fichier `.env` ou passez les variables :

```bash
# Avec .env
docker compose up

# Ou avec variables inline
ENCRYPTION_KEY=ma_cle docker compose up
```

---

## 🚫 Ce qui est Exclu de Git

Le fichier `.gitignore` exclut :
- `.env` (fichier avec vos secrets)
- `backend/data/databases.json` (contient les mots de passe chiffrés)
- `backend/data/versions.json`
- `backend/data/scheduler.json`

**Ne jamais commiter** :
- ❌ Fichiers `.env` avec des secrets réels
- ❌ Clés de chiffrement en clair
- ❌ Mots de passe en clair

---

## ✅ Bonnes Pratiques

1. **Utiliser `.env.example`** : Template sans secrets réels
2. **Variables d'environnement** : Toujours utiliser des variables, jamais de valeurs hardcodées
3. **Rotation des clés** : Changer régulièrement les clés en production
4. **Séparation dev/prod** : Clés différentes pour développement et production
5. **Vault externe** : En production, utiliser un service de gestion de secrets (HashiCorp Vault, AWS Secrets Manager)

---

## 🔍 Vérification

### Vérifier que les secrets ne sont pas dans Git

```bash
# Chercher des secrets dans l'historique
git log --all --full-history --source --grep="password\|secret\|key" -p

# Chercher dans les fichiers
git grep -i "password\|secret\|api_key" -- ':!node_modules' ':!*.md'
```

### Vérifier les variables d'environnement

```bash
# Backend
cd backend
node -e "console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY ? 'SET' : 'NOT SET')"

# Frontend
cd frontend
node -e "console.log('VITE_API_KEY:', process.env.VITE_API_KEY ? 'SET' : 'NOT SET')"
```

---

## 🛠️ En Cas de Compromission

Si un secret est compromis :

1. **Régénérer immédiatement** toutes les clés
2. **Révoquer** les anciennes clés
3. **Chiffrer à nouveau** tous les mots de passe avec la nouvelle clé
4. **Auditer** l'accès aux systèmes

---

**Dernière mise à jour** : 9 novembre 2025

