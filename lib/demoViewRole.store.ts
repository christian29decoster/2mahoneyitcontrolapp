'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Demo view role for hiding/showing menu items during demos. */
export type DemoViewRole = 'mahoney_it_group' | 'partner' | 'client_wit' | 'client_woit'

type State = {
  demoViewRole: DemoViewRole
  setDemoViewRole: (role: DemoViewRole) => void
}

export const DEMO_VIEW_ROLE_LABELS: Record<DemoViewRole, string> = {
  mahoney_it_group: 'Mahoney IT Group',
  partner: 'Partner',
  client_wit: 'Client with IT',
  client_woit: 'Client without IT',
}

export const useDemoViewRoleStore = create<State>()(
  persist(
    (set) => ({
      demoViewRole: 'mahoney_it_group',
      setDemoViewRole: (demoViewRole) => set({ demoViewRole }),
    }),
    { name: 'mahoney-demo-view-role' }
  )
)
