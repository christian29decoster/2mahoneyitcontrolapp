'use client'

import { create } from 'zustand'

type UIState = {
  navVisible: boolean
  setNavVisible: (v: boolean) => void
  hideNav: () => void
  showNav: () => void
}

export const useUIStore = create<UIState>((set) => ({
  navVisible: true,
  setNavVisible: (v) => set({ navVisible: v }),
  hideNav: () => set({ navVisible: false }),
  showNav: () => set({ navVisible: true }),
}))
