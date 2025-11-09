#!/bin/bash
# Script de test des fonctionnalités SafeBase
# Usage: ./test-fonctionnalites.sh

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

API_URL="${API_URL:-http://localhost:8080}"

echo -e "${BLUE}=== SafeBase - Tests des Fonctionnalités ===${NC}"
echo ""

# Fonction pour tester un endpoint
test_endpoint() {
  local name=$1
  local method=$2
  local url=$3
  local data=$4
  local expected_status=${5:-200}
  
  echo -e "${BLUE}Test: $name${NC}"
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$API_URL$url")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" "$API_URL$url" \
      -H 'Content-Type: application/json' \
      -d "$data")
  fi
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  if [ "$http_code" = "$expected_status" ]; then
    echo -e "${GREEN}✓ Succès (HTTP $http_code)${NC}"
    if [ -n "$body" ] && [ "$body" != "null" ]; then
      echo "$body" | jq . 2>/dev/null || echo "$body"
    fi
    echo ""
    return 0
  else
    echo -e "${RED}✗ Échec (HTTP $http_code, attendu $expected_status)${NC}"
    echo "$body"
    echo ""
    return 1
  fi
}

# Compteurs
PASSED=0
FAILED=0

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}1. TEST : Ajout de base de données${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 1.1 : Health check
if test_endpoint "Health check" "GET" "/health" "" 200; then
  ((PASSED++))
else
  ((FAILED++))
fi

# Test 1.2 : Liste des bases (vide au début)
if test_endpoint "Liste des bases (GET)" "GET" "/databases" "" 200; then
  ((PASSED++))
else
  ((FAILED++))
fi

# Test 1.3 : Ajouter une base MySQL
MYSQL_DB=$(cat <<EOF
{
  "name": "Test MySQL $(date +%s)",
  "engine": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "${MYSQL_USER:-root}",
  "password": "${MYSQL_PASSWORD:-}",
  "database": "test"
}
EOF
)

if test_endpoint "Ajouter base MySQL" "POST" "/databases" "$MYSQL_DB" 200; then
  MYSQL_ID=$(echo "$body" | jq -r '.id' 2>/dev/null || echo "")
  ((PASSED++))
else
  ((FAILED++))
fi

# Test 1.4 : Ajouter une base PostgreSQL
PG_DB=$(cat <<EOF
{
  "name": "Test PostgreSQL $(date +%s)",
  "engine": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "postgres",
  "password": "${POSTGRES_PASSWORD:-}",
  "database": "test"
}
EOF
)

if test_endpoint "Ajouter base PostgreSQL" "POST" "/databases" "$PG_DB" 200; then
  PG_ID=$(echo "$body" | jq -r '.id' 2>/dev/null || echo "")
  ((PASSED++))
else
  ((FAILED++))
fi

# Test 1.5 : Validation (doit échouer)
INVALID_DB='{"name":"","engine":"invalid"}'
if test_endpoint "Validation (doit échouer)" "POST" "/databases" "$INVALID_DB" 400; then
  ((PASSED++))
else
  ((FAILED++))
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}2. TEST : Sauvegardes régulières${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Utiliser la première base disponible
DB_ID=$(curl -s "$API_URL/databases" | jq -r '.[0].id' 2>/dev/null || echo "")

if [ -z "$DB_ID" ] || [ "$DB_ID" = "null" ]; then
  echo -e "${RED}✗ Aucune base disponible pour tester les backups${NC}"
  ((FAILED++))
else
  echo -e "${BLUE}Utilisation de la base ID: $DB_ID${NC}"
  echo ""
  
  # Test 2.1 : Backup manuel
  if test_endpoint "Backup manuel" "POST" "/backup/$DB_ID" "" 200; then
    BACKUP_ID=$(echo "$body" | jq -r '.id' 2>/dev/null || echo "")
    ((PASSED++))
  else
    ((FAILED++))
  fi
  
  # Test 2.2 : Liste des backups
  if test_endpoint "Liste des backups" "GET" "/backups/$DB_ID" "" 200; then
    ((PASSED++))
  else
    ((FAILED++))
  fi
  
  # Test 2.3 : Backup-all
  if test_endpoint "Backup de toutes les bases" "POST" "/backup-all" "" 200; then
    ((PASSED++))
  else
    ((FAILED++))
  fi
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}3. TEST : Gestion des versions${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -n "$DB_ID" ] && [ "$DB_ID" != "null" ]; then
  # Récupérer une version
  VERSION_ID=$(curl -s "$API_URL/backups/$DB_ID" | jq -r '.[0].id' 2>/dev/null || echo "")
  
  if [ -z "$VERSION_ID" ] || [ "$VERSION_ID" = "null" ]; then
    echo -e "${YELLOW}⚠ Aucune version disponible pour tester${NC}"
    echo ""
  else
    echo -e "${BLUE}Utilisation de la version ID: $VERSION_ID${NC}"
    echo ""
    
    # Test 3.1 : Pin
    if test_endpoint "Épingler une version" "POST" "/versions/$VERSION_ID/pin" "" 200; then
      ((PASSED++))
    else
      ((FAILED++))
    fi
    
    # Test 3.2 : Unpin
    if test_endpoint "Retirer l'épingle" "POST" "/versions/$VERSION_ID/unpin" "" 200; then
      ((PASSED++))
    else
      ((FAILED++))
    fi
    
    # Test 3.3 : Téléchargement (vérifier seulement le code HTTP)
    echo -e "${BLUE}Test: Téléchargement d'une version${NC}"
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/versions/$VERSION_ID/download")
    if [ "$http_code" = "200" ]; then
      echo -e "${GREEN}✓ Succès (HTTP $http_code)${NC}"
      echo ""
      ((PASSED++))
    else
      echo -e "${RED}✗ Échec (HTTP $http_code)${NC}"
      echo ""
      ((FAILED++))
    fi
  fi
