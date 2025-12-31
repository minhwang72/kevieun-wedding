#!/bin/bash

# kevieun-wedding 업로드 디렉토리 권한 수정 스크립트
# 서버에서 실행: ./fix-upload-issues.sh

echo "🔧 kevieun-wedding 업로드 디렉토리 권한 수정 중..."

# 디렉토리 생성 및 권한 설정 (nextjs 사용자: 1001:1001)
sudo mkdir -p /home/ubuntu/kevieun-wedding/uploads/images
sudo chown -R 1001:1001 /home/ubuntu/kevieun-wedding/uploads
sudo chmod -R 755 /home/ubuntu/kevieun-wedding/uploads

echo ""
echo "📁 디렉토리 상태 확인:"
ls -la /home/ubuntu/kevieun-wedding/uploads/
ls -la /home/ubuntu/kevieun-wedding/uploads/images/

echo ""
echo "🧪 컨테이너 내부 쓰기 테스트:"
docker exec kevieun-wedding sh -c 'touch /app/public/uploads/test.txt && ls -la /app/public/uploads/test.txt && rm /app/public/uploads/test.txt' && echo "✅ 쓰기 성공" || echo "❌ 쓰기 실패"

echo ""
echo "✅ 완료!"

