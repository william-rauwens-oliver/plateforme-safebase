# ✅ Test Frontend - Fonctionnalité par Fonctionnalité selon les Consignes

Guide complet pour tester **chaque fonctionnalité demandée dans les consignes** depuis le frontend.

---

## 📋 Rappel des Consignes

Selon le sujet, les fonctionnalités à tester sont :
1. ✅ Ajout de base de données
2. ✅ Automatisation des sauvegardes régulières
3. ✅ Gestion des versions
4. ✅ Surveillance et alertes
5. ✅ Interface utilisateur
6. ✅ Intégrations de tests

---

## 🚀 Préparation

1. **Ouvrir** http://localhost:5173
2. **Vérifier** que l'indicateur API est **vert** (🟢 API en ligne)
3. Si rouge, vérifier que le backend tourne : `cd backend && npm run dev`

---

## 1️⃣ TEST : Ajout de base de données

### 📝 Consigne
> "Ajouter une connexion à une base de données"

### ✅ Test à faire

#### Test 1.1 : Ajouter une base MySQL
1. **Remplir le formulaire** :
   - Nom : `Base MySQL Test`
   - Moteur : Sélectionner `🐬 MySQL`
   - Hôte : `localhost`
   - Port : `3306`
   - Utilisateur : `root` (ou votre utilisateur)
   - Mot de passe : `root` (ou votre mot de passe)
   - Base de données : `test` (ou une base qui existe)

2. **Cliquer** sur `✨ Ajouter la base`

3. **Vérifier** :
   - [ ] Message vert : `✓ Base ajoutée`
   - [ ] La base apparaît dans la liste "📊 Bases de données"
   - [ ] La carte affiche le nom, le badge MySQL, et les informations

#### Test 1.2 : Ajouter une base PostgreSQL
1. **Remplir le formulaire** :
   - Nom : `Base PostgreSQL Test`
   - Moteur : Sélectionner `🐘 PostgreSQL`
   - Hôte : `localhost`
   - Port : `5432`
   - Utilisateur : `postgres` (ou votre utilisateur)
   - Mot de passe : `postgres` (ou votre mot de passe)
   - Base de données : `test` (ou une base qui existe)

2. **Cliquer** sur `✨ Ajouter la base`

3. **Vérifier** :
   - [ ] Message vert : `✓ Base ajoutée`
   - [ ] La base apparaît dans la liste
   - [ ] Le badge affiche `🐘 Postgres`

#### Test 1.3 : Validation du formulaire
1. **Essayer** d'ajouter une base avec un champ vide
2. **Vérifier** : Le navigateur empêche la soumission

### ✅ Résultat attendu
- [x] On peut ajouter des bases MySQL
- [x] On peut ajouter des bases PostgreSQL
- [x] La validation fonctionne
- [x] Les bases apparaissent dans la liste

---

## 2️⃣ TEST : Automatisation des sauvegardes régulières

### 📝 Consigne
> "Planifier et effectuer des sauvegardes périodiques des bases de données"

### ✅ Test à faire

#### Test 2.1 : Backup manuel d'une base
1. **Trouver** une base dans la liste
2. **Cliquer** sur le bouton `💾 Backup`
3. **Attendre** quelques secondes

4. **Vérifier** :
   - [ ] Message vert : `✓ Backup déclenché`
   - [ ] Le backup est créé (voir test 3.1 pour vérifier)

#### Test 2.2 : Backup de toutes les bases
1. **Aller** dans la section "⚙️ Réglages"
2. **Cliquer** sur `💾 Backup All`
3. **Attendre** quelques secondes

4. **Vérifier** :
   - [ ] Message vert : `✓ Backups lancés pour toutes les bases`
   - [ ] Toutes les bases ont un nouveau backup (voir test 3.1)

#### Test 2.3 : Vérifier le scheduler (cron)
> Note : Le scheduler fonctionne automatiquement toutes les heures avec Docker

**Sans Docker** :
- Le scheduler n'est pas actif en local
- C'est normal, il fonctionne dans Docker

**Avec Docker** :
```bash
# Vérifier les logs du scheduler
docker logs safebase-scheduler

# Vérifier le crontab
docker exec safebase-scheduler cat /etc/crontabs/root
```

### ✅ Résultat attendu
- [x] Backup manuel fonctionne
- [x] Backup All fonctionne
- [x] Le scheduler est configuré (avec Docker)

---

## 3️⃣ TEST : Gestion des versions

### 📝 Consigne
> "Conserver l'historique des différentes versions sauvegardées, avec des options pour choisir quelle version restaurer"

### ✅ Test à faire

#### Test 3.1 : Voir l'historique des versions
1. **Cliquer** sur `📦 Versions` d'une base
2. **Vérifier** :
   - [ ] La modale s'ouvre
   - [ ] Le titre affiche "Versions" et le nom de la base
   - [ ] La liste des backups s'affiche
   - [ ] Chaque version montre :
     - Un ID (code court)
     - La date et l'heure de création
     - La taille en octets
     - Un indicateur `📌 épinglée` si applicable

