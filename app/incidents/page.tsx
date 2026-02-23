'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Plus, Filter } from 'lucide-react'
import Card from '@/components/ui/Card'
import {
  INCIDENT_STATUSES,
  INCIDENT_CATEGORIES,
  INCIDENT_PRIORITIES,
  type IncidentRecord,
  type IncidentStatus,
  type IncidentCategory,
  type IncidentPriority,
} from '@/lib/data/incidents'

export default function IncidentsPage() {
  const [items, setItems] = useState<IncidentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | ''>('')
  const [filterCategory, setFilterCategory] = useState<IncidentCategory | ''>('')
  const [filterPriority, setFilterPriority] = useState<IncidentPriority | ''>('')
  const [showFilters, setShowFilters] = useState(false)

  function load() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterStatus) params.set('status', filterStatus)
    if (filterCategory) params.set('category', filterCategory)
    if (filterPriority) params.set('priority', filterPriority)
    fetch(`/api/incidents?${params}`)
      .then((r) => r.json())
      .then((data: { items: IncidentRecord[] }) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [filterStatus, filterCategory, filterPriority])

  const priorityColor: Record<IncidentPriority, string> = {
    P1: 'bg-red-600/20 text-red-300',
    P2: 'bg-amber-600/20 text-amber-300',
    P3: 'bg-blue-600/20 text-blue-300',
    P4: 'bg-zinc-600/20 text-zinc-400',
  }

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-[var(--primary)]" />
          <h1 className="text-2xl font-bold text-[var(--text)]">Incidents</h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
          >
            <Filter size={16} />
            Filters
          </button>
          <Link
            href="/incidents/new"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--primary)] text-white"
          >
            <Plus size={16} />
            New incident
          </Link>
        </div>
      </div>

      {showFilters && (
        <Card className="mt-4 p-4 flex flex-wrap gap-4">
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as IncidentStatus | '')}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {INCIDENT_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as IncidentCategory | '')}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {INCIDENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as IncidentPriority | '')}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {INCIDENT_PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </Card>
      )}

      <p className="text-sm text-[var(--muted)] mt-2">
        ITIL-aligned lifecycle: New → Assigned → In Progress → Resolved → Closed. Filter by status, category, or priority.
      </p>

      {loading ? (
        <div className="mt-6 text-sm text-[var(--muted)]">Loading…</div>
      ) : (
        <div className="mt-4 space-y-2">
          {items.length === 0 ? (
            <Card className="p-6 text-center text-[var(--muted)]">No incidents match the current filters.</Card>
          ) : (
            items.map((inc) => (
              <Link key={inc.id} href={`/incidents/${inc.id}`}>
                <Card className="p-4 hover:border-[var(--primary)]/40 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[var(--text)] truncate">{inc.title}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">
                        {inc.id} · Logged {new Date(inc.loggedAtISO).toLocaleString()}
                        {inc.assignedTo && ` · ${inc.assignedTo}`}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityColor[inc.priority]}`}>
                        {inc.priority}
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs border border-[var(--border)] text-[var(--muted)]">
                        {inc.category}
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs bg-[var(--surface-2)] text-[var(--text)]">
                        {inc.status}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
