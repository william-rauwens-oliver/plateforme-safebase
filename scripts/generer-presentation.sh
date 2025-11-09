#!/bin/bash
# Script pour générer la présentation SafeBase

echo "=== Génération de la Présentation SafeBase ==="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier si Marp CLI est installé
if ! command -v marp &> /dev/null; then
    echo -e "${YELLOW}⚠️  Marp CLI n'est pas installé${NC}"
    echo ""
    echo "Installation de Marp CLI..."
    echo ""
    
    # Vérifier si npm est disponible
    if command -v npm &> /dev/null; then
        echo "Installation via npm..."
        npm install -g @marp-team/marp-cli
    elif command -v brew &> /dev/null; then
        echo "Installation via Homebrew..."
        brew install marp-cli
    else
        echo -e "${YELLOW}❌ npm ou Homebrew requis pour installer Marp CLI${NC}"
        echo ""
        echo "Options alternatives :"
        echo "1. Installer npm : https://nodejs.org/"
        echo "2. Installer Homebrew : https://brew.sh/"
        echo "3. Utiliser l'extension VS Code 'Marp for VS Code'"
        echo "4. Utiliser https://web.marp.app/ (en ligne)"
        exit 1
    fi
fi

# Vérifier que Marp est maintenant installé
if ! command -v marp &> /dev/null; then
    echo -e "${YELLOW}❌ Échec de l'installation de Marp CLI${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Marp CLI installé${NC}"
echo ""

# Aller dans le répertoire du projet
cd "$(dirname "$0")/.." || exit 1

# Créer le répertoire de sortie si nécessaire
mkdir -p docs

echo -e "${BLUE}Génération de la présentation...${NC}"
echo ""

# Générer HTML
echo "1. Génération HTML..."
marp docs/PRESENTATION.md --html -o docs/presentation.html
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ HTML généré : docs/presentation.html${NC}"
else
    echo -e "${YELLOW}⚠️  Erreur lors de la génération HTML${NC}"
fi
echo ""

# Générer PDF
echo "2. Génération PDF..."
marp docs/PRESENTATION.md --pdf -o docs/presentation.pdf
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PDF généré : docs/presentation.pdf${NC}"
else
    echo -e "${YELLOW}⚠️  Erreur lors de la génération PDF (Puppeteer peut être requis)${NC}"
fi
echo ""

echo "========================================"
echo -e "${GREEN}✓ Présentation générée avec succès !${NC}"
echo "========================================"
echo ""
echo "📍 Fichiers générés :"
echo "  - docs/presentation.html (ouvrir dans le navigateur)"
echo "  - docs/presentation.pdf (pour impression)"
echo ""
echo "🚀 Pour lancer le serveur de présentation :"
echo "  marp docs/PRESENTATION.md --server"
echo ""

