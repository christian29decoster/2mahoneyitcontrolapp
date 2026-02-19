'use client'

import { create } from 'zustand'

type CopilotState = {
  open: boolean
  setOpen: (v: boolean) => void
}

export const useCopilotStore = create<CopilotState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}))