#### Test 3.2 : Créer plusieurs versions
1. **Faire 3 backups** d'une même base (cliquer `💾 Backup` 3 fois)
2. **Ouvrir** les versions
3. **Vérifier** :
   - [ ] 3 versions apparaissent dans la liste
   - [ ] Elles sont triées par date (plus récent en premier)

#### Test 3.3 : Épingler une version (Pin)
1. **Ouvrir** les versions d'une base
2. **Repérer** une version qui n'est pas épinglée
3. **Cliquer** sur `📌 Épingler`
4. **Vérifier** :
   - [ ] Message vert : `✓ Version épinglée`
   - [ ] L'indicateur `📌 épinglée` apparaît
   - [ ] Le bouton change en `📍 Retirer`

#### Test 3.4 : Retirer l'épingle (Unpin)
1. **Cliquer** sur `📍 Retirer` sur une version épinglée
2. **Vérifier** :
   - [ ] Message vert : `✓ Épingle retirée`
   - [ ] L'indicateur `📌 épinglée` disparaît
   - [ ] Le bouton redevient `📌 Épingler`

#### Test 3.5 : Télécharger une version
1. **Cliquer** sur le bouton `⬇️` d'une version
2. **Vérifier** :
   - [ ] Le fichier `.sql` se télécharge
   - [ ] Le fichier est dans votre dossier Téléchargements
   - [ ] Le fichier contient du SQL (ouvrir avec un éditeur de texte)

#### Test 3.6 : Restaurer une version
1. **Ouvrir** les versions d'une base
2. **Cliquer** sur `🛠️ Restaurer` d'une version
3. **Confirmer** dans la popup du navigateur
4. **Vérifier** :
   - [ ] La restauration se fait (message de succès)
   - [ ] ⚠️ En mode FAKE_DUMP, c'est simulé (pas de vraie restauration)

#### Test 3.7 : Supprimer une version
1. **S'assurer** qu'une version n'est **pas épinglée**
2. **Cliquer** sur `🗑️ Supprimer`
3. **Confirmer** dans la popup
4. **Vérifier** :
   - [ ] Message vert : `✓ Version supprimée`
   - [ ] La version disparaît de la liste

#### Test 3.8 : Politique de rétention
1. **Créer plus de 10 backups** d'une base (cliquer `💾 Backup` 11 fois)
2. **Ouvrir** les versions
3. **Vérifier** :
   - [ ] Maximum 10 versions sont conservées (les plus anciennes sont supprimées)
   - [ ] Les versions épinglées ne sont **pas** supprimées

### ✅ Résultat attendu
- [x] L'historique des versions est visible
- [x] On peut épingler/désépingler des versions
- [x] On peut télécharger une version
- [x] On peut restaurer une version
- [x] On peut supprimer une version (non épinglée)
- [x] La politique de rétention fonctionne (10 versions max)

---

## 4️⃣ TEST : Surveillance et alertes

### 📝 Consigne
> "Générer des alertes en cas de problème lors des processus de sauvegarde ou de restauration"

### ✅ Test à faire

#### Test 4.1 : Indicateur de santé API
1. **Regarder** l'indicateur en haut à droite
2. **Vérifier** :
   - [ ] Si l'API fonctionne : 🟢 `API en ligne`
   - [ ] Si l'API ne fonctionne pas : 🔴 `API hors ligne`

#### Test 4.2 : Rafraîchir l'indicateur
1. **Cliquer** sur le bouton `Rafraîchir` à côté de l'indicateur
2. **Vérifier** : L'indicateur se met à jour

#### Test 4.3 : Test d'erreur (API hors ligne)
1. **Arrêter** le backend (Ctrl+C dans le terminal)
2. **Recharger** la page frontend
3. **Vérifier** :
   - [ ] L'indicateur passe en 🔴 `API hors ligne`
   - [ ] Essayer d'ajouter une base
   - [ ] Message d'erreur : `✗ Erreur: ajout impossible`

#### Test 4.4 : Messages d'erreur
1. **Essayer** un backup avec une base qui n'existe pas vraiment
2. **Vérifier** : Message d'erreur approprié s'affiche

#### Test 4.5 : Heartbeat du scheduler
> Note : Le heartbeat est géré automatiquement par le scheduler

**Avec Docker** :
```bash
# Vérifier le heartbeat
curl http://localhost:8080/scheduler/heartbeat | jq .
```

**Résultat attendu** :
```json
{
  "lastHeartbeat": "2025-11-09T..."
}
```

### ✅ Résultat attendu
- [x] L'indicateur de santé fonctionne
- [x] Les erreurs sont affichées clairement
- [x] Le heartbeat est actif (avec Docker)

---

## 5️⃣ TEST : Interface utilisateur

### 📝 Consigne
> "Proposer une interface simple pour permettre aux utilisateurs de gérer facilement les processus de sauvegarde et de restauration"

### ✅ Test à faire

