'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, RefreshCw, Trash2 } from 'lucide-react'
import { useActivityStore, type Activity } from '@/lib/activity.store'
import { useHaptics } from '@/hooks/useHaptics'

function formatTime(at: number): string {
  const d = new Date(at)
  const now = Date.now()
  const diff = (now - at) / 1000
  if (diff < 60) return 'Gerade eben'
  if (diff < 3600) return `Vor ${Math.floor(diff / 60)} Min.`
  if (diff < 86400) return `Heute ${d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function ActivityRow({ a }: { a: Activity }) {
  return (
    <div
      className={`px-3 py-2.5 border-b border-[var(--border)] last:border-0 ${
        a.read ? 'opacity-80' : 'bg-[var(--primary)]/5'
      }`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`shrink-0 mt-0.5 w-2 h-2 rounded-full ${
            a.type === 'added' ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
          aria-hidden
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text)]">{a.title}</p>
          {a.message && <p className="text-xs text-[var(--muted)] mt-0.5">{a.message}</p>}
          <p className="text-[10px] text-[var(--muted)] mt-1">{formatTime(a.at)}</p>
        </div>
      </div>
    </div>
  )
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { activities, markAllRead, clearActivities } = useActivityStore()
  const h = useHaptics()

  const unreadCount = activities.filter((a) => !a.read).length

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const handleOpen = () => {
    h.impact('light')
    setOpen((v) => !v)
    if (!open) markAllRead()
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        aria-label="Aktivitäten anzeigen"
        onClick={handleOpen}
        className="relative h-9 w-9 grid place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] active:scale-[.98] transition-transform hover:bg-[var(--surface)]"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[min(90vw,320px)] max-h-[70vh] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elev)] shadow-xl z-50 flex flex-col"
          role="dialog"
          aria-label="Aktivitäten"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/80">
            <h2 className="text-sm font-semibold text-[var(--text)]">Aktivitäten</h2>
            <div className="flex items-center gap-1">
              {activities.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      h.impact('light')
                      markAllRead()
                    }}
                    className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)]"
                    aria-label="Alle gelesen"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      h.impact('light')
                      clearActivities()
                      setOpen(false)
                    }}
                    className="p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--muted)]"
                    aria-label="Alle löschen"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {activities.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--muted)]">
                Keine Aktivitäten. Änderungen in der App erscheinen hier in Echtzeit.
              </div>
            ) : (
              activities.map((a) => <ActivityRow key={a.id} a={a} />)
            )}
          </div>
        </div>
      )}
    </div>
  )
}
