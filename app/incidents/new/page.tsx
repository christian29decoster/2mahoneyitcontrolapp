'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Card from '@/components/ui/Card'
import { INCIDENT_CATEGORIES, INCIDENT_PRIORITIES, type IncidentCategory, type IncidentPriority } from '@/lib/data/incidents'

export default function NewIncidentPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<IncidentCategory>('Other')
  const [priority, setPriority] = useState<IncidentPriority>('P4')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError(null)
    fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      }),
    })
      .then((r) => {
        if (r.ok) return r.json()
        return r.json().then((body) => Promise.reject(new Error(body.error || 'Failed to create')))
      })
      .then((data: { item: { id: string } }) => {
        router.push(`/incidents/${data.item.id}`)
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to create incident.')
        setSaving(false)
      })
  }

  return (
    <div className="mx-auto w-full max-w-[560px] px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/incidents" className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)]">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-[var(--text)]">New incident</h1>
      </div>

      <Card className="p-4">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"
              placeholder="Short summary of the incident"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--muted)] mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"
              placeholder="What happened? When? Who is affected?"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"
              >
                {INCIDENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"
              >
                {INCIDENT_PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white disabled:opacity-50"
            >
              {saving ? 'Creating…' : 'Create incident'}
            </button>
            <Link href="/incidents" className="px-4 py-2 rounded-xl border border-[var(--border)]">
              Cancel
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
