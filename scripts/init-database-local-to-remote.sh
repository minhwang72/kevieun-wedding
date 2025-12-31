#!/bin/bash

# 로컬에서 SQL 파일을 서버로 전송 후 실행
# 사용법: ./scripts/init-database-local-to-remote.sh

echo "🔍 로컬에서 SQL 파일을 서버로 전송 후 실행 중..."

# SQL 파일을 서버로 전송
scp database-init-with-db.sql monsil-server:/tmp/database-init-with-db.sql

if [ $? -ne 0 ]; then
  echo "❌ 파일 전송 실패!"
  exit 1
fi

# SSH를 통해 원격 서버에서 SQL 파일 실행
ssh monsil-server << 'EOF'
mysql -h monsilserver.iptime.org -u min -p'f8tgw3lshms!' < /tmp/database-init-with-db.sql

if [ $? -eq 0 ]; then
  echo "✅ 데이터베이스 초기화 완료!"
  rm /tmp/database-init-with-db.sql
else
  echo "❌ 데이터베이스 초기화 실패!"
  exit 1
fi
EOF

echo ""
echo "✅ 완료!"

