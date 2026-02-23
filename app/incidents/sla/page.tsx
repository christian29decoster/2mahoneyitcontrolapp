'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { SlaComplianceReport, SlaBreach, IncidentSlaResult } from '@/lib/sla'

export default function SlaReportPage() {
  const [report, setReport] = useState<SlaComplianceReport | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sla/report')
      .then((r) => r.json())
      .then((data: SlaComplianceReport) => setReport(data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-6 text-[var(--muted)]">
        Loading…
      </div>
    )
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-[960px] px-4 py-6">
        <p className="text-[var(--muted)]">Could not load SLA report.</p>
        <Link href="/incidents" className="text-[var(--primary)] hover:underline mt-2 inline-block">← Back to Incidents</Link>
      </div>
    )
  }

  const periodStart = new Date(report.periodStartISO).toLocaleDateString()
  const periodEnd = new Date(report.periodEndISO).toLocaleDateString()

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/incidents" className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)]">
          <ArrowLeft size={18} />
        </Link>
        <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
        <h1 className="text-xl font-bold text-[var(--text)]">SLA Compliance Report</h1>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        Period: {periodStart} – {periodEnd}. Targets by priority: P1 15min/1h, P2 30min/4h, P3 2h/8h, P4 4h/24h.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Response SLA</div>
          <div className={`text-2xl font-semibold mt-1 ${report.responsePct >= 95 ? 'text-emerald-400' : report.responsePct >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
            {report.responsePct}%
          </div>
          <div className="text-sm text-[var(--muted)] mt-0.5">
            {report.responseMet} of {report.totalWithResponse} incidents responded within target
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Resolution SLA</div>
          <div className={`text-2xl font-semibold mt-1 ${report.resolutionPct >= 95 ? 'text-emerald-400' : report.resolutionPct >= 80 ? 'text-amber-400' : 'text-red-400'}`}>
            {report.resolutionPct}%
          </div>
          <div className="text-sm text-[var(--muted)] mt-0.5">
            {report.resolutionMet} of {report.totalResolved} resolved incidents met target
          </div>
        </Card>
      </div>

      {report.breaches.length > 0 && (
        <Card className="p-4 mb-6 border-amber-500/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            <h2 className="font-semibold text-[var(--text)]">Breaches ({report.breaches.length})</h2>
          </div>
          <ul className="space-y-2 text-sm">
            {report.breaches.map((b: SlaBreach, i: number) => (
              <li key={`${b.incidentId}-${b.type}-${i}`} className="flex flex-wrap items-center gap-2">
                <Link href={`/incidents/${b.incidentId}`} className="text-[var(--primary)] hover:underline font-medium">
                  {b.title}
                </Link>
                <span className="text-[var(--muted)]">· {b.type}</span>
                <span className="text-red-400">{Math.round(b.actualMinutes)} min (target {b.targetMinutes} min)</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="p-4 overflow-x-auto">
        <h2 className="font-semibold text-[var(--text)] mb-3">Per-incident SLA</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
              <th className="pb-2 pr-2">Incident</th>
              <th className="pb-2 pr-2">Priority</th>
              <th className="pb-2 pr-2">Response</th>
              <th className="pb-2 pr-2">Resolution</th>
            </tr>
          </thead>
          <tbody>
            {report.incidentResults.map((r: IncidentSlaResult) => (
              <tr key={r.incidentId} className="border-b border-[var(--border)] last:border-0">
                <td className="py-2 pr-2">
                  <Link href={`/incidents/${r.incidentId}`} className="text-[var(--primary)] hover:underline">
                    {r.incidentId}
                  </Link>
                </td>
                <td className="py-2 pr-2">{r.priority}</td>
                <td className="py-2 pr-2">
                  {r.responseMinutes != null ? (
                    <span className={r.responseMet ? 'text-emerald-400' : 'text-red-400'}>
                      {Math.round(r.responseMinutes)} min / {r.responseTargetMinutes} min {r.responseMet ? '✓' : '✗'}
                    </span>
                  ) : (
                    <span className="text-[var(--muted)]">—</span>
                  )}
                </td>
                <td className="py-2 pr-2">
                  {r.resolutionMinutes != null ? (
                    <span className={r.resolutionMet ? 'text-emerald-400' : 'text-red-400'}>
                      {Math.round(r.resolutionMinutes)} min / {r.resolutionTargetMinutes} min {r.resolutionMet ? '✓' : '✗'}
                    </span>
                  ) : (
                    <span className="text-[var(--muted)]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
