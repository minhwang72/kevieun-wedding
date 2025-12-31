#!/bin/bash

# SSH를 통해 원격 서버의 MySQL에 attendance 테이블 생성
# 사용법: ./scripts/create-attendance-table-remote.sh

echo "🔍 원격 서버에 attendance 테이블 생성 중..."

# SSH를 통해 MySQL 명령 실행
ssh monsil-server << 'EOF'
mysql -h monsilserver.iptime.org -u min -p'f8tgw3lshms!' kevieun_wedding << 'SQL'
CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  side ENUM('groom', 'bride') NOT NULL,
  attendance ENUM('yes', 'no') NOT NULL DEFAULT 'yes',
  meal ENUM('yes', 'no', 'pending') NOT NULL DEFAULT 'pending',
  name VARCHAR(50) NOT NULL,
  companions INT NOT NULL DEFAULT 0,
  phone_last4 VARCHAR(4) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_side (side),
  INDEX idx_name_phone (name, phone_last4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 테이블 생성 확인
SHOW TABLES LIKE 'attendance';
DESCRIBE attendance;
SQL
EOF

echo ""
echo "✅ 테이블 생성 완료!"

