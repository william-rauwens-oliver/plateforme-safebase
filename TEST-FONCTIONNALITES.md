# 🧪 Guide de Test des Fonctionnalités - SafeBase

Ce guide vous permet de tester **une par une** toutes les fonctionnalités demandées dans les consignes.

---

## 📋 Prérequis

Avant de commencer, assurez-vous que :
- ✅ Le backend est lancé : `cd backend && npm run dev`
- ✅ Le frontend est lancé : `cd frontend && npm run dev`
- ✅ L'API est accessible : http://localhost:8080
- ✅ Le frontend est accessible : http://localhost:5173

---

## 1️⃣ Test : Ajout de base de données

### Objectif
Vérifier qu'on peut ajouter une connexion à une base de données MySQL ou PostgreSQL.

### Test via l'API (curl)

```bash
# Test 1.1 : Ajouter une base MySQL
curl -X POST http://localhost:8080/databases \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test MySQL",
    "engine": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "root",
    "database": "test"
  }'

# Résultat attendu : JSON avec l'ID de la base créée
# Exemple : {"id":"xxx-xxx-xxx","name":"Test MySQL",...}
```

```bash
# Test 1.2 : Ajouter une base PostgreSQL
curl -X POST http://localhost:8080/databases \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test PostgreSQL",
    "engine": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "test"
  }'

# Résultat attendu : JSON avec l'ID de la base créée
```

```bash
# Test 1.3 : Vérifier la liste des bases
curl http://localhost:8080/databases | jq .

# Résultat attendu : Tableau JSON avec toutes les bases ajoutées
```

```bash
# Test 1.4 : Test de validation (doit échouer)
curl -X POST http://localhost:8080/databases \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "",
    "engine": "invalid"
  }'

# Résultat attendu : Erreur 400 avec détails de validation
```

### Test via le Frontend

1. **Ouvrir** http://localhost:5173
2. **Remplir le formulaire** "Ajouter une base de données" :
   - Nom : `Ma Base Test`
   - Moteur : `MySQL` ou `PostgreSQL`
   - Hôte : `localhost`
   - Port : `3306` (MySQL) ou `5432` (PostgreSQL)
   - Utilisateur : votre utilisateur
   - Mot de passe : votre mot de passe
   - Base de données : nom de votre base
3. **Cliquer** sur "✨ Ajouter la base"
4. **Vérifier** :
   - ✅ Un toast vert "✓ Base ajoutée" apparaît
   - ✅ La base apparaît dans la liste "📊 Bases de données"
   - ✅ Les informations sont correctement affichées

### ✅ Critères de réussite
- [ ] L'API accepte les données valides
- [ ] L'API rejette les données invalides (validation)
- [ ] La base apparaît dans la liste après ajout
- [ ] Le frontend affiche correctement les bases

---

## 2️⃣ Test : Automatisation des sauvegardes régulières

### Objectif
Vérifier que les sauvegardes sont planifiées avec cron et utilisent mysqldump/pg_dump.

### Test 2.1 : Backup manuel d'une base

```bash
# Récupérer l'ID d'une base (remplacer DB_ID)
DB_ID=$(curl -s http://localhost:8080/databases | jq -r '.[0].id')
echo "ID de la base : $DB_ID"

# Lancer un backup
curl -X POST http://localhost:8080/backup/$DB_ID | jq .

# Résultat attendu : JSON avec les métadonnées du backup créé
# Exemple : {"id":"xxx","databaseId":"xxx","createdAt":"...","path":"..."}
```

### Test 2.2 : Vérifier que le fichier SQL est créé

```bash
# Lister les backups d'une base
curl http://localhost:8080/backups/$DB_ID | jq .

# Résultat attendu : Tableau avec les versions de backup
# Vérifier que "path" pointe vers un fichier .sql
```