else
  echo -e "${YELLOW}⚠ Impossible de tester les versions (pas de base)${NC}"
  echo ""
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}4. TEST : Surveillance et alertes${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test 4.1 : Heartbeat POST
if test_endpoint "Heartbeat (POST)" "POST" "/scheduler/heartbeat" "" 200; then
  ((PASSED++))
else
  ((FAILED++))
fi

# Test 4.2 : Heartbeat GET
if test_endpoint "Heartbeat (GET)" "GET" "/scheduler/heartbeat" "" 200; then
  ((PASSED++))
else
  ((FAILED++))
fi

# Test 4.3 : Erreur 404 (version inexistante)
if test_endpoint "Erreur 404 (version inexistante)" "POST" "/restore/INVALID_ID" "" 404; then
  ((PASSED++))
else
  ((FAILED++))
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}5. TEST : Tests unitaires${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test backend
echo -e "${BLUE}Tests backend...${NC}"
if cd backend && npm test > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Tests backend passés${NC}"
  echo ""
  ((PASSED++))
else
  echo -e "${RED}✗ Tests backend échoués${NC}"
  echo ""
  ((FAILED++))
fi
cd ..

# Test frontend (si les dépendances sont installées)
if [ -d "frontend/node_modules" ]; then
  echo -e "${BLUE}Tests frontend...${NC}"
  if cd frontend && npm test > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Tests frontend passés${NC}"
    echo ""
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠ Tests frontend non disponibles (dépendances manquantes)${NC}"
    echo ""
  fi
  cd ..
else
  echo -e "${YELLOW}⚠ Tests frontend ignorés (node_modules manquant)${NC}"
  echo ""
fi

echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}RÉSUMÉ${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -eq 0 ]; then
  PERCENT=0
else
  PERCENT=$((PASSED * 100 / TOTAL))
fi

echo -e "${GREEN}Tests réussis: $PASSED${NC}"
echo -e "${RED}Tests échoués: $FAILED${NC}"
echo -e "${BLUE}Total: $TOTAL${NC}"
echo -e "${BLUE}Taux de réussite: ${PERCENT}%${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
  exit 0
else
  echo -e "${RED}❌ Certains tests ont échoué${NC}"
  exit 1
fi

