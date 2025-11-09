# 🔄 CI/CD Pipeline - Plateforme SafeBase

## 📋 Vue d'ensemble

Le projet utilise **GitHub Actions** pour automatiser les tests, le linting et la vérification des builds Docker.

## 🚀 Pipeline CI/CD

### Fichier de configuration

`.github/workflows/ci.yml`

### Jobs

#### 1. **Backend - Tests & Lint**
- ✅ Installation des dépendances (`npm ci`)
- ✅ Exécution du linter (`npm run lint`)
- ✅ Build du projet (`npm run build`)
- ✅ Exécution des tests (`npm test`)

#### 2. **Frontend - Tests & Lint**
- ✅ Installation des dépendances (`npm ci`)
- ✅ Exécution du linter (`npm run lint`)
- ✅ Build du projet (`npm run build`)
- ✅ Exécution des tests (`npm test`)

#### 3. **Docker - Build Check**
- ✅ Vérification que les Dockerfiles sont valides
- ✅ Build des images Docker (backend, frontend, scheduler)
- ✅ Utilisation du cache GitHub Actions pour accélérer les builds

## 🔧 Déclencheurs

Le pipeline se déclenche automatiquement sur :
- ✅ **Push** sur les branches `main` et `develop`
- ✅ **Pull Request** vers `main` et `develop`

## 📊 Résultats

### En cas de succès
- ✅ Tous les tests passent
- ✅ Le linter ne trouve pas d'erreurs
- ✅ Les builds sont réussis
- ✅ Les images Docker sont valides

### En cas d'échec
- ❌ Le pipeline s'arrête et signale l'erreur
- 📧 Notification GitHub (si configurée)
- 🔍 Logs détaillés disponibles dans l'onglet "Actions"

## 🎯 Conformité aux Consignes

**Consigne** : "Contribuer à la mise en production dans une démarche DevOps (Test automatisés (CI/CD), Linter, Suivi des logs)"

**Implémentation** :
- ✅ **CI/CD** : Pipeline GitHub Actions
- ✅ **Tests automatisés** : Backend + Frontend
- ✅ **Linter** : ESLint pour backend et frontend
- ✅ **Suivi des logs** : Fastify logger + logs GitHub Actions

## 📝 Utilisation

### Voir le statut du pipeline

1. Aller sur GitHub
2. Onglet **"Actions"**
3. Voir les dernières exécutions du pipeline

### Exécuter localement

```bash
# Backend
cd backend
npm run lint
npm run build
npm test

# Frontend
cd frontend
npm run lint
npm run build
npm test
```

## 🔍 Détails Techniques

### Node.js Version
- Version utilisée : **Node.js 20**
- Cache npm activé pour accélérer les installations

### Docker Buildx
- Utilisation de Docker Buildx pour les builds multi-plateformes
- Cache GitHub Actions pour optimiser les builds

### Cache
- Cache npm pour les dépendances
- Cache Docker pour les images

## ✅ Statut

**CI/CD : ✅ CONFORME**

Le pipeline est configuré et fonctionnel. Il vérifie automatiquement :
- La qualité du code (linter)
- La compilation (build)
- Les tests unitaires
- La validité des Dockerfiles

---

**Le projet respecte les exigences DevOps des consignes !** ✅

