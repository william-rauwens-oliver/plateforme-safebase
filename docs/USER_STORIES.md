# User Stories - Plateforme SafeBase

## Épique 1 : Gestion des Bases de Données

### US-1.1 : Enregistrer une nouvelle base de données
**En tant que** administrateur de bases de données  
**Je veux** enregistrer une nouvelle connexion à une base de données  
**Afin de** que SafeBase puisse la sauvegarder automatiquement

**Critères d'acceptation :**
- Je peux saisir les informations de connexion (nom, moteur, hôte, port, utilisateur, mot de passe, base)
- Je peux récupérer automatiquement la liste des bases disponibles sur le serveur
- La connexion est testée avant l'enregistrement
- Le mot de passe est chiffré avant stockage
- Je reçois une confirmation de succès ou un message d'erreur clair

**Priorité :** Haute  
**Estimation :** 5 points

---

### US-1.2 : Lister les bases de données enregistrées
**En tant que** utilisateur  
**Je veux** voir la liste de toutes les bases de données enregistrées  
**Afin de** connaître les bases surveillées par SafeBase

**Critères d'acceptation :**
- La liste affiche toutes les bases avec leurs informations principales
- Je peux rechercher une base par nom, moteur, hôte
- Je peux trier par nom, moteur, date de création
- Chaque base affiche son statut (disponible/inaccessible)

**Priorité :** Haute  
**Estimation :** 3 points

---

### US-1.3 : Supprimer une base de données
**En tant que** administrateur  
**Je veux** supprimer une base de données enregistrée  
**Afin de** arrêter les sauvegardes automatiques pour cette base

**Critères d'acceptation :**
- Je dois confirmer la suppression
- La suppression supprime aussi tous les backups associés
- Je reçois une confirmation de suppression

**Priorité :** Moyenne  
**Estimation :** 2 points

---

## Épique 2 : Sauvegardes

### US-2.1 : Créer une sauvegarde manuelle
**En tant que** utilisateur  
**Je veux** déclencher une sauvegarde manuelle d'une base  
**Afin de** créer un point de restauration avant une opération risquée

**Critères d'acceptation :**
- Je peux déclencher une sauvegarde depuis l'interface
- La sauvegarde utilise `mysqldump` ou `pg_dump` selon le moteur
- Je reçois un feedback pendant l'opération
- Une alerte est générée en cas de succès ou d'échec
- La nouvelle version apparaît dans la liste des versions

**Priorité :** Haute  
**Estimation :** 5 points

---

### US-2.2 : Sauvegardes automatiques périodiques
**En tant que** administrateur  
**Je veux** que les bases soient sauvegardées automatiquement  
**Afin de** garantir la disponibilité de points de restauration récents

**Critères d'acceptation :**
- Les sauvegardes sont déclenchées toutes les heures (configurable)
- Le scheduler utilise cron pour la planification
- Toutes les bases enregistrées sont sauvegardées
- Les sauvegardes sont exécutées même si certaines échouent
- Un heartbeat est envoyé pour confirmer que le scheduler fonctionne

**Priorité :** Haute  
**Estimation :** 8 points

---

### US-2.3 : Sauvegarder toutes les bases en une fois
**En tant que** administrateur  
**Je veux** sauvegarder toutes les bases en une seule action  
**Afin de** créer un snapshot complet de toutes les bases à un moment donné

**Critères d'acceptation :**
- Un bouton "Sauvegarder toutes les bases" est disponible
- Toutes les bases sont sauvegardées séquentiellement
- Un rapport indique les succès et échecs
- Les alertes sont générées pour chaque base

**Priorité :** Moyenne  
**Estimation :** 3 points

---

## Épique 3 : Gestion des Versions

### US-3.1 : Consulter l'historique des versions
**En tant que** utilisateur  
**Je veux** voir toutes les versions sauvegardées d'une base  
**Afin de** choisir quelle version restaurer

**Critères d'acceptation :**
- La liste affiche toutes les versions avec date, taille, statut (épinglée ou non)
- Les versions épinglées apparaissent en premier
- Les versions sont triées par date (plus récent en premier)
- Je peux voir les détails de chaque version

**Priorité :** Haute  
**Estimation :** 3 points

---

### US-3.2 : Épingler une version importante
**En tant que** utilisateur  
**Je veux** épingler une version importante  
**Afin de** la protéger de la suppression automatique

**Critères d'acceptation :**
- Je peux épingler/désépingler une version
- Les versions épinglées ne sont pas supprimées automatiquement
- Les versions épinglées sont visuellement distinguées
- Je peux voir quelles versions sont épinglées

**Priorité :** Moyenne  
**Estimation :** 2 points

---

