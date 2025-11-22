# Gestion de Projet - Plateforme SafeBase

## 1. Méthodologie

### 1.1 Approche Agile

Le projet SafeBase a été développé en suivant une **méthodologie Agile** adaptée à une équipe de 2 développeurs :

- **Sprints** : Itérations de 1-2 semaines
- **Daily Stand-ups** : Points quotidiens pour synchronisation
- **Rétrospectives** : Amélioration continue après chaque sprint
- **User Stories** : Développement orienté par les besoins utilisateur

### 1.2 Outils Collaboratifs

#### GitHub
- **Repository** : `https://github.com/william-rauwens-oliver/plateforme-safebase`
- **Branches** : 
  - `main` : Branche principale (production)
  - `develop` : Branche de développement
  - `feature/*` : Branches de fonctionnalités
- **Pull Requests** : Revue de code avant merge
- **Issues** : Suivi des bugs et améliorations

#### Kanban Board
- **Outil** : GitHub Projects ou Trello
- **Colonnes** :
- Backlog
- En cours
- En revue
- Terminé

#### Communication
- **Discord/Slack** : Communication quotidienne
- **GitHub Discussions** : Questions techniques
- **Code Reviews** : Amélioration de la qualité

## 2. Répartition des Tâches

### 2.1 Équipe

- **William Rauwens-Oliver** : Backend, API, Architecture
- **Chaima BEN FARHAT** : Frontend, Interface, Tests

### 2.2 Répartition par Épique

#### Épique 1 : Gestion des Bases de Données
- **Backend** : William (API, validation, chiffrement)
- **Frontend** : Chaima (Formulaire, liste, recherche)

#### Épique 2 : Sauvegardes
- **Backend** : William (Scheduler, mysqldump/pg_dump)
- **Frontend** : Chaima (Boutons, feedback)

#### Épique 3 : Gestion des Versions
- **Backend** : William (Stockage, restauration)
- **Frontend** : Chaima (Modal, actions)

