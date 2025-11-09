# 🔧 Solution : MAMP démarre automatiquement mais reste orange

## 🟠 Problème

MAMP essaie de démarrer automatiquement au lancement, mais le bouton reste **orange** au lieu de devenir **vert**.

## 🔍 Diagnostic

### 1. Vérifier les logs MySQL

Les erreurs MySQL sont dans :
```
/Applications/MAMP/logs/mysql_error.log
```

**Pour voir les dernières erreurs** :
```bash
tail -30 /Applications/MAMP/logs/mysql_error.log
```

### 2. Causes fréquentes

#### A. **Port déjà utilisé**
- Un autre MySQL (Homebrew, XAMPP) utilise le port 8889
- **Solution** : Arrêter tous les MySQL avant de lancer MAMP

#### B. **Fichiers de verrouillage corrompus**
- Des fichiers `.pid` ou `.sock` bloquent le démarrage
- **Solution** : Supprimer les fichiers de verrouillage

#### C. **Base de données corrompue**
- Les fichiers de données MySQL sont corrompus
- **Solution** : Réparer ou réinitialiser la base

#### D. **Permissions insuffisantes**
- MAMP n'a pas les droits d'écriture
- **Solution** : Vérifier les permissions

## ✅ Solutions par ordre de priorité

### Solution 1 : Nettoyer les fichiers de verrouillage

```bash
# Arrêter MAMP complètement (Cmd+Q)

# Supprimer les fichiers de verrouillage
sudo rm -rf /Applications/MAMP/tmp/mysql/*.pid
sudo rm -rf /Applications/MAMP/tmp/mysql/*.sock

# Redémarrer MAMP
```

### Solution 2 : Arrêter tous les MySQL concurrents

```bash
# Arrêter MySQL Homebrew
brew services stop mysql

# Tuer tous les processus MySQL
pkill -9 mysqld
pkill -9 mysqld_safe

# Vérifier que le port est libre
lsof -i :8889
# (Doit retourner vide)
```

### Solution 3 : Vérifier les logs et corriger

1. **Ouvrir MAMP**
2. **Cliquer sur "Logs"** (ou "View Logs")
3. **Lire "MySQL Error Log"**
4. **Chercher l'erreur** (ex: "Can't create/write to file", "Port already in use", etc.)
5. **Corriger selon l'erreur**

### Solution 4 : Réparer la base de données

Si les logs indiquent une corruption :

```bash
# Arrêter MAMP

# Réparer la base (remplacez mysql57 par votre version)
/Applications/MAMP/Library/bin/mysqld_safe --datadir=/Applications/MAMP/db/mysql57 --repair
```

### Solution 5 : Réinitialiser MAMP (dernier recours)

⚠️ **ATTENTION** : Cela supprime toutes vos bases de données MAMP !

```bash
# 1. Sauvegarder vos bases (si importantes)
mysqldump -h 127.0.0.1 -P 8889 -u root -proot --all-databases > backup.sql

# 2. Arrêter MAMP

# 3. Supprimer les données
sudo rm -rf /Applications/MAMP/db/mysql57/*

# 4. Redémarrer MAMP (il recréera les bases système)
```

## 🎯 Solution Rapide (Recommandée)

**Exécutez ce script** :

```bash
cd /Applications/MAMP/htdocs/plateforme-safebase
./scripts/fixer-mamp.sh
```

Puis :
1. **Fermez MAMP complètement** (Cmd+Q dans le menu MAMP)
2. **Rouvrez MAMP**
3. **Cliquez sur "Stop Servers"** (si orange)
4. **Cliquez sur "Start Servers"**
5. **Attendez que ça devienne vert** ✅

## 🔍 Vérification

Une fois MAMP vert, testez :

```bash
# Tester MySQL
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 'OK' as status;"
```

Si ça fonctionne, vous verrez :
```
+--------+
| status |
+--------+
| OK     |
+--------+
```

## 📋 Checklist de dépannage

- [ ] Port 8889 libre (`lsof -i :8889` retourne vide)
- [ ] Aucun MySQL Homebrew en cours (`brew services list`)
- [ ] Fichiers de verrouillage supprimés
- [ ] Logs MySQL lus et erreurs corrigées
- [ ] MAMP complètement fermé puis rouvert
- [ ] Permissions OK sur `/Applications/MAMP/db/mysql57`

## 🆘 Si rien ne fonctionne

1. **Redémarrer votre Mac** (solution radicale mais efficace)
2. **Réinstaller MAMP** (dernier recours)
3. **Utiliser PostgreSQL** à la place (si vous avez PostgreSQL installé)

---

**Une fois MAMP vert, SafeBase pourra se connecter à MySQL !** ✅

