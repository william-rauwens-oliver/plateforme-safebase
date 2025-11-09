# 🎓 Tutoriel Soutenance - Test Frontend SafeBase

Guide **ultra-détaillé** étape par étape pour tester le frontend devant votre professeur.

---

## 🚀 AVANT DE COMMENCER

### Étape 0 : Vérifier que tout fonctionne

1. **Ouvrir un terminal**
2. **Aller dans le dossier backend** :
   ```bash
   cd /Applications/MAMP/htdocs/plateforme-safebase/backend
   ```
3. **Vérifier que le backend tourne** :
   - Si vous voyez des logs, c'est bon ✅
   - Sinon, lancer : `npm run dev`

4. **Ouvrir un autre terminal**
5. **Aller dans le dossier frontend** :
   ```bash
   cd /Applications/MAMP/htdocs/plateforme-safebase/frontend
   ```
6. **Vérifier que le frontend tourne** :
   - Si vous voyez des logs, c'est bon ✅
   - Sinon, lancer : `npm run dev`

7. **Ouvrir votre navigateur** (Chrome, Firefox, Safari)
8. **Aller sur** : http://localhost:5173
9. **Vérifier** : Vous voyez l'interface SafeBase avec le header noir/blanc

---

## 📋 DÉMONSTRATION COMPLÈTE (15 minutes)

### 🎯 Ce que vous allez montrer

1. ✅ Ajouter une base de données MySQL
2. ✅ Ajouter une base de données PostgreSQL
3. ✅ Faire un backup
4. ✅ Voir les versions
5. ✅ Épingler une version
6. ✅ Télécharger une version
7. ✅ Restaurer une version
8. ✅ Tester la recherche
9. ✅ Tester le tri
10. ✅ Changer le thème
11. ✅ Backup All

---

## 📝 ÉTAPE PAR ÉTAPE

### ÉTAPE 1 : Présenter l'interface (30 secondes)

**Ce que vous dites** :
> "Voici l'interface SafeBase. C'est une plateforme de gestion de sauvegarde de bases de données MySQL et PostgreSQL. L'interface est épurée, en noir et blanc, avec support du thème clair et sombre."

**Ce que vous montrez** :
1. **Pointer** le header "SafeBase"
2. **Montrer** l'indicateur "API en ligne" (doit être vert)
3. **Expliquer** : "L'indicateur montre que l'API backend fonctionne correctement"
4. **Montrer** le formulaire "Ajouter une base de données"
5. **Montrer** la section "Réglages"
6. **Montrer** la section "Bases de données" (probablement vide)

**Vérification** :
- [ ] L'interface s'affiche correctement
- [ ] L'indicateur API est vert
- [ ] Le design est épuré (noir et blanc)

---

### ÉTAPE 2 : Ajouter une base MySQL (2 minutes)

**Ce que vous dites** :
> "Je vais maintenant ajouter une base de données MySQL pour démontrer le fonctionnement."

**Actions à faire** :

1. **Cliquer** dans le champ "Nom"
2. **Taper** : `Base MySQL Demo`
3. **Cliquer** sur le menu déroulant "Moteur"
4. **Sélectionner** : `MySQL`
5. **Cliquer** dans le champ "Hôte"
6. **Taper** : `localhost`
7. **Cliquer** dans le champ "Port"
8. **Taper** : `3306`
9. **Cliquer** dans le champ "Utilisateur"
10. **Taper** : `root` (ou votre utilisateur MySQL)
11. **Cliquer** dans le champ "Mot de passe"
12. **Taper** : `root` (ou votre mot de passe MySQL)
13. **Cliquer** dans le champ "Nom de la base de données"
14. **Taper** : `test` (ou une base qui existe)
15. **Cliquer** sur le bouton `Ajouter la base`

**Ce que vous dites pendant** :
> "Je remplis le formulaire avec les informations de connexion à une base MySQL. Le formulaire valide les champs obligatoires."

**Résultat attendu** :
- ✅ Un message apparaît en bas à droite : "Base ajoutée"
- ✅ La base apparaît dans la liste "Bases de données"
- ✅ Vous voyez une carte avec le nom "Base MySQL Demo" et le badge "MySQL"

**Ce que vous dites après** :
> "Parfait ! La base a été ajoutée avec succès. Elle apparaît maintenant dans la liste."

**Vérification** :
- [ ] Message "Base ajoutée" visible
- [ ] La base apparaît dans la liste
- [ ] La carte affiche les bonnes informations

