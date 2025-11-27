import type { ThemeSettings } from '@/types'
import { themeToCssString } from '@/lib/themeConfig'

interface ThemeStyleInjectorProps {
  theme: ThemeSettings
}

export default function ThemeStyleInjector({ theme }: ThemeStyleInjectorProps) {
  const css = themeToCssString(theme)
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}

