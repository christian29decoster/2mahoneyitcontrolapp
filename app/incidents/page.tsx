'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { AlertTriangle, Plus, Filter, TrendingUp } from 'lucide-react'
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

type SlaReport = {
  responsePct: number
  resolutionPct: number
  totalWithResponse: number
  totalResolved: number
  responseMet: number
  resolutionMet: number
  breaches: { incidentId: string; type: string; actualMinutes: number; targetMinutes: number }[]
}

export default function IncidentsPage() {
  const [items, setItems] = useState<IncidentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | ''>('')
  const [filterCategory, setFilterCategory] = useState<IncidentCategory | ''>('')
  const [filterPriority, setFilterPriority] = useState<IncidentPriority | ''>('')
  const [showFilters, setShowFilters] = useState(false)
  const [slaReport, setSlaReport] = useState<SlaReport | null>(null)
  const [dataSource, setDataSource] = useState<'local' | 'autotask' | 'mixed'>('local')

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterStatus) params.set('status', filterStatus)
    if (filterCategory) params.set('category', filterCategory)
    if (filterPriority) params.set('priority', filterPriority)
    fetch(`/api/incidents?${params}`)
      .then((r) => r.json())
      .then((data: { items: IncidentRecord[]; source?: 'local' | 'autotask' | 'mixed' }) => {
        setItems(data.items ?? [])
        setDataSource(data.source ?? 'local')
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [filterStatus, filterCategory, filterPriority])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    fetch('/api/sla/report')
      .then((r) => r.json())
      .then((data: SlaReport) => setSlaReport(data))
      .catch(() => {})
  }, [])

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

      {slaReport != null && (
        <Link href="/incidents/sla">
          <Card className="mt-4 p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 hover:border-[var(--primary)]/40 transition-colors">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
              <span className="text-sm font-medium text-[var(--muted)]">SLA (last 30 days)</span>
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Response SLA</div>
              <div className={`text-lg font-semibold ${slaReport.responsePct >= 95 ? 'text-emerald-400' : slaReport.responsePct >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                {slaReport.responsePct}%
              </div>
              <div className="text-[10px] text-[var(--muted)]">{slaReport.responseMet}/{slaReport.totalWithResponse} met</div>
            </div>
            <div>
              <div className="text-xs text-[var(--muted)]">Resolution SLA</div>
              <div className={`text-lg font-semibold ${slaReport.resolutionPct >= 95 ? 'text-emerald-400' : slaReport.resolutionPct >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
                {slaReport.resolutionPct}%
              </div>
              <div className="text-[10px] text-[var(--muted)]">{slaReport.resolutionMet}/{slaReport.totalResolved} met</div>
            </div>
            <div className="flex items-end">
              {slaReport.breaches.length > 0 ? (
                <span className="text-xs text-red-400">{slaReport.breaches.length} breach{slaReport.breaches.length !== 1 ? 'es' : ''}</span>
              ) : (
                <span className="text-xs text-[var(--muted)]">No breaches</span>
              )}
            </div>
          </Card>
        </Link>
      )}

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
        {(dataSource === 'autotask' || dataSource === 'mixed') && (
          <span className="ml-2 text-[var(--primary)]">Including tickets from Autotask PSA.</span>
        )}
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
