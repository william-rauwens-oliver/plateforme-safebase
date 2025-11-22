#!/bin/bash
# Script pour tester les sauvegardes automatiques

set -e

echo "=== Test des Sauvegardes Automatiques ==="
echo ""

API_URL="${API_URL:-http://localhost:8080}"
API_KEY_HEADER=""
if [ -n "${API_KEY:-}" ]; then
  API_KEY_HEADER="-H x-api-key:${API_KEY}"
fi

echo "1. Vérification de l'API..."
if ! curl -s "$API_URL/health" > /dev/null; then
  echo "❌ L'API n'est pas accessible sur $API_URL"
  echo "   Assurez-vous que le backend tourne : cd backend && npm run dev"
  exit 1
fi
echo "✅ API accessible"
echo ""

echo "2. Vérification du heartbeat..."
HEARTBEAT_BEFORE=$(curl -s "$API_URL/scheduler/heartbeat" | jq -r '.lastHeartbeat // "null"')
echo "   Heartbeat actuel : $HEARTBEAT_BEFORE"
echo ""

echo "3. Simulation du script backup_all.sh..."
echo "   Appel à /backup-all..."
RESULT=$(curl -s -X POST "$API_URL/backup-all" ${API_KEY_HEADER})
echo "$RESULT" | jq . 2>/dev/null || echo "$RESULT"
echo ""

echo "4. Envoi du heartbeat..."
curl -s -X POST "$API_URL/scheduler/heartbeat" ${API_KEY_HEADER} > /dev/null
HEARTBEAT_AFTER=$(curl -s "$API_URL/scheduler/heartbeat" | jq -r '.lastHeartbeat')
echo "   Nouveau heartbeat : $HEARTBEAT_AFTER"
echo ""

echo "5. Vérification des résultats..."
SUCCESS_COUNT=$(echo "$RESULT" | jq '[.results[] | select(.ok == true)] | length')
TOTAL_COUNT=$(echo "$RESULT" | jq '.results | length')

echo "   Backups réussis : $SUCCESS_COUNT / $TOTAL_COUNT"
echo ""

if [ "$SUCCESS_COUNT" -eq "$TOTAL_COUNT" ] && [ "$TOTAL_COUNT" -gt 0 ]; then
  echo "✅ Tous les backups ont réussi !"
elif [ "$TOTAL_COUNT" -eq 0 ]; then
  echo "⚠️  Aucune base de données configurée"
else
  echo "⚠️  Certains backups ont échoué"
  echo "$RESULT" | jq '.results[] | select(.ok == false)'
fi

echo ""
echo "=== Test terminé ==="

