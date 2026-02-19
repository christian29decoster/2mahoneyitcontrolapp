'use client'

import { create } from 'zustand'

export type ActivityType = 'added' | 'changed'

export type Activity = {
  id: string
  type: ActivityType
  title: string
  message?: string
  at: number
  read: boolean
}

type State = {
  activities: Activity[]
  addActivity: (payload: { type: ActivityType; title: string; message?: string }) => void
  markAllRead: () => void
  clearActivities: () => void
}

const MAX_ACTIVITIES = 80

export const useActivityStore = create<State>((set) => ({
  activities: [],

  addActivity: (payload) =>
    set((state) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      const next: Activity = {
        id,
        type: payload.type,
        title: payload.title,
        message: payload.message,
        at: Date.now(),
        read: false,
      }
      const list = [next, ...state.activities].slice(0, MAX_ACTIVITIES)
      return { activities: list }
    }),

  markAllRead: () =>
    set((state) => ({
      activities: state.activities.map((a) => ({ ...a, read: true })),
    })),

  clearActivities: () => set({ activities: [] }),
}))
