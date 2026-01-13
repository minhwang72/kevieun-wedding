#!/bin/bash

# 서버에서 업로드 디렉토리 권한 수정 (바로 실행)
# 사용법: ./scripts/fix-upload-permissions-remote.sh

echo "🔧 kevieun-wedding 업로드 디렉토리 권한 수정 중..."

ssh monsil-server << 'EOF'
cd /home/min/kevieun-wedding || exit 1

echo ""
echo "📁 현재 상태 확인:"
ls -la public/uploads/ 2>/dev/null || echo "❌ uploads 디렉토리가 없습니다"

echo ""
echo "🔧 디렉토리 생성 및 권한 수정 중..."
sudo mkdir -p public/uploads/images
sudo chown -R 1001:1001 public/uploads
sudo chmod -R 755 public/uploads

echo ""
echo "📁 수정 후 상태:"
ls -la public/uploads/
ls -la public/uploads/images/ 2>/dev/null || echo "images 디렉토리 생성 중..."

echo ""
echo "🧪 컨테이너 내부 쓰기 테스트:"
docker exec kevieun-wedding sh -c 'touch /app/public/uploads/test.txt && ls -la /app/public/uploads/test.txt && rm /app/public/uploads/test.txt' 2>/dev/null && echo "✅ 쓰기 성공" || echo "❌ 쓰기 실패"

echo ""
echo "✅ 완료!"
EOF

