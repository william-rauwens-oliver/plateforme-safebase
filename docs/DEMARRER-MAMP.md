# 🟠 MAMP : Voyant Orange → Démarrer les Serveurs

## 🔍 Problème

Le voyant **orange** dans MAMP signifie que :
- ✅ MAMP est lancé
- ❌ Mais les serveurs (MySQL et Apache) ne sont **pas démarrés**

## ✅ Solution : Démarrer les Serveurs

### Étape 1 : Démarrer les serveurs

1. **Ouvrir MAMP** (si ce n'est pas déjà fait)
2. **Regarder** le bouton en haut
3. **Cliquer** sur **"Start Servers"** ou **"Démarrer les serveurs"**
4. **Attendre** quelques secondes

### Étape 2 : Vérifier que c'est vert

Le voyant doit passer de **🟠 Orange** à **🟢 Vert**.

**Si c'est vert** :
- ✅ MySQL est démarré
- ✅ Apache est démarré
- ✅ Vous pouvez utiliser MySQL dans SafeBase

### Étape 3 : Vérifier le port MySQL

1. Dans MAMP : **Préférences** → **Ports**
2. **Noter** le port MySQL affiché (généralement **8889**)

---

## 🧪 Tester que MySQL fonctionne

Une fois le voyant **vert**, testez :

```bash
# Avec le port de MAMP (généralement 8889)
mysql -h 127.0.0.1 -P 8889 -u root -proot -e "SELECT 1"
```

**Si ça fonctionne** : Vous verrez `1` s'afficher.

**Si ça ne fonctionne pas** : Vérifiez le port dans MAMP Préférences.

---

## 📝 Utiliser dans SafeBase

Une fois MySQL démarré (voyant vert), utilisez dans l'interface :

- **Hôte** : `127.0.0.1`
- **Port** : Le port affiché dans MAMP (généralement `8889`)
- **Utilisateur** : `root`
- **Mot de passe** : `root`
- **Base de données** : Créez-en une dans phpMyAdmin d'abord, ou utilisez une existante

---

## 🎯 Alternative : Utiliser PostgreSQL

Si vous voulez tester **maintenant** sans attendre MAMP :

**PostgreSQL fonctionne déjà** ! Utilisez-le :

- **Hôte** : `localhost`
- **Port** : `5432`
- **Utilisateur** : `postgres`
- **Mot de passe** : (votre mot de passe)
- **Base** : `postgres` ou `fittracker`

---

## ⚡ Solution Rapide pour Tester

Si vous voulez tester **immédiatement** sans démarrer MAMP :

```bash
# Désactiver la validation
export VALIDATE_CONNECTION=0

# Redémarrer le backend
cd backend
npm run dev
```

Maintenant vous pourrez ajouter des bases même si MySQL n'est pas démarré.

---

**Résumé : Cliquez sur "Start Servers" dans MAMP pour que le voyant passe au vert ! 🟢**

