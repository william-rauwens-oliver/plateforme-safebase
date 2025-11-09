# 🎨 Maquette Interface - SafeBase

## Vue d'Ensemble

L'interface SafeBase suit un design **minimaliste** en noir et blanc, compatible avec les thèmes clair et sombre.

## Structure de l'Interface

### En-tête
- **Titre** : "SafeBase"
- **Indicateur de santé API** : Badge vert/orange/rouge
- **Toggle thème** : Bouton clair/sombre
- **Configuration** : Bouton pour configurer l'API URL et la clé API

### Zone Principale

#### Section 1 : Ajout de Base de Données
- **Formulaire** avec champs :
  - Nom de la base
  - Moteur (MySQL/PostgreSQL)
  - Hôte
  - Port
  - Utilisateur
  - Mot de passe
  - Nom de la base de données
- **Bouton** : "Ajouter"

#### Section 2 : Liste des Bases de Données
- **Barre de recherche** : Filtre par nom
- **Tri** : Par nom, moteur, ou date de création
- **Cartes** pour chaque base avec :
  - Nom et moteur
  - Informations de connexion
  - Boutons : Backup, Versions, Copier DSN
  - Badge de santé

#### Section 3 : Actions Globales
- **Bouton** : "Sauvegarder toutes les bases"

### Modal : Gestion des Versions

#### En-tête
- **Titre** : Nom de la base
- **Bouton fermer** : X

#### Liste des Versions
- **Tri** : Versions épinglées en premier, puis par date
- **Pour chaque version** :
  - Date de création
  - Taille
  - Badge "Épinglé" si applicable
  - Actions : Restaurer, Télécharger, Épingler/Retirer, Supprimer

## Design

### Couleurs
- **Thème sombre** : Fond noir (#000), texte blanc (#fff)
- **Thème clair** : Fond blanc (#fff), texte noir (#000)
- **Accents** : Gris pour les bordures et séparateurs

### Typographie
- **Police** : Système (sans-serif)
- **Tailles** : Hiérarchie claire (h1, h2, body)
- **Poids** : Normal et bold

### Composants

#### Cartes
- Bordure fine
- Padding généreux
- Ombre légère (thème clair)

#### Boutons
- **Primaire** : Fond noir (sombre) / blanc (clair), texte inversé
- **Secondaire** : Bordure, fond transparent
- **Ghost** : Texte simple, pas de bordure

#### Formulaires
- Inputs avec bordures
- Labels clairs
- Validation visuelle

### Responsive

#### Mobile (< 768px)
- Layout en colonne unique
- Cartes pleine largeur
- Formulaire empilé
- Menu compact

#### Tablette (768px - 1024px)
- Layout adaptatif
- Cartes en grille 2 colonnes

#### Desktop (> 1024px)
- Layout optimisé
- Cartes en grille 3 colonnes
- Espacement généreux

## Interactions

### Feedback Utilisateur
- **Toasts** : Notifications en haut à droite
  - Succès (vert)
  - Erreur (rouge)
  - Info (bleu)
- **États de chargement** : Spinners et désactivation des boutons
- **Messages d'erreur** : Affichage clair dans les formulaires

### Navigation
- **Scroll fluide** : Pas de pagination
- **Recherche en temps réel** : Filtrage instantané
- **Tri dynamique** : Changement immédiat

## Accessibilité

- **Labels ARIA** : Tous les éléments interactifs
- **Contraste** : Respect des standards WCAG
- **Clavier** : Navigation complète au clavier
- **Focus** : Indicateurs visuels clairs

---

**Cette maquette a été implémentée dans `frontend/src/main.tsx` et `frontend/index.html`**

