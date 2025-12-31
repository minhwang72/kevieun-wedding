#!/bin/bash

# kevieun admin 계정 생성 스크립트
# 사용법: ./scripts/create-admin-kevieun.sh [서버URL]

SERVER_URL=${1:-"https://kevieun.eungming.com"}

echo "🔍 kevieun admin 계정 생성 중..."
echo "서버 URL: $SERVER_URL"

RESPONSE=$(curl -s -X POST "$SERVER_URL/api/admin/create" \
  -H "Content-Type: application/json" \
  -d '{"username":"kevieun","password":"dldmsgPdlagmlrms3160"}')

echo "$RESPONSE" | jq '.'

SUCCESS=$(echo "$RESPONSE" | jq -r '.success')

if [ "$SUCCESS" = "true" ]; then
  echo ""
  echo "✅ kevieun admin 계정 생성 완료!"
  echo "   username: kevieun"
  echo "   password: dldmsgPdlagmlrms3160"
else
  echo ""
  echo "❌ 계정 생성 실패!"
  echo "   응답: $RESPONSE"
  exit 1
fi

