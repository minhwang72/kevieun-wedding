#!/bin/bash

# 참석의사 API 테스트 스크립트
# 사용법: ./scripts/test-attendance-api.sh [서버URL]
# 예: ./scripts/test-attendance-api.sh http://localhost:3000
# 예: ./scripts/test-attendance-api.sh https://your-domain.com

SERVER_URL="${1:-http://localhost:3000}"

echo "🧪 참석의사 API 테스트"
echo "서버 URL: $SERVER_URL"
echo ""

# 테스트 데이터 생성
echo "1️⃣ 참석의사 등록 테스트 (POST)..."
RESPONSE=$(curl -s -X POST "$SERVER_URL/api/attendance" \
  -H "Content-Type: application/json" \
  -d '{
    "side": "groom",
    "attendance": "yes",
    "meal": "yes",
    "name": "테스트하객",
    "companions": 2,
    "phone_last4": "1234"
  }')

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# 중복 체크 테스트
echo "2️⃣ 중복 체크 테스트 (동일한 이름과 휴대폰 뒷자리)..."
RESPONSE2=$(curl -s -X POST "$SERVER_URL/api/attendance" \
  -H "Content-Type: application/json" \
  -d '{
    "side": "groom",
    "attendance": "yes",
    "meal": "yes",
    "name": "테스트하객",
    "companions": 1,
    "phone_last4": "1234"
  }')

echo "$RESPONSE2" | jq '.' 2>/dev/null || echo "$RESPONSE2"
echo ""

# 목록 조회 테스트
echo "3️⃣ 참석의사 목록 조회 테스트 (GET)..."
RESPONSE3=$(curl -s -X GET "$SERVER_URL/api/attendance")
echo "$RESPONSE3" | jq '.' 2>/dev/null || echo "$RESPONSE3"
echo ""

# 신랑 하객만 조회
echo "4️⃣ 신랑 하객만 조회 테스트 (GET ?side=groom)..."
RESPONSE4=$(curl -s -X GET "$SERVER_URL/api/attendance?side=groom")
echo "$RESPONSE4" | jq '.' 2>/dev/null || echo "$RESPONSE4"
echo ""

echo "✅ 테스트 완료!"


