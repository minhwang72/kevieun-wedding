#!/bin/bash

# 실제 서버의 마이그레이션 API 호출
# 사용법: ./scripts/run-migration.sh

SERVER_URL="${SERVER_URL:-http://localhost:3160}"

echo "🔍 마이그레이션 실행 중..."
echo "서버 URL: $SERVER_URL"

curl -X POST "$SERVER_URL/api/migrate" \
  -H "Content-Type: application/json" \
  | jq '.'

echo ""
echo "✅ 마이그레이션 완료"

