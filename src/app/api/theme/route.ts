import { NextResponse } from 'next/server'
import type { ApiResponse, ThemeSettings } from '@/types'
import { getThemeSettings } from '@/lib/server/themeStore'

export async function GET() {
  try {
    const theme = await getThemeSettings()
    return NextResponse.json<ApiResponse<ThemeSettings>>({
      success: true,
      data: theme
    })
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to load theme settings' },
      { status: 500 }
    )
  }
}

