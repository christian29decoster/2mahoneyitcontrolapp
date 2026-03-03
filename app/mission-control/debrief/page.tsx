'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Radio, MessageSquare, Plus } from 'lucide-react'
import Card from '@/components/ui/Card'

type Review = {
  id: string
  tenantId: string
  briefingId: string | null
  reviewDate: string
  whatWentWell: string
  whatFailed: string
  nearMiss: string
  lessonsLearned: string
  preventiveActionTicketId: string | null
  createdAtISO: string
}

export default function DebriefPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [whatWentWell, setWhatWentWell] = useState('')
  const [whatFailed, setWhatFailed] = useState('')
  const [nearMiss, setNearMiss] = useState('')
  const [lessonsLearned, setLessonsLearned] = useState('')
  const [createTicket, setCreateTicket] = useState(false)

  useEffect(() => {
    fetch('/api/mission-briefing/debrief?limit=20')
      .then((r) => r.ok ? r.json() : { items: [] })
      .then((j) => setReviews(j.items ?? []))
      .finally(() => setLoading(false))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/mission-briefing/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatWentWell: whatWentWell.trim(),
          whatFailed: whatFailed.trim(),
          nearMiss: nearMiss.trim(),
          lessonsLearned: lessonsLearned.trim(),
          preventiveActionTicketId: createTicket ? 'AUTOTASK-STUB' : null,
        }),
      })
      if (res.ok) {
        const j = await res.json()
        setReviews((prev) => [j.item, ...prev])
        setWhatWentWell('')
        setWhatFailed('')
        setNearMiss('')
        setLessonsLearned('')
        setCreateTicket(false)
        setShowForm(false)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
          <Radio className="w-6 h-6 text-[var(--primary)]" />
          Post-Shift Debrief
        </h1>
        <Link
          href="/mission-control"
          className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
        >
          Back to Mission Control
        </Link>
      </div>

      <p className="text-sm text-[var(--muted)]">
        Capture what went well, what failed, near misses, and lessons learned. Optionally create a preventive action ticket in Autotask.
      </p>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90"
        >
          <Plus size={18} />
          Start Debrief
        </button>
      ) : (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
            <MessageSquare size={14} />
            New debrief
          </h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">What went well</label>
              <textarea
                value={whatWentWell}
                onChange={(e) => setWhatWentWell(e.target.value)}
                placeholder="…"
                className="w-full min-h-[80px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--muted)]"
                maxLength={2000}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">What failed</label>
              <textarea
                value={whatFailed}
                onChange={(e) => setWhatFailed(e.target.value)}
                placeholder="…"
                className="w-full min-h-[80px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--muted)]"
                maxLength={2000}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Near miss</label>
              <textarea
                value={nearMiss}
                onChange={(e) => setNearMiss(e.target.value)}
                placeholder="…"
                className="w-full min-h-[80px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--muted)]"
                maxLength={2000}
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted)] mb-1">Lessons learned</label>
              <textarea
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="…"
                className="w-full min-h-[80px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--muted)]"
                maxLength={2000}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={createTicket}
                onChange={(e) => setCreateTicket(e.target.checked)}
                className="rounded border-[var(--border)]"
              />
              Create preventive action ticket in Autotask (stub — link ticket ID later)
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Save debrief'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Recent debriefs
        </h2>
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading…</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">No debriefs yet.</p>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>{r.reviewDate}</span>
                  <span>{new Date(r.createdAtISO).toLocaleString()}</span>
                </div>
                <dl className="mt-2 grid gap-1 text-sm">
                  {r.whatWentWell && (
                    <>
                      <dt className="text-[var(--muted)]">Went well</dt>
                      <dd className="text-[var(--text)]">{r.whatWentWell}</dd>
                    </>
                  )}
                  {r.whatFailed && (
                    <>
                      <dt className="text-[var(--muted)]">Failed</dt>
                      <dd className="text-[var(--text)]">{r.whatFailed}</dd>
                    </>
                  )}
                  {r.nearMiss && (
                    <>
                      <dt className="text-[var(--muted)]">Near miss</dt>
                      <dd className="text-[var(--text)]">{r.nearMiss}</dd>
                    </>
                  )}
                  {r.lessonsLearned && (
                    <>
                      <dt className="text-[var(--muted)]">Lessons learned</dt>
                      <dd className="text-[var(--text)]">{r.lessonsLearned}</dd>
                    </>
                  )}
                  {r.preventiveActionTicketId && (
                    <dd className="text-[var(--primary)]">Ticket: {r.preventiveActionTicketId}</dd>
                  )}
                </dl>
              </Card>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
