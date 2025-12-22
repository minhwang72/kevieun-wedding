import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ApiResponse, Attendance } from '@/types'

// GET: 참석의사 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const side = searchParams.get('side') // 'groom' | 'bride' | null (전체)

    let query = 'SELECT * FROM attendance WHERE 1=1'
    const params: any[] = []

    if (side === 'groom' || side === 'bride') {
      query += ' AND side = ?'
      params.push(side)
    }

    query += ' ORDER BY created_at DESC'

    const [rows] = await pool.query<any[]>(query, params)

    const attendance: Attendance[] = rows.map((row) => ({
      id: row.id,
      side: row.side,
      attendance: row.attendance,
      meal: row.meal,
      name: row.name,
      companions: row.companions,
      phone_last4: row.phone_last4,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    return NextResponse.json<ApiResponse<Attendance[]>>({
      success: true,
      data: attendance,
    })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch attendance',
      },
      { status: 500 }
    )
  }
}

// POST: 참석의사 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { side, attendance, meal, name, companions, phone_last4 } = body

    // 유효성 검사
    if (!side || !['groom', 'bride'].includes(side)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid side. Must be "groom" or "bride"',
        },
        { status: 400 }
      )
    }

    if (!attendance || !['yes', 'no', 'pending'].includes(attendance)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid attendance. Must be "yes", "no", or "pending"',
        },
        { status: 400 }
      )
    }

    if (!meal || !['yes', 'no', 'pending'].includes(meal)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid meal. Must be "yes", "no", or "pending"',
        },
        { status: 400 }
      )
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Name is required',
        },
        { status: 400 }
      )
    }

    if (companions === undefined || companions < 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Companions must be a non-negative number',
        },
        { status: 400 }
      )
    }

    if (!phone_last4 || phone_last4.length !== 4 || !/^\d{4}$/.test(phone_last4)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Phone last 4 digits must be exactly 4 digits',
        },
        { status: 400 }
      )
    }

    // 중복 체크 (이름 + 휴대폰 뒷자리)
    const [existing] = await pool.query<any[]>(
      'SELECT id FROM attendance WHERE name = ? AND phone_last4 = ?',
      [name.trim(), phone_last4]
    )

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '이미 등록된 참석의사입니다. (동일한 이름과 휴대폰 뒷자리)',
        },
        { status: 409 } // Conflict
      )
    }

    // 데이터 삽입
    const [result] = await pool.query<any>(
      `INSERT INTO attendance (side, attendance, meal, name, companions, phone_last4)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [side, attendance, meal, name.trim(), companions || 0, phone_last4]
    )

    const insertId = (result as any).insertId

    // 생성된 데이터 조회
    const [rows] = await pool.query<any[]>(
      'SELECT * FROM attendance WHERE id = ?',
      [insertId]
    )

    if (Array.isArray(rows) && rows.length === 0) {
      throw new Error('Failed to retrieve created attendance')
    }

    const created: Attendance = {
      id: rows[0].id,
      side: rows[0].side,
      attendance: rows[0].attendance,
      meal: rows[0].meal,
      name: rows[0].name,
      companions: rows[0].companions,
      phone_last4: rows[0].phone_last4,
      created_at: rows[0].created_at,
      updated_at: rows[0].updated_at,
    }

    return NextResponse.json<ApiResponse<Attendance>>(
      {
        success: true,
        data: created,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating attendance:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to create attendance',
      },
      { status: 500 }
    )
  }
}

