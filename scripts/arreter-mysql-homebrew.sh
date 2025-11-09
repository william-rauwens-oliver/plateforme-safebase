#!/bin/bash
echo "🛑 Arrêt de MySQL Homebrew pour permettre à MAMP de démarrer"
echo ""

# Arrêter le service Homebrew
echo "1. Arrêt du service MySQL Homebrew..."
brew services stop mysql 2>&1

# Arrêter tous les processus MySQL Homebrew
echo "2. Arrêt des processus MySQL Homebrew..."
pkill -f "/opt/homebrew/opt/mysql/bin/mysqld" 2>/dev/null || true
pkill -f "mysqld_safe" 2>/dev/null || true

sleep 2

# Vérifier
echo ""
echo "3. Vérification..."
if ps aux | grep -i mysql | grep -v grep | grep -q homebrew; then
    echo "❌ Des processus MySQL Homebrew sont encore en cours"
    echo "   Essayez de redémarrer votre Mac"
else
    echo "✅ MySQL Homebrew arrêté"
    echo ""
    echo "📌 Maintenant :"
    echo "   1. Ouvrez MAMP"
    echo "   2. Cliquez sur 'Start Servers'"
    echo "   3. Le bouton devrait devenir VERT ✅"
fi