---

### ÉTAPE 3 : Ajouter une base PostgreSQL (1 minute)

**Ce que vous dites** :
> "Je vais maintenant ajouter une base PostgreSQL pour montrer que le système supporte les deux types de bases de données."

**Actions à faire** :

1. **Cliquer** dans le champ "Nom"
2. **Taper** : `Base PostgreSQL Demo`
3. **Cliquer** sur le menu déroulant "Moteur"
4. **Sélectionner** : `PostgreSQL`
5. **Cliquer** dans le champ "Hôte"
6. **Taper** : `localhost`
7. **Cliquer** dans le champ "Port"
8. **Taper** : `5432`
9. **Cliquer** dans le champ "Utilisateur"
10. **Taper** : `postgres` (ou votre utilisateur PostgreSQL)
11. **Cliquer** dans le champ "Mot de passe"
12. **Taper** : `postgres` (ou votre mot de passe PostgreSQL)
13. **Cliquer** dans le champ "Nom de la base de données"
14. **Taper** : `test` (ou une base qui existe)
15. **Cliquer** sur le bouton `Ajouter la base`

**Résultat attendu** :
- ✅ Message "Base ajoutée"
- ✅ Deux bases dans la liste (MySQL et PostgreSQL)

**Ce que vous dites après** :
> "Excellent ! J'ai maintenant deux bases configurées : une MySQL et une PostgreSQL. Le système supporte les deux moteurs de bases de données."

**Vérification** :
- [ ] Deux bases dans la liste
- [ ] Une avec badge "MySQL", une avec badge "Postgres"

---

### ÉTAPE 4 : Faire un backup (1 minute)

**Ce que vous dites** :
> "Maintenant, je vais démontrer la fonctionnalité de backup. Je vais créer une sauvegarde de la base MySQL."

**Actions à faire** :

1. **Trouver** la carte "Base MySQL Demo" dans la liste
2. **Cliquer** sur le bouton `Backup` (bouton noir avec texte blanc)
3. **Attendre** 2-3 secondes

**Ce que vous dites pendant** :
> "Le système va créer un fichier de sauvegarde SQL de la base de données. C'est fait en arrière-plan."

**Résultat attendu** :
- ✅ Message "Backup déclenché" en bas à droite
- ✅ Le backup est créé (vous ne le voyez pas encore, mais il est là)

**Ce que vous dites après** :
> "Le backup a été créé avec succès. Le système a généré un fichier SQL contenant toutes les données de la base."

**Vérification** :
- [ ] Message "Backup déclenché" visible
- [ ] Pas d'erreur

---

### ÉTAPE 5 : Voir les versions (1 minute)

**Ce que vous dites** :
> "Je vais maintenant ouvrir la liste des versions de backup pour voir l'historique des sauvegardes."

**Actions à faire** :

1. **Trouver** la carte "Base MySQL Demo"
2. **Cliquer** sur le bouton `Versions`
3. **Une fenêtre modale s'ouvre**

**Ce que vous dites pendant** :
> "Cette modale affiche toutes les versions de backup créées pour cette base. Chaque version contient un ID unique, la date de création, et la taille du fichier."

**Résultat attendu** :
- ✅ La modale s'ouvre
- ✅ Vous voyez au moins une version dans la liste
- ✅ Chaque version affiche :
  - Un ID (code court)
  - La date et l'heure
  - La taille en octets

**Ce que vous dites après** :
> "Voici l'historique des sauvegardes. On peut voir qu'une version a été créée. Le système conserve l'historique de toutes les sauvegardes."

**Vérification** :
- [ ] La modale s'ouvre
- [ ] Au moins une version visible
- [ ] Les informations sont affichées correctement

---

### ÉTAPE 6 : Épingler une version (30 secondes)

**Ce que vous dites** :
> "Je vais maintenant épingler cette version pour la protéger. Les versions épinglées ne sont pas supprimées par la politique de rétention automatique."

**Actions à faire** :

1. **Dans la modale des versions**
2. **Repérer** le bouton `Épingler` sur la première version
3. **Cliquer** sur `Épingler`
4. **Attendre** 1 seconde

**Résultat attendu** :
- ✅ Message "Version épinglée"
- ✅ Le texte "Épinglée" apparaît à côté de la version
- ✅ Le bouton change en "Retirer"

**Ce que vous dites après** :
> "Parfait ! La version est maintenant épinglée. Elle ne sera pas supprimée automatiquement, même si on dépasse la limite de 10 versions par base."

