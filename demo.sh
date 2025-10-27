#!/bin/bash
# Script de démonstration SafeBase
# Usage: ./demo.sh

set -e

echo "=== SafeBase - Script de Démonstration ==="
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:8080"

echo -e "${BLUE}1. Vérification de la santé de l'API${NC}"
curl -s "$API_URL/health" | jq .
echo ""

echo -e "${BLUE}2. Liste des bases de données actuelles${NC}"
curl -s "$API_URL/databases" | jq .
echo ""

echo -e "${BLUE}3. Ajout d'une base de données MySQL de test${NC}"
RESPONSE=$(curl -s -X POST "$API_URL/databases" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "demo-mysql",
    "engine": "mysql",
    "host": "mysql",
    "port": 3306,
    "username": "safebase",
    "password": "safebase",
    "database": "safebase"
  }')
echo "$RESPONSE" | jq .
DB_ID=$(echo "$RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Base ajoutée avec l'ID: $DB_ID${NC}"
echo ""

echo -e "${BLUE}4. Ajout d'une base PostgreSQL${NC}"
RESPONSE2=$(curl -s -X POST "$API_URL/databases" \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "demo-postgres",
    "engine": "postgres",
    "host": "postgres",
    "port": 5432,
    "username": "safebase",
    "password": "rootpassword",
    "database": "safebase"
  }')
echo "$RESPONSE2" | jq .
DB_ID2=$(echo "$RESPONSE2" | jq -r '.id')
echo -e "${GREEN}✓ Base PostgreSQL ajoutée avec l'ID: $DB_ID2${NC}"
echo ""

echo -e "${BLUE}5. Liste mise à jour des bases de données${NC}"
curl -s "$API_URL/databases" | jq .
echo ""

echo -e "${BLUE}6. Déclenchement d'un backup pour la première base${NC}"
curl -s -X POST "$API_URL/backup/$DB_ID" | jq .
echo -e "${GREEN}✓ Backup créé${NC}"
echo ""

echo -e "${BLUE}7. Liste des versions de backup pour la première base${NC}"
curl -s "$API_URL/backups/$DB_ID" | jq .
echo ""

echo -e "${BLUE}8. Heartbeat du scheduler${NC}"
curl -s "$API_URL/scheduler/heartbeat" | jq .
echo ""

echo -e "${YELLOW}=== Démonstration terminée ===${NC}"
echo ""
echo "Prochaines étapes:"
echo "- Ouvrir http://localhost:5173 pour l'interface frontend"
echo "- Tester la restauration avec: curl -X POST $API_URL/restore/VERSION_ID"
echo "- Voir le GUIDE-TEST.md pour plus d'exemples"

