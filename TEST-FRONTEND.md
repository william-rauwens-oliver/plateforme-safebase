# 🖥️ Guide de Test Frontend - SafeBase

Guide pratique pour tester **toutes les fonctionnalités** depuis l'interface web.

---

## 🚀 Démarrage

1. **Ouvrir votre navigateur** (Chrome, Firefox, Safari, etc.)
2. **Aller sur** : http://localhost:5173
3. **Vérifier** que vous voyez l'interface SafeBase avec :
   - Header "SafeBase" avec logo SB
   - Indicateur de santé API (vert = en ligne, rouge = hors ligne)
   - Formulaire "➕ Ajouter une base de données"
   - Section "📊 Bases de données"

---

## 1️⃣ TEST : Ajout de base de données

### Étape 1 : Ouvrir le formulaire
- Le formulaire est déjà visible en haut de la page
- Section "➕ Ajouter une base de données"

### Étape 2 : Remplir le formulaire

**Pour MySQL :**
1. **Nom** : Taper `Ma Base MySQL`
2. **Moteur** : Sélectionner `🐬 MySQL` dans le menu déroulant
3. **Hôte** : Taper `localhost`
4. **Port** : Taper `3306`
5. **Utilisateur** : Taper votre utilisateur MySQL (ex: `root`)
6. **Mot de passe** : Taper votre mot de passe MySQL
7. **Nom de la base** : Taper le nom de votre base (ex: `test`)

**Pour PostgreSQL :**
1. **Nom** : Taper `Ma Base PostgreSQL`
2. **Moteur** : Sélectionner `🐘 PostgreSQL` dans le menu déroulant
3. **Hôte** : Taper `localhost`
4. **Port** : Taper `5432`
5. **Utilisateur** : Taper votre utilisateur PostgreSQL (ex: `postgres`)
6. **Mot de passe** : Taper votre mot de passe PostgreSQL
7. **Nom de la base** : Taper le nom de votre base (ex: `test`)

### Étape 3 : Ajouter la base
1. **Cliquer** sur le bouton `✨ Ajouter la base`
2. **Attendre** quelques secondes

### ✅ Résultat attendu
- ✅ Un message vert apparaît en bas à droite : `✓ Base ajoutée`
- ✅ La base apparaît dans la liste "📊 Bases de données"
- ✅ Vous voyez une carte avec :
  - Le nom de la base
  - Le badge `🐬 MySQL` ou `🐘 Postgres`
  - Les informations de connexion (utilisateur@hôte:port/base)
  - Les boutons : `🔗 Copier DSN`, `💾 Backup`, `📦 Versions`

### 🧪 Test de validation
1. **Essayer d'ajouter** une base avec un champ vide
2. **Cliquer** sur `✨ Ajouter la base`
3. **Vérifier** : Le navigateur empêche la soumission (validation HTML)

---

## 2️⃣ TEST : Backup manuel

### Étape 1 : Trouver une base
- Dans la section "📊 Bases de données"
- Repérer une base que vous venez d'ajouter

### Étape 2 : Lancer le backup
1. **Cliquer** sur le bouton `💾 Backup` de la carte de la base
2. **Attendre** quelques secondes (le bouton peut être désactivé pendant le traitement)

### ✅ Résultat attendu
- ✅ Un message vert apparaît : `✓ Backup déclenché`
- ✅ Le backup est créé en arrière-plan
- ✅ Vous pouvez vérifier en cliquant sur `📦 Versions` (voir test suivant)

### 🧪 Test : Backup de toutes les bases
1. **Aller** dans la section "⚙️ Réglages" (carte à droite du formulaire)
2. **Cliquer** sur le bouton `💾 Backup All`
3. **Vérifier** : Message `✓ Backups lancés pour toutes les bases`

---

## 3️⃣ TEST : Gestion des versions

### Étape 1 : Ouvrir la liste des versions
1. **Cliquer** sur le bouton `📦 Versions` d'une base
2. **Une fenêtre modale** s'ouvre

### Étape 2 : Vérifier l'affichage
Dans la modale, vous devriez voir :
- ✅ Le titre "Versions" avec le nom de la base
- ✅ Une liste des backups avec pour chaque version :
  - Un ID (code court)
  - La date et l'heure de création
  - La taille en octets
  - Un indicateur `📌 épinglée` si la version est épinglée
- ✅ Des boutons d'action pour chaque version

### Étape 3 : Tester le Pin (Épingler)
1. **Repérer** une version qui n'est pas épinglée
2. **Cliquer** sur le bouton `📌 Épingler`
3. **Attendre** quelques secondes

