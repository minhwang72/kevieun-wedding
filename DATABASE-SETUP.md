# kevieun-wedding 데이터베이스 설정 가이드

## 문제 해결

`appuser`는 데이터베이스를 생성할 권한이 없습니다. 다음 순서로 진행하세요.

## 방법 1: root 사용자로 전체 실행 (권장)

```bash
# root 사용자로 전체 스크립트 실행
mysql -u root -p < database-init-with-db.sql
```

## 방법 2: 단계별 실행

### 1단계: 데이터베이스 생성 (root 권한 필요)

```bash
# root로 데이터베이스 생성
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS kevieun_wedding CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

또는 MariaDB 클라이언트에서:
```sql
CREATE DATABASE IF NOT EXISTS kevieun_wedding 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;
```

### 2단계: 테이블 생성 (appuser로 실행)

```bash
# appuser로 테이블 생성
mysql -u appuser -p kevieun_wedding < database-init.sql
```

## 방법 3: appuser에 데이터베이스 생성 권한 부여

root 사용자로 다음 명령 실행:

```sql
GRANT CREATE ON *.* TO 'appuser'@'%';
FLUSH PRIVILEGES;
```

그 후:
```bash
mysql -u appuser -p < database-init-with-db.sql
```

## 확인

```bash
# 데이터베이스 확인
mysql -u appuser -p -e "SHOW DATABASES LIKE 'kevieun_wedding';"

# 테이블 확인
mysql -u appuser -p kevieun_wedding -e "SHOW TABLES;"

# admin 계정 확인
mysql -u appuser -p kevieun_wedding -e "SELECT id, username FROM admin;"
```

## 포함된 테이블

1. `guestbook` - 방명록
2. `gallery` - 갤러리 이미지
3. `contacts` - 연락처
4. `blessing_content` - 축하 메시지
5. `admin` - 관리자 (username: admin, password: ehcksdmswls123)
6. `theme_settings` - 테마 설정
7. `attendance` - 참석의사 (kevieun 전용)

