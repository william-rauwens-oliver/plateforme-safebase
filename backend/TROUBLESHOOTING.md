# Guide de dépannage - SafeBase API

## Problème : API hors ligne

Si l'API affiche "API hors ligne" dans le frontend, voici les étapes de dépannage :

### 1. Vérifier que PostgreSQL est démarré

**Avec Docker :**
```bash
docker compose up -d postgres
docker compose logs postgres
```

**Sans Docker (PostgreSQL local) :**
```bash
# macOS
brew services start postgresql@16
# ou
pg_ctl -D /usr/local/var/postgres start

# Linux
sudo systemctl start postgresql
```

### 2. Vérifier les variables d'environnement

Assurez-vous que les variables suivantes sont correctement configurées :

**Avec Docker (dans docker-compose.yml) :**
```yaml
environment:
  - DB_HOST=postgres
  - DB_PORT=5432
  - DB_NAME=safebase
  - DB_USER=safebase
  - DB_PASSWORD=safebase
```

**Sans Docker (fichier .env ou variables d'environnement) :**
```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=safebase
export DB_USER=safebase
export DB_PASSWORD=safebase
```

### 3. Vérifier la connexion PostgreSQL

Testez la connexion manuellement :

```bash
# Avec Docker
docker exec -it safebase-postgres psql -U safebase -d safebase

# Sans Docker
psql -U safebase -d safebase -h localhost
```

### 4. Vérifier les logs de l'API

```bash
# Avec Docker
docker compose logs api

# Sans Docker
cd backend
npm run dev
# Regardez les messages dans la console
```

### 5. Créer la base de données si elle n'existe pas

```bash
# Avec Docker (automatique)
# La base est créée automatiquement via POSTGRES_DB

# Sans Docker
createdb -U postgres safebase
psql -U postgres -c "CREATE USER safebase WITH PASSWORD 'safebase';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE safebase TO safebase;"
```

### 6. Réinitialiser le schéma

Si le schéma n'est pas initialisé correctement :

```bash
cd backend
npm run migrate
```

### 7. Vérifier que le port 8080 est libre

```bash
# macOS/Linux
lsof -i :8080
# ou
netstat -an | grep 8080
```

## Erreurs courantes

### "Connection refused" ou "ECONNREFUSED"
- PostgreSQL n'est pas démarré
- Le host/port est incorrect
- Le firewall bloque la connexion

### "password authentication failed"
- Le mot de passe PostgreSQL est incorrect
- Vérifiez les variables DB_USER et DB_PASSWORD

### "database does not exist"
- La base de données n'a pas été créée
- Vérifiez DB_NAME et créez la base si nécessaire

### "timeout"
- PostgreSQL est trop lent à répondre
- Vérifiez que le service est bien démarré
- Augmentez `connectionTimeoutMillis` dans `db.ts` si nécessaire

## Mode développement local (sans Docker)

Si vous développez localement sans Docker :

1. Installez PostgreSQL localement
2. Créez la base de données et l'utilisateur
3. Configurez les variables d'environnement pour pointer vers `localhost`
4. Démarrez l'API : `cd backend && npm run dev`

## Mode production (avec Docker)

1. Assurez-vous que `docker-compose.yml` est correctement configuré
2. Démarrez tous les services : `docker compose up -d`
3. Vérifiez les logs : `docker compose logs -f api`

