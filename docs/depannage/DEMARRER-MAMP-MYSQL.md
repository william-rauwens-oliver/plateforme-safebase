# 🚀 Démarrer MAMP MySQL pour SafeBase

## ⚠️ Problème

Vous obtenez l'erreur : "Impossible de se connecter au serveur 127.0.0.1:8889"

Cela signifie que **MAMP MySQL n'est pas démarré**.

## ✅ Solution : Démarrer MAMP

### Étape 1 : Ouvrir MAMP

1. **Ouvrez l'application MAMP** (dans Applications/MAMP)
2. **Cliquez sur "Start Servers"**
3. **Attendez** que les voyants passent au **vert** (Apache et MySQL)

### Étape 2 : Vérifier le Port MySQL

1. Dans MAMP, cliquez sur **"Preferences"** ou **"Préférences"**
2. Allez dans l'onglet **"Ports"**
3. **Notez le port MySQL** (généralement `8889`)

### Étape 3 : Tester la Connexion

```bash
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 1;"
```

Si ça fonctionne, vous verrez :
```
1
1
```

### Étape 4 : Créer une Base de Données (si nécessaire)

1. **Ouvrez phpMyAdmin** : http://localhost:8888/phpMyAdmin
2. **Cliquez** sur "Nouvelle base de données"
3. **Nommez** votre base (ex: `test_safebase`)
4. **Créez** la base

### Étape 5 : Utiliser dans SafeBase

Dans l'interface SafeBase :
- **Nom** : (ex: "Base MySQL MAMP")
- **Moteur** : `MySQL`
- **Hôte** : `127.0.0.1`
- **Port** : `8889` (ou le port affiché dans MAMP)
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Base de données** : Le nom de la base que vous avez créée

## 🔧 Si MAMP ne démarre pas

### Problème : Voyant MySQL reste orange

1. **Quittez complètement MAMP**
2. **Vérifiez** les logs : MAMP → Aide → Logs
3. **Réinitialisez** les ports : Préférences → Ports → "Set Web & MySQL ports to 80 & 3306"
4. **Redémarrez** MAMP

### Alternative : Utiliser MySQL Standard

Si MAMP ne fonctionne pas, vous pouvez utiliser MySQL standard (port 3306) :

```bash
# Installer MySQL (si pas déjà installé)
brew install mysql

# Démarrer MySQL
brew services start mysql

# Créer un utilisateur et une base
mysql -u root -p
CREATE DATABASE test_safebase;
```

Puis dans SafeBase :
- **Port** : `3306`
- **Utilisateur** : `root`
- **Mot de passe** : (celui que vous avez configuré)

## 📝 Identifiants MAMP par Défaut

- **Hôte** : `127.0.0.1`
- **Port MySQL** : `8889` (ou celui affiché dans MAMP)
- **Port Apache** : `8888`
- **Utilisateur MySQL** : `root`
- **Mot de passe MySQL** : `root`

## ✅ Vérification Rapide

```bash
# Vérifier que MySQL écoute sur le port 8889
lsof -i :8889

# Tester la connexion
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SHOW DATABASES;"
```

---

**Une fois MAMP démarré, la connexion dans SafeBase devrait fonctionner !** ✅

