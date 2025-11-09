# 🔐 Changer le Mot de Passe PostgreSQL

## 🎯 Objectif

Changer le mot de passe de l'utilisateur `postgres` sur votre installation PostgreSQL locale.

## 🚀 Méthode Rapide (Script Automatique)

```bash
cd /Applications/MAMP/htdocs/plateforme-safebase
./scripts/changer-mot-de-passe-postgres.sh
```

Le script va :
1. Vous demander le nouveau mot de passe
2. Modifier temporairement la configuration PostgreSQL
3. Changer le mot de passe
4. Restaurer la configuration

## 📝 Méthode Manuelle

### Étape 1 : Trouver le fichier de configuration

```bash
# Trouver pg_hba.conf
find ~ -name pg_hba.conf 2>/dev/null

# Ou chercher dans les emplacements courants
ls -la /opt/homebrew/var/postgresql@*/pg_hba.conf
ls -la /usr/local/var/postgresql@*/pg_hba.conf
ls -la /opt/homebrew/var/postgres/pg_hba.conf
ls -la /usr/local/var/postgres/pg_hba.conf
```

### Étape 2 : Modifier temporairement pg_hba.conf

Ouvrez le fichier `pg_hba.conf` et trouvez la ligne pour `127.0.0.1` :

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             127.0.0.1/32            md5
```

Changez `md5` (ou `scram-sha-256`) en `trust` :

```
host    all             all             127.0.0.1/32            trust
```

**⚠️ Important** : Cela permet la connexion sans mot de passe temporairement. Ne laissez pas ça en production !

### Étape 3 : Redémarrer PostgreSQL

```bash
# Si installé via Homebrew
brew services restart postgresql@15
# ou
brew services restart postgresql
```

### Étape 4 : Changer le mot de passe

```bash
psql -h localhost -p 5432 -U postgres -d postgres -c "ALTER USER postgres WITH PASSWORD 'votre_nouveau_mot_de_passe';"
```

Remplacez `votre_nouveau_mot_de_passe` par votre mot de passe souhaité.

### Étape 5 : Restaurer pg_hba.conf

Remettez `md5` (ou `scram-sha-256`) dans `pg_hba.conf` :

```
host    all             all             127.0.0.1/32            md5
```

### Étape 6 : Redémarrer PostgreSQL

```bash
brew services restart postgresql@15
```

## ✅ Vérification

Testez la connexion avec le nouveau mot de passe :

```bash
psql -h localhost -p 5432 -U postgres -d postgres
# Entrez le nouveau mot de passe quand demandé
```

Ou avec PGPASSWORD :

```bash
PGPASSWORD='votre_nouveau_mot_de_passe' psql -h localhost -p 5432 -U postgres -d postgres -c "SELECT version();"
```

## 🔧 Si PostgreSQL n'est pas démarré

```bash
# Démarrer PostgreSQL
brew services start postgresql@15
# ou
brew services start postgresql
```

## 📋 Utilisation dans SafeBase

Une fois le mot de passe changé :

1. Ouvrez SafeBase
2. Sélectionnez PostgreSQL
3. Utilisateur : `postgres`
4. Mot de passe : **Votre nouveau mot de passe**
5. Port : `5432`
6. Hôte : `localhost`

## 🆘 Problèmes Courants

### "password authentication failed"

- Vérifiez que vous avez bien redémarré PostgreSQL après avoir modifié `pg_hba.conf`
- Vérifiez que `pg_hba.conf` est revenu en mode `md5` ou `scram-sha-256`

### "could not connect to server"

- Vérifiez que PostgreSQL est démarré : `brew services list | grep postgres`
- Vérifiez le port : `lsof -i :5432`

### "psql: command not found"

- Installez PostgreSQL : `brew install postgresql@15`
- Ajoutez au PATH si nécessaire

---

**Une fois le mot de passe changé, utilisez-le dans SafeBase !** ✅

