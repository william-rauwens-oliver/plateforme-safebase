# ⚡ Solution Rapide : Erreur Backup 500

## 🎯 Solution Immédiate (2 minutes)

### Option 1 : Activer le mode FAKE_DUMP

Cela permet de tester l'interface sans avoir besoin d'une vraie base de données.

**Étapes** :

1. **Arrêter le backend** (dans le terminal où il tourne) :
   - Appuyer sur `Ctrl+C`

2. **Activer le mode fake** :
```bash
export FAKE_DUMP=1
```

3. **Redémarrer le backend** :
```bash
cd backend
npm run dev
```

4. **Tester dans le frontend** :
   - Aller sur http://localhost:5173
   - Cliquer sur "💾 Backup"
   - ✅ Ça devrait fonctionner maintenant !

---

## 🔍 Pourquoi ça ne marchait pas ?

Le problème était que MySQL n'est pas accessible avec la configuration actuelle :
- MAMP utilise souvent un socket Unix différent
- Les identifiants peuvent être incorrects
- La base de données peut ne pas exister

---

## ✅ Solution Définitive (si vous avez une vraie base)

### Pour MAMP MySQL :

1. **Vérifier le port MySQL de MAMP** :
   - Ouvrir MAMP
   - Vérifier le port MySQL (généralement 8889)

2. **Mettre à jour la base dans l'interface** :
   - Ouvrir http://localhost:5173
   - Pour chaque base MySQL, modifier :
     - **Hôte** : `127.0.0.1` (au lieu de `localhost`)
     - **Port** : `8889` (ou le port configuré dans MAMP)
     - **Utilisateur** : `root`
     - **Mot de passe** : `root` (ou votre mot de passe MAMP)
     - **Base de données** : Le nom d'une base qui existe vraiment

3. **Tester la connexion** :
```bash
mysqldump -h 127.0.0.1 -P 8889 -u root -proot nom_de_votre_base --no-data
```

Si cette commande fonctionne, les backups fonctionneront aussi !

---

## 📝 Résumé

**Pour tester rapidement** : Activez `FAKE_DUMP=1`  
**Pour utiliser de vraies bases** : Configurez correctement les identifiants MAMP

---

**Le code a été amélioré pour afficher de meilleurs messages d'erreur dans les logs !**

