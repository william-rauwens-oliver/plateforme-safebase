# Cahier des Charges - Plateforme SafeBase

## 1. Contexte et Objectifs

### 1.1 Contexte

Dans le monde de l'entreprise, la gestion des bases de données et la sécurisation des données sont des enjeux cruciaux. Les données sont souvent l'un des actifs les plus précieux pour une organisation et leur perte peut engendrer des conséquences désastreuses.

### 1.2 Objectif Principal

Développer une solution complète de gestion de la sauvegarde et de la restauration de bases de données sous forme d'une API REST, permettant de :
- Automatiser les sauvegardes régulières
- Gérer l'historique des versions
- Surveiller et alerter en cas de problème
- Offrir une interface utilisateur simple

### 1.3 Public Cible

- **Administrateurs de bases de données**
- **Développeurs** gérant plusieurs projets
- **Équipes DevOps** nécessitant une solution de backup automatisée
- **Organisations** souhaitant sécuriser leurs données

## 2. Fonctionnalités Requises

### 2.1 Gestion des Bases de Données

#### 2.1.1 Ajout de Base de Données
- **Description** : Permettre l'ajout d'une connexion à une base de données
- **Critères d'acceptation** :
  - Support MySQL et PostgreSQL
  - Validation des paramètres de connexion
  - Test de connexion avant enregistrement
  - Chiffrement des mots de passe
  - Récupération automatique des bases disponibles

#### 2.1.2 Liste et Gestion
- **Description** : Lister, rechercher et supprimer les bases enregistrées
- **Critères d'acceptation** :
  - Affichage de toutes les bases enregistrées
  - Recherche et filtrage
  - Suppression avec confirmation
  - Suppression automatique des backups associés

### 2.2 Automatisation des Sauvegardes

#### 2.2.1 Sauvegardes Périodiques
- **Description** : Planifier et effectuer des sauvegardes régulières
- **Critères d'acceptation** :
  - Utilisation du standard cron
  - Utilisation de `mysqldump` pour MySQL
  - Utilisation de `pg_dump` pour PostgreSQL
  - Sauvegarde automatique toutes les heures (configurable)
  - Sauvegarde manuelle possible

#### 2.2.2 Sauvegarde Globale
- **Description** : Sauvegarder toutes les bases enregistrées en une fois
- **Critères d'acceptation** :
  - Endpoint API `/backup-all`
  - Exécution séquentielle ou parallèle
  - Gestion des erreurs individuelles
  - Rapport de résultats

### 2.3 Gestion des Versions

#### 2.3.1 Historique des Versions
- **Description** : Conserver l'historique des différentes versions sauvegardées
- **Critères d'acceptation** :
  - Stockage des métadonnées (date, taille, chemin)
  - Association à une base de données
  - Tri par date (plus récent en premier)
  - Limitation du nombre de versions conservées

#### 2.3.2 Épinglage de Versions
- **Description** : Protéger certaines versions de la suppression automatique
- **Critères d'acceptation** :
  - Épinglage/désépinglage d'une version
  - Versions épinglées prioritaires dans l'affichage
  - Versions épinglées non supprimées automatiquement

#### 2.3.3 Restauration
- **Description** : Restaurer une version spécifique
- **Critères d'acceptation** :
  - Sélection d'une version à restaurer
  - Confirmation avant restauration
  - Utilisation de `mysql` pour MySQL
  - Utilisation de `psql` pour PostgreSQL
  - Gestion des erreurs de restauration
  - Alerte de succès/échec

#### 2.3.4 Téléchargement
- **Description** : Télécharger un fichier de backup
- **Critères d'acceptation** :
  - Téléchargement direct du fichier .sql
  - Headers HTTP appropriés
  - Gestion des fichiers volumineux

### 2.4 Surveillance et Alertes

