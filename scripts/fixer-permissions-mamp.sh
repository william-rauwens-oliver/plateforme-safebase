#!/bin/bash
echo "🔧 Correction des permissions MAMP MySQL"
echo "========================================"
echo ""
echo "⚠️  Ce script nécessite votre mot de passe administrateur"
echo ""

# Arrêter MAMP d'abord
echo "1. Arrêt de MAMP..."
pkill -f MAMP.app 2>&1 || true
sleep 2

# Corriger les permissions
echo ""
echo "2. Correction des permissions sur /Applications/MAMP/db/mysql80..."
sudo chmod -R 755 /Applications/MAMP/db/mysql80
sudo chown -R $(whoami):admin /Applications/MAMP/db/mysql80

echo ""
echo "3. Correction des permissions sur /Applications/MAMP/tmp/mysql..."
sudo chmod -R 755 /Applications/MAMP/tmp/mysql
sudo chown -R $(whoami):admin /Applications/MAMP/tmp/mysql

echo ""
echo "4. Création du fichier binlog.index si manquant..."
if [ ! -f "/Applications/MAMP/db/mysql80/binlog.index" ]; then
    sudo touch /Applications/MAMP/db/mysql80/binlog.index
    sudo chmod 644 /Applications/MAMP/db/mysql80/binlog.index
    sudo chown $(whoami):admin /Applications/MAMP/db/mysql80/binlog.index
    echo "   ✅ Fichier créé"
else
    echo "   ✅ Fichier existe déjà"
    sudo chmod 644 /Applications/MAMP/db/mysql80/binlog.index
    sudo chown $(whoami):admin /Applications/MAMP/db/mysql80/binlog.index
fi

echo ""
echo "✅ Permissions corrigées !"
echo ""
echo "📌 Prochaines étapes:"
echo "   1. Ouvrez MAMP"
echo "   2. Cliquez sur 'Start Servers'"
echo "   3. Le bouton devrait devenir VERT ✅"

