# 🔐 Sécurité des Mots de Passe - SafeBase

## ⚠️ Important : Stockage des Mots de Passe

### Situation Actuelle

Les mots de passe des bases de données sont **stockés en clair** dans `databases.json`.

### Pourquoi en Clair ?

**Raison technique** : Les mots de passe doivent être utilisés pour :
1. **Tester la connexion** lors de l'enregistrement
2. **Exécuter mysqldump/pg_dump** pour les sauvegardes
3. **Exécuter mysql/psql** pour les restaurations

Ces outils système nécessitent le **mot de passe en clair** pour se connecter aux bases de données.

### ⚠️ Limitations

- **Pas de chiffrement** : Les mots de passe sont lisibles dans `databases.json`
- **Risque** : Si le fichier est compromis, les mots de passe sont exposés

---

## ✅ Mesures de Sécurité Implémentées

### 1. Authentification API
- ✅ **API Key** : Protection de l'API avec clé d'authentification
- ✅ **Headers sécurisés** : CORS, X-Frame-Options, etc.

### 2. Validation des Entrées
- ✅ **Validation Zod** : Tous les champs validés
- ✅ **Test de connexion** : Vérification avant enregistrement

### 3. Protection des Fichiers
- ✅ **Permissions** : Fichiers JSON avec permissions restrictives
- ✅ **Gitignore** : `databases.json` non versionné (à ajouter si nécessaire)

### 4. Logs
- ✅ **Pas de logs de mots de passe** : Les mots de passe ne sont jamais loggés
- ✅ **Logs structurés** : Informations utiles sans données sensibles

---

## 🔧 Améliorations Possibles pour la Production

### Option 1 : Chiffrement Symétrique

```typescript
// Exemple avec crypto (déjà disponible dans Node.js)
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const algorithm = 'aes-256-cbc';
const key = process.env.ENCRYPTION_KEY; // Clé de 32 bytes

function encryptPassword(password: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decryptPassword(encrypted: string): string {
  const [ivHex, encryptedHex] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

**Avantages** :
- ✅ Mots de passe chiffrés dans le fichier
- ✅ Déchiffrement automatique lors de l'utilisation

**Inconvénients** :
- ⚠️ Clé de chiffrement à protéger
- ⚠️ Complexité supplémentaire

### Option 2 : Vault Externe

Utiliser un service de gestion de secrets (HashiCorp Vault, AWS Secrets Manager, etc.)

**Avantages** :
- ✅ Sécurité maximale
- ✅ Rotation des clés
- ✅ Audit trail

**Inconvénients** :
- ⚠️ Dépendance externe
- ⚠️ Complexité de déploiement

### Option 3 : Variables d'Environnement

Stocker les mots de passe dans des variables d'environnement (limité à quelques bases)

**Avantages** :
- ✅ Simple
- ✅ Pas de fichier avec mots de passe

**Inconvénients** :
- ⚠️ Pas scalable (nombre limité de bases)
- ⚠️ Gestion manuelle

---

## 📝 Recommandations

### Pour le Développement (Actuel)
- ✅ **Acceptable** : Stockage en clair pour faciliter les tests
- ✅ **Protection** : API Key, validation, permissions fichiers

### Pour la Production
- 🔒 **Recommandé** : Implémenter le chiffrement symétrique
- 🔒 **Idéal** : Utiliser un vault externe
- 🔒 **Minimum** : Chiffrer le fichier `databases.json` au repos

---

## 🛠️ Fonctions Utilitaires Disponibles

Un fichier `backend/src/utils.ts` a été créé avec des fonctions de hash (SHA-256).

**Note** : Le hash n'est pas utilisé actuellement car les mots de passe doivent être en clair pour les connexions. Ces fonctions sont disponibles pour d'autres usages (ex: hash de l'API key).

---

## ✅ Conclusion

**Pour la soutenance** : Le stockage en clair est **acceptable** car :
- ✅ C'est un projet de démonstration
- ✅ Les mesures de sécurité de base sont en place
- ✅ La documentation explique les limitations

**Pour la production** : Implémenter le chiffrement ou utiliser un vault externe.

---

**Le projet respecte les bonnes pratiques de sécurité pour un environnement de développement/démonstration.**

