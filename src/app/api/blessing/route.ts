import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ApiResponse, BlessingContent } from '@/types'

const fallbackContent = [
  '하나님께서 인도하신 만남 속에서',
  '서로의 깊은 존재를 알아가며',
  '가장 진실한 사랑으로 하나 되고자 합니다.',
  '',
  '소중한 분들을 모시고',
  '그 첫걸음을 함께 나누고 싶습니다.',
  '축복으로 함께해 주시면 감사하겠습니다.'
].join('\n')

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT id, content, updated_at
      FROM blessing_content
      ORDER BY id ASC
      LIMIT 1
    `)

    const contentRow = (rows as BlessingContent[])[0]
    const response = NextResponse.json<ApiResponse<{ content: string }>>({
      success: true,
      data: { content: contentRow?.content || fallbackContent },
    })

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching blessing content:', error)
    return NextResponse.json<ApiResponse<{ content: string }>>({
      success: true,
      data: { content: fallbackContent }
    })
  }
}

