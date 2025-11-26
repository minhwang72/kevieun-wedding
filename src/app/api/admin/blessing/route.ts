import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ApiResponse, BlessingContent } from '@/types'

function isAuthorized(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session')?.value
  return !!(sessionToken && sessionToken.startsWith('admin_'))
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const [rows] = await pool.query(`
      SELECT id, content, updated_at
      FROM blessing_content
      ORDER BY id ASC
      LIMIT 1
    `)

    const contentRow = (rows as BlessingContent[])[0] || null

    return NextResponse.json<ApiResponse<BlessingContent | null>>({
      success: true,
      data: contentRow,
    })
  } catch (error) {
    console.error('Error fetching admin blessing content:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch blessing content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const content = (body.content ?? '').trim()

    if (!content) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: '내용을 입력해주세요.' },
        { status: 400 }
      )
    }

    const [rows] = await pool.query(`
      SELECT id FROM blessing_content
      ORDER BY id ASC
      LIMIT 1
    `)
    const existing = (rows as BlessingContent[])[0]

    if (existing) {
      await pool.query(
        'UPDATE blessing_content SET content = ? WHERE id = ?',
        [content, existing.id]
      )
    } else {
      await pool.query(
        'INSERT INTO blessing_content (content) VALUES (?)',
        [content]
      )
    }

    return NextResponse.json<ApiResponse<null>>({ success: true })
  } catch (error) {
    console.error('Error updating blessing content:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: '문구를 저장하지 못했습니다.' },
      { status: 500 }
    )
  }
}

