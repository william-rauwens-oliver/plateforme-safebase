# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

## [Unreleased]

### Added
- ✅ Tests E2E complets avec Playwright
- ✅ Tests unitaires supplémentaires (crypto, utils, store)
- ✅ Tests d'intégration améliorés (routes, alertes, scheduler)
- ✅ Documentation complète des tests (`TESTS.md`)
- ✅ Workflow CI/CD GitHub Actions
- ✅ Tests frontend pour les hooks React

### Changed
- 📝 Amélioration de la documentation des tests
- 🔧 Organisation de la structure du projet
- 📦 Mise à jour des dépendances de test

### Fixed
- 🐛 Correction des tests d'intégration
- 🐛 Amélioration de la gestion des erreurs dans les tests

## [0.1.0] - 2025-01-22

### Added
- 🎉 Version initiale du projet
- ✅ API REST complète (Fastify)
- ✅ Interface utilisateur React
- ✅ Scheduler automatique (cron)
- ✅ Support MySQL et PostgreSQL
- ✅ Chiffrement des mots de passe (AES-256-GCM)
- ✅ Système d'alertes complet
- ✅ Gestion des versions de backup
- ✅ Tests unitaires backend (17 tests)
- ✅ Tests unitaires frontend (8 tests)
- ✅ Tests d'intégration
- ✅ Tests de sécurité
- ✅ Scripts de test fonctionnels
- ✅ Conteneurisation Docker complète
- ✅ Documentation complète

### Features
- Ajout de bases de données (MySQL/PostgreSQL)
- Sauvegardes automatiques (cron)
- Sauvegardes manuelles
- Restauration de versions
- Épinglage de versions
- Téléchargement de backups
- Historique des alertes
- Interface utilisateur moderne et responsive
- Thème sombre/clair

### Security
- Chiffrement AES-256-GCM des mots de passe
- Authentification API (API key)
- Validation des entrées (Zod)
- Headers de sécurité HTTP

### Documentation
- README complet
- Documentation des variables d'environnement
- Présentation pour soutenance
- Guide de contribution
- Guide de sécurité
