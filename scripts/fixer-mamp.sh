#!/bin/bash
echo "🔧 Script de réparation MAMP"
echo "============================"
echo ""

# 1. Arrêter tous les MySQL
echo "1. Arrêt de tous les processus MySQL..."
brew services stop mysql 2>&1 || true
pkill -f mysqld 2>&1 || true
pkill -f mysqld_safe 2>&1 || true
sleep 2

# 2. Vérifier les ports
echo ""
echo "2. Vérification des ports..."
if lsof -i :8889 > /dev/null 2>&1; then
    echo "   ⚠️  Le port 8889 est encore utilisé"
    lsof -i :8889 | head -3
    echo "   Essayez de tuer le processus manuellement"
else
    echo "   ✅ Port 8889 libre"
fi

if lsof -i :8888 > /dev/null 2>&1; then
    echo "   ⚠️  Le port 8888 est encore utilisé"
    lsof -i :8888 | head -3
else
    echo "   ✅ Port 8888 libre"
fi

# 3. Nettoyer les fichiers de verrouillage
echo ""
echo "3. Nettoyage des fichiers de verrouillage..."
if [ -d "/Applications/MAMP/tmp/mysql" ]; then
    sudo rm -rf /Applications/MAMP/tmp/mysql/*.pid 2>&1 || true
    sudo rm -rf /Applications/MAMP/tmp/mysql/*.sock 2>&1 || true
    echo "   ✅ Fichiers de verrouillage supprimés"
else
    echo "   ⚠️  Dossier tmp/mysql non trouvé"
fi

# 4. Vérifier les permissions
echo ""
echo "4. Vérification des permissions..."
if [ -w "/Applications/MAMP/db/mysql57" ]; then
    echo "   ✅ Permissions OK"
else
    echo "   ⚠️  Problème de permissions sur /Applications/MAMP/db/mysql57"
    echo "   Essayez: sudo chmod -R 755 /Applications/MAMP/db/mysql57"
fi

# 5. Afficher les logs récents
echo ""
echo "5. Dernières erreurs dans les logs MySQL MAMP:"
if [ -f "/Applications/MAMP/logs/mysql_error_log.err" ]; then
    tail -5 /Applications/MAMP/logs/mysql_error_log.err 2>&1 | sed 's/^/   /'
else
    echo "   ⚠️  Fichier de log non trouvé"
fi

echo ""
echo "✅ Réparation terminée"
echo ""
echo "📌 Prochaines étapes:"
echo "   1. Fermez complètement MAMP (Cmd+Q)"
echo "   2. Rouvrez MAMP"
echo "   3. Cliquez sur 'Stop Servers' puis 'Start Servers'"
echo "   4. Si c'est encore orange, vérifiez les logs dans MAMP > Logs"