```bash
# Vérifier que le fichier existe (si vous avez accès au système de fichiers)
ls -lh backend/backups/$DB_ID/

# Résultat attendu : Fichier .sql présent avec une taille > 0
```

### Test 2.3 : Backup de toutes les bases

```bash
# Lancer backup-all
curl -X POST http://localhost:8080/backup-all | jq .

# Résultat attendu : 
# {
#   "results": [
#     {"id": "xxx", "ok": true},
#     {"id": "yyy", "ok": true}
#   ]
# }
```

### Test 2.4 : Vérifier le scheduler (cron)

**Avec Docker** :
```bash
# Vérifier les logs du scheduler
docker logs safebase-scheduler

# Vérifier le crontab
docker exec safebase-scheduler cat /etc/crontabs/root

# Résultat attendu : Ligne avec "0 * * * * /app/scripts/backup_all.sh"
```

**Sans Docker** (test manuel) :
```bash
# Tester le script de backup directement
cd scheduler/scripts
chmod +x backup_all.sh
./backup_all.sh

# Résultat attendu : Appel à l'API /backup-all et /scheduler/heartbeat
```

### Test 2.5 : Vérifier l'utilisation de mysqldump/pg_dump

```bash
# Pour MySQL : vérifier que mysqldump est utilisé
# Le backup doit contenir des commandes SQL MySQL
head -20 backend/backups/$DB_ID/*.sql

# Pour PostgreSQL : vérifier que pg_dump est utilisé
# Le backup doit contenir des commandes SQL PostgreSQL
```

### ✅ Critères de réussite
- [ ] Le backup manuel fonctionne
- [ ] Le fichier SQL est créé dans `backups/{db-id}/`
- [ ] Le backup-all fonctionne pour toutes les bases
- [ ] Le scheduler (cron) est configuré correctement
- [ ] Les commandes mysqldump/pg_dump sont utilisées

---

## 3️⃣ Test : Gestion des versions

### Objectif
Vérifier l'historique des versions, le pin/unpin, et la restauration.

### Test 3.1 : Créer plusieurs versions

```bash
# Créer 3 backups successifs
DB_ID=$(curl -s http://localhost:8080/databases | jq -r '.[0].id')

curl -X POST http://localhost:8080/backup/$DB_ID
sleep 2
curl -X POST http://localhost:8080/backup/$DB_ID
sleep 2
curl -X POST http://localhost:8080/backup/$DB_ID

# Vérifier l'historique
curl http://localhost:8080/backups/$DB_ID | jq .

# Résultat attendu : Tableau avec 3 versions, triées par date (plus récent d'abord)
```

### Test 3.2 : Épingler une version (pin)

```bash
# Récupérer l'ID d'une version
VERSION_ID=$(curl -s http://localhost:8080/backups/$DB_ID | jq -r '.[0].id')
echo "Version ID : $VERSION_ID"

# Épingler la version
curl -X POST http://localhost:8080/versions/$VERSION_ID/pin | jq .

# Résultat attendu : JSON de la version avec "pinned": true

# Vérifier dans la liste
curl http://localhost:8080/backups/$DB_ID | jq '.[] | select(.id == "'$VERSION_ID'")'

# Résultat attendu : Version avec "pinned": true
```

### Test 3.3 : Retirer l'épingle (unpin)

```bash
# Retirer l'épingle
curl -X POST http://localhost:8080/versions/$VERSION_ID/unpin | jq .

# Résultat attendu : JSON de la version avec "pinned": false
```

### Test 3.4 : Télécharger une version

```bash
# Télécharger le fichier SQL
curl http://localhost:8080/versions/$VERSION_ID/download -o backup_test.sql

# Vérifier le fichier
ls -lh backup_test.sql
head -10 backup_test.sql

# Résultat attendu : Fichier SQL téléchargé et valide
```

### Test 3.5 : Restaurer une version

