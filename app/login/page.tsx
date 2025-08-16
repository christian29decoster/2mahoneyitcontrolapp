'use client'

import { useState } from 'react'
import Image from 'next/image'
import { checkDemoCredentials } from '@/lib/demo-auth'
import { useHaptics } from '@/hooks/useHaptics'

export default function LoginPage() {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const h = useHaptics()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    h.impact('medium')

    if (checkDemoCredentials(u, p)) {
      // demo cookie for 24h
      document.cookie = `demo_authed=1; Max-Age=86400; Path=/; SameSite=Lax`
      h.success()
      window.location.assign('/')
    } else {
      setErr('Invalid username or password.')
      h.impact('heavy')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="w-full max-w-[440px] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[0_10px_35px_rgba(0,0,0,.45)] text-center">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/mahoney-logo-white.png"
            alt="Mahoney IT Logo"
            width={180}
            height={60}
            priority
          />
        </div>

        {/* Title + Slogan */}
        <h1 className="text-2xl font-bold text-[var(--text)]">Welcome to Mahoney Control App</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Cybersecurity in your pocket</p>

        {/* Demo credentials hint */}
        <div className="mt-3 text-[11px] text-[var(--muted)]">
          Use demo access: <b>demo123</b> / <b>Demo321#</b>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="mt-6 space-y-3 text-left">
          <div>
            <label className="text-sm text-[var(--muted)]">Username</label>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              className="mt-1 w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 outline-none focus:border-[rgba(59,130,246,.5)] text-[var(--text)] placeholder-[var(--muted)]"
              placeholder="Enter username"
              autoFocus
              inputMode="text"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--muted)]">Password</label>
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              className="mt-1 w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 outline-none focus:border-[rgba(59,130,246,.5)] text-[var(--text)] placeholder-[var(--muted)]"
              placeholder="Enter password"
            />
          </div>

          {err && <div className="text-sm text-red-400">{err}</div>}

          <button
            disabled={busy}
            className="w-full rounded-xl bg-[var(--primary)] text-white py-2.5 font-medium active:scale-[.99] disabled:opacity-60 transition-transform"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-[11px] text-[var(--muted)] mt-2 text-center">
            Demo only — no production data.
          </div>
        </form>
      </div>
    </div>
  )
}
