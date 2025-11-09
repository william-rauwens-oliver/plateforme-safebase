# 🎤 Guide de Présentation - Tester Toutes les Consignes en Frontend

**Guide complet pour présenter votre projet SafeBase à votre professeur en testant toutes les consignes via le frontend.**

---

## 🚀 Préparation (5 minutes avant)

### Checklist de démarrage

1. **Lancer le projet** :
```bash
./scripts/LANCER-PROJET.sh
```

2. **Vérifier que tout fonctionne** :
   - ✅ Backend : http://localhost:8080/health → `{"status":"ok"}`
   - ✅ Frontend : http://localhost:5173 → Interface visible
   - ✅ Indicateur API : 🟢 **API en ligne** (en haut à droite)

3. **Préparer des bases de données de test** :
   - Une base MySQL (ex: `test_mysql`)
   - Une base PostgreSQL (ex: `test_postgres`)

4. **Ouvrir le navigateur** :
   - Onglet 1 : http://localhost:5173 (Frontend)
   - Onglet 2 : Terminal pour vérifications API si besoin

---

## 📋 Plan de Présentation (15-20 minutes)

### Introduction (1 min)
> "Je vais vous présenter SafeBase, une plateforme de sauvegarde automatisée pour bases de données MySQL et PostgreSQL. Je vais tester toutes les consignes via l'interface frontend."

---

## 1️⃣ CONSIGNE 1 : Ajouter une connexion à une base de données

### 📝 Ce que vous dites
> "La première consigne est d'ajouter une connexion à une base de données. L'interface permet d'ajouter des bases MySQL et PostgreSQL."

### ✅ Démonstration (2 minutes)

#### Test 1.1 : Ajouter une base MySQL
1. **Montrer le formulaire** en haut de la page
2. **Remplir** :
   - Nom : `Base MySQL Production`
   - Moteur : Sélectionner `🐬 MySQL`
   - Hôte : `127.0.0.1` (ou `localhost`)
   - Port : `8889` (MAMP) ou `3306` (MySQL standard)
   - Utilisateur : `root`
   - Mot de passe : `root`
   - Base de données : `test_mysql` (une base qui existe)
3. **Cliquer** `✨ Ajouter la base`
4. **Montrer** :
   - ✅ Message vert : `✓ Base ajoutée`
   - ✅ La base apparaît dans la liste avec badge `🐬 MySQL`

#### Test 1.2 : Ajouter une base PostgreSQL
1. **Remplir** :
   - Nom : `Base PostgreSQL Production`
   - Moteur : Sélectionner `🐘 PostgreSQL`
   - Hôte : `localhost`
   - Port : `5432`
   - Utilisateur : `postgres`
   - Mot de passe : `postgres`
   - Base de données : `test_postgres` (une base qui existe)
2. **Cliquer** `✨ Ajouter la base`
3. **Montrer** :
   - ✅ Message vert : `✓ Base ajoutée`
   - ✅ La base apparaît dans la liste avec badge `🐘 Postgres`

#### Test 1.3 : Validation
1. **Essayer** d'ajouter avec un champ vide
2. **Montrer** : Le navigateur empêche la soumission (validation HTML5)

### 💬 Points à mentionner
- ✅ Support MySQL et PostgreSQL
- ✅ Validation des données (Zod côté API)
- ✅ Test de connexion avant enregistrement
- ✅ Interface intuitive avec formulaire clair

---

## 2️⃣ CONSIGNE 2 : Automatisation des sauvegardes régulières

### 📝 Ce que vous dites
> "La deuxième consigne est l'automatisation des sauvegardes régulières avec cron et les utilitaires système mysqldump/pg_dump."

### ✅ Démonstration (2 minutes)

