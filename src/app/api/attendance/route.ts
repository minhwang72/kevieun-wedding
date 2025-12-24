import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import type { ApiResponse, Attendance } from '@/types'

// GET: 참석의사 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const side = searchParams.get('side') // 'groom' | 'bride' | null (전체)

    let query = 'SELECT * FROM attendance WHERE 1=1'
    const params: (string | number)[] = []

    if (side === 'groom' || side === 'bride') {
      query += ' AND side = ?'
      params.push(side)
    }

    query += ' ORDER BY created_at DESC'

    interface AttendanceRow {
      id: number
      side: 'groom' | 'bride'
      attendance: 'yes' | 'no' | 'pending'
      meal: 'yes' | 'no' | 'pending'
      name: string
      companions: number
      phone_last4: string
      created_at: Date | string
      updated_at?: Date | string
    }

    const [rows] = await pool.query(query, params)
    const attendanceRows = rows as AttendanceRow[]

    const attendance: Attendance[] = attendanceRows.map((row) => ({
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

    if (!attendance || !['yes', 'no'].includes(attendance)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Invalid attendance. Must be "yes" or "no"',
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
    interface ExistingRow {
      id: number
    }
    const [existing] = await pool.query(
      'SELECT id FROM attendance WHERE name = ? AND phone_last4 = ?',
      [name.trim(), phone_last4]
    )
    const existingRows = existing as ExistingRow[]

    if (Array.isArray(existingRows) && existingRows.length > 0) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: '이미 등록된 참석의사입니다. (동일한 이름과 휴대폰 뒷자리)',
        },
        { status: 409 } // Conflict
      )
    }

    // 데이터 삽입
    interface InsertResult {
      insertId: number
    }
    const [result] = await pool.query(
      `INSERT INTO attendance (side, attendance, meal, name, companions, phone_last4)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [side, attendance, meal, name.trim(), companions || 0, phone_last4]
    )
    const insertResult = result as InsertResult
    const insertId = insertResult.insertId

    // 생성된 데이터 조회
    interface AttendanceRow {
      id: number
      side: 'groom' | 'bride'
      attendance: 'yes' | 'no' | 'pending'
      meal: 'yes' | 'no' | 'pending'
      name: string
      companions: number
      phone_last4: string
      created_at: Date | string
      updated_at?: Date | string
    }
    const [rows] = await pool.query(
      'SELECT * FROM attendance WHERE id = ?',
      [insertId]
    )
    const attendanceRows = rows as AttendanceRow[]

    if (Array.isArray(attendanceRows) && attendanceRows.length === 0) {
      throw new Error('Failed to retrieve created attendance')
    }

    const created: Attendance = {
      id: attendanceRows[0].id,
      side: attendanceRows[0].side,
      attendance: attendanceRows[0].attendance,
      meal: attendanceRows[0].meal,
      name: attendanceRows[0].name,
      companions: attendanceRows[0].companions,
      phone_last4: attendanceRows[0].phone_last4,
      created_at: attendanceRows[0].created_at,
      updated_at: attendanceRows[0].updated_at,
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