#### Test 5.1 : Affichage général
1. **Vérifier** que l'interface s'affiche correctement :
   - [ ] Header "SafeBase" avec logo SB
   - [ ] Formulaire d'ajout visible
   - [ ] Section réglages visible
   - [ ] Liste des bases visible
   - [ ] Design moderne et clair

#### Test 5.2 : Recherche
1. **Ajouter** plusieurs bases avec des noms différents
2. **Taper** dans le champ "Rechercher…"
3. **Vérifier** :
   - [ ] La liste se filtre en temps réel
   - [ ] Seules les bases correspondantes apparaissent
   - [ ] Effacer la recherche fait réapparaître toutes les bases

#### Test 5.3 : Tri
1. **Cliquer** sur le menu déroulant "Trier par"
2. **Sélectionner** `Nom`
3. **Vérifier** : Les bases sont triées par nom (A-Z)
4. **Sélectionner** `Moteur`
5. **Vérifier** : Les bases sont triées par moteur (MySQL puis PostgreSQL)

#### Test 5.4 : Thème clair/sombre
1. **Cliquer** sur `🌙 Sombre` ou `☀️ Clair`
2. **Vérifier** :
   - [ ] L'interface change de thème immédiatement
   - [ ] Recharger la page (F5)
   - [ ] Le thème choisi est conservé

#### Test 5.5 : Responsive Design
1. **Réduire** la largeur de la fenêtre à ~800px
2. **Vérifier** :
   - [ ] Le layout passe en 1 colonne
   - [ ] Les cartes restent lisibles
3. **Réduire** à ~400px (mobile)
4. **Vérifier** :
   - [ ] Le layout s'adapte
   - [ ] Les boutons restent accessibles
   - [ ] Le texte reste lisible

#### Test 5.6 : Copier DSN
1. **Cliquer** sur `🔗 Copier DSN` d'une base
2. **Ouvrir** un éditeur de texte
3. **Coller** (Ctrl+V / Cmd+V)
4. **Vérifier** : Le DSN est collé (ex: `mysql://user:pass@localhost:3306/db`)

#### Test 5.7 : Messages de feedback (Toasts)
1. **Faire** différentes actions (ajouter, backup, etc.)
2. **Vérifier** :
   - [ ] Les messages verts apparaissent pour les succès
   - [ ] Les messages rouges apparaissent pour les erreurs
   - [ ] Les messages disparaissent après 3-4 secondes

### ✅ Résultat attendu
- [x] L'interface est complète et fonctionnelle
- [x] La recherche fonctionne
- [x] Le tri fonctionne
- [x] Le thème fonctionne
- [x] Le design est responsive
- [x] Les actions sont accessibles
- [x] Les feedbacks utilisateur fonctionnent

---

## 6️⃣ TEST : Intégrations de tests

### 📝 Consigne
> "Écrire des tests fonctionnels permettant de s'assurer du bon fonctionnement de l'API"

### ✅ Test à faire

#### Test 6.1 : Tests unitaires backend
```bash
cd backend
npm test
```

**Vérifier** :
- [ ] Les tests passent (3 tests)
- [ ] Aucune erreur

#### Test 6.2 : Tests unitaires frontend
```bash
cd frontend
npm test
```

**Vérifier** :
- [ ] Les tests passent (4 tests)
- [ ] Aucune erreur

### ✅ Résultat attendu
- [x] Tests backend passent
- [x] Tests frontend passent

---

## 📊 Checklist Complète

### Fonctionnalités Core
- [ ] Ajout de base MySQL
- [ ] Ajout de base PostgreSQL
- [ ] Validation du formulaire
- [ ] Backup manuel
- [ ] Backup All
- [ ] Historique des versions
- [ ] Pin/Unpin
- [ ] Téléchargement
- [ ] Restauration
- [ ] Suppression de version
- [ ] Politique de rétention

### Interface Utilisateur
- [ ] Affichage correct
- [ ] Recherche fonctionne
- [ ] Tri fonctionne
- [ ] Thème clair/sombre
- [ ] Responsive design
- [ ] Copier DSN
- [ ] Messages de feedback

### Surveillance
- [ ] Indicateur de santé API
- [ ] Messages d'erreur
- [ ] Heartbeat (avec Docker)

### Tests
- [ ] Tests backend passent
- [ ] Tests frontend passent

---

## 🎯 Scénario de Test Complet (15 minutes)

Pour tester tout en une fois :

1. **Ajouter** une base MySQL
2. **Ajouter** une base PostgreSQL
3. **Faire** 3 backups de chaque base
4. **Ouvrir** les versions d'une base
5. **Épingler** une version
6. **Télécharger** une version
7. **Restaurer** une version
8. **Tester** la recherche
9. **Tester** le tri
10. **Changer** le thème
11. **Lancer** Backup All
12. **Vérifier** la politique de rétention (créer 11 backups)

---

## ✅ Résultat Final

Si tous les tests passent, votre frontend est **100% conforme** aux consignes ! 🎉

---

**Temps estimé pour tous les tests : 15-20 minutes**

