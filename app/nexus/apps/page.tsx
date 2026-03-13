'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const NEXUS_BG = 'linear-gradient(180deg, #0c1222 0%, #0f1828 50%, #0c1222 100%)'

const APP_BUTTONS: { name: string; link: string; cacOnly: boolean }[] = [
  { name: 'Nexus App Sales', link: 'https://nexus.mahoney-it.tech/', cacOnly: false },
  { name: 'Control App', link: '#', cacOnly: true },
  { name: 'Autotask PSA', link: 'https://ww19.autotask.net/', cacOnly: false },
  { name: 'SIEM System', link: '#', cacOnly: true },
  { name: 'Sophos', link: 'https://portal.sophos.com/', cacOnly: false },
  { name: 'Server SP', link: 'https://mahoneyit.sharepoint.com/', cacOnly: false },
  { name: 'Marketing NL', link: 'https://login.mailchimp.com/', cacOnly: false },
  { name: 'Marketing SM', link: 'https://app.metricool.com/login', cacOnly: false },
  { name: 'Demo MCA', link: '/login', cacOnly: false },
  { name: 'QMS – Templates', link: '#', cacOnly: true },
]

function CacModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="rounded-xl border border-[#2a3a52] bg-[#1a2332] p-6 max-w-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-2">CAC / Auth-Card required</h3>
        <p className="text-sm text-[#9ab0d0] mb-4">
          Please use your CAC or Auth-Card to be redirected to this service.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-[#2563eb] py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default function NexusAppsPage() {
  const [user, setUser] = useState<{ username: string; name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [cacModal, setCacModal] = useState(false)
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

  function handleLogout() {
    fetch('/api/nexus/auth', { method: 'DELETE', credentials: 'include' }).then(() => {
      router.replace('/nexus')
      router.refresh()
    })
  }

  function handleAppClick(btn: (typeof APP_BUTTONS)[0]) {
    if (btn.cacOnly) {
      setCacModal(true)
      return
    }
    if (btn.link.startsWith('/')) router.push(btn.link)
    else window.open(btn.link, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#0c1222]">
        <p className="text-[#9ab0d0]">Loading…</p>
      </div>
    )
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
          <h1 className="text-xl font-bold text-white tracking-tight">Mahoney Nexus Plattform</h1>
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => router.push('/nexus/users')}
                className="text-sm text-[#9ab0d0] hover:text-white"
              >
                Manage users
              </button>
            )}
            <span className="text-sm text-[#9ab0d0]">{user?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-[#9ab0d0] hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-w-4xl">
            {APP_BUTTONS.map((btn) => (
              <button
                key={btn.name}
                type="button"
                onClick={() => handleAppClick(btn)}
                className="rounded-2xl border border-[#2a3a52] bg-[#1e3a5f]/40 hover:bg-[#1e3a5f]/70 text-white px-5 py-4 text-center text-sm font-medium shadow-lg hover:shadow-xl transition-colors"
              >
                {btn.name}
              </button>
            ))}
          </div>
        </main>
        <footer className="p-4 flex justify-end">
          <span className="text-xs text-[#5a6f8a]">MAHONEY IT</span>
        </footer>
      </div>
      {cacModal && <CacModal onClose={() => setCacModal(false)} />}
    </div>
  )
}