**Vérification** :
- [ ] Message "Version épinglée"
- [ ] Indicateur "Épinglée" visible
- [ ] Bouton changé en "Retirer"

---

### ÉTAPE 7 : Faire un deuxième backup (30 secondes)

**Ce que vous dites** :
> "Je vais créer un deuxième backup pour avoir plusieurs versions à gérer."

**Actions à faire** :

1. **Fermer** la modale (cliquer sur "Fermer" ou en dehors)
2. **Cliquer** à nouveau sur `Backup` de "Base MySQL Demo"
3. **Attendre** 2 secondes

**Résultat attendu** :
- ✅ Message "Backup déclenché"
- ✅ Nouveau backup créé

**Ce que vous dites après** :
> "Un deuxième backup a été créé. Maintenant nous avons deux versions."

---

### ÉTAPE 8 : Télécharger une version (30 secondes)

**Ce que vous dites** :
> "Je vais maintenant télécharger une version de backup. Cela permet de récupérer le fichier SQL localement."

**Actions à faire** :

1. **Cliquer** sur `Versions` de "Base MySQL Demo"
2. **Dans la modale**, repérer le bouton `Télécharger` sur une version
3. **Cliquer** sur `Télécharger`

**Résultat attendu** :
- ✅ Le fichier SQL se télécharge dans votre dossier Téléchargements
- ✅ Le nom du fichier contient le nom de la base et la date

**Ce que vous dites après** :
> "Le fichier SQL a été téléchargé. On peut l'utiliser pour restaurer la base sur un autre serveur ou le conserver en archive."

**Vérification** :
- [ ] Le téléchargement démarre
- [ ] Le fichier apparaît dans les téléchargements

---

### ÉTAPE 9 : Restaurer une version (1 minute)

**Ce que vous dites** :
> "Maintenant, je vais démontrer la fonctionnalité de restauration. Cela permet de remettre la base dans l'état d'un backup précédent."

**Actions à faire** :

1. **Dans la modale des versions**
2. **Repérer** le bouton `Restaurer` (bouton noir)
3. **Cliquer** sur `Restaurer`
4. **Une popup de confirmation apparaît**
5. **Cliquer** sur "OK" ou "Confirmer" dans la popup
6. **Attendre** 2 secondes

**Ce que vous dites pendant** :
> "Le système demande confirmation car la restauration remplace les données actuelles de la base."

