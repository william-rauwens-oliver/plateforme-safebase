# ⚡ Test Frontend Rapide - SafeBase

Guide ultra-simple pour tester rapidement toutes les fonctionnalités depuis le navigateur.

---

## 🎯 Test Express (5 minutes)

### 1. Ouvrir l'interface
👉 **Aller sur** : http://localhost:5173

### 2. Ajouter une base
1. Remplir le formulaire en haut
2. Cliquer `✨ Ajouter la base`
3. ✅ Vérifier : Message vert + base dans la liste

### 3. Faire un backup
1. Cliquer `💾 Backup` sur une base
2. ✅ Vérifier : Message `✓ Backup déclenché`

### 4. Voir les versions
1. Cliquer `📦 Versions` sur une base
2. ✅ Vérifier : Fenêtre avec la liste des backups

### 5. Tester les actions
Dans la fenêtre des versions :
- Cliquer `📌 Épingler` → ✅ Message de confirmation
- Cliquer `⬇️` → ✅ Fichier téléchargé
- Cliquer `🛠️ Restaurer` → ✅ Confirmer → Message de succès

---

## 📝 Test Complet (15 minutes)

### ✅ Checklist Visuelle

#### Page d'accueil
- [ ] Header "SafeBase" visible
- [ ] Indicateur API (vert = OK, rouge = KO)
- [ ] Formulaire d'ajout visible
- [ ] Section "Réglages" visible
- [ ] Liste des bases (vide ou avec des bases)

#### Ajout de base
- [ ] Formulaire avec tous les champs
- [ ] Menu déroulant MySQL/PostgreSQL
- [ ] Bouton "Ajouter la base"
- [ ] Message de succès après ajout
- [ ] Base apparaît dans la liste

#### Carte d'une base
- [ ] Nom de la base
- [ ] Badge MySQL/Postgres
- [ ] Informations de connexion
- [ ] Bouton "Copier DSN"
- [ ] Bouton "Backup"
- [ ] Bouton "Versions"

#### Modale des versions
- [ ] Liste des backups
- [ ] Date et taille pour chaque backup
- [ ] Indicateur "📌 épinglée" si applicable
- [ ] Boutons : ⬇️, 📌, 🛠️, 🗑️

#### Fonctionnalités
- [ ] Recherche fonctionne
- [ ] Tri fonctionne
- [ ] Thème clair/sombre fonctionne
- [ ] Backup All fonctionne

---

## 🖱️ Actions à Tester

### Sur une base de données

| Action | Bouton | Résultat attendu |
|--------|--------|------------------|
| Copier DSN | `🔗 Copier DSN` | DSN dans presse-papier |
| Backup | `💾 Backup` | Message `✓ Backup déclenché` |
| Voir versions | `📦 Versions` | Modale s'ouvre |

### Dans la modale des versions

| Action | Bouton | Résultat attendu |
|--------|--------|------------------|
| Télécharger | `⬇️` | Fichier .sql téléchargé |
| Épingler | `📌 Épingler` | Message `✓ Version épinglée` |
| Retirer épingle | `📍 Retirer` | Message `✓ Épingle retirée` |
| Restaurer | `🛠️ Restaurer` | Confirmation → Succès |
| Supprimer | `🗑️ Supprimer` | Confirmation → Version supprimée |

### Dans les réglages

| Action | Bouton | Résultat attendu |
|--------|--------|------------------|
| Recharger | `↻ Recharger` | Liste mise à jour |
| Backup All | `💾 Backup All` | Message `✓ Backups lancés` |

---

## 🎨 Test Visuel

### Couleurs et thèmes
- [ ] Thème sombre par défaut
- [ ] Thème clair fonctionne
- [ ] Changement instantané
- [ ] Préférence sauvegardée

### Responsive
- [ ] Desktop : 2 colonnes (formulaire + réglages)
- [ ] Tablette : 1 colonne
- [ ] Mobile : Layout adapté

### Messages
- [ ] Messages verts pour succès
- [ ] Messages rouges pour erreurs
- [ ] Messages disparaissent après 3-4 secondes

---

## 🚨 Test d'erreurs

### API hors ligne
1. Arrêter le backend
2. Recharger la page
3. ✅ Indicateur rouge "API hors ligne"
4. Essayer d'ajouter une base
5. ✅ Message d'erreur

### Validation
1. Laisser un champ vide
2. Cliquer "Ajouter"
3. ✅ Le navigateur empêche la soumission

---

## 📊 Résumé des Tests

### Fonctionnalités Core ✅
- [x] Ajout de base (MySQL et PostgreSQL)
- [x] Backup manuel
- [x] Backup All
- [x] Liste des versions
- [x] Pin/Unpin
- [x] Téléchargement
- [x] Restauration
- [x] Suppression

### Interface ✅
- [x] Affichage correct
- [x] Recherche
- [x] Tri
- [x] Thème
- [x] Responsive
- [x] Messages de feedback

### Gestion d'erreurs ✅
- [x] API hors ligne
- [x] Validation des champs
- [x] Messages d'erreur clairs

---

## 🎬 Scénario de Démo

**Pour une présentation, suivez cet ordre :**

1. **Ouvrir** http://localhost:5173
2. **Montrer** l'interface (header, formulaire, liste)
3. **Ajouter** une base MySQL (remplir le formulaire)
4. **Montrer** la base dans la liste
5. **Lancer** un backup
6. **Ouvrir** les versions
7. **Épingler** une version
8. **Télécharger** une version
9. **Tester** la recherche
10. **Changer** le thème
11. **Lancer** Backup All

**Temps total : ~3-4 minutes**

---

**✅ Si tous ces tests passent, votre frontend est parfaitement fonctionnel !**

