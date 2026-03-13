'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Radio,
  AlertTriangle,
  Users,
  Activity,
  BarChart3,
  FileWarning,
  MessageSquare,
  Play,
  ChevronRight,
  FileText,
  Sparkles,
  TrendingUp,
  Briefcase,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import { scoreToLevel, type RiskLevel, type PerCustomerRisk } from '@/lib/mission-briefing/types'
import { BRIEFING_DEMO_SITREP, AI_COORDINATOR_DEMO, AI_COORDINATOR_SUMMARY, DEMO_MISSION_SUMMARY } from '@/lib/mission-briefing/briefing-demo'
import { GROW_INSIGHTS, growAiScore, GROW_DEMO_BASELINE } from '@/lib/mahoney-grow-demo'

type DashboardSummary = {
  tenantId: string
  summary: {
    threatLandscapeScore: number
    infrastructureHealthScore: number
    operationalLoadScore: number
    complianceExposureScore: number
    customerRiskIndex: number
    perCustomer: PerCustomerRisk[]
    rawMetrics: {
      highSeveritySiemAlerts24h: number
      activeSophosIncidents: number
      devicesOfflineOver12h: number
      devicesTotal: number
      patchCompliancePercent: number
      openP1Tickets: number
      openP2Tickets: number
      slaBreachesPending: number
      resourceUtilizationPercent: number
    }
    generatedAtISO: string
  }
}

const levelColors: Record<RiskLevel, string> = {
  green: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50',
  yellow: 'bg-amber-600/30 text-amber-300 border-amber-500/50',
  red: 'bg-red-600/30 text-red-300 border-red-500/50',
  critical: 'bg-red-800/50 text-red-200 border-red-400',
}

function ScoreRing({ value, label, level }: { value: number; label: string; level: RiskLevel }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-14 w-14 rounded-full border-2 border-[var(--border)] bg-[var(--surface-2)]">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent transition-all"
          style={{
            background: `conic-gradient(var(--primary) ${pct * 3.6}deg, transparent 0)`,
          }}
        />
        <div className="absolute inset-1 rounded-full bg-[var(--surface)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${level === 'critical' || level === 'red' ? 'text-red-300' : level === 'yellow' ? 'text-amber-300' : 'text-emerald-300'}`}>
            {Math.round(pct)}
          </span>
        </div>
      </div>
      <span className="mt-1 text-[10px] text-[var(--muted)] uppercase tracking-wide">{label}</span>
    </div>
  )
}