### US-3.3 : Restaurer une version
**En tant que** utilisateur  
**Je veux** restaurer une version spécifique  
**Afin de** revenir à un état antérieur de la base de données

**Critères d'acceptation :**
- Je peux sélectionner une version à restaurer
- Je dois confirmer avant la restauration (opération destructive)
- La restauration utilise `mysql` ou `psql` selon le moteur
- Je reçois un feedback pendant l'opération
- Une alerte est générée en cas de succès ou d'échec

**Priorité :** Haute  
**Estimation :** 5 points

---

### US-3.4 : Télécharger un fichier de backup
**En tant que** utilisateur  
**Je veux** télécharger un fichier de backup  
**Afin de** le conserver localement ou le restaurer manuellement

**Critères d'acceptation :**
- Je peux télécharger le fichier .sql directement
- Le téléchargement fonctionne pour les fichiers volumineux
- Le nom du fichier est préservé

**Priorité :** Moyenne  
**Estimation :** 2 points

---

### US-3.5 : Supprimer une version
**En tant que** utilisateur  
**Je veux** supprimer une version non épinglée  
**Afin de** libérer de l'espace disque

**Critères d'acceptation :**
- Je peux supprimer uniquement les versions non épinglées
- Je dois confirmer la suppression
- Le fichier de backup est supprimé du disque
- La version disparaît de la liste

**Priorité :** Basse  
**Estimation :** 2 points

---

## Épique 4 : Surveillance et Alertes

### US-4.1 : Consulter les alertes
**En tant que** administrateur  
**Je veux** voir toutes les alertes générées  
**Afin de** être informé des problèmes et des succès

**Critères d'acceptation :**
- La liste affiche toutes les alertes avec type, date, message
- Je peux filtrer par type d'alerte
- Je peux filtrer par statut (résolue/non résolue)
- Je peux limiter le nombre d'alertes affichées

**Priorité :** Haute  
**Estimation :** 3 points

---

### US-4.2 : Résoudre une alerte
**En tant que** administrateur  
**Je veux** marquer une alerte comme résolue  
**Afin de** suivre les problèmes traités

**Critères d'acceptation :**
- Je peux marquer une alerte comme résolue
- L'alerte affiche la date de résolution
- Les alertes résolues peuvent être filtrées

**Priorité :** Moyenne  
**Estimation :** 2 points

---

### US-4.3 : Recevoir des notifications externes
**En tant que** administrateur  
**Je veux** recevoir des alertes sur Slack/Teams/Email  
**Afin de** être notifié même si je ne consulte pas l'interface

**Critères d'acceptation :**
- Les alertes sont envoyées à un webhook configuré
- Le format est compatible avec Slack, Teams, etc.
- Les alertes incluent toutes les informations pertinentes

**Priorité :** Basse  
**Estimation :** 3 points

---

## Épique 5 : Interface Utilisateur

### US-5.1 : Interface responsive
**En tant que** utilisateur  
**Je veux** utiliser l'interface sur mobile et tablette  
**Afin de** gérer les sauvegardes depuis n'importe quel appareil

**Critères d'acceptation :**
- L'interface s'adapte aux différentes tailles d'écran
- Les fonctionnalités sont accessibles sur mobile
- Le design reste lisible et utilisable

**Priorité :** Moyenne  
**Estimation :** 5 points

---

### US-5.2 : Thème clair/sombre
**En tant que** utilisateur  
**Je veux** choisir entre thème clair et sombre  
**Afin de** adapter l'interface à mes préférences

**Critères d'acceptation :**
- Un bouton permet de basculer entre les thèmes
- Le choix est sauvegardé dans le navigateur
- Les deux thèmes sont bien contrastés et lisibles

**Priorité :** Basse  
**Estimation :** 2 points

---

### US-5.3 : Feedback visuel
**En tant que** utilisateur  
**Je veux** recevoir un feedback visuel pour mes actions  
**Afin de** savoir si mes actions ont réussi ou échoué

**Critères d'acceptation :**
- Des toasts apparaissent pour les succès et erreurs
- Les états de chargement sont affichés
- Les messages d'erreur sont clairs et actionnables

**Priorité :** Haute  
**Estimation :** 3 points

---

## Récapitulatif

### Par Priorité

**Haute (Must Have) :**
- US-1.1, US-1.2, US-2.1, US-2.2, US-3.1, US-3.3, US-4.1, US-5.3

**Moyenne (Should Have) :**
- US-1.3, US-2.3, US-3.2, US-4.2, US-5.1

**Basse (Nice to Have) :**
- US-3.4, US-3.5, US-4.3, US-5.2

### Estimation Totale

- **Haute** : 35 points
- **Moyenne** : 14 points
- **Basse** : 9 points
- **Total** : 58 points

---

*User Stories créées pour le projet SafeBase*

