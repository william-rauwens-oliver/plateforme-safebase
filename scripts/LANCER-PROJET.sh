#!/bin/bash
# Script pour lancer le projet SafeBase

echo "=== SafeBase - Démarrage ==="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Démarrant le backend...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend démarré (PID: $BACKEND_PID)${NC}"
echo ""

echo -e "${BLUE}2. Attente de 3 secondes...${NC}"
sleep 3

echo -e "${BLUE}3. Vérification du backend...${NC}"
if curl -s http://localhost:8080/health > /dev/null; then
  echo -e "${GREEN}✓ Backend opérationnel${NC}"
else
  echo "⚠️ Backend non accessible"
fi
echo ""

echo -e "${BLUE}4. Démarrant le frontend...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend démarré (PID: $FRONTEND_PID)${NC}"
echo ""

echo -e "${BLUE}5. Attente de Robot...${NC}"
sleep 3

echo -e "${BLUE}6. Vérification du frontend...${NC}"
if curl -s http://localhost:5173 > /dev/null; then
  echo -e "${GREEN}✓ Frontend opérationnel${NC}"
else
  echo "⚠️ Frontend non accessible"
fi
echo ""

echo "========================================"
echo -e "${GREEN}✓ Projet démarré avec succès !${NC}"
echo "========================================"
echo ""
echo "📍 URLs :"
echo "  - API : http://localhost:8080"
echo "  - Frontend : http://localhost:5173"
echo ""
echo "🔧 Pour arrêter :"
echo "  kill $BACKEND_PID"
echo "  kill $FRONTEND_PID"
echo ""
echo "Ou dans un nouveau terminal :"
echo "  pkill -f 'tsx watch'"
echo "  pkill -f 'vite'"
echo ""