export default function MissionControlPage() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [tenantId, setTenantId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/mission-briefing/dashboard')
      if (res.ok) {
        const j = await res.json()
        setData(j)
        setTenantId(j.tenantId ?? null)
      } else {
        setData(null)
      }
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const startBriefing = async () => {
    setStarting(true)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const res = await fetch('/api/mission-briefing/briefings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: data?.tenantId ?? (isDemoData ? 'O-25-001' : undefined),
          timezone: tz,
        }),
      })
      if (res.ok) {
        const j = await res.json()
        window.location.href = `/mission-control/briefing/${j.item.id}`
        return
      }
    } catch {
      setStarting(false)
    }
    setStarting(false)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Loading mission dashboard…</p>
      </div>
    )
  }

  const s = data?.summary ?? DEMO_MISSION_SUMMARY
  const isDemoData = !data?.summary
  const threatLevel = scoreToLevel(s.threatLandscapeScore)
  const infraLevel = scoreToLevel(s.infrastructureHealthScore)
  const loadLevel = scoreToLevel(s.operationalLoadScore)
  const complianceLevel = scoreToLevel(s.complianceExposureScore)
  const riskLevel = scoreToLevel(s.customerRiskIndex)
  const raw = s.rawMetrics

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-4 space-y-6">
      {isDemoData && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm text-amber-200">
          Demo data — assign a tenant and configure integrations (RMM, Autotask, etc.) for live dashboard data.
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
          <Radio className="w-6 h-6 text-[var(--primary)]" />
          Mission Control
        </h1>
        <button
          type="button"
          onClick={startBriefing}
          disabled={starting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          <Play size={18} />
          {starting ? 'Starting…' : 'Start Briefing'}
        </button>
      </div>

      {/* Briefing (Situation Report) – added value, aviation-oriented */}
      <Card className="p-4 border-[var(--border)]">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <FileText size={14} />
          Briefing — Situation Report (SITREP)
        </h2>
        <p className="text-xs text-[var(--muted)] mb-4">
          What this briefing delivers: one coordinated picture for teams, resources, and in-house IT.
        </p>
        <div className="space-y-4">
          {BRIEFING_DEMO_SITREP.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide mb-1">
                {section.title}
                {section.subtitle && <span className="font-normal text-[var(--muted)] normal-case"> — {section.subtitle}</span>}
              </h3>
              <ul className="list-disc list-inside text-sm text-[var(--text)] space-y-0.5">
                {section.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Radar – 5 scores */}
      <Card className="p-4 border-[var(--border)]">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <Activity size={14} />
          Risk Radar
        </h2>
        <div className="flex flex-wrap justify-around gap-6">
          <ScoreRing value={s.threatLandscapeScore} label="Threat" level={threatLevel} />
          <ScoreRing value={s.infrastructureHealthScore} label="Infrastructure" level={infraLevel} />
          <ScoreRing value={s.operationalLoadScore} label="Operational load" level={loadLevel} />
          <ScoreRing value={s.complianceExposureScore} label="Compliance" level={complianceLevel} />
          <ScoreRing value={s.customerRiskIndex} label="Risk index" level={riskLevel} />
        </div>
        <p className="text-[10px] text-[var(--muted)] mt-2">Scores 0–100; higher = higher risk. Generated {new Date(s.generatedAtISO).toLocaleString()}.</p>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Critical Clients */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
            <Users size={14} />
            Critical Clients (by Risk Index)
          </h2>
          {s.perCustomer.length === 0 ? (
            <p className="text-xs text-[var(--muted)]">No customer data.</p>
          ) : (
            <ul className="space-y-2">
              {s.perCustomer.slice(0, 8).map((c) => (
                <li key={c.customerId} className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                  <span className="text-sm text-[var(--text)] truncate">{c.customerName}</span>
                  <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium border ${levelColors[c.level]}`}>
                    {Math.round(c.riskIndex)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* SLA Threat Board */}
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
            <FileWarning size={14} />
            SLA Threat Board
          </h2>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-[var(--muted)]">Open P1</dt>
            <dd className={raw.openP1Tickets > 0 ? 'text-red-300 font-medium' : 'text-[var(--text)]'}>{raw.openP1Tickets}</dd>
            <dt className="text-[var(--muted)]">Open P2</dt>
            <dd className={raw.openP2Tickets > 0 ? 'text-amber-300 font-medium' : 'text-[var(--text)]'}>{raw.openP2Tickets}</dd>
            <dt className="text-[var(--muted)]">SLA breaches pending</dt>
            <dd className={raw.slaBreachesPending > 0 ? 'text-red-300 font-medium' : 'text-[var(--text)]'}>{raw.slaBreachesPending}</dd>
            <dt className="text-[var(--muted)]">Resource utilization</dt>
            <dd className="text-[var(--text)]">{raw.resourceUtilizationPercent}%</dd>
          </dl>
        </Card>
      </div>

      {/* Device Fleet Health */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <Activity size={14} />
          Device Fleet Health
        </h2>
        <div className="flex flex-wrap gap-6">
          <div>
            <span className="text-2xl font-bold text-[var(--text)]">{raw.devicesTotal}</span>
            <span className="text-xs text-[var(--muted)] ml-1">total devices</span>
          </div>
          <div>
            <span className={`text-2xl font-bold ${raw.devicesOfflineOver12h > 0 ? 'text-amber-300' : 'text-[var(--text)]'}`}>
              {raw.devicesOfflineOver12h}
            </span>
            <span className="text-xs text-[var(--muted)] ml-1">offline &gt; 12h</span>
          </div>
          <div>
            <span className={`text-2xl font-bold ${raw.patchCompliancePercent < 90 ? 'text-amber-300' : 'text-emerald-400'}`}>
              {raw.patchCompliancePercent}%
            </span>
            <span className="text-xs text-[var(--muted)] ml-1">patch compliance</span>
          </div>
        </div>
      </Card>

      {/* Resource Capacity Bar */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <BarChart3 size={14} />
          Resource Capacity
        </h2>
        <div className="h-6 rounded-full bg-[var(--surface-2)] overflow-hidden flex">
          <div
            className={`h-full transition-all ${raw.resourceUtilizationPercent >= 90 ? 'bg-red-500' : raw.resourceUtilizationPercent >= 70 ? 'bg-amber-500' : 'bg-[var(--primary)]'}`}
            style={{ width: `${Math.min(100, raw.resourceUtilizationPercent)}%` }}
          />
        </div>
        <p className="text-xs text-[var(--muted)] mt-1">{raw.resourceUtilizationPercent}% utilized</p>
      </Card>

      {/* Operational Notices */}
      <Card className="p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <MessageSquare size={14} />
          Operational Notices
        </h2>
        <ul className="space-y-2 text-sm">
          {raw.highSeveritySiemAlerts24h > 0 && (
            <li className="flex items-center gap-2 text-amber-300">
              <AlertTriangle size={14} />
              {raw.highSeveritySiemAlerts24h} high-severity SIEM alerts (24h).
            </li>
          )}
          {raw.activeSophosIncidents > 0 && (
            <li className="flex items-center gap-2 text-red-300">
              <AlertTriangle size={14} />
              {raw.activeSophosIncidents} active Sophos incidents.
            </li>
          )}
          {raw.openP1Tickets > 0 && (
            <li className="flex items-center gap-2 text-red-300">
              <AlertTriangle size={14} />
              {raw.openP1Tickets} open P1 ticket(s).
            </li>
          )}
          {raw.slaBreachesPending > 0 && (
            <li className="flex items-center gap-2 text-red-300">
              <AlertTriangle size={14} />
              {raw.slaBreachesPending} SLA breach(es) pending.
            </li>
          )}
          {raw.highSeveritySiemAlerts24h === 0 && raw.activeSophosIncidents === 0 && raw.openP1Tickets === 0 && raw.slaBreachesPending === 0 && (
            <li className="text-[var(--muted)]">No critical notices. Review Risk Radar and Critical Clients above.</li>
          )}
        </ul>
      </Card>

      {/* From Mahoney Grow – Business & Technical (data from Grow shown in briefing context) */}
      <Card className="p-4 border-[var(--border)]">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <TrendingUp size={14} />
          From Mahoney Grow — In This Briefing
        </h2>
        <p className="text-xs text-[var(--muted)] mb-3">
          Security-to-Growth Score: <span className="font-semibold text-[var(--text)]">{growAiScore(GROW_DEMO_BASELINE).score}/100</span> ({growAiScore(GROW_DEMO_BASELINE).label}). Findings below feed into coordinated planning.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-2 flex items-center gap-1">
              <Briefcase size={12} />
              Business
            </h3>
            <ul className="space-y-2">
              {GROW_INSIGHTS.filter((i) => i.category === 'Business').map((ins) => (
                <li key={ins.id} className="text-sm text-[var(--text)]">
                  <span className="font-medium">{ins.title}</span>
                  <span className="text-[var(--muted)]"> — {ins.short}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wide mb-2 flex items-center gap-1">
              <Activity size={12} />
              Technical
            </h3>
            <ul className="space-y-2">
              {GROW_INSIGHTS.filter((i) => i.category === 'Technical').map((ins) => (
                <li key={ins.id} className="text-sm text-[var(--text)]">
                  <span className="font-medium">{ins.title}</span>
                  <span className="text-[var(--muted)]"> — {ins.short}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* AI Mission Coordinator (demo) – coordinated planning, improvement */}
      <Card className="p-4 border-[var(--primary)]/30 bg-[var(--primary)]/5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-2 flex items-center gap-2">
          <Sparkles size={14} />
          AI Mission Coordinator (Demo)
        </h2>
        <p className="text-xs text-[var(--muted)] mb-4">{AI_COORDINATOR_SUMMARY}</p>
        <ul className="space-y-3">
          {AI_COORDINATOR_DEMO.map((rec) => (
            <li key={rec.id} className="flex gap-3">
              <span className={`shrink-0 w-2 h-2 rounded-full mt-1.5 ${rec.priority === 'high' ? 'bg-red-400' : rec.priority === 'medium' ? 'bg-amber-400' : 'bg-[var(--muted)]'}`} />
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{rec.title}</p>
                <p className="text-xs text-[var(--muted)] mt-0.5">{rec.summary}</p>
                <p className="text-[10px] text-[var(--muted)] mt-1">Source: {rec.source}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/mission-control/debrief"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
        >
          Start Debrief
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )
}
