# ⏰ Quand ont lieu les Sauvegardes Automatiques ?

## 📅 Planning des Sauvegardes

### Configuration actuelle

Les sauvegardes automatiques ont lieu **toutes les heures à la minute 0**.

**Exemples** :
- 13:00 (13h00)
- 14:00 (14h00)
- 15:00 (15h00)
- 16:00 (16h00)
- etc.

### Configuration dans le crontab

Le fichier `scheduler/crontab` contient :
```
0 * * * * /app/scripts/backup_all.sh
```

**Explication** :
- `0` = minute 0
- `*` = toutes les heures
- `*` = tous les jours du mois
- `*` = tous les mois
- `*` = tous les jours de la semaine

**Résultat** : Toutes les heures à 00 minutes

---

## 🔧 Modifier la Fréquence

### Option 1 : Toutes les 30 minutes

Modifier `scheduler/crontab` :
```
*/30 * * * * /app/scripts/backup_all.sh
```

### Option 2 : Toutes les 6 heures

```
0 */6 * * * /app/scripts/backup_all.sh
```

### Option 3 : Tous les jours à minuit

```
0 0 * * * /app/scripts/backup_all.sh
```

### Option 4 : Toutes les 15 minutes (pour test)

```
*/15 * * * * /app/scripts/backup_all.sh
```

---

## 🐳 Avec Docker

### Vérifier la configuration

```bash
# Voir le crontab dans le container
docker exec safebase-scheduler cat /etc/crontabs/root
```

### Modifier la fréquence

1. **Modifier** `scheduler/crontab`
2. **Reconstruire** le container :
   ```bash
   docker compose build scheduler
   docker compose restart scheduler
   ```

### Vérifier les logs

```bash
# Voir les logs du scheduler
docker logs safebase-scheduler

# Suivre les logs en temps réel
docker logs -f safebase-scheduler
```

---

## 🖥️ Sans Docker (Test Local)

### Le scheduler ne fonctionne pas automatiquement

Sans Docker, le cron ne tourne pas automatiquement.

**Pour tester** :

1. **Exécuter manuellement** :
   ```bash
   cd scheduler/scripts
   export SCHEDULER_API_URL="http://localhost:8080"
   ./backup_all.sh
   ```

2. **Utiliser le script de test** :
   ```bash
   ./test-scheduler.sh
   ```

3. **Créer un cron local** (optionnel) :
   ```bash
   # Éditer le crontab
   crontab -e
   
   # Ajouter cette ligne :
   0 * * * * cd /Applications/MAMP/htdocs/plateforme-safebase/scheduler/scripts && SCHEDULER_API_URL="http://localhost:8080" ./backup_all.sh
   ```

---

## 🧪 Tester les Sauvegardes Automatiques

### Test immédiat

```bash
# Lancer le script de test
./test-scheduler.sh
```

### Simuler le cron

```bash
# Exécuter le script du scheduler
cd scheduler/scripts
export SCHEDULER_API_URL="http://localhost:8080"
./backup_all.sh
```

### Vérifier le résultat

```bash
# Voir les nouveaux backups créés
ls -lh backend/backups/*/
```

---

## 📊 Vérifier que ça fonctionne

### Avec Docker

1. **Attendre** l'heure suivante (ex: si c'est 13:45, attendre 14:00)
2. **Vérifier les logs** :
   ```bash
   docker logs safebase-scheduler | tail -20
   ```
3. **Vérifier les backups** :
   ```bash
   ls -lh backend/backups/*/
   ```

### Sans Docker

Les sauvegardes automatiques ne fonctionnent **pas** sans Docker.

**Solutions** :
- Utiliser Docker Compose
- Créer un cron local (voir ci-dessus)
- Tester manuellement avec `./test-scheduler.sh`

---

## ⏰ Résumé

| Environnement | Fréquence | Comment ça marche |
|---------------|-----------|-------------------|
| **Docker** | Toutes les heures (00 min) | Cron dans le container |
| **Local** | ❌ Pas automatique | Test manuel uniquement |

---

## 🎯 Pour la Soutenance

**Ce que vous pouvez dire** :

> "Les sauvegardes automatiques sont configurées pour s'exécuter toutes les heures via un scheduler basé sur cron. Le scheduler appelle l'endpoint `/backup-all` qui crée un backup pour toutes les bases configurées.
> 
> En local sans Docker, on peut tester les sauvegardes automatiques avec le script `test-scheduler.sh` qui simule le comportement du scheduler."

---

**Les sauvegardes automatiques ont lieu toutes les heures à la minute 0 (ex: 13:00, 14:00, 15:00...)**

