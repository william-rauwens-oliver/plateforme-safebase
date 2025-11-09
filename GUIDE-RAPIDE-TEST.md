# ⚡ Guide Rapide - Test des Corrections

## ✅ Ce qui a été corrigé

1. **Validation des identifiants** : On ne peut plus créer une base avec de mauvais identifiants
2. **Versions épinglées** : Les versions épinglées apparaissent en haut
3. **Sauvegardes automatiques** : Script de test créé

---

## 🧪 Test Rapide (3 minutes)

### Test 1 : Validation des identifiants (30 secondes)

**Dans le frontend** :
1. Ouvrir http://localhost:5173
2. Essayer d'ajouter une base avec de **mauvais identifiants** :
   - Nom : `Test Erreur`
   - Moteur : MySQL
   - Hôte : `localhost`
   - Port : `3306`
   - Utilisateur : `fakeuser`
   - Mot de passe : `fakepass`
   - Base : `fakedb`
3. Cliquer "Ajouter la base"

**Résultat attendu** :
- ❌ Erreur : "Connexion à la base de données échouée"
- ✅ La base n'est **pas** créée

**Ensuite** :
4. Ajouter une base avec de **bons identifiants**
5. Vérifier : La base est créée ✅

---

### Test 2 : Versions épinglées (1 minute)

1. **Créer** 2-3 backups d'une base
2. **Ouvrir** les versions
3. **Épingler** la dernière version
4. **Fermer** et **rouvrir** les versions
5. **Vérifier** : La version épinglée est **en haut** ✅

---

### Test 3 : Sauvegardes automatiques (1 minute)

```bash
# Dans le terminal
./test-scheduler.sh
```

**Résultat attendu** :
```
✅ API accessible
✅ Tous les backups ont réussi !
```

---

## 📍 Où sont les données ?

**Métadonnées** :
- `backend/data/databases.json` - Bases enregistrées
- `backend/data/versions.json` - Versions de backup

**Fichiers SQL** :
- `backend/backups/{database-id}/*.sql` - Les vrais backups

---

## ⚙️ Mode FAKE_DUMP

**Actuellement** : Validation activée (si FAKE_DUMP n'est pas défini)

**Pour désactiver la validation** (mode test) :
```bash
export FAKE_DUMP=1
# Redémarrer le backend
```

**Pour activer la validation** (mode production) :
```bash
export FAKE_DUMP=0
# Ou ne pas définir FAKE_DUMP
```

---

**Tout est corrigé et testable ! ✅**

