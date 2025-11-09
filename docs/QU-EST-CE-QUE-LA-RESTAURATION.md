# 🔄 Qu'est-ce que la Restauration ?

## 📖 Explication Simple

La **restauration** permet de **remettre une base de données dans un état antérieur** en utilisant un fichier de backup (sauvegarde).

### Analogie
Imaginez que vous avez :
- 📸 Une photo de votre bureau à un moment précis (c'est le **backup**)
- 🗑️ Vous avez ensuite déplacé des fichiers, supprimé des documents
- 🔄 La **restauration** permet de remettre votre bureau exactement comme il était sur la photo

## 🔧 Comment ça fonctionne techniquement ?

### 1. Le Backup (Sauvegarde)
Quand vous faites un backup :
- Le système crée un fichier `.sql` qui contient **toutes les données** de votre base
- Ce fichier contient les commandes SQL pour recréer la base exactement comme elle était

### 2. La Restauration
Quand vous restaurez :
- Le système lit le fichier `.sql` du backup
- Il exécute les commandes SQL dans votre base de données
- Votre base revient à l'état qu'elle avait au moment du backup

## ⚠️ Attention !

**La restauration REMPLACE les données actuelles !**

Exemple :
- 📅 **Lundi** : Vous faites un backup (votre base contient 100 utilisateurs)
- 📅 **Mardi** : Vous ajoutez 50 nouveaux utilisateurs (votre base contient 150 utilisateurs)
- 📅 **Mercredi** : Vous restaurez le backup du lundi
- ❌ **Résultat** : Votre base revient à 100 utilisateurs (les 50 ajoutés mardi sont perdus)

## 🎯 Cas d'usage

### Quand restaurer ?

1. **Erreur de données** : Vous avez supprimé des données par erreur
2. **Corruption** : Votre base est corrompue
3. **Test** : Vous voulez tester quelque chose et revenir en arrière après
4. **Migration** : Vous voulez copier une base sur un autre serveur

### Exemple concret

```
Situation : Base de données "ecommerce"

Jour 1 - 10h00 : Backup créé
  → Base contient : 100 produits, 50 commandes

Jour 1 - 14h00 : Erreur ! 
  → Un développeur exécute par erreur : DROP TABLE products;
  → Résultat : Tous les produits sont supprimés !

Jour 1 - 14h05 : Restauration
  → On restaure le backup de 10h00
  → Résultat : Les 100 produits reviennent !
  → ⚠️ Mais les commandes créées entre 10h et 14h sont perdues
```

## 🔍 Dans SafeBase

### Mode FAKE_DUMP (actuel)

Avec `FAKE_DUMP=1` (mode de test) :
- ✅ La restauration **simule** le processus
- ✅ Elle retourne un message de succès
- ⚠️ Mais **ne modifie pas vraiment** la base de données
- 🎯 Utile pour tester l'interface sans risquer de perdre des données

### Mode Réel (FAKE_DUMP=0)

Avec une vraie base de données :
- ✅ La restauration **exécute vraiment** les commandes SQL
- ✅ Votre base est **vraiment restaurée**
- ⚠️ **Attention** : Les données actuelles sont remplacées !

## 📝 Commandes SQL exécutées

### Pour MySQL
```bash
mysql -h localhost -P 3306 -u utilisateur -pmotdepasse nom_base < fichier_backup.sql
```

### Pour PostgreSQL
```bash
psql -h localhost -p 5432 -U utilisateur -d nom_base -f fichier_backup.sql
```

## ✅ Résumé

| Action | Ce que ça fait |
|--------|----------------|
| **Backup** | Crée un fichier `.sql` avec toutes les données |
| **Restauration** | Lit le fichier `.sql` et remet la base dans l'état du backup |
| **Résultat** | La base revient exactement comme elle était au moment du backup |

## 🎯 Pour votre projet

**Actuellement (mode FAKE_DUMP)** :
- La restauration simule le processus
- Parfait pour tester l'interface
- Aucun risque pour vos données

**En production (mode réel)** :
- La restauration modifie vraiment la base
- ⚠️ Faites attention à ce que vous restaurez !

---

**En résumé : La restauration = "Remettre la base comme elle était au moment du backup"** 🔄