```bash
# ⚠️ ATTENTION : Ceci va restaurer la base de données !
# Assurez-vous d'avoir un backup récent avant de tester

curl -X POST http://localhost:8080/restore/$VERSION_ID | jq .

# Résultat attendu : {"status": "restored", "versionId": "xxx"}

# Vérifier que la base a été restaurée (selon votre cas d'usage)
```

### Test 3.6 : Politique de rétention

```bash
# Créer plus de 10 backups pour une base
DB_ID=$(curl -s http://localhost:8080/databases | jq -r '.[0].id')

for i in {1..15}; do
  curl -X POST http://localhost:8080/backup/$DB_ID > /dev/null
  sleep 1
done

# Vérifier le nombre de versions conservées
VERSION_COUNT=$(curl -s http://localhost:8080/backups/$DB_ID | jq 'length')
echo "Nombre de versions : $VERSION_COUNT"

# Résultat attendu : Maximum 10 versions (ou RETAIN_PER_DB si configuré)
# Les versions épinglées doivent être conservées
```

### Test via le Frontend

1. **Ouvrir** http://localhost:5173
2. **Cliquer** sur "📦 Versions" pour une base
3. **Vérifier** :
   - ✅ La liste des versions s'affiche
   - ✅ Les dates et tailles sont visibles
4. **Tester le pin** :
   - ✅ Cliquer "📌 Épingler" sur une version
   - ✅ L'icône 📌 apparaît
5. **Tester le téléchargement** :
   - ✅ Cliquer "⬇️" sur une version
   - ✅ Le fichier SQL se télécharge
6. **Tester la restauration** :
   - ✅ Cliquer "🛠️ Restaurer"
   - ✅ Confirmer dans la popup
   - ✅ Message de succès

### ✅ Critères de réussite
- [ ] L'historique des versions est conservé
- [ ] Le pin/unpin fonctionne
- [ ] Le téléchargement fonctionne
- [ ] La restauration fonctionne
- [ ] La politique de rétention supprime les anciennes versions (sauf épinglées)

---

## 4️⃣ Test : Surveillance et alertes

### Objectif
Vérifier les alertes en cas d'échec et le système de heartbeat.

### Test 4.1 : Heartbeat du scheduler

```bash
# Envoyer un heartbeat
curl -X POST http://localhost:8080/scheduler/heartbeat | jq .

# Résultat attendu : {"ok": true}

# Lire le dernier heartbeat
curl http://localhost:8080/scheduler/heartbeat | jq .

# Résultat attendu : {"lastHeartbeat": "2025-01-09T..."}
```

### Test 4.2 : Test d'alerte webhook (simulation)

```bash
# Configurer une URL webhook de test (ex: webhook.site)
export ALERT_WEBHOOK_URL="https://webhook.site/your-unique-id"

# Redémarrer l'API avec cette variable
# Puis lancer un backup qui échoue (base inexistante)
curl -X POST http://localhost:8080/backup/INVALID_ID

# Vérifier sur webhook.site que l'alerte a été envoyée
# Résultat attendu : POST avec {"type":"backup_failed",...}
```

### Test 4.3 : Vérifier les logs

```bash
# Les logs Fastify doivent afficher les erreurs
# Vérifier dans le terminal où l'API tourne

# Exemple de log attendu en cas d'erreur :
# {"level":50,"time":...,"msg":"backup failed",...}
```

### Test 4.4 : Test d'erreur de restauration

```bash
# Tenter de restaurer une version inexistante
curl -X POST http://localhost:8080/restore/INVALID_VERSION_ID

# Résultat attendu : 404 avec {"message": "version not found"}
```

### ✅ Critères de réussite
- [ ] Le heartbeat fonctionne (GET et POST)
- [ ] Les alertes webhook sont envoyées en cas d'échec
- [ ] Les erreurs sont loggées correctement
- [ ] Les codes HTTP d'erreur sont appropriés (400, 404, 500)

---

## 5️⃣ Test : Interface utilisateur

