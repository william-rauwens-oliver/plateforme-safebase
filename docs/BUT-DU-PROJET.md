# 🎯 But du Projet SafeBase

## 📋 Consigne Principale

**"Ajouter une connexion à une base de données"**

## ✅ Ce que SafeBase fait

SafeBase est un **outil de sauvegarde et restauration** de bases de données **existantes**.

### Objectif

**Enregistrer des bases de données DÉJÀ CRÉÉES** pour pouvoir :
1. ✅ Les sauvegarder automatiquement
2. ✅ Conserver un historique des versions
3. ✅ Les restaurer en cas de problème

## 🔍 Ce que SafeBase NE fait PAS

❌ **SafeBase ne crée PAS de nouvelles bases de données**
- SafeBase n'est pas un outil de création de bases
- SafeBase ne gère pas le schéma des bases
- SafeBase ne crée pas de tables ou de données

## 📝 Comment utiliser SafeBase

### Étape 1 : Créer votre base de données (AVANT SafeBase)

Vous devez **d'abord créer votre base de données** avec vos outils habituels :

**Pour MySQL (MAMP)** :
1. Ouvrez phpMyAdmin : http://localhost:8888/phpMyAdmin
2. Créez une nouvelle base de données (ex: `ma_base_prod`)
3. Créez vos tables et données

**Pour PostgreSQL** :
```bash
psql -h localhost -p 5432 -U postgres
CREATE DATABASE ma_base_prod;
\c ma_base_prod
-- Créez vos tables ici
```

### Étape 2 : Enregistrer la base dans SafeBase

Une fois votre base créée, **enregistrez-la dans SafeBase** :

Dans l'interface SafeBase :
- **Nom** : "Ma Base de Production"
- **Moteur** : MySQL ou PostgreSQL
- **Hôte** : `127.0.0.1` (MySQL MAMP) ou `localhost` (PostgreSQL)
- **Port** : `8889` (MySQL MAMP) ou `5432` (PostgreSQL)
- **Utilisateur** : `root` (MySQL) ou `postgres` (PostgreSQL)
- **Mot de passe** : `root` (MySQL) ou `postgres` (PostgreSQL)
- **Base de données** : `ma_base_prod` (le nom de la base que vous avez créée)

### Étape 3 : Utiliser SafeBase

Une fois enregistrée, SafeBase peut :
- ✅ Sauvegarder votre base automatiquement (cron)
- ✅ Créer des sauvegardes manuelles
- ✅ Conserver un historique des versions
- ✅ Restaurer une version précédente

## 🎯 Exemple Concret

### Scénario : Base "fittracker"

1. **Vous avez déjà** une base PostgreSQL appelée `fittracker` avec vos données
2. **Vous enregistrez** cette base dans SafeBase avec :
   - Nom : "FitTracker Production"
   - Moteur : PostgreSQL
   - Base de données : `fittracker`
3. **SafeBase peut maintenant** :
   - Sauvegarder `fittracker` toutes les heures
   - Créer des points de restauration
   - Restaurer `fittracker` si vous faites une erreur

## 📊 Résumé

| Action | SafeBase le fait ? | Outil à utiliser |
|--------|-------------------|------------------|
| Créer une base de données | ❌ Non | phpMyAdmin, psql, MySQL Workbench, etc. |
| Créer des tables | ❌ Non | phpMyAdmin, psql, migrations, etc. |
| Insérer des données | ❌ Non | Votre application, scripts SQL, etc. |
| **Sauvegarder une base existante** | ✅ **Oui** | **SafeBase** |
| **Restaurer une base** | ✅ **Oui** | **SafeBase** |
| **Gérer l'historique des backups** | ✅ **Oui** | **SafeBase** |

## 💡 En Résumé

**SafeBase = Outil de sauvegarde/restauration**
- ✅ Enregistre des bases **existantes**
- ✅ Sauvegarde ces bases
- ✅ Restaure ces bases
- ❌ Ne crée pas de nouvelles bases

**Pour créer une base** : Utilisez phpMyAdmin, psql, ou votre outil habituel.

**Pour sauvegarder une base** : Utilisez SafeBase.

---

**C'est comme un système de sauvegarde pour votre ordinateur** : il ne crée pas vos fichiers, il les sauvegarde ! 🎯

