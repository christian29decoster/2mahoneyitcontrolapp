'use client'

import { useState, useMemo, Fragment } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { HapticButton } from '@/components/HapticButton'
import { Sheet } from '@/components/Sheets'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import {
  GOVERNANCE_FRAMEWORKS,
  getDefaultGovernanceInputs,
  computeComplianceScore,
  computeRiskIndex,
  getAuditReadiness,
  governanceTrend,
  getControlsForFramework,
  getGovernanceHeatmap,
  type FrameworkId,
  type GovernanceControl,
} from '@/lib/governance'
import { Scale, TrendingUp, TrendingDown, Download, HelpCircle } from 'lucide-react'

const TAB_OVERVIEW = 'overview'
const TAB_CONTROLS = 'controls'
const TAB_HEATMAP = 'heatmap'

function CircularScore({ value, label, trend }: { value: number; label: string; trend?: number }) {
  const r = 42
  const c = 2 * Math.PI * r
  const pct = value / 100
  const strokeDash = pct * c
  const color = value >= 80 ? 'var(--success)' : value >= 60 ? 'var(--warning)' : 'var(--danger)'
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${strokeDash} ${c}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-[var(--text)]">{value}%</span>
        </div>
      </div>
      <span className="text-xs font-medium text-[var(--muted)] mt-1">{label}</span>
      {trend != null && (
        <span className={`text-[10px] flex items-center gap-0.5 mt-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
          {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend >= 0 ? '+' : ''}{trend} (30d)
        </span>
      )}
    </div>
  )
}

function ExplainTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-[var(--muted)] hover:text-[var(--text)] p-0.5 rounded"
        aria-label="Explain this metric"
      >
        <HelpCircle size={14} />
      </button>
      {show && (
        <span className="absolute left-6 top-0 z-10 w-48 p-2 text-[10px] rounded-lg bg-[var(--surface-elev)] border border-[var(--border)] text-[var(--text)] shadow-lg">
          {text}
        </span>
      )}
    </span>
  )
}

export default function GovernancePage() {
  const [framework, setFramework] = useState<FrameworkId>('iso27001')
  const [tab, setTab] = useState<string>(TAB_OVERVIEW)
  const [selectedControl, setSelectedControl] = useState<GovernanceControl | null>(null)
  const [period, setPeriod] = useState<'30d' | '90d'>('30d')
  const h = useHaptics()

  const inputs = useMemo(() => getDefaultGovernanceInputs(), [])
  const complianceScore = useMemo(() => computeComplianceScore(inputs), [inputs])
  const risk = useMemo(() => computeRiskIndex(inputs), [inputs])
  const auditReadiness = useMemo(() => getAuditReadiness(complianceScore, risk.level), [complianceScore, risk.level])
  const controls = useMemo(() => getControlsForFramework(framework), [framework])
  const heatmap = useMemo(() => getGovernanceHeatmap(framework), [framework])

  const trendDelta = period === '30d' ? governanceTrend.complianceDelta : governanceTrend.complianceDelta * 2

  const statusLabel = (s: string) => (s === 'compliant' ? 'Compliant' : s === 'partially_compliant' ? 'Partial' : 'Non-compliant')
  const statusVariant = (s: string) => (s === 'compliant' ? 'accent' : s === 'partially_compliant' ? 'secondary' : 'destructive')

  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Governance Center</h1>
          <p className="text-sm text-[var(--muted)]">Compliance, risk and audit readiness</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted)]">Period:</span>
          <button
            type="button"
            onClick={() => { h.impact('light'); setPeriod('30d') }}
            className={`px-2 py-1 rounded-lg text-xs font-medium ${period === '30d' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-2)] text-[var(--muted)]'}`}
          >
            30d
          </button>
          <button
            type="button"
            onClick={() => { h.impact('light'); setPeriod('90d') }}
            className={`px-2 py-1 rounded-lg text-xs font-medium ${period === '90d' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-2)] text-[var(--muted)]'}`}
          >
            90d
          </button>
        </div>
      </div>

      {/* Framework selector */}
      <Card className="p-4">
        <label className="block text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
          Framework
        </label>
        <select
          value={framework}
          onChange={(e) => { h.impact('light'); setFramework(e.target.value as FrameworkId) }}
          className="w-full max-w-xs rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text)]"
        >
          {GOVERNANCE_FRAMEWORKS.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)]">
        {[TAB_OVERVIEW, TAB_CONTROLS, TAB_HEATMAP].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { h.impact('light'); setTab(t) }}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-colors ${
              tab === t ? 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] border-b-0 -mb-px' : 'text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {t === TAB_OVERVIEW ? 'Overview' : t === TAB_CONTROLS ? 'Control Mapping' : 'Heatmap'}
          </button>
        ))}
      </div>

      {tab === TAB_OVERVIEW && (
        <motion.div className="space-y-6" variants={stagger}>
          <Card className="p-6">
            <div className="flex flex-wrap items-start gap-8">
              <CircularScore value={complianceScore} label="Compliance Score" trend={trendDelta} />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">Risk Index</span>
                  <ExplainTooltip text="Aggregated from coverage gaps, critical findings and open incidents." />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[var(--text)]">{risk.value}</span>
                  <Badge variant={risk.level === 'high' ? 'destructive' : risk.level === 'medium' ? 'secondary' : 'accent'}>
                    {risk.level.toUpperCase()}
                  </Badge>
                </div>
                <span className="text-[10px] text-[var(--muted)]">
                  {period === '30d' ? governanceTrend.riskDelta : governanceTrend.riskDelta * 2} (30d)
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text)]">Audit Readiness</span>
                  <ExplainTooltip text="Ready = score ≥80 and low risk. At Risk = score ≥60. Not Ready otherwise." />
                </div>
                <Badge
                  variant={
                    auditReadiness === 'ready' ? 'accent' : auditReadiness === 'at_risk' ? 'secondary' : 'destructive'
                  }
                >
                  {auditReadiness === 'ready' ? 'Ready' : auditReadiness === 'at_risk' ? 'At Risk' : 'Not Ready'}
                </Badge>
              </div>
            </div>
          </Card>
          <p className="text-xs text-[var(--muted)]">
            Score is derived from protected devices, patch compliance, backup coverage, MFA, EDR deployment, and penalties for open critical findings and high-severity incidents.
          </p>
        </motion.div>
      )}

      {tab === TAB_CONTROLS && (
        <motion.div variants={stagger}>
          <Card className="p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                  <th className="pb-2 pr-4 font-medium">Control ID</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 pr-4 font-medium">Coverage</th>
                  <th className="pb-2 pr-4 font-medium">Linked Assets</th>
                  <th className="pb-2 font-medium">Open Gaps</th>
                </tr>
              </thead>
              <tbody>
                {controls.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => { h.impact('light'); setSelectedControl(c) }}
                    className="border-b border-[var(--border)] last:border-0 cursor-pointer hover:bg-[var(--surface-2)]/50"
                  >
                    <td className="py-3 pr-4 font-medium text-[var(--text)]">{c.controlId}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusVariant(c.status)}>{statusLabel(c.status)}</Badge>
                    </td>
                    <td className="py-3 pr-4 text-[var(--muted)]">{c.coveragePct}%</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">{c.linkedAssets}</td>
                    <td className="py-3 text-[var(--muted)]">{c.openGaps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Sheet isOpen={!!selectedControl} onClose={() => setSelectedControl(null)} title={selectedControl?.controlId ?? 'Control'}>
            {selectedControl && (
              <div className="space-y-4">
                <p className="text-sm text-[var(--muted)]">{selectedControl.description}</p>
                <div>
                  <h4 className="text-xs font-semibold uppercase text-[var(--muted)] mb-1">Evidence sources</h4>
                  <ul className="text-sm text-[var(--text)] list-disc pl-4">
                    {selectedControl.evidenceSources.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm">Linked devices/users: {selectedControl.linkedAssets}</p>
                {selectedControl.remediationRecommendations.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-[var(--muted)] mb-1">Remediation</h4>
                    <ul className="text-sm text-[var(--text)] list-disc pl-4">
                      {selectedControl.remediationRecommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <HapticButton
                  label="Request Remediation Plan"
                  onClick={() => h.impact('medium')}
                />
              </div>
            )}
          </Sheet>
        </motion.div>
      )}

      {tab === TAB_HEATMAP && (
        <motion.div variants={stagger}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[var(--muted)]">Domains × Risk Severity. Green = healthy, Yellow = attention, Red = critical.</p>
              <button
                type="button"
                onClick={() => {
                  h.impact('light')
                  const w = window.open('', '_blank')
                  if (!w) return
                  const domains = Array.from(new Set(heatmap.map((c) => c.domain)))
                  const severities = ['low', 'medium', 'high'] as const
                  w.document.write(`
                    <!DOCTYPE html><html><head><title>Governance Heatmap</title></head><body style="font-family:sans-serif;padding:24px">
                    <h1>Governance Heatmap – ${GOVERNANCE_FRAMEWORKS.find((f) => f.id === framework)?.name ?? framework}</h1>
                    <table border="1" cellpadding="8" style="border-collapse:collapse">
                    <tr><th>Domain</th>${severities.map((s) => `<th>${s}</th>`).join('')}</tr>
                    ${domains.map((d) => {
                      const row = severities.map((sev) => {
                        const cell = heatmap.find((c) => c.domain === d && c.severity === sev)
                        const bg = cell?.status === 'critical' ? '#fecaca' : cell?.status === 'attention' ? '#fef08a' : '#bbf7d0'
                        return `<td style="background:${bg}">${cell?.count ?? 0}</td>`
                      }).join('')
                      return `<tr><td>${d}</td>${row}</tr>`
                    }).join('')}
                    </table><p style="margin-top:16px;font-size:12px;color:#666">Export: Print this page and choose Save as PDF.</p></body></html>`)
                  w.document.close()
                  setTimeout(() => w.print(), 300)
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-sm text-[var(--text)] hover:bg-[var(--surface)]"
              >
                <Download size={16} />
                Export as PDF
              </button>
            </div>
            <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(3, 1fr)` }}>
              <div className="font-medium text-xs text-[var(--muted)] py-2"></div>
              <div className="font-medium text-xs text-[var(--muted)] py-2 text-center">Low</div>
              <div className="font-medium text-xs text-[var(--muted)] py-2 text-center">Medium</div>
              <div className="font-medium text-xs text-[var(--muted)] py-2 text-center">High</div>
              {Array.from(new Set(heatmap.map((c) => c.domain))).map((domain) => (
                <Fragment key={domain}>
                  <div className="text-sm text-[var(--text)] py-2 pr-2 truncate" title={domain}>{domain}</div>
                  {(['low', 'medium', 'high'] as const).map((sev) => {
                    const cell = heatmap.find((c) => c.domain === domain && c.severity === sev)
                    const bg = cell?.status === 'critical' ? 'bg-red-500/30' : cell?.status === 'attention' ? 'bg-amber-500/30' : 'bg-emerald-500/30'
                    return (
                      <div key={sev} className={`py-2 rounded-lg text-center text-sm font-medium ${bg} text-[var(--text)]`}>
                        {cell?.count ?? 0}
                      </div>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}
