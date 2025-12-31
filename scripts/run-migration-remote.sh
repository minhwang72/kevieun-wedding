#!/bin/bash

# 서버에서 migration API 호출
# 사용법: ./scripts/run-migration-remote.sh [서버URL]

SERVER_URL=${1:-"https://your-domain.com"}

echo "🔍 서버에서 migration 실행 중..."
echo "서버 URL: $SERVER_URL"

curl -X POST "$SERVER_URL/api/migrate" \
  -H "Content-Type: application/json" \
  | jq '.'

echo ""
echo "✅ Migration 완료!"