#### Test 2.1 : Backup manuel d'une base
1. **Pointer** sur une base dans la liste
2. **Cliquer** sur `💾 Backup`
3. **Montrer** :
   - ✅ Message vert : `✓ Backup déclenché`
   - ✅ Le backup est créé (expliquer qu'il se fait en arrière-plan)

#### Test 2.2 : Backup de toutes les bases
1. **Aller** dans la section "⚙️ Réglages" (en haut)
2. **Cliquer** sur `💾 Backup All`
3. **Montrer** :
   - ✅ Message vert : `✓ Backups lancés pour toutes les bases`
   - ✅ Toutes les bases ont un nouveau backup

#### Test 2.3 : Vérifier les versions créées
1. **Cliquer** sur `📦 Versions` d'une base
2. **Montrer** :
   - ✅ La liste des backups s'affiche
   - ✅ Chaque backup a une date/heure
   - ✅ Les fichiers SQL sont créés avec mysqldump/pg_dump

### 💬 Points à mentionner
- ✅ Backups manuels disponibles
- ✅ Backups automatiques toutes les heures (cron)
- ✅ Utilisation de mysqldump pour MySQL
- ✅ Utilisation de pg_dump pour PostgreSQL
- ✅ Scheduler configuré dans Docker

---

## 3️⃣ CONSIGNE 3 : Gestion des versions

### 📝 Ce que vous dites
> "La troisième consigne est de conserver l'historique des versions avec options pour restaurer."

### ✅ Démonstration (3 minutes)

#### Test 3.1 : Voir l'historique
1. **Cliquer** sur `📦 Versions` d'une base
2. **Montrer** :
   - ✅ Modal s'ouvre avec la liste des versions
   - ✅ Chaque version affiche :
     - ID (code court)
     - Date et heure de création
     - Taille en octets
     - Indicateur `📌 épinglée` si applicable

#### Test 3.2 : Créer plusieurs versions
1. **Fermer** la modal
2. **Faire 3 backups** successifs (cliquer `💾 Backup` 3 fois)
3. **Rouvrir** les versions
4. **Montrer** :
   - ✅ 3 versions apparaissent
   - ✅ Triées par date (plus récent en premier)

#### Test 3.3 : Épingler une version (Pin)
1. **Cliquer** sur `📌 Épingler` sur une version
2. **Montrer** :
   - ✅ Message vert : `✓ Version épinglée`
   - ✅ L'indicateur `📌 épinglée` apparaît
   - ✅ Le bouton change en `📍 Retirer`

#### Test 3.4 : Télécharger une version
1. **Cliquer** sur le bouton `⬇️` d'une version
2. **Montrer** :
   - ✅ Le fichier `.sql` se télécharge
   - ✅ Le fichier est dans les téléchargements

#### Test 3.5 : Restaurer une version
1. **Cliquer** sur `🛠️ Restaurer` d'une version
2. **Confirmer** dans la popup
3. **Montrer** :
   - ✅ Message de succès
   - ✅ La base est restaurée à cette version

#### Test 3.6 : Politique de rétention
1. **Créer 11 backups** d'une base (cliquer `💾 Backup` 11 fois rapidement)
2. **Ouvrir** les versions
3. **Montrer** :
   - ✅ Maximum 10 versions conservées
   - ✅ Les versions épinglées ne sont **pas** supprimées

### 💬 Points à mentionner
- ✅ Historique complet des versions
- ✅ Pin/Unpin pour protéger des versions importantes
- ✅ Téléchargement des backups
- ✅ Restauration à une version précédente
- ✅ Politique de rétention (10 versions max, sauf épinglées)

---

## 4️⃣ CONSIGNE 4 : Surveillance et alertes

### 📝 Ce que vous dites
> "La quatrième consigne est de générer des alertes en cas de problème."

### ✅ Démonstration (2 minutes)

#### Test 4.1 : Indicateur de santé API
1. **Pointer** sur l'indicateur en haut à droite
2. **Montrer** :
   - ✅ 🟢 `API en ligne` (si tout fonctionne)
   - ✅ L'indicateur se met à jour automatiquement

#### Test 4.2 : Test d'erreur (optionnel)
1. **Arrêter** le backend (Ctrl+C dans le terminal)
2. **Recharger** la page frontend
3. **Montrer** :
   - ✅ 🔴 `API hors ligne`
   - ✅ Essayer d'ajouter une base
   - ✅ Message d'erreur : `✗ Erreur: ajout impossible`
4. **Relancer** le backend et recharger

#### Test 4.3 : Messages d'erreur
1. **Essayer** un backup avec une base qui n'existe plus
2. **Montrer** :
   - ✅ Message d'erreur approprié s'affiche
   - ✅ Toast rouge avec le message d'erreur

### 💬 Points à mentionner
- ✅ Indicateur de santé en temps réel
- ✅ Messages d'erreur clairs
- ✅ Alertes webhook en cas d'échec (configurable)
- ✅ Heartbeat du scheduler pour monitoring

---

## 5️⃣ CONSIGNE 5 : Interface utilisateur

### 📝 Ce que vous dites
> "La cinquième consigne est de proposer une interface simple pour gérer les sauvegardes et restaurations."

### ✅ Démonstration (3 minutes)

#### Test 5.1 : Affichage général
1. **Montrer** l'interface complète :
   - ✅ Header "SafeBase" avec logo
   - ✅ Formulaire d'ajout
   - ✅ Section réglages
   - ✅ Liste des bases
   - ✅ Design moderne et clair

#### Test 5.2 : Recherche
1. **Taper** dans le champ "Rechercher…"
2. **Montrer** :
   - ✅ La liste se filtre en temps réel
   - ✅ Seules les bases correspondantes apparaissent

#### Test 5.3 : Tri
1. **Cliquer** sur le menu "Trier par"
2. **Sélectionner** `Nom`
3. **Montrer** : Les bases sont triées par nom
4. **Sélectionner** `Moteur`
5. **Montrer** : Les bases sont triées par moteur

#### Test 5.4 : Thème clair/sombre
1. **Cliquer** sur `🌙 Sombre` ou `☀️ Clair`
2. **Montrer** :
   - ✅ L'interface change de thème immédiatement
   - ✅ Recharger la page (F5)
   - ✅ Le thème est conservé

#### Test 5.5 : Responsive Design
1. **Réduire** la largeur de la fenêtre
2. **Montrer** :
   - ✅ Le layout s'adapte (grid devient 1 colonne)
   - ✅ Les cartes restent lisibles
   - ✅ Les boutons restent accessibles

#### Test 5.6 : Copier DSN
1. **Cliquer** sur `🔗 Copier DSN` d'une base
2. **Ouvrir** un éditeur de texte
3. **Coller** (Ctrl+V / Cmd+V)
4. **Montrer** : Le DSN est collé (ex: `mysql://user:pass@localhost:3306/db`)

#### Test 5.7 : Messages de feedback
1. **Faire** différentes actions
2. **Montrer** :
   - ✅ Messages verts pour les succès
   - ✅ Messages rouges pour les erreurs
   - ✅ Les messages disparaissent après quelques secondes

### 💬 Points à mentionner
- ✅ Interface intuitive et moderne
- ✅ Recherche et tri fonctionnels
- ✅ Thème clair/sombre
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Feedback utilisateur clair (toasts)
- ✅ Actions accessibles (backup, restore, pin, etc.)

---

## 6️⃣ CONSIGNE 6 : Tests fonctionnels

### 📝 Ce que vous dites
> "La sixième consigne est d'écrire des tests fonctionnels pour s'assurer du bon fonctionnement."

### ✅ Démonstration (1 minute)

#### Test 6.1 : Tests backend
```bash
cd backend
npm test
```

**Montrer** :
- ✅ Les tests passent (3 tests)
- ✅ Aucune erreur

#### Test 6.2 : Tests frontend
```bash
cd frontend
npm test
```

**Montrer** :
- ✅ Les tests passent (4 tests)
- ✅ Aucune erreur

### 💬 Points à mentionner
- ✅ Tests unitaires backend (Vitest)
- ✅ Tests unitaires frontend (Vitest)
- ✅ Tests d'intégration
- ✅ 100% des tests passent

---

## 🎯 Scénario de Démonstration Rapide (5 minutes)

Si vous avez peu de temps, suivez ce scénario condensé :

1. **Ajouter** une base MySQL (30 sec)
2. **Ajouter** une base PostgreSQL (30 sec)
3. **Faire** 2 backups d'une base (30 sec)
4. **Ouvrir** les versions (30 sec)
5. **Épingler** une version (20 sec)
6. **Télécharger** une version (20 sec)
7. **Tester** la recherche (20 sec)
8. **Tester** le tri (20 sec)
9. **Changer** le thème (20 sec)
10. **Lancer** Backup All (30 sec)

**Total : ~5 minutes**

---

## 📊 Checklist de Présentation

### Avant la présentation
- [ ] Projet lancé (backend + frontend)
- [ ] Bases de données de test créées
- [ ] Navigateur ouvert sur http://localhost:5173
- [ ] Indicateur API : 🟢 en ligne

### Pendant la présentation
- [ ] Consigne 1 : Ajout de bases (MySQL + PostgreSQL)
- [ ] Consigne 2 : Backups manuels et automatiques
- [ ] Consigne 3 : Gestion des versions (pin, download, restore)
- [ ] Consigne 4 : Surveillance (indicateur, erreurs)
- [ ] Consigne 5 : Interface (recherche, tri, thème, responsive)
- [ ] Consigne 6 : Tests (backend + frontend)

### Points forts à mentionner
- ✅ **Complétude** : Toutes les consignes implémentées
- ✅ **Sécurité** : API Key, validation, chiffrement
- ✅ **Automatisation** : Scheduler avec cron
- ✅ **Interface** : Moderne, responsive, intuitive
- ✅ **Tests** : 100% des tests passent
- ✅ **Documentation** : Complète et détaillée

---

## 💡 Conseils pour la Présentation

### Parler clairement
- Expliquez ce que vous faites avant de le faire
- Mentionnez les consignes correspondantes
- Montrez les résultats visuels (messages, listes, etc.)

### Gérer le temps
- **15-20 minutes** : Démonstration complète
- **5-10 minutes** : Scénario rapide
- **5 minutes** : Questions/réponses

### Anticiper les questions
- **"Comment fonctionne le scheduler ?"** → Docker + cron toutes les heures
- **"Comment sont stockés les backups ?"** → Fichiers SQL dans `backups/`
- **"Comment fonctionne la sécurité ?"** → API Key, validation Zod, chiffrement
- **"Comment tester la restauration sans perdre de données ?"** → Utiliser des bases de test

---

## 🎉 Conclusion

### Ce que vous dites
> "SafeBase est une solution complète qui répond à toutes les consignes. L'interface frontend permet de gérer facilement les sauvegardes et restaurations, avec une automatisation complète via le scheduler."

### Points à rappeler
- ✅ Toutes les consignes implémentées
- ✅ Interface intuitive et moderne
- ✅ Automatisation complète
- ✅ Tests fonctionnels
- ✅ Documentation complète

---

**Bonne présentation ! 🚀**

