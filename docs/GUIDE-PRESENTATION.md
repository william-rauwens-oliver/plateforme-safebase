# 🎤 Guide d'Utilisation de la Présentation

## 📄 Format de la Présentation

La présentation est créée au format **Marp** (Markdown pour diapositives).

**Fichier :** `docs/PRESENTATION.md`

---

## 🚀 Options pour Afficher la Présentation

### Option 1 : Marp CLI (Recommandé)

#### Installation de Marp CLI

```bash
# Via npm (global)
npm install -g @marp-team/marp-cli

# Ou via Homebrew (macOS)
brew install marp-cli
```

#### Générer des diapositives HTML

```bash
cd /Applications/MAMP/htdocs/plateforme-safebase
marp docs/PRESENTATION.md --html -o docs/presentation.html
```

Ouvrez ensuite `docs/presentation.html` dans votre navigateur.

#### Générer un PDF

```bash
marp docs/PRESENTATION.md --pdf -o docs/presentation.pdf
```

#### Mode présentation (serveur local)

```bash
marp docs/PRESENTATION.md --server
```

Ouvrez http://localhost:8080 dans votre navigateur pour la présentation interactive.

---

### Option 2 : Marp for VS Code (Extension)

1. **Installer l'extension** : "Marp for VS Code" dans VS Code
2. **Ouvrir** `docs/PRESENTATION.md`
3. **Cliquer** sur l'icône "Open Preview" dans la barre d'outils
4. **Mode présentation** : Clic droit → "Marp: Open Preview to the Side"

**Avantages :**
- Prévisualisation en temps réel
- Export direct vers PDF/PPTX/HTML
- Pas besoin d'installer Marp CLI

---

### Option 3 : Marp Web (En ligne)

1. Aller sur https://web.marp.app/
2. Copier le contenu de `docs/PRESENTATION.md`
3. Coller dans l'éditeur en ligne
4. Exporter en PDF/PPTX/HTML

---

### Option 4 : PowerPoint / Google Slides (Manuel)

1. Ouvrir `docs/PRESENTATION.md` dans un éditeur de texte
2. Copier chaque section (séparée par `---`)
3. Créer une diapositive par section dans PowerPoint/Google Slides
4. Adapter le formatage si nécessaire

---

## 📊 Structure de la Présentation

La présentation contient **20 diapositives** :

1. **Titre** - SafeBase
2. **Objectif** - But du projet
3. **Architecture** - Vue d'ensemble
4. **Architecture détaillée** - Schéma
5. **API REST** - Endpoints
6. **Interface** - Design
7. **Sécurité** - Mesures
8. **Fonctionnalités** - Avancées
9. **Tests** - Qualité
10. **Stack** - Technique
11. **Statistiques** - Projet
12. **Compétences** - Démontrées
13. **Démonstration** - URLs
14. **Flux** - Données
15. **Stockage** - Données
16. **Points forts** - Projet
17. **Évolutions** - Futures
18. **Q&A** - Questions
19. **Conclusion** - Résumé
20. **Contact** - Ressources

---

## 🎨 Personnalisation

### Modifier le thème

Dans `docs/PRESENTATION.md`, vous pouvez modifier :

```yaml
---
theme: default  # ou 'gaia', 'uncover', etc.
```

### Modifier les couleurs

Dans la section `style: |`, modifiez :

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Ajouter des diapositives

Ajoutez une nouvelle section séparée par `---` :

```markdown
---

# Nouvelle Diapositive

Contenu de la diapositive...
```

---

## 💡 Conseils pour la Présentation

### Avant la présentation

1. ✅ Tester la présentation sur l'écran de projection
2. ✅ Vérifier que les URLs fonctionnent (localhost:8080, localhost:5173)
3. ✅ Préparer la démonstration (projet lancé)
4. ✅ Avoir un terminal prêt pour les commandes

### Pendant la présentation

1. **Temps recommandé** : 15-20 minutes
2. **Démonstration** : 5 minutes pour l'interface
3. **Questions** : Prévoir 5-10 minutes

### Navigation

- **Flèches** : Naviguer entre les diapositives
- **Escape** : Quitter le mode présentation
- **F** : Mode plein écran

---

## 🔧 Dépannage

### Marp CLI non trouvé

```bash
# Vérifier l'installation
which marp

# Réinstaller si nécessaire
npm install -g @marp-team/marp-cli
```

### Erreur lors de l'export PDF

Installez Puppeteer (requis pour PDF) :

```bash
npm install -g puppeteer
```

### Les diapositives ne s'affichent pas correctement

Vérifiez que le fichier commence bien par :

```yaml
---
marp: true
theme: default
---
```

---

## 📱 Formats d'Export Disponibles

- **HTML** : Pour présentation web
- **PDF** : Pour impression ou partage
- **PPTX** : Pour PowerPoint (via extension VS Code)
- **PNG** : Pour images individuelles

---

## 🎯 Exemple de Commande Complète

```bash
# Aller dans le projet
cd /Applications/MAMP/htdocs/plateforme-safebase

# Générer HTML
marp docs/PRESENTATION.md --html -o docs/presentation.html

# Générer PDF
marp docs/PRESENTATION.md --pdf -o docs/presentation.pdf

# Lancer le serveur de présentation
marp docs/PRESENTATION.md --server --port 8081
```

---

**Bonne présentation ! 🚀**

