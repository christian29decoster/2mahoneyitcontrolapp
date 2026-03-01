import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'theme-preference'

function applyTheme(mode: ThemeMode) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', mode)
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {}
}

export const useThemeStore = create<{
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
}>()(
  persist(
    (set) => ({
      theme: 'dark',
      setTheme(theme: ThemeMode) {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: 'theme-preference',
      partialize: (s) => ({ theme: s.theme }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme)
      },
    }
  )
)

/** Call once on app load to sync html from stored preference (e.g. before React hydrates). */
export function initThemeFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored)
      return stored
    }
  } catch {}
  document.documentElement.setAttribute('data-theme', 'dark')
  return 'dark'
}
