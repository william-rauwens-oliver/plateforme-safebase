#!/bin/bash
# Script de démarrage de l'API SafeBase avec gestion d'erreurs

echo "🚀 Démarrage de l'API SafeBase..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier la connexion PostgreSQL (optionnel, ne bloque pas le démarrage)
echo "🔍 Vérification de la connexion PostgreSQL..."
if command -v psql &> /dev/null; then
    export PGPASSWORD="${DB_PASSWORD:-safebase}"
    if psql -h "${DB_HOST:-localhost}" -p "${DB_PORT:-5432}" -U "${DB_USER:-safebase}" -d "${DB_NAME:-safebase}" -c "SELECT 1" &> /dev/null; then
        echo "✅ PostgreSQL est accessible"
    else
        echo "⚠️  PostgreSQL n'est pas accessible, l'API démarrera quand même"
        echo "💡 Assurez-vous que PostgreSQL est démarré pour utiliser toutes les fonctionnalités"
    fi
else
    echo "⚠️  psql n'est pas installé, impossible de vérifier PostgreSQL"
fi

# Démarrer l'API
echo "🎯 Démarrage de l'API..."
npm run dev

