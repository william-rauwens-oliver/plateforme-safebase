# 🌳 Git Workflow - SafeBase

Ce document décrit la stratégie de gestion des branches et le workflow Git utilisé dans le projet SafeBase.

## 📋 Structure des Branches

### Branches Principales

#### `main`
- **Rôle** : Branche de production
- **Protection** : ✅ Protégée (pas de push direct)
- **Contenu** : Code stable, testé et prêt pour la production
- **Merge** : Uniquement depuis `develop` via Pull Request

#### `develop`
- **Rôle** : Branche de développement
- **Protection** : ✅ Protégée (pas de push direct)
- **Contenu** : Code en cours de développement
- **Merge** :** Depuis les branches de fonctionnalité via Pull Request

### Branches de Fonctionnalité

#### `feature/nom-fonctionnalite`
- **Rôle** : Développement d'une nouvelle fonctionnalité
- **Base** : Créée depuis `develop`
- **Merge** : Vers `develop` via Pull Request
- **Exemple** : `feature/ajout-export-csv`

#### `fix/nom-bug`
- **Rôle** : Correction d'un bug
- **Base** : Créée depuis `develop`
- **Merge** : Vers `develop` via Pull Request
- **Exemple** : `fix/correction-chiffrement`

#### `docs/nom-doc`
- **Rôle** : Amélioration de la documentation
- **Base** : Créée depuis `develop`
- **Merge** : Vers `develop` via Pull Request
- **Exemple** : `docs/ajout-guide-installation`

#### `refactor/nom-refactor`
- **Rôle** : Refactoring de code
- **Base** : Créée depuis `develop`
- **Merge** : Vers `develop` via Pull Request
- **Exemple** : `refactor/simplification-store`

#### `chore/nom-chore`
- **Rôle** : Tâches de maintenance
- **Base** : Créée depuis `develop`
- **Merge** : Vers `develop` via Pull Request
- **Exemple** : `chore/mise-a-jour-dependances`

#### `test/nom-test`
- **Rôle** : Ajout ou amélioration de tests
- **Base** : Créée depuis `develop`
- **Merge** : Vers `develop` via Pull Request
- **Exemple** : `test/ajout-tests-integration`

## 🔄 Workflow Git Flow

### 1. Créer une Nouvelle Fonctionnalité

```bash
# Se placer sur develop
git checkout develop
git pull origin develop

# Créer une nouvelle branche
git checkout -b feature/ma-fonctionnalite

# Développer...
git add .
git commit -m "feat(api): ajout de la fonctionnalité X"

# Pousser la branche
git push origin feature/ma-fonctionnalite
```

### 2. Créer une Pull Request

1. Aller sur GitHub
2. Créer une Pull Request depuis `feature/ma-fonctionnalite` vers `develop`
3. Remplir le template de PR
4. Attendre la review
5. Corriger les commentaires si nécessaire
6. Merge après approbation

### 3. Release vers Production

```bash
# Se placer sur develop
git checkout develop
git pull origin develop

# Créer une branche release (optionnel)
git checkout -b release/v1.0.0

# Finaliser la release
# ... corrections de dernière minute ...

# Merge dans main
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags

# Merge dans develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

## 📝 Conventions de Commit

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
- `chore`: Tâches de maintenance
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

## 🔒 Protection des Branches

### Branches Protégées

- `main` : Requiert une PR, review approuvée, tests passants
- `develop` : Requiert une PR, review approuvée, tests passants

### Règles de Protection

1. **Pas de push direct** : Impossible de push directement sur `main` ou `develop`
2. **Pull Request requise** : Tous les changements doivent passer par une PR
3. **Review requise** : Au moins une review approuvée
4. **Tests requis** : Tous les tests CI/CD doivent passer
5. **Pas de merge direct** : Merge uniquement via GitHub interface

## 🧹 Nettoyage des Branches

### Après Merge

Les branches mergées peuvent être supprimées :

```bash
# Supprimer localement
git branch -d feature/ma-fonctionnalite

# Supprimer sur GitHub (via interface ou)
git push origin --delete feature/ma-fonctionnalite
```

## 📊 Diagramme de Workflow

```
main (production)
  ↑
  │ (release)
  │
develop (développement)
  ↑
  │ (merge via PR)
  │
  ├── feature/xxx
  ├── fix/xxx
  ├── docs/xxx
  ├── refactor/xxx
  ├── chore/xxx
  └── test/xxx
```

## ✅ Checklist avant PR

- [ ] Code suit les conventions
- [ ] Tests passent localement
- [ ] Documentation mise à jour
- [ ] Commit messages suivent les conventions
- [ ] Pas de warnings ou erreurs
- [ ] Code review effectuée (auto-review)

## 🚀 Commandes Utiles

```bash
# Voir toutes les branches
git branch -a

# Voir les branches mergées
git branch --merged

# Voir les branches non mergées
git branch --no-merged

# Supprimer une branche locale
git branch -d nom-branche

# Supprimer une branche distante
git push origin --delete nom-branche

# Synchroniser avec origin
git fetch origin
git checkout develop
git pull origin develop
```

---

**Pour plus de détails, voir [CONTRIBUTING.md](../CONTRIBUTING.md)**

