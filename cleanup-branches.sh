#!/bin/bash

# Script pour nettoyer toutes les branches feature

BRANCHES=(
  "feature/alerts"
  "feature/backend-tests"
  "feature/bulk-backup"
  "feature/ci-cd"
  "feature/database-registration"
  "feature/docker-setup"
  "feature/encryption"
  "feature/frontend-tests"
  "feature/manual-backup"
  "feature/restore"
  "feature/scheduler"
  "feature/ui-database-list"
  "feature/ui-search-sort"
  "feature/ui-theme"
  "feature/ui-version-modal"
  "feature/version-management"
)

FILES_TO_DELETE=(
  "COMMENT-FAIRE-LE-DIAPORAMA.md"
  "GENERER-DIAPORAMA.md"
  "GUIDE-PRESENTATION-SIMPLE.md"
  "docs/ANALYSE-COMPLETE-CONFORMITE.md"
  "docs/ANALYSE-FINALE-COMPLETE.md"
  "docs/ANALYSE-FINALE-CONSIGNE-COMPLETE.md"
  "docs/ARCHITECTURE.md"
  "docs/BUT-DU-PROJET.md"
  "docs/CI-CD.md"
  "docs/FEATURES-BRANCHES.md"
  "docs/GIT-WORKFLOW.md"
  "docs/GUIDE-PRESENTATION.md"
  "docs/MAQUETTE-INTERFACE.md"
  "docs/METHODOLOGIE-PROJET.md"
  "docs/POINTS-A-VERIFIER.md"
  "docs/README.md"
  "docs/RESUME-PROJET.md"
  "docs/SCHEMA-DONNEES-MCD-MLD-MPD.md"
  "docs/SECURITE-MOTS-DE-PASSE.md"
  "docs/SECURITE-SECRETS.md"
  "docs/SOUTENANCE.md"
  "docs/USER-STORIES.md"
  "docs/analyse"
  "docs/depannage"
  "docs/guides"
  "scripts/generer-diaporama.sh"
  "scripts/generer-presentation.sh"
)

git checkout main

for branch in "${BRANCHES[@]}"; do
  echo "=== Nettoyage de $branch ==="
  
  # Vérifier si la branche existe localement
  if git show-ref --verify --quiet refs/heads/"$branch"; then
    git checkout "$branch" 2>/dev/null
  else
    git checkout -b "$branch" "origin/$branch" 2>/dev/null
  fi
  
  if [ $? -ne 0 ]; then
    echo "❌ Impossible de checkout $branch"
    git checkout main
    continue
  fi
  
  # Supprimer les fichiers s'ils existent
  has_changes=false
  for file in "${FILES_TO_DELETE[@]}"; do
    if [ -e "$file" ] || [ -d "$file" ]; then
      git rm -rf "$file" 2>/dev/null && has_changes=true
    fi
  done
  
  # Commit si des changements
  if [ "$has_changes" = true ]; then
    git commit -m "Nettoyage: suppression documentation redondante" 2>/dev/null
    if [ $? -eq 0 ]; then
      echo "✅ $branch nettoyée et commitée"
      git push origin "$branch" 2>/dev/null && echo "✅ $branch pushée sur GitHub"
    else
      echo "⚠️  $branch: pas de changements à commiter"
    fi
  else
    echo "ℹ️  $branch: déjà propre"
  fi
  
  echo ""
done

git checkout main
echo "✅ Nettoyage terminé"

