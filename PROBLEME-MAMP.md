# ⚠️ Problème : MAMP non accessible

## 🔍 Diagnostic

L'erreur `ECONNREFUSED 127.0.0.1:8889` signifie que **rien n'écoute sur le port 8889**.

**Causes possibles** :
1. MAMP n'est pas démarré
2. MySQL n'est pas démarré dans MAMP
3. Le port MySQL de MAMP est différent de 8889

---

## ✅ Solutions

### Solution 1 : Vérifier que MAMP est démarré

1. **Ouvrir MAMP**
2. **Vérifier** que les serveurs sont **verts** (Start Servers)
3. **Vérifier** le port MySQL :
   - Aller dans **Préférences** → **Ports**
   - Notez le port MySQL (peut être 8889, 3306, ou autre)

### Solution 2 : Vérifier le port MySQL de MAMP

1. **Ouvrir MAMP**
2. **Préférences** → **Ports**
3. **Notez** le port MySQL affiché
4. **Utilisez ce port** dans SafeBase (pas forcément 8889)

### Solution 3 : Désactiver temporairement la validation

Si vous voulez tester sans MAMP, désactivez la validation :

```bash
# Dans le terminal où le backend tourne
export VALIDATE_CONNECTION=0

# Redémarrer le backend (Ctrl+C puis npm run dev)
```

**OU** activer le mode FAKE_DUMP :
```bash
export FAKE_DUMP=1
```

---

## 🧪 Test de Connexion MAMP

### Vérifier que MAMP fonctionne

```bash
# Tester avec le port 8889 (par défaut)
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 1"

# Si ça ne marche pas, essayer le port 3306
mysql -h 127.0.0.1 -P 3306 -u root -proot -e "SELECT 1"
```

### Vérifier quel port MAMP utilise

1. **Ouvrir MAMP**
2. **Préférences** → **Ports**
3. **Regarder** le port MySQL affiché

---

## 📝 Identifiants MAMP Corrects

Une fois MAMP démarré, utilisez dans SafeBase :

- **Hôte** : `127.0.0.1` (important : pas `localhost`)
- **Port** : Le port affiché dans MAMP (généralement 8889)
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Base de données** : Créez-en une dans phpMyAdmin d'abord

---

## 🎯 Solution Rapide pour Tester

Si vous voulez juste tester l'interface sans MAMP :

```bash
# Désactiver la validation
export VALIDATE_CONNECTION=0

# Redémarrer le backend
cd backend
npm run dev
```

Maintenant vous pourrez ajouter des bases même si MAMP n'est pas démarré.

---

## ✅ Vérification

### Étape 1 : Démarrer MAMP

1. Ouvrir MAMP
2. Cliquer "Start Servers"
3. Vérifier que les voyants sont verts

### Étape 2 : Vérifier le port

1. Préférences → Ports
2. Noter le port MySQL

### Étape 3 : Tester la connexion

```bash
mysql -h 127.0.0.1 -P [PORT_MAMP] -u root -proot -e "SELECT 1"
```

Si ça fonctionne, utilisez ce port dans SafeBase.

---

## 💡 Alternative : Utiliser PostgreSQL

PostgreSQL fonctionne déjà sur votre système ! Utilisez-le pour tester :

- **Hôte** : `localhost`
- **Port** : `5432`
- **Utilisateur** : `postgres`
- **Mot de passe** : (votre mot de passe)
- **Base** : `postgres` ou `fittracker`

---

**Une fois MAMP démarré et le bon port trouvé, ça fonctionnera !**

