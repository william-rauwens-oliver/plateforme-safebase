#!/bin/bash

# Script pour corriger les permissions MySQL MAMP

echo "🔧 Correction des permissions MySQL MAMP..."

# Vérifier si on est sur macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Ce script est pour macOS uniquement"
    exit 1
fi

# Chemin vers les données MySQL MAMP
MYSQL_DIR="/Applications/MAMP/db/mysql80"
TMP_DIR="/Applications/MAMP/tmp/mysql"

echo "📁 Vérification des répertoires..."

# Créer le fichier binlog.index s'il n'existe pas
if [ ! -f "$MYSQL_DIR/binlog.index" ]; then
    echo "📝 Création du fichier binlog.index..."
    touch "$MYSQL_DIR/binlog.index" 2>/dev/null || {
        echo "⚠️  Impossible de créer le fichier sans sudo"
        echo "💡 Exécutez cette commande manuellement :"
        echo "   sudo touch $MYSQL_DIR/binlog.index"
        echo "   sudo chmod 644 $MYSQL_DIR/binlog.index"
    }
fi

# Nettoyer les fichiers temporaires
echo "🧹 Nettoyage des fichiers temporaires..."
rm -rf "$TMP_DIR"/* 2>/dev/null

echo ""
echo "✅ Corrections appliquées !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Redémarrez MAMP"
echo "   2. Cliquez sur 'Start Servers'"
echo "   3. Le voyant devrait passer au vert"
echo ""
echo "💡 Si ça ne fonctionne toujours pas, exécutez :"
echo "   sudo chmod -R 755 $MYSQL_DIR"
echo "   sudo chown -R $(whoami):admin $MYSQL_DIR"