### Objectif
Vérifier que l'interface permet de gérer facilement les sauvegardes et restaurations.

### Test 5.1 : Affichage général

1. **Ouvrir** http://localhost:5173
2. **Vérifier** :
   - ✅ Le header "SafeBase" s'affiche
   - ✅ L'indicateur de santé API est visible
   - ✅ Le formulaire d'ajout est présent
   - ✅ La liste des bases s'affiche

### Test 5.2 : Responsive design

1. **Réduire la fenêtre** du navigateur
2. **Vérifier** :
   - ✅ Le layout s'adapte (grid devient 1 colonne)
   - ✅ Les boutons restent accessibles
   - ✅ Le texte reste lisible

### Test 5.3 : Thème clair/sombre

1. **Cliquer** sur "🌙 Sombre" / "☀️ Clair"
2. **Vérifier** :
   - ✅ Le thème change immédiatement
   - ✅ La préférence est sauvegardée (recharger la page)

### Test 5.4 : Recherche et tri

1. **Ajouter plusieurs bases** avec des noms différents
2. **Tester la recherche** :
   - ✅ Taper dans le champ "Rechercher…"
   - ✅ La liste se filtre en temps réel
3. **Tester le tri** :
   - ✅ Changer le select "Trier par"
   - ✅ La liste se réorganise

### Test 5.5 : Actions sur les bases

Pour chaque base dans la liste :
1. **Copier DSN** :
   - ✅ Cliquer "🔗 Copier DSN"
   - ✅ Le DSN est dans le presse-papier
2. **Backup** :
   - ✅ Cliquer "💾 Backup"
   - ✅ Toast de confirmation
3. **Versions** :
   - ✅ Cliquer "📦 Versions"
   - ✅ Modal s'ouvre avec la liste

### Test 5.6 : Backup global

1. **Cliquer** "💾 Backup All"
2. **Vérifier** :
   - ✅ Toast de confirmation
   - ✅ Tous les backups sont lancés

### ✅ Critères de réussite
- [ ] L'interface est complète et fonctionnelle
- [ ] Le design est responsive
- [ ] Toutes les actions sont accessibles
- [ ] Les feedbacks utilisateur (toasts) fonctionnent
- [ ] La recherche et le tri fonctionnent

---

## 6️⃣ Test : Intégrations de tests

### Objectif
Vérifier que les tests unitaires fonctionnent correctement.

### Test 6.1 : Tests backend

```bash
cd backend
npm test

# Résultat attendu :
# ✓ health
#   ✓ returns ok
#   ✓ requires API key for protected endpoints when configured
#   ✓ scheduler heartbeat read/write
# 
# Test Files  1 passed (1)
#      Tests  3 passed (3)
```

### Test 6.2 : Tests frontend

```bash
cd frontend
npm install  # Installer les dépendances de test si nécessaire
npm test

# Résultat attendu :
# ✓ App.test.tsx (4 tests)
#   ✓ should handle API health check
#   ✓ should fetch databases list
#   ✓ should handle API errors gracefully
#   ✓ should validate database schema structure
```

### Test 6.3 : Tests de sécurité

```bash
# Test avec API Key
export API_KEY="test-key-123"

# Redémarrer l'API, puis tester :
curl http://localhost:8080/databases
# Résultat attendu : 401 Unauthorized

curl -H 'x-api-key: test-key-123' http://localhost:8080/databases
# Résultat attendu : 200 OK avec les bases
```

### ✅ Critères de réussite
- [ ] Les tests backend passent (3/3)
- [ ] Les tests frontend passent (4/4)
- [ ] Les tests de sécurité fonctionnent

---

## 7️⃣ Test : Conteneurisation

### Objectif
Vérifier que le projet fonctionne avec Docker Compose.

### Test 7.1 : Build et démarrage

```bash
# Build et démarrage
docker compose up --build -d

# Vérifier que tous les services sont up
docker compose ps

# Résultat attendu : 5 services (api, frontend, mysql, postgres, scheduler)
```

