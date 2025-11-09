# 🔧 Débogage des Erreurs de Backup

## Problème : Erreur 500 "backup failed"

### Causes possibles

1. **MySQL/PostgreSQL non accessible**
   - Le serveur de base de données n'est pas démarré
   - Les identifiants sont incorrects
   - La base de données n'existe pas

2. **mysqldump/pg_dump non trouvé**
   - Les outils ne sont pas dans le PATH
   - Les outils ne sont pas installés

3. **Permissions insuffisantes**
   - Le dossier `backups/` n'est pas accessible en écriture
   - L'utilisateur n'a pas les droits

---

## ✅ Solution 1 : Mode FAKE_DUMP (pour tester)

Si vous voulez tester l'interface sans vraie base de données :

```bash
# Dans le terminal où le backend tourne
export FAKE_DUMP=1

# Redémarrer le backend
# Ctrl+C puis :
cd backend
npm run dev
```

**Avantages** :
- ✅ Permet de tester toute l'interface
- ✅ Crée des fichiers de backup factices
- ✅ Pas besoin de base de données réelle

**Inconvénients** :
- ⚠️ Les backups ne sont pas réels
- ⚠️ La restauration ne fonctionnera pas vraiment

---

## ✅ Solution 2 : Corriger la connexion MySQL

### Pour MAMP

MAMP utilise souvent un socket Unix différent. Vérifiez :

```bash
# Trouver le socket MySQL de MAMP
ls -la /Applications/MAMP/tmp/mysql/mysql.sock

# Ou utiliser TCP/IP au lieu du socket
# Dans votre base de données, utilisez :
# - Host: 127.0.0.1 (au lieu de localhost)
# - Port: 8889 (port MySQL par défaut de MAMP)
```

### Tester la connexion manuellement

```bash
# Test MySQL
mysqldump -h 127.0.0.1 -P 8889 -u root -proot nom_base --no-data

# Test PostgreSQL
PGPASSWORD='password' pg_dump -h 127.0.0.1 -p 5432 -U postgres -d nom_base --no-data
```

### Mettre à jour les bases dans l'interface

1. Ouvrir http://localhost:5173
2. Pour chaque base MySQL :
   - Modifier le **Hôte** : `127.0.0.1` (au lieu de `localhost`)
   - Modifier le **Port** : `8889` (port MySQL MAMP) ou `3306` (si MySQL standard)
   - Vérifier **Utilisateur** et **Mot de passe**
   - Vérifier que la **Base de données** existe

---

## ✅ Solution 3 : Améliorer les messages d'erreur

Le code a été amélioré pour afficher plus de détails sur l'erreur.

**Vérifier les logs du backend** :
- Regardez le terminal où `npm run dev` tourne
- Les erreurs détaillées s'affichent maintenant

**Exemple de log** :
```
{
  "level": 50,
  "backupError": "mysqldump: Got error: 2002...",
  "databaseId": "240eb50f-...",
  "database": "Test"
}
```

---

## 🧪 Test rapide

### 1. Vérifier que MySQL est accessible

```bash
# Test avec MAMP
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 1"

# Test avec MySQL standard
mysql -h localhost -P 3306 -u root -proot -e "SELECT 1"
```

### 2. Vérifier mysqldump

```bash
which mysqldump
mysqldump --version
```

### 3. Tester un backup manuel

```bash
# Remplacer les valeurs par les vôtres
mysqldump -h 127.0.0.1 -P 8889 -u root -proot nom_base > test_backup.sql

# Vérifier que le fichier est créé
ls -lh test_backup.sql
```

---

## 📝 Configuration recommandée pour MAMP

Dans l'interface SafeBase, utilisez ces valeurs pour MAMP :

**MySQL** :
- **Hôte** : `127.0.0.1` (ou `localhost`)
- **Port** : `8889` (port MySQL MAMP par défaut)
- **Utilisateur** : `root`
- **Mot de passe** : `root` (ou votre mot de passe MAMP)
- **Base de données** : Le nom de votre base

**PostgreSQL** :
- **Hôte** : `127.0.0.1`
- **Port** : `5432` (ou le port configuré dans MAMP)
- **Utilisateur** : `postgres`
- **Mot de passe** : Votre mot de passe
- **Base de données** : Le nom de votre base

---

## 🚀 Solution rapide : Activer FAKE_DUMP

Pour tester immédiatement sans configurer MySQL :

```bash
# Arrêter le backend (Ctrl+C)

# Activer le mode fake
export FAKE_DUMP=1

# Redémarrer
cd backend
npm run dev
```

Maintenant, les backups fonctionneront avec des fichiers factices !

---

## 💡 Astuce

Si vous utilisez MAMP, vous pouvez aussi :
1. Démarrer MAMP
2. Ouvrir phpMyAdmin
3. Créer une base de test
4. Utiliser les identifiants MAMP dans SafeBase

---

**Une fois la connexion corrigée, les backups fonctionneront normalement !**

