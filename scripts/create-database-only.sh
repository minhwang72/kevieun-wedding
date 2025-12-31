#!/bin/bash

# 데이터베이스만 생성하는 스크립트 (root 권한 필요)
# 사용법: ./scripts/create-database-only.sh

echo "🔍 데이터베이스 생성 중 (root 권한 필요)..."

# root 사용자로 데이터베이스 생성
mysql -h monsilserver.iptime.org -u root -p << 'SQL'
CREATE DATABASE IF NOT EXISTS kevieun_wedding 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- appuser에게 권한 부여 (이미 부여되어 있을 수 있음)
GRANT ALL PRIVILEGES ON kevieun_wedding.* TO 'appuser'@'%';
FLUSH PRIVILEGES;

SELECT 'Database created successfully!' AS message;
SQL

if [ $? -eq 0 ]; then
  echo "✅ 데이터베이스 생성 완료!"
else
  echo "❌ 데이터베이스 생성 실패!"
  exit 1
fi

