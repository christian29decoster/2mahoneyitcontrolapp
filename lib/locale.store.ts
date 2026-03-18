'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Locale = 'en-US' | 'de'

type State = {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<State>()(
  persist(
    (set) => ({
      locale: 'en-US',
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'mahoney-locale' }
  )
)
