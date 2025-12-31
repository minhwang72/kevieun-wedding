#!/bin/bash

# 서버에서 데이터베이스 초기화 스크립트
# 사용법: ./scripts/init-database-remote.sh

echo "🔍 서버에서 데이터베이스 초기화 중..."

# SSH를 통해 원격 서버에서 SQL 파일 실행
ssh monsil-server << 'EOF'
cd /path/to/project || exit 1

# MySQL에 SQL 파일 실행
mysql -h monsilserver.iptime.org -u min -p'f8tgw3lshms!' < database-init-with-db.sql

if [ $? -eq 0 ]; then
  echo "✅ 데이터베이스 초기화 완료!"
else
  echo "❌ 데이터베이스 초기화 실패!"
  exit 1
fi
EOF

echo ""
echo "✅ 완료!"

