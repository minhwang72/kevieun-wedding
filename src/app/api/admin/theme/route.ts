import { NextRequest, NextResponse } from 'next/server'
import type { ApiResponse, ThemeSettings } from '@/types'
import { getThemeSettings, updateThemeSettings } from '@/lib/server/themeStore'
import { HEX_COLOR_REGEX, THEME_COLOR_KEYS, ThemeColorKey } from '@/lib/themeConfig'

function isAuthorized(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session')?.value
  return !!(sessionToken && sessionToken.startsWith('admin_'))
}

function sanitizeThemePayload(body: Partial<Record<ThemeColorKey, string>>) {
  const updates: Record<string, string> = {}

  for (const key of THEME_COLOR_KEYS) {
    if (body[key]) {
      const value = body[key]
      if (!HEX_COLOR_REGEX.test(value)) {
        throw new Error(`${key} has invalid color value: ${value}`)
      }
      updates[key] = value.toUpperCase()
    }
  }

  if (Object.keys(updates).length !== THEME_COLOR_KEYS.length) {
    throw new Error('모든 색상 값을 입력해주세요.')
  }

  return updates
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const theme = await getThemeSettings()
    return NextResponse.json<ApiResponse<ThemeSettings>>({
      success: true,
      data: theme
    })
  } catch (error) {
    console.error('Error fetching admin theme settings:', error)
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to load theme settings' },
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
    const updates = sanitizeThemePayload(body)
    const result = await updateThemeSettings(updates)

    return NextResponse.json<ApiResponse<ThemeSettings>>({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Error updating theme settings:', error)
    const message = error instanceof Error ? error.message : 'Failed to update theme'
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 400 }
    )
  }
}

