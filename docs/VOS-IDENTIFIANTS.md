# 🔐 Vos Identifiants MySQL et PostgreSQL

## ✅ PostgreSQL - Fonctionne !

D'après les tests, **PostgreSQL est accessible** sur votre système.

### Identifiants PostgreSQL

- **Hôte** : `localhost` ou `127.0.0.1`
- **Port** : `5432`
- **Utilisateur** : `postgres` ou `WilliamPro` (votre utilisateur)
- **Mot de passe** : (celui que vous avez configuré)
- **Base de données** : `postgres`, `fittracker`, `symfony-e` (bases existantes) ou créez-en une

**Bases disponibles** :
- `postgres` (base système)
- `fittracker` (votre base)
- `symfony-e` (votre base)

### Test de connexion réussi ✅

PostgreSQL répond correctement.

---

## ❌ MySQL - Non accessible actuellement

MySQL n'est pas accessible actuellement. Deux options :

### Option 1 : Démarrer MAMP

1. **Ouvrir MAMP**
2. **Démarrer** les serveurs (Start Servers)
3. **Vérifier** le port MySQL dans Préférences → Ports (généralement 8889)

**Identifiants MAMP** :
- **Hôte** : `127.0.0.1`
- **Port** : `8889` (ou celui affiché dans MAMP)
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Base de données** : Créez-en une dans phpMyAdmin

### Option 2 : Utiliser Docker

```bash
docker compose up mysql -d
```

**Identifiants Docker** :
- **Hôte** : `localhost` (depuis l'extérieur du container)
- **Port** : `3306`
- **Utilisateur** : `safebase`
- **Mot de passe** : `safebase`
- **Base de données** : `safebase`

---

## 📝 Identifiants Recommandés pour SafeBase

### Pour PostgreSQL (fonctionne maintenant)

Dans l'interface SafeBase :
- **Nom** : `Base PostgreSQL Test`
- **Moteur** : `PostgreSQL`
- **Hôte** : `localhost`
- **Port** : `5432`
- **Utilisateur** : `postgres` (ou `WilliamPro` si nécessaire)
- **Mot de passe** : (votre mot de passe PostgreSQL)
- **Base de données** : `postgres`, `fittracker`, ou `symfony-e` (bases existantes)

### Pour MySQL (après avoir démarré MAMP)

Dans l'interface SafeBase :
- **Nom** : `Base MySQL Test`
- **Moteur** : `MySQL`
- **Hôte** : `127.0.0.1`
- **Port** : `8889` (ou le port affiché dans MAMP)
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Base de données** : `test` (ou créez-en une dans phpMyAdmin)

---

## 🧪 Tester vos Identifiants

### Test PostgreSQL

```bash
# Si le mot de passe est vide
psql -h localhost -p 5432 -U postgres -d postgres

# Si vous avez un mot de passe
PGPASSWORD='votre_mot_de_passe' psql -h localhost -p 5432 -U postgres -d postgres
```

### Test MySQL (après avoir démarré MAMP)

```bash
mysql -h 127.0.0.1 -P 8889 -u root -proot
```

---

## 🔧 Créer une Base de Test

### PostgreSQL

```bash
# Se connecter
psql -h localhost -p 5432 -U postgres

# Créer une base
CREATE DATABASE test_safebase;

# Vérifier
\l

# Sortir
\q
```

### MySQL (avec MAMP)

1. **Ouvrir** phpMyAdmin (http://localhost:8888/phpMyAdmin)
2. **Cliquer** sur "Nouvelle base de données"
3. **Nommer** : `test_safebase`
4. **Créer**

---

## 📊 Résumé

| Base | Statut | Hôte | Port | Utilisateur | Mot de passe |
|------|--------|------|------|-------------|--------------|
| **PostgreSQL** | ✅ Accessible | `localhost` | `5432` | `postgres` | (votre mot de passe) |
| **MySQL (MAMP)** | ⚠️ Démarrer MAMP | `127.0.0.1` | `8889` | `root` | `root` |
| **MySQL (Docker)** | ⚠️ Démarrer Docker | `localhost` | `3306` | `safebase` | `safebase` |

---

## 💡 Astuce

**Pour tester rapidement** :
1. Utilisez **PostgreSQL** (fonctionne déjà)
2. Ou **démarrez MAMP** pour MySQL

**Pour la soutenance** :
- Vous pouvez utiliser PostgreSQL qui fonctionne
- Ou montrer comment démarrer MAMP pour MySQL

---

**PostgreSQL est prêt à être utilisé dans SafeBase ! ✅**

