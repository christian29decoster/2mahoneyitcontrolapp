'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const NEXUS_BG = 'linear-gradient(180deg, #0c1222 0%, #0f1828 50%, #0c1222 100%)'

export default function NexusLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const res = await fetch('/api/nexus/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Login failed.')
        setBusy(false)
        return
      }
      router.push('/nexus/apps')
      router.refresh()
    } catch {
      setError('Network error.')
      setBusy(false)
    }
  }

  return (
    <div
      className="min-h-dvh flex flex-col bg-[#0c1222] relative overflow-hidden"
      style={{ background: NEXUS_BG }}
    >
      {/* Background logo – faded */}
      <div
        className="absolute inset-0 opacity-[0.12] bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: 'url(/nexus-logo.png)' }}
      />
      <div className="relative z-10 flex flex-col flex-1">
        <header className="p-6">
          <h1 className="text-xl font-bold text-white tracking-tight">Mahoney Nexus Plattform</h1>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-[380px] rounded-xl border border-[#2a3a52] bg-[#1a2332]/95 shadow-2xl p-6"
          >
            <p className="text-sm text-[#9ab0d0] mb-4">Sign in with your Nexus credentials.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#9ab0d0] mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-[#2a3a52] bg-[#0f1624] px-3 py-2.5 text-white placeholder-[#5a6f8a] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
                  placeholder="Username"
                  autoComplete="username"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#9ab0d0] mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[#2a3a52] bg-[#0f1624] px-3 py-2.5 text-white placeholder-[#5a6f8a] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="mt-5 w-full rounded-lg bg-[#2563eb] py-2.5 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50 disabled:pointer-events-none"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </main>
        <footer className="p-4 flex justify-end">
          <span className="text-xs text-[#5a6f8a]">MAHONEY IT</span>
        </footer>
      </div>
    </div>
  )
}
