# Guide de Contribution - SafeBase

Merci de votre intérêt pour contribuer à SafeBase ! Ce document contient les conventions et processus pour contribuer au projet.

## Table des Matières

- [Code de Conduite](#code-de-conduite)
- [Processus de Contribution](#processus-de-contribution)
- [Conventions de Code](#conventions-de-code)
- [Conventions de Commit](#conventions-de-commit)
- [Structure des Branches](#structure-des-branches)
- [Tests](#tests)
- [Documentation](#documentation)

---

## Code de Conduite

### Nos Standards

- Être respectueux et inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté
- Faire preuve d'empathie envers les autres membres

---

## Processus de Contribution

### 1. Fork et Clone

```bash
# Fork le projet sur GitHub
# Puis clonez votre fork
git clone https://github.com/VOTRE-USERNAME/plateforme-safebase.git
cd plateforme-safebase
```

### 2. Créer une Branche

```bash
# Créer une branche depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-fonctionnalite
# ou
git checkout -b fix/nom-du-bug
```

### 3. Faire vos Modifications

- Écrire du code propre et bien documenté
- Suivre les conventions de code
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation si nécessaire

### 4. Commiter vos Changements

```bash
git add .
git commit -m "feat: ajout de la fonctionnalité X"
```

Voir [Conventions de Commit](#conventions-de-commit) pour le format.

### 5. Pousser et Créer une Pull Request

```bash
git push origin feature/nom-de-la-fonctionnalite
```

Puis créez une Pull Request sur GitHub depuis votre branche vers `develop`.

---

## Conventions de Code

### TypeScript / JavaScript

- **Indentation** : 2 espaces
- **Guillemets** : Simple quotes pour les strings
- **Point-virgule** : Oui
- **Nommage** :
  - Variables et fonctions : `camelCase`
  - Classes et interfaces : `PascalCase`
  - Constantes : `UPPER_SNAKE_CASE`

### Exemple

```typescript
// Bon
const userName = 'john';
function getUserData() { }
class DatabaseManager { }
const MAX_RETRIES = 3;

// Mauvais
const user_name = 'john';
function get_user_data() { }
class database_manager { }
```

### Documentation

- Utiliser JSDoc pour les fonctions publiques
- Commenter les parties complexes du code
- Expliquer le "pourquoi", pas le "comment"

```typescript
/**
 * Teste la connexion à une base de données
 * @param db - Base de données à tester
 * @returns Résultat du test avec succès ou message d'erreur
 */
async function testDatabaseConnection(db: RegisteredDatabase): Promise<{ success: boolean; error?: string }> {
  // ...
}
```

---

## Conventions de Commit

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types

- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation uniquement
- `style`: Formatage, point-virgule manquant, etc.
- `refactor`: Refactoring de code
- `test`: Ajout ou modification de tests
- `chore`: Tâches de maintenance (build, dépendances, etc.)
- `perf`: Amélioration de performance
- `ci`: Changements dans CI/CD

### Exemples

```bash
feat(api): ajout de l'endpoint /databases/available
fix(backend): correction du chiffrement des mots de passe
docs(readme): mise à jour de la documentation d'installation
test(frontend): ajout de tests pour le composant App
refactor(store): simplification de la gestion des versions
chore(deps): mise à jour de fastify vers 4.28.1
```

### Scope (optionnel)

- `api`, `backend`, `frontend`, `scheduler`, `docs`, `ci`, etc.

---

## Structure des Branches

### Branches Principales

- `main` : Production (code stable et testé)
- `develop` : Développement (intégration des features)

### Branches de Fonctionnalité

- `feature/nom-fonctionnalite` : Nouvelle fonctionnalité
- `fix/nom-bug` : Correction de bug
- `docs/nom-doc` : Documentation
- `refactor/nom-refactor` : Refactoring

### Workflow

```
main ← develop ← feature/xxx
              ← fix/xxx
              ← docs/xxx
```

1. Créer une branche depuis `develop`
2. Développer et tester
3. Créer une PR vers `develop`
4. Après review et merge, `develop` est mergé dans `main` pour release

---

## Tests

### Exigences

- Tous les nouveaux tests doivent passer
- Les tests existants doivent continuer à passer
- Couverture de code maintenue ou améliorée

### Exécuter les Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Écrire des Tests

- Tests unitaires pour les fonctions isolées
- Tests d'intégration pour les flux complets
- Tests de sécurité pour les fonctionnalités sensibles

---

## Documentation

### Mise à Jour de la Documentation

- Mettre à jour le README si nécessaire
- Ajouter des exemples d'utilisation
- Documenter les nouvelles fonctionnalités dans `docs/`
- Mettre à jour le CHANGELOG.md

### Format de Documentation

- Utiliser Markdown
- Ajouter des exemples de code
- Inclure des captures d'écran si applicable

---

## Review Process

### Avant de Soumettre une PR

- [ ] Code suit les conventions
- [ ] Tests passent localement
- [ ] Documentation mise à jour
- [ ] Pas de warnings ou erreurs
- [ ] Commit messages suivent les conventions

### Pendant la Review

- Répondre aux commentaires
- Faire les modifications demandées
- Tester à nouveau après modifications

---

## Questions ?

Si vous avez des questions, n'hésitez pas à :
- Ouvrir une issue
- Créer une discussion
- Contacter les mainteneurs

---

**Merci de contribuer à SafeBase !**