#### Épique 4 : Surveillance et Alertes
- **Backend** : William (Système d'alertes)
- **Frontend** : Chaima (Affichage, filtres)

#### Épique 5 : Interface Utilisateur
- **Frontend** : Chaima (Design, responsive, thèmes)
- **Backend** : William (Support API)

### 2.3 Tâches Transversales

- **Tests** : Répartition équitable
- **Documentation** : Répartition équitable
- **Docker** : William (Configuration)
- **CI/CD** : William (GitHub Actions)

## 3. Planning

### 3.1 Phases du Projet

#### Phase 1 : Setup et Architecture (Semaine 1)
-  Configuration du projet
-  Architecture et schéma de base de données
-  Setup Docker
-  Structure des dossiers

#### Phase 2 : Backend Core (Semaine 2-3)
-  API REST avec Fastify
-  Gestion des bases de données
-  Chiffrement des mots de passe
-  Store avec fallback

#### Phase 3 : Sauvegardes (Semaine 4)
-  Endpoints de sauvegarde
-  Scheduler avec cron
-  Gestion des versions
-  Nettoyage automatique

#### Phase 4 : Frontend (Semaine 5-6)
-  Interface React
-  Formulaire d'ajout
-  Liste des bases
-  Gestion des versions
-  Design responsive

#### Phase 5 : Alertes et Surveillance (Semaine 7)
-  Système d'alertes
-  Webhooks
-  Monitoring

#### Phase 6 : Tests et Documentation (Semaine 8)
-  Tests unitaires
-  Tests d'intégration
-  Tests E2E
-  Documentation complète

### 3.2 Jalons (Milestones)

- **M1** : API fonctionnelle avec CRUD bases
- **M2** : Sauvegardes automatiques opérationnelles
- **M3** : Interface utilisateur complète
- **M4** : Tests et documentation terminés
- **M5** : Déploiement et soutenance

## 4. Conventions de Code

### 4.1 Git

#### Messages de Commit
Format : `type(scope): description`

Types :
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage
- `refactor` : Refactorisation
- `test` : Tests
- `chore` : Tâches de maintenance

Exemples :
```
feat(api): add database registration endpoint
fix(store): handle PostgreSQL connection errors
docs(readme): add deployment instructions
```

#### Branches
- `feature/nom-fonctionnalite` : Nouvelle fonctionnalité
- `fix/nom-bug` : Correction de bug
- `docs/nom-doc` : Documentation

### 4.2 Code

#### TypeScript
- Types explicites
- Interfaces pour les objets complexes
- Pas de `any` sauf cas exceptionnel

#### Nommage
- **Variables/Fonctions** : camelCase
- **Classes/Interfaces** : PascalCase
- **Constantes** : UPPER_SNAKE_CASE
- **Fichiers** : kebab-case

#### Formatage
- ESLint configuré
- Prettier (si utilisé)
- Formatage automatique avant commit

## 5. Qualité et Tests

### 5.1 Tests

#### Couverture Minimale
- **Backend** : 80% minimum
- **Frontend** : 70% minimum
- **E2E** : Flux critiques

#### Types de Tests
- **Unitaires** : Fonctions isolées
- **Intégration** : Flux complets
- **E2E** : Interface utilisateur

### 5.2 Code Review

#### Processus
1. Création d'une Pull Request
2. Revue par l'autre développeur
3. Corrections si nécessaire
4. Merge après approbation

#### Critères de Revue
- Code fonctionnel
- Tests passants
- Documentation à jour
- Pas de régression
- Respect des conventions

## 6. Gestion des Risques

### 6.1 Risques Identifiés

| Risque | Probabilité | Impact | Mitigation |
|--------|------------|--------|------------|
| PostgreSQL indisponible | Moyenne | Moyen | Fallback JSON |
| Sauvegardes volumineuses | Faible | Élevé | Compression, nettoyage |
| Conflits Git | Moyenne | Faible | Communication, branches |
| Retard sur planning | Faible | Moyen | Buffer, priorités |

### 6.2 Actions Correctives

- **PostgreSQL down** : Fallback automatique vers JSON
- **Sauvegardes lentes** : Optimisation, parallélisation
- **Conflits** : Communication préventive, merge fréquents
- **Retards** : Réévaluation des priorités

## 7. Métriques de Succès

### 7.1 Techniques

-  Tous les tests passent
-  Code coverage > 80%
-  Aucun bug critique
-  Documentation complète

### 7.2 Fonctionnels

-  Toutes les user stories prioritaires implémentées
-  Interface utilisable et intuitive
-  Sauvegardes automatiques fonctionnelles
-  Performance acceptable

### 7.3 Qualité

-  Code propre et maintenable
-  Architecture respectée
-  Sécurité implémentée
-  Conteneurisation complète

## 8. Rétrospectives

### 8.1 Points Positifs

-  Bonne communication entre développeurs
-  Architecture modulaire facilitant le travail en parallèle
-  Tests permettant de détecter les régressions
-  Docker simplifiant le déploiement

### 8.2 Points d'Amélioration

- [ATTENTION] Documentation plus tôt dans le projet
- [ATTENTION] Plus de tests E2E en amont
- [ATTENTION] Revue de code plus systématique

### 8.3 Actions pour la Suite

- Documenter au fur et à mesure
- Écrire les tests en même temps que le code
- Revue de code pour chaque PR

## 9. Livrables

### 9.1 Code Source

-  Repository GitHub public
-  Code commenté
-  README complet

### 9.2 Documentation

-  Cahier des charges
-  User stories
-  Diagrammes de flux
-  Documentation technique
-  Guide de déploiement

### 9.3 Tests

-  Tests unitaires
-  Tests d'intégration
-  Tests E2E
-  Rapport de couverture

### 9.4 Présentation

-  Diaporama de soutenance
-  Démonstration fonctionnelle
-  Présentation du code

---

*Document de gestion de projet pour SafeBase - Méthodologie Agile avec équipe de 2 développeurs*

