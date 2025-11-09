# Guide de Test - Plateforme SafeBase

## ✅ Tests effectués

Les tests suivants ont été réalisés avec succès :

### 1. Tests unitaires backend
```bash
cd backend
npm test
```
**Résultat:** 3 tests passés (health, auth, scheduler heartbeat)

### 2. Test de l'API en local
```bash
# Démarrer l'API
cd backend
npm run dev

# Dans un autre terminal, tester :
curl http://localhost:8080/health
# → {"status":"ok"}

curl http://localhost:8080/databases
# → []

curl -X POST http://localhost:8080/databases \
  -H 'Content-Type: application/json' \
  -d '{"name":"test","engine":"mysql","host":"localhost","port":3306,"username":"root","password":"root","database":"test"}'
# → Retourne la base créée avec son ID
```
**Résultat:** API fonctionnelle

## 🚀 Comment tester le projet complet

### Option 1: Avec Docker (recommandé)
```bash
docker compose up --build
```
- API: http://localhost:8080
- Frontend: http://localhost:5173
- Bases de données MySQL/Postgres accessibles

### Option 2: En local

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend (nouveau terminal):**
```bash
cd frontend
npm install
npm run dev
```

Puis ouvrez http://localhost:5173 dans votre navigateur.

## 📋 Checklist de test fonctionnel

### Test 1: Ajout d'une base de données
- [ ] Ouvrir le frontend
- [ ] Remplir le formulaire avec les informations d'une base de données
- [ ] Cliquer sur "Ajouter"
- [ ] Vérifier que la base apparaît dans la liste

### Test 2: Backup manuel
- [ ] Sélectionner une base de données
- [ ] Cliquer sur "Backup"
- [ ] Vérifier le message de confirmation
- [ ] Vérifier qu'un backup a été créé dans le dossier `backups/`

### Test 3: Gestion des versions
- [ ] Cliquer sur "Versions/Restore" pour une base
- [ ] Tester les commandes : `pin <id>`, `unpin <id>`
- [ ] Vérifier que les versions pinnées ne sont pas supprimées par la rétention

### Test 4: Restauration
- [ ] Sélectionner une version
- [ ] Taper `restore <id>`
- [ ] Vérifier que la base de données a été restaurée

### Test 5: Téléchargement
- [ ] Taper `download <id>`
- [ ] Vérifier que le fichier SQL se télécharge

### Test 6: Scheduler (avec Docker)
- [ ] Attendre 1 heure (ou modifier le crontab)
- [ ] Vérifier que tous les backups ont été effectués automatiquement
- [ ] Vérifier les logs du scheduler

### Test 7: Sécurité API Key
```bash
export API_KEY=testkey123
# Redémarrer l'API

curl http://localhost:8080/databases
# → 401 Unauthorized

curl -H 'x-api-key: testkey123-résultat http://localhost:8080/databases
# → 200 OK avec les bases
```

## 🛠️ Tests avancés

### Test de la rétention
1. Créer une base de données
2. Lancer plusieurs backups (ex: 15 backups)
3. Vérifier que seulement 10 versions sont conservées (RETAIN_PER_DB)
4. Créer une version pinnée
5. Vérifier qu'elle n'est pas supprimée

### Test des alertes
```bash
export ALERT_WEBHOOK_URL=https://hook.example.com/webhook
# Lancer un backup qui échoue
# Vérifier que l'alerte est envoyée
```

### Test multi-bases
1. Ajouter 2-3 bases de données
2. Lancer `/backup-all` via curl
3. Vérifier que tous les backups ont été effectués

## 📊 Résultats attendus

- ✅ Tous les endpoints API répondent correctement
- ✅ Les backups sont créés dans le bon format SQL
- ✅ Les restaurations fonctionnent sans erreur
- ✅ La rétention supprime les anciennes versions (sauf pinnées)
- ✅ Le scheduler exécute les backups automatiquement
- ✅ L'interface frontend permet la gestion complète
- ✅ Les tests unitaires passent

## 🐛 En cas de problème

### L'API ne démarre pas
```bash
cd backend
npm run build  # Vérifier qu'il n'y a pas d'erreurs TypeScript
npm run dev
```

### Les backups échouent
- Vérifier que `mysql-client` et `postgresql-client` sont installés
- Vérifier les identifiants de connexion
- Vérifier que le dossier `backups/` est accessible en écriture

### Le frontend ne se connecte pas à l'API
- Vérifier que `VITE_API_URL` est correcte dans `.env`
- Vérifier que l'API est démarrée sur le port 8080
- Vérifier les CORS dans les logs de l'API

