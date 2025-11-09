# 🔐 Identifiants par Défaut - MySQL et PostgreSQL

## 🐬 MySQL

### Avec MAMP (votre cas probable)

**Port** : `8889` (port MySQL par défaut de MAMP)

**Identifiants par défaut** :
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Hôte** : `127.0.0.1` ou `localhost`
- **Port** : `8889`

### MySQL Standard (sans MAMP)

**Port** : `3306`

**Identifiants par défaut** :
- **Utilisateur** : `root`
- **Mot de passe** : (généralement vide ou celui que vous avez configuré)
- **Hôte** : `127.0.0.1` ou `localhost`
- **Port** : `3306`

### Avec Docker Compose

**Identifiants configurés** :
- **Utilisateur** : `safebase`
- **Mot de passe** : `safebase`
- **Hôte** : `mysql` (dans Docker) ou `localhost` (depuis l'extérieur)
- **Port** : `3306`
- **Base de données** : `safebase`

---

## 🐘 PostgreSQL

### PostgreSQL Standard

**Port** : `5432`

**Identifiants par défaut** :
- **Utilisateur** : `postgres`
- **Mot de passe** : (celui que vous avez configuré lors de l'installation)
- **Hôte** : `127.0.0.1` ou `localhost`
- **Port** : `5432`

### Avec Docker Compose

**Identifiants configurés** :
- **Utilisateur** : `safebase`
- **Mot de passe** : `rootpassword`
- **Hôte** : `postgres` (dans Docker) ou `localhost` (depuis l'extérieur)
- **Port** : `5432`
- **Base de données** : `safebase`

---

## 🔍 Comment Trouver vos Identifiants

### Pour MySQL (MAMP)

1. **Ouvrir MAMP**
2. **Aller dans** Préférences → Ports
3. **Vérifier** le port MySQL (généralement 8889)
4. **Tester la connexion** :
   ```bash
   mysql -h 127.0.0.1 -P 8889 -u root -proot
   ```

### Pour PostgreSQL

1. **Vérifier** si PostgreSQL est installé :
   ```bash
   which psql
   ```
2. **Tester la connexion** :
   ```bash
   psql -h localhost -p 5432 -U postgres
   ```
3. **Si ça demande un mot de passe**, c'est celui que vous avez configuré

---

## 🧪 Test Rapide

### Test MySQL

```bash
# Avec MAMP (port 8889)
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 1"

# MySQL standard (port 3306)
mysql -h localhost -P 3306 -u root -p -e "SELECT 1"
```

### Test PostgreSQL

```bash
# PostgreSQL standard
psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT 1"
```

---

## 📝 Identifiants Recommandés pour SafeBase

### MySQL (MAMP)

Dans l'interface SafeBase, utilisez :
- **Hôte** : `127.0.0.1`
- **Port** : `8889`
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Base de données** : Le nom d'une base qui existe (ex: `test`, `safebase`)

### PostgreSQL

Dans l'interface SafeBase, utilisez :
- **Hôte** : `127.0.0.1`
- **Port** : `5432`
- **Utilisateur** : `postgres`
- **Mot de passe** : Votre mot de passe PostgreSQL
- **Base de données** : Le nom d'une base qui existe (ex: `test`, `postgres`)

---

## ⚠️ Important

- Les **mots de passe** sont stockés en **clair** dans `backend/data/databases.json`
- **Ne partagez pas** ce fichier
- En production, pensez à **chiffrer** les mots de passe

---

## 🔧 Créer une Base de Test

### MySQL

```bash
# Se connecter
mysql -h 127.0.0.1 -P 8889 -u root -proot

# Créer une base
CREATE DATABASE test_safebase;

# Sortir
exit;
```

### PostgreSQL

```bash
# Se connecter
psql -h localhost -p 5432 -U postgres

# Créer une base
CREATE DATABASE test_safebase;

# Sortir
\q
```

---

**Utilisez ces identifiants dans l'interface SafeBase pour ajouter vos bases !**

