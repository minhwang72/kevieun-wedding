import type { ThemeSettings } from '@/types'

export const DEFAULT_THEME: ThemeSettings = {
  id: 1,
  primaryBg: '#FFFEFB',
  secondaryBg: '#E5E5E7',
  sectionBg: '#FFFEFD',
  accentPrimary: '#F8DDE4',
  accentSecondary: '#783BFF',
  buttonBg: '#111827',
  buttonBgHover: '#000000',
  buttonText: '#FFFFFF',
  dateCountdownSectionBg: '#F5F5F5',
  updatedAt: undefined
}

export const THEME_COLOR_KEYS = [
  'primaryBg',
  'secondaryBg',
  'sectionBg',
  'accentPrimary',
  'accentSecondary',
  'buttonBg',
  'buttonBgHover',
  'buttonText',
  'dateCountdownSectionBg'
] as const

export type ThemeColorKey = typeof THEME_COLOR_KEYS[number]

export const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/

export const THEME_CSS_VARIABLES: Record<ThemeColorKey, string> = {
  primaryBg: '--theme-bg-main',
  secondaryBg: '--theme-bg-secondary',
  sectionBg: '--theme-bg-section',
  accentPrimary: '--theme-accent-primary',
  accentSecondary: '--theme-accent-secondary',
  buttonBg: '--theme-button-bg',
  buttonBgHover: '--theme-button-bg-hover',
  buttonText: '--theme-button-text',
  dateCountdownSectionBg: '--theme-date-countdown-bg'
}

export const THEME_COLUMN_MAP: Record<ThemeColorKey, string> = {
  primaryBg: 'primary_bg',
  secondaryBg: 'secondary_bg',
  sectionBg: 'section_bg',
  accentPrimary: 'accent_primary',
  accentSecondary: 'accent_secondary',
  buttonBg: 'button_bg',
  buttonBgHover: 'button_bg_hover',
  buttonText: 'button_text',
  dateCountdownSectionBg: 'date_countdown_section_bg'
}

export function isValidHexColor(value: string): boolean {
  return HEX_COLOR_REGEX.test(value)
}

export function withDefaultTheme(partial?: Partial<Record<ThemeColorKey, string>>, base: ThemeSettings = DEFAULT_THEME): ThemeSettings {
  const next: ThemeSettings = { ...base }

  THEME_COLOR_KEYS.forEach((key) => {
    if (partial?.[key]) {
      next[key] = partial[key] as string
    }
  })

  return next
}

export function themeToCssVariableMap(theme: ThemeSettings): Record<string, string> {
  const vars: Record<string, string> = {}
  THEME_COLOR_KEYS.forEach((key) => {
    const value = theme[key] || DEFAULT_THEME[key] || ''
    if (value) {
      vars[THEME_CSS_VARIABLES[key]] = value
    }
  })
  return vars
}

export function themeToCssString(theme: ThemeSettings): string {
  const vars = themeToCssVariableMap(theme)
  const body = Object.entries(vars)
    .map(([cssVar, value]) => `  ${cssVar}: ${value};`)
    .join('\n')

  return `:root {\n${body}\n}`
}

