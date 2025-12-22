-- 참석의사 체크 테이블 생성 SQL
-- 사용법: mysql -h monsilserver.iptime.org -u min -p kevieun_wedding < scripts/create-attendance-table.sql

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  side ENUM('groom', 'bride') NOT NULL,
  attendance ENUM('yes', 'no', 'pending') NOT NULL DEFAULT 'pending',
  meal ENUM('yes', 'no', 'pending') NOT NULL DEFAULT 'pending',
  name VARCHAR(50) NOT NULL,
  companions INT NOT NULL DEFAULT 0,
  phone_last4 VARCHAR(4) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_side (side),
  INDEX idx_name_phone (name, phone_last4)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

