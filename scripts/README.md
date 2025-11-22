# Scripts Utilitaires - SafeBase

Ce dossier contient les scripts utilitaires pour le projet SafeBase.

## Scripts Disponibles

### Tests
- **test-fonctionnalites.sh** - Test complet des fonctionnalités de l'API
- **test-scheduler.sh** - Test du scheduler et des sauvegardes automatiques

### Déploiement
- **LANCER-PROJET.sh** - Script pour lancer le projet complet

### Configuration
- **changer-mot-de-passe-postgres.sh** - Changer le mot de passe PostgreSQL
- **fix-postgres-permissions.sh** - Corriger les permissions PostgreSQL

## Utilisation

### Tester les fonctionnalités
```bash
./scripts/test-fonctionnalites.sh
```

### Tester le scheduler
```bash
./scripts/test-scheduler.sh
```

### Lancer le projet
```bash
./scripts/LANCER-PROJET.sh
```

### Changer mot de passe PostgreSQL
```bash
./scripts/changer-mot-de-passe-postgres.sh
```

## Note

Assurez-vous que les scripts ont les permissions d'exécution :
```bash
chmod +x scripts/*.sh
```
