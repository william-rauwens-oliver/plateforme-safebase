# 🔄 Test des Sauvegardes Automatiques

Guide pour tester et faire fonctionner les sauvegardes automatiques.

---

## ✅ Correction : Vérification des identifiants

**Problème résolu** : Maintenant, lors de l'ajout d'une base, le système **vérifie que la connexion fonctionne** avant d'enregistrer.

### Comment ça fonctionne maintenant

1. **Vous ajoutez une base** dans l'interface
2. **Le système teste la connexion** (ping MySQL ou SELECT 1 pour PostgreSQL)
3. **Si la connexion échoue** → Erreur 400 avec message clair
4. **Si la connexion réussit** → La base est enregistrée ✅

### Exception : Mode FAKE_DUMP

Si `FAKE_DUMP=1` est activé, la vérification est **désactivée** pour permettre les tests sans vraie base.

---

## 🔄 Sauvegardes Automatiques

### Comment ça fonctionne

Le scheduler exécute automatiquement un backup de toutes les bases **toutes les heures** via cron.

### Avec Docker

Le scheduler fonctionne automatiquement dans un container Docker.

**Vérifier** :
```bash
docker logs safebase-scheduler
```

### Sans Docker (test manuel)

Pour tester les sauvegardes automatiques sans Docker :

#### Option 1 : Script de test

```bash
# Tester le script de backup
./test-scheduler.sh
```

Ce script :
1. Vérifie que l'API est accessible
2. Appelle `/backup-all`
3. Envoie un heartbeat
4. Affiche les résultats

#### Option 2 : Test manuel

```bash
# Appeler backup-all directement
curl -X POST http://localhost:8080/backup-all

# Vérifier le heartbeat
curl http://localhost:8080/scheduler/heartbeat
```

#### Option 3 : Simuler le cron localement

```bash
# Exécuter le script du scheduler
cd scheduler/scripts
chmod +x backup_all.sh
export SCHEDULER_API_URL="http://localhost:8080"
./backup_all.sh
```

---

## 🧪 Test Complet des Sauvegardes Automatiques

### Étape 1 : Préparer des bases valides

1. **Assurez-vous** d'avoir au moins 2 bases avec des identifiants **corrects**
2. **Vérifier** que les bases existent vraiment dans MySQL/PostgreSQL

### Étape 2 : Tester le script

```bash
# Lancer le test
./test-scheduler.sh
```

**Résultat attendu** :
```
=== Test des Sauvegardes Automatiques ===

1. Vérification de l'API...
✅ API accessible

2. Vérification du heartbeat...
   Heartbeat actuel : 2025-11-09T...

3. Simulation du script backup_all.sh...
   Appel à /backup-all...
{
  "results": [
    {"id": "xxx", "ok": true},
    {"id": "yyy", "ok": true}
  ]
}

4. Envoi du heartbeat...
   Nouveau heartbeat : 2025-11-09T...

5. Vérification des résultats...
   Backups réussis : 2 / 2

✅ Tous les backups ont réussi !
```

### Étape 3 : Vérifier les backups créés

```bash
# Voir les nouveaux backups
ls -lh backend/backups/*/
```

---

## 🔧 Configuration du Scheduler

### Avec Docker

Le scheduler est configuré dans `scheduler/crontab` :
```
0 * * * * /app/scripts/backup_all.sh
```

Cela signifie : **toutes les heures à la minute 0** (ex: 13:00, 14:00, 15:00...)

### Modifier la fréquence

Pour changer la fréquence, modifiez `scheduler/crontab` :

```bash
# Toutes les 30 minutes
*/30 * * * * /app/scripts/backup_all.sh

# Toutes les 6 heures
0 */6 * * * /app/scripts/backup_all.sh

# Tous les jours à minuit
0 0 * * * /app/scripts/backup_all.sh
```

Puis reconstruire le container :
```bash
docker compose build scheduler
docker compose up -d scheduler
```

---

## 🧪 Test Rapide (2 minutes)

### Test 1 : Vérifier que la validation fonctionne

1. **Essayer d'ajouter** une base avec de **mauvais identifiants**
2. **Vérifier** : Erreur 400 avec message "Connexion à la base de données échouée"
3. **Ajouter** une base avec de **bons identifiants**
4. **Vérifier** : La base est créée ✅

### Test 2 : Tester backup-all

```bash
# Lancer backup-all
curl -X POST http://localhost:8080/backup-all | jq .

# Vérifier les résultats
# Tous les "ok": true = succès
```

### Test 3 : Tester le script scheduler

```bash
# Lancer le script de test
./test-scheduler.sh

# Vérifier que tout fonctionne
```

---

## ⚠️ Mode FAKE_DUMP

Si vous avez `FAKE_DUMP=1` activé :

- ✅ La vérification de connexion est **désactivée** (pour les tests)
- ✅ Les backups sont **simulés** (fichiers factices)
- ✅ Les restaurations sont **simulées**

**Pour activer la vraie vérification** :
```bash
# Désactiver FAKE_DUMP
unset FAKE_DUMP
# Ou définir explicitement
export FAKE_DUMP=0

# Redémarrer le backend
```

---

## 📊 Vérification des Sauvegardes Automatiques

### Vérifier que les backups sont créés

```bash
# Compter les backups par base
for dir in backend/backups/*/; do
  echo "$(basename $dir): $(ls -1 $dir | wc -l) backups"
done
```

### Vérifier les logs

```bash
# Logs du backend (dans le terminal où il tourne)
# Vous verrez les appels à /backup-all
```

### Vérifier le heartbeat

```bash
curl http://localhost:8080/scheduler/heartbeat | jq .
```

Le `lastHeartbeat` doit être mis à jour régulièrement.

---

## ✅ Checklist

- [ ] La validation des identifiants fonctionne (erreur si mauvais identifiants)
- [ ] Les bases avec bons identifiants sont créées
- [ ] Le script `test-scheduler.sh` fonctionne
- [ ] Le endpoint `/backup-all` fonctionne
- [ ] Le heartbeat est mis à jour
- [ ] Les backups sont créés dans `backend/backups/`

---

## 🎯 Pour la Soutenance

**Ce que vous pouvez dire** :

> "Le système vérifie maintenant que les identifiants sont corrects lors de l'ajout d'une base. Si la connexion échoue, une erreur claire est affichée.
> 
> Les sauvegardes automatiques sont gérées par un scheduler qui exécute un backup de toutes les bases toutes les heures. On peut tester cela avec le script test-scheduler.sh."

---

**Tout est maintenant configuré et testable !**

