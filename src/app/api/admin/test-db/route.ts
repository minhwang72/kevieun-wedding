import { NextResponse } from 'next/server'
import pool from '@/lib/db'

// DB 연결 테스트 API
export async function GET() {
  try {
    // 연결 정보 확인
    const connection = await pool.getConnection()
    
    // 간단한 쿼리 실행
    const [rows] = await connection.query('SELECT 1 as test, NOW() as current_time')
    connection.release()
    
    return NextResponse.json({
      success: true,
      message: 'DB 연결 성공',
      data: {
        test: rows,
        connectionInfo: {
          host: process.env.DB_HOST || '192.168.0.55',
          user: process.env.DB_USER || 'appuser',
          database: process.env.DB_NAME || 'kevieun_wedding',
        }
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    
    console.error('DB 연결 테스트 실패:', {
      message: errorMessage,
      stack: errorStack,
      error
    })
    
    return NextResponse.json(
      {
        success: false,
        message: 'DB 연결 실패',
        error: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

