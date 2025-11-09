# 🟠 MAMP ne démarre pas - Solutions

## 🔍 Problème

Quand vous cliquez sur "Start Servers" dans MAMP, le voyant reste **orange** au lieu de passer au **vert**.

**Cela signifie** : Les serveurs (MySQL et Apache) ne démarrent pas correctement.

---

## ✅ Solutions

### Solution 1 : Vérifier les ports

Les ports peuvent être déjà utilisés par d'autres applications.

1. **Ouvrir MAMP**
2. **Préférences** → **Ports**
3. **Cliquer** sur "Set Web & MySQL ports to 80 & 3306" (ou utiliser des ports personnalisés)
4. **Redémarrer** MAMP
5. **Essayer** de démarrer les serveurs

### Solution 2 : Vérifier les logs

1. Dans MAMP : **Aide** → **Logs**
2. **Regarder** les erreurs MySQL et Apache
3. **Chercher** des messages d'erreur

### Solution 3 : Redémarrer MAMP complètement

1. **Quitter** MAMP complètement (Cmd+Q)
2. **Redémarrer** MAMP
3. **Essayer** de démarrer les serveurs

### Solution 4 : Vérifier les permissions

Parfois MAMP a besoin de permissions administrateur :

1. **Quitter** MAMP
2. **Relancer** MAMP en cliquant droit → "Ouvrir" (pour contourner les restrictions)
3. **Essayer** de démarrer

---

## 🎯 Solution Alternative : Ne pas utiliser MAMP

Puisque MAMP ne démarre pas, **utilisez PostgreSQL** qui fonctionne déjà !

### Utiliser PostgreSQL dans SafeBase

**Dans l'interface SafeBase** :
- **Nom** : `Base PostgreSQL`
- **Moteur** : `PostgreSQL`
- **Hôte** : `localhost`
- **Port** : `5432`
- **Utilisateur** : `postgres`
- **Mot de passe** : (votre mot de passe PostgreSQL)
- **Base de données** : `postgres` ou `fittracker`

**Ça fonctionnera immédiatement !** ✅

---

## ⚡ Solution Rapide : Désactiver la Validation

Si vous voulez tester avec n'importe quels identifiants (même MySQL) :

```bash
# Dans le terminal où le backend tourne
export VALIDATE_CONNECTION=0

# Redémarrer le backend (Ctrl+C puis)
cd backend
npm run dev
```

**Maintenant** : Vous pourrez ajouter des bases même si MySQL n'est pas accessible.

---

## 🐳 Alternative : Utiliser Docker

Si vous avez Docker installé, vous pouvez utiliser MySQL via Docker :

```bash
# Démarrer seulement MySQL
docker compose up mysql -d

# Utiliser dans SafeBase :
# - Hôte: localhost
# - Port: 3306
# - Utilisateur: safebase
# - Mot de passe: safebase
# - Base: safebase
```

---

## 📊 Résumé des Options

| Option | Avantage | Inconvénient |
|--------|----------|--------------|
| **PostgreSQL** | ✅ Fonctionne déjà | Aucun |
| **VALIDATE_CONNECTION=0** | ✅ Teste avec n'importe quels identifiants | Pas de vraie validation |
| **Docker MySQL** | ✅ MySQL fonctionnel | Nécessite Docker |
| **Corriger MAMP** | ✅ MySQL local | Peut prendre du temps |

---

## 🎯 Recommandation pour la Soutenance

**Utilisez PostgreSQL** :
- ✅ Fonctionne immédiatement
- ✅ Pas besoin de MAMP
- ✅ Parfait pour la démonstration
- ✅ Vous pouvez montrer MySQL aussi (avec Docker si nécessaire)

**OU** désactivez la validation avec `VALIDATE_CONNECTION=0` pour pouvoir tester avec n'importe quels identifiants.

---

## 🔧 Si vous voulez vraiment corriger MAMP

### Vérifier les processus qui bloquent

```bash
# Vérifier si quelque chose utilise les ports
lsof -ti:8889  # Port MySQL MAMP
lsof -ti:80    # Port Apache MAMP
```

### Tuer les processus bloquants

```bash
# ATTENTION : Tuez seulement si vous êtes sûr !
kill $(lsof -ti:8889)
kill $(lsof -ti:80)
```

Puis redémarrer MAMP.

---

**Pour tester maintenant : Utilisez PostgreSQL ou désactivez la validation !**

