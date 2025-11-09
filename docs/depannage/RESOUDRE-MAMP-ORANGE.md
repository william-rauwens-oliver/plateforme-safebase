# 🔧 Résoudre le Problème MAMP (Bouton Orange)

## 🟠 Problème : Le bouton "Start Server" reste orange

Quand le bouton MAMP est **orange** au lieu de **vert**, cela signifie que MAMP n'arrive pas à démarrer les serveurs.

## 🔍 Causes Possibles

### 1. **Ports déjà utilisés** (le plus fréquent)

Les ports MAMP par défaut sont :
- **8888** : Apache
- **8889** : MySQL

Si un autre processus utilise ces ports, MAMP ne peut pas démarrer.

### 2. **Processus MySQL déjà en cours**

Un autre MySQL peut être déjà lancé (Homebrew, XAMPP, etc.)

### 3. **Permissions insuffisantes**

MAMP a besoin de permissions pour démarrer les serveurs.

## ✅ Solutions

### Solution 1 : Vérifier et libérer les ports

#### Étape 1 : Vérifier qui utilise les ports

```bash
# Vérifier le port 8889 (MySQL)
lsof -i :8889

# Vérifier le port 8888 (Apache)
lsof -i :8888
```

#### Étape 2 : Arrêter les processus qui utilisent les ports

Si vous voyez des processus, notez le **PID** (première colonne) et arrêtez-les :

```bash
# Remplacer PID par le numéro du processus
kill -9 PID
```

#### Étape 3 : Redémarrer MAMP

1. Fermer complètement MAMP
2. Rouvrir MAMP
3. Cliquer sur "Start Servers"

### Solution 2 : Arrêter tous les MySQL en cours

```bash
# Trouver tous les processus MySQL
ps aux | grep mysql

# Arrêter MySQL Homebrew (si installé)
brew services stop mysql

# Ou arrêter manuellement
sudo killall mysqld
```

### Solution 3 : Changer les ports dans MAMP

Si les ports sont toujours occupés, changez-les dans MAMP :

1. Ouvrir **MAMP**
2. Cliquer sur **Préférences** (ou **Preferences**)
3. Onglet **Ports**
4. Changer les ports :
   - Apache : `8888` → `8080` (ou autre port libre)
   - MySQL : `8889` → `3307` (ou autre port libre)
5. **Sauvegarder**
6. Redémarrer MAMP

**⚠️ Important** : Si vous changez les ports, mettez à jour les valeurs dans SafeBase :
- MySQL Port : `3307` (au lieu de `8889`)

### Solution 4 : Réinitialiser MAMP

Si rien ne fonctionne :

1. **Fermer MAMP complètement**
2. **Supprimer les fichiers de verrouillage** :
   ```bash
   # Supprimer les fichiers de verrouillage MySQL
   sudo rm -rf /Applications/MAMP/tmp/mysql/*
   sudo rm -rf /Applications/MAMP/db/mysql57/*.pid
   ```
3. **Redémarrer MAMP**

### Solution 5 : Vérifier les logs MAMP

1. Ouvrir **MAMP**
2. Cliquer sur **Logs** (ou **View Logs**)
3. Vérifier les erreurs dans :
   - **Apache Error Log**
   - **MySQL Error Log**

Les erreurs vous indiqueront le problème exact.

## 🎯 Solution Rapide (Recommandée)

**La solution la plus rapide** :

1. **Arrêter tous les MySQL** :
   ```bash
   sudo killall mysqld
   brew services stop mysql 2>/dev/null || true
   ```

2. **Vérifier que les ports sont libres** :
   ```bash
   lsof -i :8889
   lsof -i :8888
   ```
   (Doit retourner vide)

3. **Redémarrer MAMP** :
   - Fermer MAMP complètement
   - Rouvrir MAMP
   - Cliquer sur "Start Servers"

4. **Vérifier que c'est vert** ✅

## 🔍 Diagnostic Automatique

Pour diagnostiquer automatiquement :

```bash
# Script de diagnostic
echo "=== Ports MAMP ==="
lsof -i :8889 | head -3
lsof -i :8888 | head -3

echo "=== Processus MySQL ==="
ps aux | grep mysql | grep -v grep

echo "=== Processus MAMP ==="
ps aux | grep -i mamp | grep -v grep
```

## ✅ Vérification

Une fois MAMP démarré (bouton **vert**), testez :

```bash
# Tester MySQL
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 1;"

# Si ça fonctionne, vous verrez :
# +---+
# | 1 |
# +---+
# | 1 |
# +---+
```

## 🆘 Si Rien Ne Fonctionne

1. **Redémarrer votre Mac** (solution radicale mais efficace)
2. **Réinstaller MAMP** (dernier recours)
3. **Utiliser PostgreSQL** à la place (si vous avez PostgreSQL installé)

---

**Une fois MAMP démarré (vert), vous pourrez utiliser SafeBase avec MySQL !** ✅

