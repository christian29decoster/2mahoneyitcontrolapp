'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import Card from '@/components/ui/Card'
import {
  INCIDENT_STATUSES,
  canTransition,
  type IncidentRecord,
  type IncidentStatus,
} from '@/lib/data/incidents'

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [item, setItem] = useState<IncidentRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState<IncidentStatus | ''>('')
  const [timelineText, setTimelineText] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/incidents/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { item: IncidentRecord } | null) => data && setItem(data.item))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [id])

  function refresh() {
    if (!id) return
    fetch(`/api/incidents/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { item: IncidentRecord } | null) => data && setItem(data.item))
      .catch(() => {})
  }

  function updateStatus(to: IncidentStatus) {
    if (!id || !item) return
    setUpdating(true)
    fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: to }),
    })
      .then((r) => {
        if (r.ok) refresh()
        else setNewStatus('')
      })
      .finally(() => setUpdating(false))
    setNewStatus('')
  }

  function addTimelineEntry() {
    if (!id || !timelineText.trim()) return
    setUpdating(true)
    fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timelineAppend: { atISO: new Date().toISOString(), text: timelineText.trim() },
      }),
    })
      .then((r) => {
        if (r.ok) {
          setTimelineText('')
          refresh()
        }
      })
      .finally(() => setUpdating(false))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[920px] px-4 py-6 text-[var(--muted)]">
        Loading…
      </div>
    )
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-[920px] px-4 py-6">
        <p className="text-[var(--muted)]">Incident not found.</p>
        <Link href="/incidents" className="text-[var(--primary)] hover:underline mt-2 inline-block">
          ← Back to list
        </Link>
      </div>
    )
  }

  const allowedNext = INCIDENT_STATUSES.filter((s) => canTransition(item.status, s))
  const priorityColor: Record<string, string> = {
    P1: 'bg-red-600/20 text-red-300',
    P2: 'bg-amber-600/20 text-amber-300',
    P3: 'bg-blue-600/20 text-blue-300',
    P4: 'bg-zinc-600/20 text-zinc-400',
  }

  return (
    <div className="mx-auto w-full max-w-[920px] px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/incidents" className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)]">
          <ArrowLeft size={18} />
        </Link>
        <AlertTriangle className="w-5 h-5 text-[var(--primary)]" />
        <h1 className="text-xl font-bold text-[var(--text)] truncate">{item.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="text-sm text-[var(--muted)] mb-2">Description</div>
            <p className="text-[var(--text)] whitespace-pre-wrap">{item.description}</p>
          </Card>

          <Card className="p-4">
            <div className="font-semibold text-[var(--text)] mb-2">Timeline</div>
            <ul className="space-y-2 text-sm">
              {item.timeline.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[var(--muted)] shrink-0">
                    {new Date(t.atISO).toLocaleString()}
                  </span>
                  <span className="text-[var(--text)]">{t.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={timelineText}
                onChange={(e) => setTimelineText(e.target.value)}
                placeholder="Add timeline entry…"
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addTimelineEntry}
                disabled={updating || !timelineText.trim()}
                className="px-3 py-2 rounded-lg bg-[var(--primary)] text-white text-sm disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </Card>

          {item.id === 'inc-aws-2025-08-16-01' && (
            <Link
              href="/incidents/aws"
              className="inline-block px-4 py-2 rounded-xl border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/10"
            >
              Open full AWS incident view (containment actions) →
            </Link>
          )}
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">
              Lifecycle & times
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-[var(--muted)]">Status</dt>
                <dd className="font-medium text-[var(--text)]">{item.status}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">Logged</dt>
                <dd>{new Date(item.loggedAtISO).toLocaleString()}</dd>
              </div>
              {item.respondedAtISO && (
                <div>
                  <dt className="text-[var(--muted)]">Responded</dt>
                  <dd>{new Date(item.respondedAtISO).toLocaleString()}</dd>
                </div>
              )}
              {item.resolvedAtISO && (
                <div>
                  <dt className="text-[var(--muted)]">Resolved</dt>
                  <dd>{new Date(item.resolvedAtISO).toLocaleString()}</dd>
                </div>
              )}
              {item.closedAtISO && (
                <div>
                  <dt className="text-[var(--muted)]">Closed</dt>
                  <dd>{new Date(item.closedAtISO).toLocaleString()}</dd>
                </div>
              )}
              {item.dueByISO && (
                <div>
                  <dt className="text-[var(--muted)]">Due by</dt>
                  <dd>{new Date(item.dueByISO).toLocaleString()}</dd>
                </div>
              )}
              {item.assignedTo && (
                <div>
                  <dt className="text-[var(--muted)]">Assigned to</dt>
                  <dd>{item.assignedTo}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card className="p-4">
            <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">
              Category & priority
            </div>
            <p className="text-sm">
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium ${priorityColor[item.priority] ?? ''}`}>
                {item.priority}
              </span>
              {' · '}
              <span className="text-[var(--text)]">{item.category}</span>
            </p>
          </Card>

          {allowedNext.length > 0 && (
            <Card className="p-4">
              <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">
                Change status
              </div>
              <div className="flex flex-wrap gap-2">
                {allowedNext.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(s)}
                    disabled={updating}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--primary)]/50 text-sm disabled:opacity-50"
                  >
                    → {s}
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
