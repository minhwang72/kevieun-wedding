#!/bin/bash
# 서버에서 바로 실행할 명령어

ssh monsil-server << 'EOF'
cd /home/min/kevieun-wedding

echo "📁 현재 상태:"
ls -la public/uploads/ 2>/dev/null || echo "uploads 디렉토리 없음"

echo ""
echo "🔧 권한 수정 중..."
sudo mkdir -p public/uploads/images
sudo chown -R 1001:1001 public/uploads
sudo chmod -R 755 public/uploads

echo ""
echo "📁 수정 후:"
ls -la public/uploads/
ls -la public/uploads/images/ 2>/dev/null

echo ""
echo "🧪 쓰기 테스트:"
docker exec kevieun-wedding sh -c 'touch /app/public/uploads/test.txt && ls -la /app/public/uploads/test.txt && rm /app/public/uploads/test.txt' 2>/dev/null && echo "✅ 성공" || echo "❌ 실패"

echo "✅ 완료!"
EOF
