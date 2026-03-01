'use client'

import { useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/lib/theme.store'
import { useHaptics } from '@/hooks/useHaptics'

export default function ThemeToggle() {
  const h = useHaptics()
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="flex rounded-xl border border-[var(--border)] overflow-hidden">
      <button
        type="button"
        onClick={() => {
          h.impact('light')
          setTheme('light')
        }}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium ${theme === 'light' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
        aria-label="Light mode"
        title="Light mode"
      >
        <Sun size={14} />
        Light
      </button>
      <button
        type="button"
        onClick={() => {
          h.impact('light')
          setTheme('dark')
        }}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium ${theme === 'dark' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        <Moon size={14} />
        Dark
      </button>
    </div>
  )
}
