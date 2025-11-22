# 📊 Comment Générer le Diaporama SafeBase

## 🚀 Méthode la PLUS SIMPLE (2 minutes)

### Option 1 : Marp Web (Recommandé)

1. **Aller sur** : https://web.marp.app/
2. **Ouvrir** le fichier `docs/PRESENTATION.md` dans un éditeur de texte
3. **Copier tout le contenu** (Cmd+A, Cmd+C)
4. **Coller** dans l'éditeur Marp Web
5. **Exporter en PDF** : Cliquer sur "Export" → "PDF"
6. **Télécharger** le PDF

**C'est tout !** ✅

---

## 🛠️ Méthode avec Script Automatique

Un script est disponible pour faciliter la génération :

```bash
./scripts/generer-diaporama.sh
```

Le script détecte automatiquement si Marp est installé et propose les options disponibles.

---

## 📦 Installation de Marp CLI (Optionnel)

Si tu veux générer le PDF directement depuis le terminal :

```bash
npm install -g @marp-team/marp-cli
```

Puis :

```bash
# Générer un PDF
marp docs/PRESENTATION.md --pdf --output docs/PRESENTATION.pdf

# Générer un HTML
marp docs/PRESENTATION.md --html --output docs/PRESENTATION.html
```

---

## 💻 VS Code Extension (Alternative)

1. **Installer** l'extension "Marp for VS Code" dans VS Code
2. **Ouvrir** `docs/PRESENTATION.md`
3. **Cliquer** sur l'icône "Open Preview" (en haut à droite)
4. **Exporter en PDF** : Clic droit → "Marp: Export slide deck" → "PDF"

---

## 📋 Structure du Diaporama

Le diaporama contient **20 diapositives** :

1. Titre
2. Objectif du Projet
3. Architecture Technique
4. Vue d'ensemble de l'Architecture
5. API REST - 13 Endpoints
6. Interface Utilisateur
7. Sécurité
8. Fonctionnalités Avancées
9. Tests et Qualité
10. Stack Technique
11. Statistiques du Projet
12. Compétences Démontrées
13. Démonstration
14. Flux de Données
15. Stockage des Données
16. Points Forts
17. Évolutions Futures
18. Questions & Réponses
19. Conclusion
20. Contact & Ressources

---

## ✅ Vérification

Une fois le PDF généré, vérifie que :

- ✅ Toutes les diapositives sont présentes (20 diapos)
- ✅ Le formatage est correct
- ✅ Les couleurs et styles sont appliqués
- ✅ Le fichier s'ouvre correctement

---

## 🎯 Utilisation

**Pour la soutenance :**

1. **Ouvre le PDF** sur ton ordinateur
2. **Mode Présentation** : Appuie sur F5 (ou équivalent) pour le mode plein écran
3. **Navigation** : Flèches gauche/droite pour changer de diapositive
4. **Alternative** : Utilise le mode présentation de ton lecteur PDF

**Astuce :** Tu peux aussi avoir le PDF ouvert en arrière-plan pour te guider, même si tu présentes sans diaporama !

---

## 📝 Notes

- Le diaporama est au format **Marp** (Markdown)
- Il peut être édité directement dans `docs/PRESENTATION.md`
- Les modifications sont immédiatement visibles après régénération

---

**Besoin d'aide ?** Consulte `COMMENT-FAIRE-LE-DIAPORAMA.md` pour plus de détails.

