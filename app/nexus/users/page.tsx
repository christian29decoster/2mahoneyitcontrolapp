'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NEXUS_BG = 'linear-gradient(180deg, #0c1222 0%, #0f1828 50%, #0c1222 100%)'

type NexusUser = { id: string; name: string; username: string; role: string }

export default function NexusUsersPage() {
  const [user, setUser] = useState<{ username: string; name: string; role: string } | null>(null)
  const [users, setUsers] = useState<NexusUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [resetId, setResetId] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'user' as 'user' | 'admin' })
  const [newPassword, setNewPassword] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/nexus/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user)
        else router.replace('/nexus')
      })
      .catch(() => router.replace('/nexus'))
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    fetch('/api/nexus/users', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { users: [] }))
      .then((data) => setUsers(data.users ?? []))
      .catch(() => setUsers([]))
  }, [user])

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/nexus/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Failed to create user.')
        return
      }
      setUsers((prev) => [...prev, { id: data.user.id, name: data.user.name, username: data.user.username, role: data.user.role }])
      setNewUser({ name: '', username: '', password: '', role: 'user' })
      setShowAdd(false)
      setSuccess('User created.')
    } catch {
      setError('Network error.')
    }
  }

  async function handleResetPassword(id: string) {
    if (!newPassword.trim()) return
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch(`/api/nexus/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Failed to update password.')
        return
      }
      setResetId(null)
      setNewPassword('')
      setSuccess('Password updated.')
    } catch {
      setError('Network error.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0c1222]">
        <p className="text-[#9ab0d0]">Loading…</p>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div
      className="min-h-dvh flex flex-col bg-[#0c1222] relative overflow-hidden"
      style={{ background: NEXUS_BG }}
    >
      <div
        className="absolute inset-0 opacity-[0.12] bg-no-repeat bg-center bg-contain"
        style={{ backgroundImage: 'url(/nexus-logo.png)' }}
      />
      <div className="relative z-10 flex flex-col flex-1">
        <header className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white tracking-tight">Mahoney Nexus Plattform – User management</h1>
          <button
            type="button"
            onClick={() => router.push('/nexus/apps')}
            className="text-sm text-[#9ab0d0] hover:text-white"
          >
            ← Back to apps
          </button>
        </header>
        <main className="flex-1 px-6 pb-8 max-w-2xl">
          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          {success && <p className="mb-4 text-sm text-emerald-400">{success}</p>}
          <div className="rounded-xl border border-[#2a3a52] bg-[#1a2332]/95 overflow-hidden">
            <div className="p-4 border-b border-[#2a3a52] flex justify-between items-center">
              <h2 className="font-semibold text-white">Users</h2>
              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#1d4ed8]"
              >
                Add user
              </button>
            </div>
            <ul className="divide-y divide-[#2a3a52]">
              {users.map((u) => (
                <li key={u.id} className="p-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{u.name}</p>
                    <p className="text-sm text-[#9ab0d0]">{u.username} · {u.role}</p>
                  </div>
                  {resetId === u.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password"
                        className="rounded border border-[#2a3a52] bg-[#0f1624] px-2 py-1 text-sm text-white placeholder-[#5a6f8a] w-40"
                      />
                      <button
                        type="button"
                        onClick={() => handleResetPassword(u.id)}
                        className="text-sm text-[#3b82f6] hover:underline"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => { setResetId(null); setNewPassword('') }}
                        className="text-sm text-[#9ab0d0] hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setResetId(u.id)}
                      className="text-sm text-[#9ab0d0] hover:text-white"
                    >
                      Change password
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </main>
        <footer className="p-4 flex justify-end">
          <span className="text-xs text-[#5a6f8a]">MAHONEY IT</span>
        </footer>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setShowAdd(false)}>
          <form
            className="rounded-xl border border-[#2a3a52] bg-[#1a2332] p-6 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreateUser}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add user</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))}
                placeholder="Full name"
                className="w-full rounded border border-[#2a3a52] bg-[#0f1624] px-3 py-2 text-white placeholder-[#5a6f8a]"
                required
              />
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))}
                placeholder="Username"
                className="w-full rounded border border-[#2a3a52] bg-[#0f1624] px-3 py-2 text-white placeholder-[#5a6f8a]"
                required
              />
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))}
                placeholder="Password"
                className="w-full rounded border border-[#2a3a52] bg-[#0f1624] px-3 py-2 text-white placeholder-[#5a6f8a]"
                required
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value as 'user' | 'admin' }))}
                className="w-full rounded border border-[#2a3a52] bg-[#0f1624] px-3 py-2 text-white"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-[#2563eb] py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-lg border border-[#2a3a52] py-2 text-sm text-[#9ab0d0] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
