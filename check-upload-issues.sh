#!/bin/bash

# kevieun-wedding 업로드 디렉토리 상태 확인 스크립트
# 서버에서 실행: ./check-upload-issues.sh

echo "🔍 kevieun-wedding 업로드 디렉토리 상태 확인"
echo "=========================================="

echo ""
echo "📁 호스트 디렉토리:"
ls -ld /home/ubuntu/kevieun-wedding/uploads/ 2>/dev/null || echo "❌ /home/ubuntu/kevieun-wedding/uploads/ 디렉토리가 없습니다"

echo ""
echo "📁 호스트 uploads 내용:"
ls -la /home/ubuntu/kevieun-wedding/uploads/ 2>/dev/null || echo "디렉토리가 없습니다"

echo ""
echo "📁 호스트 images 디렉토리:"
ls -la /home/ubuntu/kevieun-wedding/uploads/images/ 2>/dev/null || echo "❌ images 디렉토리가 없습니다"

echo ""
echo "📊 디렉토리 권한 정보:"
stat -c "%U:%G %a %n" /home/ubuntu/kevieun-wedding/uploads/ 2>/dev/null || echo "디렉토리 없음"
stat -c "%U:%G %a %n" /home/ubuntu/kevieun-wedding/uploads/images/ 2>/dev/null || echo "images 디렉토리 없음"

echo ""
echo "🐳 컨테이너 내부 디렉토리:"
echo "컨테이너 내부 /app/public/uploads:"
docker exec kevieun-wedding ls -la /app/public/uploads/ 2>/dev/null || echo "❌ 컨테이너 내부 접근 실패"

echo ""
echo "컨테이너 내부 /app/public/uploads/images:"
docker exec kevieun-wedding ls -la /app/public/uploads/images/ 2>/dev/null || echo "❌ images 디렉토리가 없습니다"

echo ""
echo "👤 컨테이너 사용자 정보:"
docker exec kevieun-wedding id 2>/dev/null || echo "❌ 컨테이너 접근 실패"

echo ""
echo "🧪 쓰기 권한 테스트:"
echo "호스트에서 쓰기:"
touch /home/ubuntu/kevieun-wedding/uploads/test-write.txt 2>/dev/null && echo "✅ 호스트 쓰기 성공" && rm /home/ubuntu/kevieun-wedding/uploads/test-write.txt || echo "❌ 호스트 쓰기 실패"

echo ""
echo "컨테이너에서 쓰기:"
docker exec kevieun-wedding sh -c "touch /app/public/uploads/test-container.txt && ls -la /app/public/uploads/test-container.txt && rm /app/public/uploads/test-container.txt" 2>/dev/null && echo "✅ 컨테이너 쓰기 성공" || echo "❌ 컨테이너 쓰기 실패"

echo ""
echo "✅ 확인 완료!"

