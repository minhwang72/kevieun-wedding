import pool from '@/lib/db'
import type { ThemeSettings } from '@/types'
import { DEFAULT_THEME, THEME_COLOR_KEYS, THEME_COLUMN_MAP } from '@/lib/themeConfig'

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS theme_settings (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    primary_bg VARCHAR(7) NOT NULL DEFAULT '#FFFEFB',
    secondary_bg VARCHAR(7) NOT NULL DEFAULT '#E5E5E7',
    section_bg VARCHAR(7) NOT NULL DEFAULT '#FFFEFD',
    accent_primary VARCHAR(7) NOT NULL DEFAULT '#F8DDE4',
    accent_secondary VARCHAR(7) NOT NULL DEFAULT '#783BFF',
    button_bg VARCHAR(7) NOT NULL DEFAULT '#111827',
    button_bg_hover VARCHAR(7) NOT NULL DEFAULT '#000000',
    button_text VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    date_countdown_section_bg VARCHAR(7) DEFAULT '#F5F5F5',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

const ALTER_TABLE_SQL = `
  ALTER TABLE theme_settings 
  ADD COLUMN IF NOT EXISTS date_countdown_section_bg VARCHAR(7) DEFAULT '#F5F5F5';
`

type ThemeRow = {
  id: number
  primary_bg: string
  secondary_bg: string
  section_bg: string
  accent_primary: string
  accent_secondary: string
  button_bg: string
  button_bg_hover: string
  button_text: string
  date_countdown_section_bg?: string | null
  updated_at?: Date | string
}

function mapRowToTheme(row: ThemeRow): ThemeSettings {
  return {
    id: row.id,
    primaryBg: row.primary_bg || DEFAULT_THEME.primaryBg,
    secondaryBg: row.secondary_bg || DEFAULT_THEME.secondaryBg,
    sectionBg: row.section_bg || DEFAULT_THEME.sectionBg,
    accentPrimary: row.accent_primary || DEFAULT_THEME.accentPrimary,
    accentSecondary: row.accent_secondary || DEFAULT_THEME.accentSecondary,
    buttonBg: row.button_bg || DEFAULT_THEME.buttonBg,
    buttonBgHover: row.button_bg_hover || DEFAULT_THEME.buttonBgHover,
    buttonText: row.button_text || DEFAULT_THEME.buttonText,
    dateCountdownSectionBg: row.date_countdown_section_bg || DEFAULT_THEME.dateCountdownSectionBg,
    updatedAt: row.updated_at
  }
}

async function ensureThemeTable() {
  await pool.query(CREATE_TABLE_SQL)
  // 기존 테이블에 컬럼 추가 (이미 있으면 무시됨)
  try {
    await pool.query(ALTER_TABLE_SQL)
  } catch (error) {
    // 컬럼이 이미 존재하거나 다른 오류인 경우 무시
    console.log('Theme table column check:', error)
  }
}

export async function getThemeSettings(): Promise<ThemeSettings> {
  await ensureThemeTable()

  const [rows] = await pool.query('SELECT * FROM theme_settings LIMIT 1')
  const row = Array.isArray(rows) ? (rows[0] as ThemeRow | undefined) : undefined

  if (row) {
    return mapRowToTheme(row)
  }

  const insertSql = `
    INSERT INTO theme_settings (
      primary_bg, secondary_bg, section_bg,
      accent_primary, accent_secondary,
      button_bg, button_bg_hover, button_text,
      date_countdown_section_bg
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `

  const defaultValues = [
    DEFAULT_THEME.primaryBg,
    DEFAULT_THEME.secondaryBg,
    DEFAULT_THEME.sectionBg,
    DEFAULT_THEME.accentPrimary,
    DEFAULT_THEME.accentSecondary,
    DEFAULT_THEME.buttonBg,
    DEFAULT_THEME.buttonBgHover,
    DEFAULT_THEME.buttonText,
    DEFAULT_THEME.dateCountdownSectionBg
  ]

  await pool.query(insertSql, defaultValues)

  const [createdRows] = await pool.query('SELECT * FROM theme_settings LIMIT 1')
  const created = Array.isArray(createdRows) ? (createdRows[0] as ThemeRow) : null

  return created ? mapRowToTheme(created) : { ...DEFAULT_THEME }
}

export async function updateThemeSettings(values: Record<string, string>): Promise<ThemeSettings> {
  const current = await getThemeSettings()

  const nextValues: ThemeSettings = {
    ...current,
    ...values
  }

  const updates = THEME_COLOR_KEYS.map((key) => nextValues[key])
  const columns = THEME_COLOR_KEYS.map((key) => `${THEME_COLUMN_MAP[key]} = ?`).join(', ')

  await pool.query(`UPDATE theme_settings SET ${columns} WHERE id = ?`, [...updates, current.id])

  return getThemeSettings()
}

