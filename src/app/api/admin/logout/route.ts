import { NextResponse } from 'next/server'
import type { ApiResponse } from '@/types'

export async function POST() {
  try {
    const response = NextResponse.json<ApiResponse<null>>({
      success: true,
    })

    // Clear session cookie
    // secure는 HTTPS 사용 시에만 true로 설정 (환경변수로 제어 가능)
    const isSecure = process.env.COOKIE_SECURE === 'true' || 
                     (process.env.NODE_ENV === 'production' && process.env.USE_HTTPS === 'true')
    
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Error in admin logout:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Logout failed',
      },
      { status: 500 }
    )
  }
} 