### Test 7.2 : Vérifier les services

```bash
# API
curl http://localhost:8080/health
# Résultat attendu : {"status":"ok"}

# Frontend
curl http://localhost:5173
# Résultat attendu : HTML de l'application

# MySQL
docker exec safebase-mysql mysql -u safebase -psafebase -e "SELECT 1"
# Résultat attendu : Table avec "1"

# PostgreSQL
docker exec safebase-postgres psql -U safebase -d safebase -c "SELECT 1"
# Résultat attendu : Table avec "1"
```

### Test 7.3 : Vérifier le scheduler

```bash
# Vérifier les logs du scheduler
docker logs safebase-scheduler

# Vérifier le crontab
docker exec safebase-scheduler cat /etc/crontabs/root

# Résultat attendu : Configuration cron présente
```

### Test 7.4 : Test fonctionnel dans Docker

```bash
# Ajouter une base via l'API
curl -X POST http://localhost:8080/databases \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Docker Test",
    "engine": "mysql",
    "host": "mysql",
    "port": 3306,
    "username": "safebase",
    "password": "safebase",
    "database": "safebase"
  }'

# Lancer un backup
DB_ID=$(curl -s http://localhost:8080/databases | jq -r '.[0].id')
curl -X POST http://localhost:8080/backup/$DB_ID

# Vérifier que le backup est créé
docker exec safebase-api ls -lh /backups/$DB_ID/
```

### ✅ Critères de réussite
- [ ] Tous les services démarrent correctement
- [ ] L'API est accessible
- [ ] Le frontend est accessible
- [ ] Les bases de données sont accessibles
- [ ] Le scheduler fonctionne
- [ ] Les backups sont créés dans les volumes

---

## 📊 Checklist Complète

Utilisez cette checklist pour vérifier que tout fonctionne :

### Fonctionnalités Core
- [ ] Ajout de base MySQL
- [ ] Ajout de base PostgreSQL
- [ ] Validation des données d'entrée
- [ ] Backup manuel d'une base
- [ ] Backup de toutes les bases
- [ ] Utilisation de mysqldump/pg_dump
- [ ] Historique des versions
- [ ] Pin/Unpin de versions
- [ ] Téléchargement de versions
- [ ] Restauration de versions
- [ ] Politique de rétention
- [ ] Heartbeat scheduler
- [ ] Alertes webhook
- [ ] Logs d'erreur

### Interface Utilisateur
- [ ] Affichage correct
- [ ] Responsive design
- [ ] Thème clair/sombre
- [ ] Recherche fonctionnelle
- [ ] Tri fonctionnel
- [ ] Toutes les actions accessibles
- [ ] Feedback utilisateur (toasts)

### Tests et Qualité
- [ ] Tests backend passent
- [ ] Tests frontend passent
- [ ] Tests de sécurité fonctionnent

### Conteneurisation
- [ ] Docker Compose fonctionne
- [ ] Tous les services démarrent
- [ ] Volumes montés correctement
- [ ] Réseau Docker fonctionne

---

## 🐛 En cas de problème

### L'API ne répond pas
```bash
# Vérifier que le backend tourne
cd backend
npm run dev

# Vérifier le port
lsof -ti:8080
```

### Le frontend ne se charge pas
```bash
# Vérifier que le frontend tourne
cd frontend
npm run dev

# Vérifier le port
lsof -ti:5173
```

### Les backups échouent
- Vérifier que `mysql-client` et `postgresql-client` sont installés
- Vérifier les identifiants de connexion
- Vérifier que les bases de données existent

### Les tests échouent
```bash
# Réinstaller les dépendances
cd backend && npm install
cd ../frontend && npm install

# Relancer les tests
cd backend && npm test
cd ../frontend && npm test
```

---

**✅ Une fois tous ces tests passés, votre projet est conforme aux consignes !**

