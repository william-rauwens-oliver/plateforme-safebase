#!/bin/bash
# Script pour créer les branches feature/ avec uniquement le code de chaque fonctionnalité

set -e

INITIAL_COMMIT=$(git log --oneline --reverse | head -1 | cut -d' ' -f1)

echo "📦 Création des branches feature/ depuis le commit initial: $INITIAL_COMMIT"
echo ""

# Fonction pour créer une branche feature
create_feature_branch() {
    local branch_name=$1
    local description=$2
    
    echo "🔨 Création de $branch_name..."
    git checkout -b "$branch_name" "$INITIAL_COMMIT" 2>/dev/null || {
        git branch -D "$branch_name" 2>/dev/null || true
        git checkout -b "$branch_name" "$INITIAL_COMMIT"
    }
    echo "✅ $branch_name créée"
}

# Créer toutes les branches
create_feature_branch "feature/database-registration" "Enregistrement de bases de données"
create_feature_branch "feature/manual-backup" "Sauvegarde manuelle"
create_feature_branch "feature/bulk-backup" "Sauvegarde globale"
create_feature_branch "feature/version-management" "Gestion des versions"
create_feature_branch "feature/restore" "Restauration"
create_feature_branch "feature/scheduler" "Scheduler automatique"
create_feature_branch "feature/alerts" "Système d'alertes"
create_feature_branch "feature/encryption" "Chiffrement"
create_feature_branch "feature/ui-database-list" "UI Liste bases"
create_feature_branch "feature/ui-version-modal" "UI Modal versions"
create_feature_branch "feature/ui-search-sort" "UI Recherche/Tri"
create_feature_branch "feature/ui-theme" "UI Thème"
create_feature_branch "feature/backend-tests" "Tests backend"
create_feature_branch "feature/frontend-tests" "Tests frontend"
create_feature_branch "feature/docker-setup" "Configuration Docker"
create_feature_branch "feature/ci-cd" "CI/CD"

echo ""
echo "✅ Toutes les branches feature/ ont été créées"
echo "⚠️  Maintenant, il faut ajouter le code spécifique à chaque branche"