### ✅ Résultat attendu
- ✅ Message vert : `✓ Version épinglée`
- ✅ L'indicateur `📌 épinglée` apparaît à côté de la version
- ✅ Le bouton change en `📍 Retirer`

### Étape 4 : Tester le Unpin (Retirer l'épingle)
1. **Cliquer** sur `📍 Retirer` sur une version épinglée
2. **Vérifier** : Message `✓ Épingle retirée` et l'indicateur disparaît

### Étape 5 : Tester le Téléchargement
1. **Cliquer** sur le bouton `⬇️` d'une version
2. **Vérifier** : Le fichier SQL se télécharge dans votre dossier Téléchargements

### Étape 6 : Tester la Restauration
⚠️ **ATTENTION** : Ceci va restaurer la base de données !

1. **Cliquer** sur le bouton `🛠️ Restaurer` d'une version
2. **Confirmer** dans la popup du navigateur
3. **Attendre** quelques secondes

### ✅ Résultat attendu
- ✅ La restauration se fait en arrière-plan
- ✅ (Selon votre configuration, vous pouvez vérifier dans votre base de données)

### Étape 7 : Tester la Suppression
1. **S'assurer** qu'une version n'est **pas épinglée**
2. **Cliquer** sur le bouton `🗑️ Supprimer`
3. **Confirmer** dans la popup
4. **Vérifier** : Message `✓ Version supprimée` et la version disparaît de la liste

### Étape 8 : Fermer la modale
- **Cliquer** sur `✕ Fermer` en haut à droite
- Ou **cliquer** en dehors de la modale (sur le fond sombre)

---

## 4️⃣ TEST : Interface et fonctionnalités

### Test 4.1 : Indicateur de santé API
En haut à droite, vous voyez un indicateur :
- 🟢 **Vert** : `API en ligne` = L'API fonctionne
- 🔴 **Rouge** : `API hors ligne` = L'API ne répond pas
- ⚪ **Gris** : `Vérification...` = En cours de vérification

**Tester** :
1. **Cliquer** sur `Rafraîchir` à côté de l'indicateur
2. **Vérifier** : L'indicateur se met à jour

### Test 4.2 : Thème clair/sombre
1. **Cliquer** sur `🌙 Sombre` ou `☀️ Clair` en haut à droite
2. **Vérifier** : L'interface change de thème immédiatement
3. **Recharger** la page (F5)
4. **Vérifier** : Le thème choisi est conservé

### Test 4.3 : Recherche
1. **Ajouter** plusieurs bases avec des noms différents
2. **Taper** dans le champ "Rechercher…" en haut de la liste
3. **Vérifier** : La liste se filtre en temps réel
4. **Effacer** la recherche
5. **Vérifier** : Toutes les bases réapparaissent

### Test 4.4 : Tri
1. **Cliquer** sur le menu déroulant "Trier par"
2. **Sélectionner** `Nom` ou `Moteur`
3. **Vérifier** : La liste se réorganise selon le critère choisi

### Test 4.5 : Copier DSN
1. **Cliquer** sur `🔗 Copier DSN` d'une base
2. **Ouvrir** un éditeur de texte
3. **Coller** (Ctrl+V / Cmd+V)
4. **Vérifier** : Le DSN est collé (ex: `mysql://user:pass@localhost:3306/db`)

### Test 4.6 : Réglages API
1. **Aller** dans la section "⚙️ Réglages"
2. **Modifier** l'URL de l'API (si nécessaire)
3. **Ajouter** une API Key (si votre API en nécessite une)
4. **Vérifier** : Les changements sont sauvegardés automatiquement

---

## 5️⃣ TEST : Responsive Design

### Test 5.1 : Desktop
- **Vérifier** : Le layout en 2 colonnes (formulaire + réglages)
- **Vérifier** : Les cartes des bases sont en grille

### Test 5.2 : Tablette
1. **Réduire** la largeur de la fenêtre à ~800px
2. **Vérifier** : Le layout passe en 1 colonne
3. **Vérifier** : Les cartes restent lisibles

### Test 5.3 : Mobile
1. **Réduire** la largeur à ~400px (ou utiliser les outils développeur)
2. **Vérifier** : 
   - Le formulaire s'adapte
   - Les boutons restent accessibles
   - Le texte reste lisible
   - La modale des versions s'adapte

---

## 6️⃣ TEST : Gestion d'erreurs

### Test 6.1 : API hors ligne
1. **Arrêter** le backend (`Ctrl+C` dans le terminal)
2. **Recharger** la page frontend
3. **Vérifier** : L'indicateur passe en rouge `API hors ligne`
4. **Essayer** d'ajouter une base
5. **Vérifier** : Message d'erreur `✗ Erreur: ajout impossible`

