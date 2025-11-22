#!/usr/bin/env bash
set -euo pipefail
API_URL="${SCHEDULER_API_URL:-http://api:8080}"
API_KEY_HEADER=""
if [ -n "${API_KEY:-}" ]; then
  API_KEY_HEADER="-H x-api-key:${API_KEY}"
fi
echo "[$(date -Is)] triggering backup-all at $API_URL"
if ! curl -sS -X POST "$API_URL/backup-all" ${API_KEY_HEADER}; then
  echo "backup-all request failed"
fi
echo "[$(date -Is)] sending heartbeat"
curl -sS -X POST "$API_URL/scheduler/heartbeat" ${API_KEY_HEADER} || true