#### 2.4.1 Types d'Alertes
- **Description** : Générer des alertes en cas de problème
- **Types d'alertes** :
  - `backup_failed` : Échec de sauvegarde
  - `restore_failed` : Échec de restauration
  - `scheduler_down` : Scheduler non actif
  - `database_inaccessible` : Base de données inaccessible
  - `backup_success` : Sauvegarde réussie
  - `restore_success` : Restauration réussie

#### 2.4.2 Gestion des Alertes
- **Description** : Consulter et gérer les alertes
- **Critères d'acceptation** :
  - Liste des alertes avec filtres (type, résolue, limite)
  - Résolution d'alertes
  - Suppression d'alertes
  - Webhook pour notifications externes

### 2.5 Interface Utilisateur

#### 2.5.1 Fonctionnalités Principales
- **Description** : Interface simple pour gérer les processus
- **Critères d'acceptation** :
  - Formulaire d'ajout de base de données
  - Liste des bases avec actions (backup, versions, supprimer)
  - Modal de gestion des versions
  - Indicateur de santé de l'API
  - Thème clair/sombre
  - Design responsive

#### 2.5.2 Expérience Utilisateur
- **Description** : Interface intuitive et moderne
- **Critères d'acceptation** :
  - Feedback visuel (toasts)
  - Gestion d'erreurs claire
  - Recherche et tri
  - États de chargement

## 3. Contraintes Techniques

### 3.1 Technologies

- **Backend** : API REST (Fastify recommandé)
- **Frontend** : React ou équivalent
- **Bases de données** : MySQL et PostgreSQL
- **Scheduler** : Cron (standard Unix)
- **Utilitaires** : `mysqldump`, `pg_dump`, `mysql`, `psql`

### 3.2 Conteneurisation

- **Obligatoire** : Le projet doit être conteneurisé
- **Services requis** :
  - API
  - Base MySQL
  - Base PostgreSQL
  - Frontend
  - Scheduler

### 3.3 Sécurité

- **Chiffrement** : Mots de passe chiffrés (AES-256-GCM)
- **Validation** : Validation de toutes les entrées
- **Authentification** : API Key optionnelle
- **Headers de sécurité** : Protection XSS, CSRF, etc.

### 3.4 Performance

- **Sauvegardes** : Support de bases jusqu'à plusieurs Go
- **Versions** : Conservation de 10 versions par défaut (configurable)
- **Nettoyage** : Suppression automatique des anciennes versions

## 4. Tests

### 4.1 Tests Fonctionnels

- Tests unitaires pour les composants backend
- Tests unitaires pour les composants frontend
- Tests d'intégration pour les flux complets
- Tests E2E pour l'interface utilisateur

### 4.2 Tests de Sécurité

- Tests de validation des entrées
- Tests de chiffrement/déchiffrement
- Tests d'authentification API

## 5. Livrables

### 5.1 Code Source

- Code source complet sur GitHub
- Repository public
- Documentation du code

### 5.2 Documentation

- README avec instructions de démarrage
- Documentation de l'API
- Documentation de déploiement
- Guide de contribution

### 5.3 Présentation

- Soutenance avec démonstration
- Présentation du code
- Présentation des tests

## 6. Critères de Réussite

### 6.1 Fonctionnels

-  Toutes les fonctionnalités requises implémentées
-  Tests passants
-  Interface utilisateur fonctionnelle
-  Sauvegardes automatiques opérationnelles

### 6.2 Techniques

-  Code propre et documenté
-  Architecture respectée
-  Sécurité implémentée
-  Conteneurisation complète

### 6.3 Qualité

-  Tests avec bonne couverture
-  Documentation complète
-  Code conforme aux standards

## 7. Planning et Organisation

### 7.1 Méthodologie

- Méthode Agile recommandée
- Utilisation d'outils collaboratifs (Trello, Kanban)
- Répartition équitable du travail

### 7.2 Livraison

- Repository GitHub public
- URL : `https://github.com/william-rauwens-oliver/plateforme-safebase`
- Date de livraison : Selon planning académique

---

*Document créé pour le projet SafeBase - Gestion de sauvegarde de bases de données*