### Test 6.2 : Erreur de connexion
1. **Ajouter** une base avec de **mauvais identifiants**
2. **Lancer** un backup
3. **Vérifier** : Message d'erreur `✗ Erreur lors du backup`

### Test 6.3 : Validation
1. **Essayer** d'ajouter une base avec un champ vide
2. **Vérifier** : Le navigateur empêche la soumission

---

## 📋 Checklist Complète Frontend

Utilisez cette checklist pour vérifier que tout fonctionne :

### Fonctionnalités Core
- [ ] Ajouter une base MySQL via le formulaire
- [ ] Ajouter une base PostgreSQL via le formulaire
- [ ] La base apparaît dans la liste après ajout
- [ ] Message de succès après ajout
- [ ] Backup manuel d'une base fonctionne
- [ ] Message de confirmation après backup
- [ ] Backup All fonctionne
- [ ] La modale des versions s'ouvre
- [ ] La liste des versions s'affiche correctement
- [ ] Pin d'une version fonctionne
- [ ] Unpin d'une version fonctionne
- [ ] Téléchargement d'une version fonctionne
- [ ] Restauration d'une version fonctionne (avec confirmation)
- [ ] Suppression d'une version fonctionne (non épinglée)

### Interface Utilisateur
- [ ] L'interface s'affiche correctement
- [ ] L'indicateur de santé API fonctionne
- [ ] Le thème clair/sombre fonctionne
- [ ] Le thème est conservé après rechargement
- [ ] La recherche fonctionne en temps réel
- [ ] Le tri fonctionne (Nom, Moteur)
- [ ] Copier DSN fonctionne
- [ ] Les toasts de notification apparaissent
- [ ] Les toasts disparaissent après quelques secondes

### Responsive
- [ ] Le layout s'adapte sur tablette
- [ ] Le layout s'adapte sur mobile
- [ ] Les boutons restent accessibles
- [ ] Le texte reste lisible

### Gestion d'erreurs
- [ ] Erreur affichée si API hors ligne
- [ ] Erreur affichée si backup échoue
- [ ] Validation des champs du formulaire

---

## 🎯 Scénario de Test Complet

Voici un scénario complet pour tester tout le frontend :

### Scénario : Gestion complète d'une base

1. **Ajouter une base**
   - Nom : `Base Test Complète`
   - Moteur : MySQL
   - Remplir tous les champs
   - Cliquer "Ajouter"
   - ✅ Vérifier : Base ajoutée

2. **Lancer 3 backups**
   - Cliquer "Backup" 3 fois avec quelques secondes d'intervalle
   - ✅ Vérifier : 3 messages de confirmation

3. **Gérer les versions**
   - Cliquer "Versions"
   - ✅ Vérifier : 3 versions dans la liste
   - Épingler la première version
   - ✅ Vérifier : Indicateur 📌 apparaît
   - Télécharger la deuxième version
   - ✅ Vérifier : Fichier téléchargé
   - Fermer la modale

4. **Tester la recherche**
   - Taper "Test" dans la recherche
   - ✅ Vérifier : Seule la base "Base Test Complète" apparaît

5. **Tester le tri**
   - Changer le tri par "Moteur"
   - ✅ Vérifier : Les bases sont triées

6. **Tester le thème**
   - Changer le thème
   - ✅ Vérifier : L'interface change

7. **Tester Backup All**
   - Cliquer "Backup All"
   - ✅ Vérifier : Message de confirmation

---

## 🐛 Problèmes Courants

### Le frontend ne se charge pas
- Vérifier que le frontend tourne : `cd frontend && npm run dev`
- Vérifier l'URL : http://localhost:5173
- Vider le cache du navigateur (Ctrl+Shift+R / Cmd+Shift+R)

### L'API n'est pas accessible
- Vérifier que le backend tourne : `cd backend && npm run dev`
- Vérifier l'URL dans les réglages : http://localhost:8080
- Vérifier l'indicateur de santé (doit être vert)

### Les backups ne fonctionnent pas
- Vérifier que les identifiants sont corrects
- Vérifier que la base de données existe
- Vérifier les logs du backend dans le terminal

### La modale ne s'ouvre pas
- Vérifier la console du navigateur (F12)
- Vérifier qu'il y a des versions pour cette base
- Essayer de recharger la page

---

## 💡 Astuces

1. **Ouvrir la console développeur** (F12) pour voir les erreurs éventuelles
2. **Vérifier l'onglet Network** pour voir les appels API
3. **Utiliser le mode responsive** du navigateur pour tester sur mobile
4. **Vider le localStorage** si vous voulez réinitialiser les réglages :
   - Console : `localStorage.clear()`

---

**✅ Une fois tous ces tests passés, votre frontend est conforme !**

