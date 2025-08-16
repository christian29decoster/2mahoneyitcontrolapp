'use client'

import { useHaptics } from '@/hooks/useHaptics'

export default function LogoutButton() {
  const h = useHaptics()

  const handleLogout = () => {
    h.impact('medium')
    document.cookie = 'demo_authed=; Max-Age=0; Path=/'
    window.location.assign('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded-xl border border-[var(--border)] hover:text-[var(--primary)] hover:bg-[var(--surface-2)] transition-colors text-[var(--text)]"
    >
      Log out
    </button>
  )
}
