'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'app' | 'desktop'

type State = {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  menuPinned: boolean
  setMenuPinned: (pinned: boolean) => void
}

export const useViewModeStore = create<State>()(
  persist(
    (set) => ({
      viewMode: 'app',
      setViewMode: (viewMode) => set({ viewMode }),
      menuPinned: false,
      setMenuPinned: (menuPinned) => set({ menuPinned }),
    }),
    { name: 'mahoney-view-mode' }
  )
)
