#!/bin/bash

# Script pour mettre à jour toutes les branches feature avec main

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

git checkout main
git pull origin main

for branch in "${BRANCHES[@]}"; do
  echo "=== Mise à jour de $branch ==="
  
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
  
  # Merger main dans la branche
  echo "  → Merge de main..."
  git merge main --no-edit -m "Merge main: nettoyage documentation" 2>&1 | tee /tmp/merge_output.txt
  
  if grep -q "CONFLICT" /tmp/merge_output.txt; then
    echo "  ⚠️  Conflits détectés, résolution automatique..."
    # Résoudre les conflits en faveur de main pour les fichiers de documentation
    git checkout --theirs COMMENT-FAIRE-LE-DIAPORAMA.md GENERER-DIAPORAMA.md 2>/dev/null
    git rm -f COMMENT-FAIRE-LE-DIAPORAMA.md GENERER-DIAPORAMA.md 2>/dev/null
    git add -A
    git commit --no-edit 2>/dev/null || git rebase --abort 2>/dev/null
  fi
  
  if [ $? -eq 0 ] && ! git diff --quiet HEAD origin/"$branch" 2>/dev/null; then
    echo "  ✅ $branch mise à jour"
    git push origin "$branch" 2>&1 | head -3
  else
    echo "  ℹ️  $branch: déjà à jour ou pas de changements"
  fi
  
  echo ""
  git checkout main
done

rm -f /tmp/merge_output.txt
echo "✅ Mise à jour terminée"

