# ⚡ Solution Rapide - Erreur MAMP

## 🚨 Problème

Vous avez l'erreur : `Connexion à la base de données échouée` même avec MAMP lancé.

## ✅ Solution Immédiate (2 options)

### Option 1 : Désactiver la validation (pour tester rapidement)

```bash
# Dans le terminal où le backend tourne
export VALIDATE_CONNECTION=0

# Redémarrer le backend (Ctrl+C puis)
cd backend
npm run dev
```

**Maintenant** : Vous pourrez ajouter des bases même si MAMP n'est pas accessible.

---

### Option 2 : Utiliser PostgreSQL (fonctionne déjà !)

PostgreSQL fonctionne sur votre système. Utilisez-le :

**Dans l'interface SafeBase** :
- **Nom** : `Base PostgreSQL`
- **Moteur** : `PostgreSQL`
- **Hôte** : `localhost`
- **Port** : `5432`
- **Utilisateur** : `postgres`
- **Mot de passe** : (votre mot de passe PostgreSQL)
- **Base** : `postgres` ou `fittracker`

**Ça fonctionnera immédiatement !** ✅

---

## 🔧 Pour Corriger MAMP

### Étape 1 : Vérifier MAMP

1. **Ouvrir MAMP**
2. **Vérifier** que les serveurs sont **démarrés** (voyants verts)
3. Si pas démarrés, cliquer **"Start Servers"**

### Étape 2 : Vérifier le port MySQL

1. Dans MAMP : **Préférences** → **Ports**
2. **Noter** le port MySQL affiché (peut être 8889, 3306, ou autre)

### Étape 3 : Tester la connexion

```bash
# Remplacer [PORT] par le port affiché dans MAMP
mysql -h 127.0.0.1 -P [PORT] -u root -proot -e "SELECT 1"
```

### Étape 4 : Utiliser le bon port dans SafeBase

Dans l'interface, utilisez le **port affiché dans MAMP** (pas forcément 8889).

---

## 🎯 Recommandation pour la Soutenance

**Utilisez PostgreSQL** qui fonctionne déjà :
- ✅ Pas besoin de MAMP
- ✅ Fonctionne immédiatement
- ✅ Parfait pour la démonstration

**OU** désactivez la validation avec `VALIDATE_CONNECTION=0` pour pouvoir tester avec n'importe quels identifiants.

---

## 📝 Messages d'erreur améliorés

Le frontend affiche maintenant le **vrai message d'erreur** du backend, donc vous verrez :
- "Connexion à la base de données échouée"
- Le détail de l'erreur
- Des conseils pour corriger

---

**Solution la plus rapide : Utilisez PostgreSQL ou désactivez la validation !**