**Résultat attendu** :
- ✅ La restauration se fait (en mode FAKE_DUMP, c'est simulé)
- ✅ Pas d'erreur

**Ce que vous dites après** :
> "La restauration a été effectuée. La base de données a été remise dans l'état du backup sélectionné."

**Vérification** :
- [ ] Popup de confirmation
- [ ] Restauration réussie (pas d'erreur)

---

### ÉTAPE 10 : Tester la recherche (30 secondes)

**Ce que vous dites** :
> "L'interface propose une fonctionnalité de recherche pour filtrer rapidement les bases de données."

**Actions à faire** :

1. **Fermer** la modale des versions
2. **Trouver** le champ "Rechercher…" en haut de la liste des bases
3. **Cliquer** dans le champ
4. **Taper** : `MySQL`
5. **Observer** : La liste se filtre automatiquement

**Résultat attendu** :
- ✅ Seule la base MySQL apparaît
- ✅ La base PostgreSQL disparaît de la liste
- ✅ Le compteur affiche "(1/2)" ou similaire

**Ce que vous dites après** :
> "La recherche fonctionne en temps réel. On peut filtrer par nom, moteur, hôte, ou nom de base."

**Actions supplémentaires** :

6. **Effacer** le texte dans le champ recherche
7. **Observer** : Les deux bases réapparaissent

**Vérification** :
- [ ] La recherche filtre correctement
- [ ] Effacer la recherche fait réapparaître toutes les bases

---

### ÉTAPE 11 : Tester le tri (30 secondes)

**Ce que vous dites** :
> "On peut aussi trier les bases par différents critères."

**Actions à faire** :

1. **Trouver** le menu déroulant "Trier par" à côté de la recherche
2. **Cliquer** dessus
3. **Sélectionner** : `Moteur`
4. **Observer** : Les bases sont réorganisées (MySQL d'abord, puis PostgreSQL)

**Résultat attendu** :
- ✅ Les bases sont triées par moteur
- ✅ MySQL avant PostgreSQL

**Ce que vous dites après** :
> "Le tri fonctionne correctement. On peut trier par nom ou par moteur de base de données."

**Actions supplémentaires** :

5. **Changer** le tri en `Nom`
6. **Observer** : Les bases sont triées alphabétiquement

**Vérification** :
- [ ] Le tri par moteur fonctionne
- [ ] Le tri par nom fonctionne

---

### ÉTAPE 12 : Changer le thème (30 secondes)

**Ce que vous dites** :
> "L'interface supporte deux thèmes : sombre et clair. Je vais changer de thème pour vous montrer."

**Actions à faire** :

1. **Regarder** en haut à droite du header
2. **Trouver** le bouton "Clair" ou "Sombre"
3. **Cliquer** dessus
4. **Observer** : L'interface change de couleur instantanément

**Résultat attendu** :
- ✅ Si vous étiez en sombre → passe en clair (fond blanc, texte noir)
- ✅ Si vous étiez en clair → passe en sombre (fond noir, texte blanc)

**Ce que vous dites après** :
> "Le changement de thème est instantané. La préférence est sauvegardée et sera conservée même après rechargement de la page."

**Actions supplémentaires** :

5. **Recharger** la page (F5 ou Cmd+R)
6. **Observer** : Le thème choisi est conservé

**Vérification** :
- [ ] Le thème change instantanément
- [ ] Le thème est conservé après rechargement

---

### ÉTAPE 13 : Backup All (1 minute)

**Ce que vous dites** :
> "Enfin, je vais démontrer la fonctionnalité de backup global qui permet de sauvegarder toutes les bases en une seule action."

**Actions à faire** :

1. **Aller** dans la section "Réglages" (carte à droite)
2. **Trouver** le bouton `Backup All`
3. **Cliquer** sur `Backup All`
4. **Attendre** 3-4 secondes

**Ce que vous dites pendant** :
> "Le système va créer un backup pour toutes les bases configurées. C'est utile pour faire une sauvegarde complète du système."

**Résultat attendu** :
- ✅ Message "Backups lancés pour toutes les bases"
- ✅ Tous les backups sont créés en arrière-plan

**Ce que vous dites après** :
> "Parfait ! Toutes les bases ont été sauvegardées. Cette fonctionnalité est particulièrement utile pour les sauvegardes programmées automatiques."

**Vérification** :
- [ ] Message de succès
- [ ] Pas d'erreur

---

### ÉTAPE 14 : Copier DSN (30 secondes)

**Ce que vous dites** :
> "Je vais aussi montrer la fonctionnalité de copie DSN, qui permet de récupérer rapidement la chaîne de connexion."

**Actions à faire** :

1. **Trouver** une base dans la liste
2. **Cliquer** sur le bouton `Copier DSN`
3. **Ouvrir** un éditeur de texte (Notes, TextEdit)
4. **Coller** (Ctrl+V ou Cmd+V)

**Résultat attendu** :
- ✅ Message "DSN copié"
- ✅ Le DSN est collé dans l'éditeur (ex: `mysql://user:pass@localhost:3306/db`)

**Ce que vous dites après** :
> "Le DSN a été copié dans le presse-papier. C'est utile pour partager rapidement les informations de connexion."

**Vérification** :
- [ ] Message "DSN copié"
- [ ] Le DSN est dans le presse-papier

---

## 🎯 RÉSUMÉ FINAL (1 minute)

**Ce que vous dites** :
> "Pour résumer, j'ai démontré toutes les fonctionnalités principales de l'interface :
> 
> 1. ✅ Ajout de bases MySQL et PostgreSQL
> 2. ✅ Création de backups individuels et globaux
> 3. ✅ Gestion des versions (visualisation, épinglage, téléchargement, restauration)
> 4. ✅ Fonctionnalités de recherche et tri
> 5. ✅ Support des thèmes clair et sombre
> 6. ✅ Copie de DSN
> 
> L'interface est épurée, en noir et blanc, et offre toutes les fonctionnalités nécessaires pour gérer les sauvegardes de bases de données de manière simple et efficace."

---

## ⚠️ EN CAS DE PROBLÈME

### Si l'API ne répond pas

**Ce que vous dites** :
> "L'indicateur montre que l'API est hors ligne. Laissez-moi vérifier le backend."

**Actions** :
1. Vérifier que le backend tourne dans le terminal
2. Si nécessaire, le redémarrer : `cd backend && npm run dev`

### Si un backup échoue

**Ce que vous dites** :
> "Le backup a échoué. C'est normal en mode de démonstration car nous utilisons le mode FAKE_DUMP qui simule les backups sans avoir besoin d'une vraie connexion à la base de données."

**Explication** :
- Le mode FAKE_DUMP permet de tester l'interface sans vraie base
- En production, les backups fonctionneraient avec de vraies bases

### Si la page ne se charge pas

**Actions** :
1. Vérifier que le frontend tourne : `cd frontend && npm run dev`
2. Vérifier l'URL : http://localhost:5173
3. Vider le cache : Ctrl+Shift+R (ou Cmd+Shift+R)

---

## ✅ CHECKLIST AVANT LA SOUTENANCE

Avant de commencer, vérifiez :

- [ ] Le backend tourne (`cd backend && npm run dev`)
- [ ] Le frontend tourne (`cd frontend && npm run dev`)
- [ ] L'interface s'affiche sur http://localhost:5173
- [ ] L'indicateur API est vert
- [ ] Vous avez testé au moins une fois toutes les fonctionnalités
- [ ] Vous connaissez les noms des bases à utiliser
- [ ] Les identifiants de connexion sont prêts

---

## 💡 CONSEILS

1. **Parlez lentement** : Expliquez chaque action avant de la faire
2. **Montrez avec la souris** : Pointez les éléments avant de cliquer
3. **Vérifiez les résultats** : Attendez que les messages apparaissent
4. **Soyez confiant** : Même si quelque chose ne marche pas, expliquez pourquoi
5. **Préparez des phrases** : Apprenez par cœur les phrases clés

---

## 📝 TEMPS ESTIMÉ

- **Présentation interface** : 30 secondes
- **Ajout bases** : 3 minutes
- **Backups** : 2 minutes
- **Versions** : 3 minutes
- **Recherche/Tri** : 1 minute
- **Thème** : 30 secondes
- **Backup All** : 1 minute
- **Résumé** : 1 minute

**Total : ~12 minutes** (avec marge de sécurité)

---

## 🎬 SCRIPT COMPLET À LIRE

Si vous voulez, vous pouvez lire ce script à voix haute pendant la démo :

```
Bonjour, je vais vous présenter l'interface frontend de SafeBase.

Voici l'interface principale. Elle est épurée, en noir et blanc, avec support 
du thème clair et sombre. L'indicateur en haut à droite montre que l'API 
backend fonctionne correctement.

Je vais maintenant ajouter une base de données MySQL. Je remplis le formulaire 
avec les informations de connexion... et je clique sur "Ajouter la base".

Parfait ! La base a été ajoutée avec succès.

Maintenant, je vais ajouter une base PostgreSQL pour montrer que le système 
supporte les deux types de bases de données.

Excellent ! J'ai maintenant deux bases configurées.

Je vais créer un backup de la base MySQL. Le système va générer un fichier 
SQL contenant toutes les données.

Le backup a été créé avec succès.

Maintenant, je vais ouvrir la liste des versions pour voir l'historique des 
sauvegardes. Voici la version qui vient d'être créée.

Je vais épingler cette version pour la protéger. Les versions épinglées ne 
sont pas supprimées automatiquement.

Parfait ! La version est épinglée.

Je vais télécharger cette version. Le fichier SQL va être téléchargé dans 
mon dossier Téléchargements.

Maintenant, je vais restaurer cette version. Cela va remettre la base dans 
l'état du backup.

La restauration a été effectuée avec succès.

Je vais maintenant tester la fonctionnalité de recherche. Je tape "MySQL" 
et la liste se filtre automatiquement.

La recherche fonctionne en temps réel.

Je vais aussi tester le tri. Je change le critère de tri par "Moteur" et 
les bases sont réorganisées.

Le tri fonctionne correctement.

Je vais changer le thème pour vous montrer. L'interface passe en mode clair.

Le changement de thème est instantané et la préférence est sauvegardée.

Enfin, je vais lancer un backup global pour sauvegarder toutes les bases 
en une seule action.

Parfait ! Toutes les bases ont été sauvegardées.

Pour résumer, j'ai démontré toutes les fonctionnalités principales :
- Ajout de bases MySQL et PostgreSQL
- Création de backups
- Gestion des versions
- Recherche et tri
- Support des thèmes
- Backup global

L'interface est complète et fonctionnelle. Avez-vous des questions ?
```

---

**Bonne chance pour votre soutenance ! 🎉**

