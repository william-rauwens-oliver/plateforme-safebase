#!/bin/bash

# Script pour générer le diaporama SafeBase
# Options : PDF via Marp Web ou HTML local

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PRESENTATION_FILE="$PROJECT_ROOT/docs/PRESENTATION.md"

echo "🎯 Génération du Diaporama SafeBase"
echo "===================================="
echo ""

# Vérifier que le fichier existe
if [ ! -f "$PRESENTATION_FILE" ]; then
    echo "❌ Erreur : $PRESENTATION_FILE n'existe pas"
    exit 1
fi

echo "✅ Fichier trouvé : $PRESENTATION_FILE"
echo ""

# Vérifier si Marp CLI est installé
if command -v marp &> /dev/null; then
    echo "📦 Marp CLI détecté"
    echo ""
    echo "Options disponibles :"
    echo "1. Générer un PDF (recommandé)"
    echo "2. Générer un HTML"
    echo "3. Ouvrir dans Marp Web (en ligne)"
    echo ""
    read -p "Choisissez une option (1-3) : " choice
    
    case $choice in
        1)
            echo ""
            echo "📄 Génération du PDF..."
            cd "$PROJECT_ROOT"
            marp "$PRESENTATION_FILE" --pdf --output "$PROJECT_ROOT/docs/PRESENTATION.pdf"
            echo ""
            echo "✅ PDF généré : docs/PRESENTATION.pdf"
            echo ""
            echo "💡 Pour ouvrir :"
            echo "   open docs/PRESENTATION.pdf"
            ;;
        2)
            echo ""
            echo "🌐 Génération du HTML..."
            cd "$PROJECT_ROOT"
            marp "$PRESENTATION_FILE" --html --output "$PROJECT_ROOT/docs/PRESENTATION.html"
            echo ""
            echo "✅ HTML généré : docs/PRESENTATION.html"
            echo ""
            echo "💡 Pour ouvrir :"
            echo "   open docs/PRESENTATION.html"
            ;;
        3)
            echo ""
            echo "🌐 Ouverture dans Marp Web..."
            echo ""
            echo "📋 Instructions :"
            echo "1. Ouvrez https://web.marp.app/"
            echo "2. Copiez le contenu de docs/PRESENTATION.md"
            echo "3. Collez dans l'éditeur"
            echo "4. Exportez en PDF"
            echo ""
            read -p "Appuyez sur Entrée pour ouvrir le fichier dans votre éditeur..."
            if command -v code &> /dev/null; then
                code "$PRESENTATION_FILE"
            elif command -v nano &> /dev/null; then
                nano "$PRESENTATION_FILE"
            else
                open "$PRESENTATION_FILE"
            fi
            ;;
        *)
            echo "❌ Option invalide"
            exit 1
            ;;
    esac
else
    echo "⚠️  Marp CLI n'est pas installé"
    echo ""
    echo "📋 Options disponibles :"
    echo ""
    echo "Option 1 : Marp Web (Recommandé - 2 minutes)"
    echo "-------------------------------------------"
    echo "1. Ouvrez https://web.marp.app/"
    echo "2. Ouvrez le fichier : $PRESENTATION_FILE"
    echo "3. Copiez tout le contenu (Cmd+A, Cmd+C)"
    echo "4. Collez dans l'éditeur Marp Web"
    echo "5. Cliquez sur 'Export' → 'PDF'"
    echo "6. Téléchargez le PDF"
    echo ""
    echo "Option 2 : Installer Marp CLI"
    echo "-----------------------------"
    echo "npm install -g @marp-team/marp-cli"
    echo "Puis relancez ce script"
    echo ""
    echo "Option 3 : VS Code Extension"
    echo "---------------------------"
    echo "1. Installez l'extension 'Marp for VS Code'"
    echo "2. Ouvrez docs/PRESENTATION.md"
    echo "3. Cliquez sur l'icône 'Open Preview'"
    echo "4. Exportez en PDF"
    echo ""
    
    read -p "Voulez-vous ouvrir le fichier maintenant ? (o/n) : " open_file
    if [ "$open_file" = "o" ] || [ "$open_file" = "O" ]; then
        if command -v code &> /dev/null; then
            code "$PRESENTATION_FILE"
        elif command -v nano &> /dev/null; then
            nano "$PRESENTATION_FILE"
        else
            open "$PRESENTATION_FILE"
        fi
    fi
fi

echo ""
echo "✨ Terminé !"

