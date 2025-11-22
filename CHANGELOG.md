# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/).

## [Unreleased]

### Added
- Structure de branches Git Flow (main, develop)
- Templates GitHub (issues, pull requests)
- Guide de contribution (CONTRIBUTING.md)
- Changelog (CHANGELOG.md)
- Documentation du schéma de données (MCD/MLD/MPD)

### Changed
- Amélioration de la structure GitHub pour un workflow professionnel

## [0.1.0] - 2025-01-09

### Added
- API REST complète avec Fastify
  - Endpoints pour gestion des bases de données
  - Endpoints pour sauvegarde et restauration
  - Endpoints pour gestion des versions
  - Support MySQL et PostgreSQL

- Interface utilisateur React
  - Formulaire d'enregistrement de bases de données
  - Liste des connexions enregistrées
  - Modal de gestion des versions
  - Actions : Backup, Restore, Pin, Download, Delete
  - Thème clair/sombre
  - Design responsive

- Scheduler automatique
  - Cron configuré (toutes les heures)
  - Scripts de backup automatique
  - Heartbeat pour monitoring

- Sécurité
  - Chiffrement AES-256-GCM des mots de passe
  - Validation des entrées avec Zod
  - API Key optionnelle
  - Headers de sécurité

- Tests
  - 17 tests backend (health, security, integration)
  - 8 tests frontend (App, security)
  - Total : 25 tests (tous passent)

- Conteneurisation
  - Docker Compose avec tous les services
  - Dockerfiles pour backend, frontend, scheduler
  - Support MySQL et PostgreSQL

- Documentation
  - Architecture complète
  - Guides de démarrage
  - Documentation des tests
  - Guide de présentation
  - Résolution de problèmes

### Changed
- Amélioration de la gestion des erreurs
- Optimisation des performances
- Amélioration de l'UX

### Fixed
- Correction des problèmes de connexion PostgreSQL
- Correction de la gestion des permissions
- Amélioration des messages d'erreur

---

## Types de Changements

- `Added` : Nouvelles fonctionnalités
- `Changed` : Changements dans les fonctionnalités existantes
- `Deprecated` : Fonctionnalités qui seront bientôt supprimées
- `Removed` : Fonctionnalités supprimées
- `Fixed` : Corrections de bugs
- `Security` : Corrections de vulnérabilités

