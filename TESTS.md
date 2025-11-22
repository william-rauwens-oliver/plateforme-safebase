# Guide des Tests - SafeBase

Ce document décrit la structure des tests du projet SafeBase.

## Structure des Tests

### Tests Backend (`backend/test/`)

#### Tests Unitaires
- **`crypto.test.ts`** - Tests du module de chiffrement (encrypt/decrypt)
- **`utils.test.ts`** - Tests des utilitaires (hashPassword/verifyPassword)
- **`store.test.ts`** - Tests du module Store (opérations sur les données)
- **`security.test.ts`** - Tests de sécurité (API key, validation)

#### Tests d'Intégration
- **`integration.test.ts`** - Tests d'intégration des flux complets
  - Enregistrement de bases de données
  - Flux de sauvegarde
  - Gestion des versions
  - Gestion des alertes
  - Scheduler
- **`routes.test.ts`** - Tests des endpoints API
- **`health.test.ts`** - Tests de santé de l'API

### Tests Frontend (`frontend/src/`)

#### Tests Unitaires
- **`App.test.tsx`** - Tests du composant principal
- **`security.test.tsx`** - Tests de sécurité frontend
- **`hooks.test.tsx`** - Tests des hooks React personnalisés

### Tests E2E (`e2e/tests/`)

#### Tests End-to-End
- **`app.spec.ts`** - Tests E2E de l'interface utilisateur
  - Affichage de l'application
  - Vérification de santé API
  - Liste des bases de données
  - Formulaire d'ajout
  - Basculement de thème
- **`api-flow.spec.ts`** - Tests E2E des flux API
  - Health check
  - Liste des bases
  - Validation des entrées
  - Scheduler heartbeat
  - Alertes

## Exécution des Tests

### Tests Backend

```bash
cd backend
npm test
```

### Tests Frontend

```bash
cd frontend
npm test
```

### Tests E2E

```bash
cd e2e
npm install
npm test
```

### Tous les Tests

```bash
# Backend
cd backend && npm test && cd ..

# Frontend
cd frontend && npm test && cd ..

# E2E
cd e2e && npm test && cd ..
```

## Configuration

### Variables d'Environnement pour les Tests

- **`ENCRYPTION_KEY`** - Clé de chiffrement (requis pour les tests crypto)
- **`FAKE_DUMP`** - Mode test sans vraies bases de données (défaut: `0`)
- **`TEST_MYSQL_USER`** - Utilisateur MySQL pour tests (optionnel)
- **`TEST_MYSQL_PASSWORD`** - Mot de passe MySQL pour tests (optionnel)
- **`TEST_API_KEY`** - Clé API pour tests (optionnel)

### Mode FAKE_DUMP

Pour éviter les dépendances à MySQL/PostgreSQL dans les tests, utilisez :

```bash
FAKE_DUMP=1 npm test
```

Ce mode simule les sauvegardes sans exécuter réellement `mysqldump` ou `pg_dump`.

## Couverture des Tests

### Backend
- ✅ Chiffrement/déchiffrement
- ✅ Validation des entrées
- ✅ Authentification API
- ✅ Opérations Store (CRUD)
- ✅ Endpoints API
- ✅ Flux d'intégration complets

### Frontend
- ✅ Composants React
- ✅ Hooks personnalisés
- ✅ Interactions API
- ✅ Gestion d'erreurs
- ✅ Sécurité

### E2E
- ✅ Interface utilisateur
- ✅ Flux API complets
- ✅ Navigation
- ✅ Thème

## Bonnes Pratiques

1. **Isolation** : Chaque test doit être indépendant
2. **Cleanup** : Nettoyer les données de test après chaque suite
3. **Mocking** : Utiliser des mocks pour les dépendances externes
4. **Noms descriptifs** : Utiliser des noms de tests clairs et descriptifs
5. **Assertions** : Une assertion par concept testé

## Dépannage

### Erreurs de Connexion PostgreSQL

Si les tests échouent avec des erreurs PostgreSQL, vérifiez :
- PostgreSQL est démarré
- Variables d'environnement `DB_*` configurées
- Ou utilisez le mode fallback JSON

### Timeouts

Si les tests timeout :
- Augmentez le timeout dans la configuration Vitest
- Utilisez `FAKE_DUMP=1` pour éviter les dépendances externes
- Vérifiez que les services sont accessibles

## Contribution

Lors de l'ajout de nouvelles fonctionnalités :
1. Ajoutez des tests unitaires pour les nouvelles fonctions
2. Ajoutez des tests d'intégration pour les nouveaux flux
3. Ajoutez des tests E2E pour les nouvelles interfaces
4. Assurez-vous que tous les tests passent avant de commit

