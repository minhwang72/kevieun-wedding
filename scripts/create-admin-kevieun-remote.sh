#!/bin/bash

# 서버에서 kevieun admin 계정 생성
# 사용법: ./scripts/create-admin-kevieun-remote.sh [서버URL]

SERVER_URL=${1:-"https://kevieun.eungming.com"}

echo "🔍 서버에서 kevieun admin 계정 생성 중..."

# SSH를 통해 서버에서 curl 실행
ssh monsil-server << EOF
curl -X POST "$SERVER_URL/api/admin/create" \\
  -H "Content-Type: application/json" \\
  -d '{"username":"kevieun","password":"dldmsgPdlagmlrms3160"}' \\
  | jq '.'
EOF

echo ""
echo "✅ 완료!"

