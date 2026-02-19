 'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { stagger } from '@/lib/ui/motion'
import {
  applyInsightEffects,
  GROW_DEMO_BASELINE,
  GROW_INSIGHTS,
  GROW_OPPORTUNITY_COMMS,
  growAiScore,
  type GrowInsight,
  type GrowInsightId,
} from '@/lib/mahoney-grow-demo'
import { Sheet } from '@/components/Sheets'
import { useHaptics } from '@/hooks/useHaptics'
import { ToastManager, type ToastType } from '@/components/Toasts'
import { HapticButton } from '@/components/HapticButton'
import { useActivityStore } from '@/lib/activity.store'

function formatMetricValue(metric: string, value: number) {
  if (metric.endsWith('USD')) {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
  }
  if (metric.endsWith('Pct')) return `${value.toFixed(0)}%`
  if (metric.endsWith('Hours')) return `${value.toFixed(1)}h`
  return value.toLocaleString('en-US', { maximumFractionDigits: 1 })
}

export default function MahoneyGrowPage() {
  const h = useHaptics()
  const addActivity = useActivityStore((s) => s.addActivity)
  const [selected, setSelected] = useState<GrowInsight | null>(null)
  const [applied, setApplied] = useState<Partial<Record<GrowInsightId, boolean>>>({})
  const [businessSheetOpen, setBusinessSheetOpen] = useState(false)
  const [aiAnalysisRequested, setAiAnalysisRequested] = useState(false)
  const [toasts, setToasts] = useState<
    Array<{ id: string; type: ToastType; title: string; message?: string }>
  >([])

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
  }
  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  const metrics = useMemo(
    () => applyInsightEffects(GROW_DEMO_BASELINE, { applied }),
    [applied]
  )
  const score = useMemo(() => growAiScore(metrics), [metrics])

  const scenarioLabel = Object.values(applied).some(Boolean) ? 'Optimized' : 'Baseline'

  const technicalInsights = useMemo(
    () => GROW_INSIGHTS.filter(i => i.category === 'Technical'),
    []
  )
  const businessInsights = useMemo(
    () => GROW_INSIGHTS.filter(i => i.category === 'Business'),
    []
  )

  const openInsight = (ins: GrowInsight) => {
    h.impact('light')
    setSelected(ins)
  }

  const toggleApply = (id: GrowInsightId) => {
    h.impact('medium')
    setApplied(prev => {
      const next = { ...prev, [id]: !prev[id] }
      return next
    })
    const nowApplied = !applied[id]
    addToast(
      nowApplied ? 'success' : 'info',
      nowApplied ? 'Optimization applied' : 'Optimization removed',
      nowApplied ? 'You are viewing the simulated optimized scenario.' : 'Back to baseline signals.'
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger} className="space-y-3">
        <Badge variant="accent" className="mb-1">
          Mahoney Grow
        </Badge>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)]">
          Your opportunities from log data
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] max-w-2xl">
          We use <strong>SIEM and RMM log data</strong> (calls, emails, usage) as objective
          evidence. Together with you and your process owners we interpret what it means;
          <strong> AI in the background</strong> calculates automation potential and savings.
          When you want it, we run the analysis for your company.
        </p>
        <div className="inline-flex flex-wrap gap-2 mt-1 text-[11px]">
          <span className="px-2 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)]">
            Log data (objective) → with you → AI potential → savings
          </span>
        </div>
      </motion.div>

      {/* How Grow works */}
      <motion.div variants={stagger}>
        <Card className="p-4 bg-[var(--surface)]/50 border-[var(--primary)]/20">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-3">How Grow works</h2>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-[var(--text)]">
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold">1</span>
              <span><strong>Your data:</strong> SIEM, RMM, telephony and mailbox logs – we only see what you allow.</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold">2</span>
              <span><strong>With you:</strong> We review the numbers with you and process owners (e.g. what are these calls about?).</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold">3</span>
              <span><strong>AI analysis:</strong> When you request it, AI calculates automation potential and estimated savings.</span>
            </li>
            <li className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-xs font-bold">4</span>
              <span><strong>Opportunities:</strong> Concrete levers (apps, automation) so you save time and cost – with objective proof from logs.</span>
            </li>
          </ol>
        </Card>
      </motion.div>

      {/* Opportunity from the use case: Communication & calls */}
      <motion.div variants={stagger}>
        <h2 className="text-base font-semibold text-[var(--text)] mb-2">
          Opportunities (from your data)
        </h2>
        <p className="text-xs text-[var(--muted)] mb-3">
          Example of what we can derive from your logs when you opt in to AI analysis. Numbers are based on real engagements (anonymized).
        </p>
        <Card className="p-4 border-[var(--primary)]/30">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[var(--text)]">{GROW_OPPORTUNITY_COMMS.title}</h3>
              <p className="text-xs text-[var(--muted)] mt-1">{GROW_OPPORTUNITY_COMMS.subtitle}</p>
              <div className="mt-3 space-y-2">
                <div className="text-[11px] uppercase tracking-wide text-[var(--muted)]">What we see in your logs</div>
                <ul className="text-sm text-[var(--text)] space-y-1">
                  {GROW_OPPORTUNITY_COMMS.fromLogs.map((x, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] mt-1.5 flex-shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 pt-3 border-t border-[var(--border)]">
                  <div className="text-[11px] uppercase tracking-wide text-[var(--muted)]">With you we derived</div>
                  <p className="text-sm text-[var(--text)] mt-1" dangerouslySetInnerHTML={{ __html: GROW_OPPORTUNITY_COMMS.howWeDerived.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <div className="text-[10px] uppercase text-[var(--muted)]">{GROW_OPPORTUNITY_COMMS.metricLabel}</div>
                    <div className="text-lg font-semibold text-[var(--text)]">{GROW_OPPORTUNITY_COMMS.metricValue}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-[var(--muted)]">{GROW_OPPORTUNITY_COMMS.potentialLabel}</div>
                    <div className="text-lg font-semibold text-[var(--primary)]">{GROW_OPPORTUNITY_COMMS.potentialValue}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {GROW_OPPORTUNITY_COMMS.dataSources.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-lg bg-[var(--surface-2)] text-[10px] text-[var(--muted)]">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {aiAnalysisRequested ? (
                <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--text)]">
                  AI analysis requested. In production we would run the analysis and send you a report.
                </div>
              ) : (
                <HapticButton
                  label="Request AI analysis"
                  onClick={() => {
                    h.impact('medium')
                    setAiAnalysisRequested(true)
                    addActivity({ type: 'changed', title: 'AI-Analyse angefordert', message: 'Communication & Call Analysis' })
                    addToast('success', 'AI analysis requested', 'When you enable analysis, we process your log data and calculate potential.')
                  }}
                />
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Security-to-Growth Score
            </div>
            <Badge
              variant={score.label === 'High' ? 'accent' : score.label === 'Balanced' ? 'secondary' : 'destructive'}
            >
              {score.label}
            </Badge>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <div className="text-3xl font-bold text-[var(--text)]">{score.score}</div>
            <div className="text-sm text-[var(--muted)]">/ 100</div>
          </div>
          <div className="mt-2 text-xs text-[var(--muted)]">
            Scenario: <span className="text-[var(--text)] font-medium">{scenarioLabel}</span>
          </div>
          <p className="mt-3 text-[11px] text-[var(--muted)]">
            Scores how well your current setup supports efficiency and growth – from
            MTTR, noise, automation and risk exposure (all from your log data when you opt in).
          </p>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            MTTR
          </div>
          <div className="mt-1 text-2xl font-semibold text-[var(--text)]">
            {formatMetricValue('mttrHours', metrics.mttrHours)}
          </div>
          <div className="mt-2 text-xs text-[var(--muted)]">
            How quickly incidents are closed in your environment – with direct impact on
            ticket cost, SLA quality and satisfaction of your teams.
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
            Risk Exposure (annualized)
          </div>
          <div className="mt-1 text-2xl font-semibold text-[var(--text)]">
            {formatMetricValue('riskExposureUSD', metrics.riskExposureUSD)}
          </div>
          <div className="mt-2 text-xs text-[var(--muted)]">
            What a worst-case year could mean in terms of impact. The lower, the more
            predictable your growth and cashflow.
          </div>
        </Card>
      </motion.div>

      <motion.div variants={stagger} className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">
              AI Insights – Technical
            </h2>
            <p className="text-xs text-[var(--muted)]">
              From your SIEM/RMM and operations data we identify technical levers to
              stabilize and streamline your environment – so you spend less time on firefighting.
            </p>
          </div>
          <div className="text-xs text-[var(--muted)]">
            Applied:{' '}
            <span className="text-[var(--text)] font-medium">
              {Object.values(applied).filter(Boolean).length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalInsights.map(ins => {
            const isApplied = !!applied[ins.id]
            const primaryValue = metrics[ins.primaryMetric]
            return (
              <button
                key={ins.id}
                onClick={() => openInsight(ins)}
                className="text-left"
              >
                <Card className="p-4 hover:border-[rgba(59,130,246,.35)] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[var(--text)] truncate">
                        {ins.title}
                      </div>
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        {ins.short}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isApplied ? 'accent' : 'secondary'}>
                        {isApplied ? 'Applied' : 'Demo'}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                        Primary signal
                      </div>
                      <div className="text-sm font-medium text-[var(--text)]">
                        {formatMetricValue(ins.primaryMetric, primaryValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                        Expected impact
                      </div>
                      <div className="text-sm font-medium text-[var(--text)]">
                        {ins.impact
                          .slice(0, 1)
                          .map(e => `${e.delta > 0 ? '+' : ''}${e.delta}${e.unit ?? ''}`)
                          .join(', ')}
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            )
          })}
        </div>

        <div className="pt-2">
          <h2 className="text-base font-semibold text-[var(--text)] mb-1">
            AI Insights – Business
          </h2>
          <p className="text-xs text-[var(--muted)] mb-3">
            From the same log and event data we derive concrete levers for efficiency and
            growth in your company – e.g. automation potential and time savings.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {businessInsights.map(ins => {
              const isApplied = !!applied[ins.id]
              const primaryValue = metrics[ins.primaryMetric]
              return (
                <button
                  key={ins.id}
                  onClick={() => openInsight(ins)}
                  className="text-left"
                >
                  <Card className="p-4 hover:border-[rgba(59,130,246,.35)] transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[var(--text)] truncate">
                          {ins.title}
                        </div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {ins.short}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Business</Badge>
                        <Badge variant={isApplied ? 'accent' : 'secondary'}>
                          {isApplied ? 'Applied' : 'Demo'}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                          Primary signal
                        </div>
                        <div className="text-sm font-medium text-[var(--text)]">
                          {formatMetricValue(ins.primaryMetric, primaryValue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                          Expected impact
                        </div>
                        <div className="text-sm font-medium text-[var(--text)]">
                          {ins.impact
                            .slice(0, 1)
                            .map(e => `${e.delta > 0 ? '+' : ''}${e.delta}${e.unit ?? ''}`)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  </Card>
                </button>
              )
            })}
          </div>
        </div>

        <Card className="p-4">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
            Detected manual workflows (Demo)
          </h3>
          <p className="text-xs text-[var(--muted)] mb-3">
            When we analyze your SIEM and RMM logs, we often find manual workflows
            (e.g. repeated calls, email volume, ticket patterns). With you we interpret
            them and AI calculates where automation can save time and cost – with
            objective evidence from your data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-[var(--text)]">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="text-xs font-medium text-[var(--muted)] mb-1">
                Password-Reset Tickets
              </div>
              <p>27% of all service desk tickets are repetitive password reset requests.</p>
              <p className="mt-2 text-[11px] text-[var(--muted)]">
                Recommendation: self-service password flow + automation in RMM / IdM.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="text-xs font-medium text-[var(--muted)] mb-1">
                Mitarbeiter-Onboarding
              </div>
              <p>Employee onboarding touches 3 systems with 9 manual steps per user.</p>
              <p className="mt-2 text-[11px] text-[var(--muted)]">
                Recommendation: standardized onboarding playbook + workflow automation.
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <div className="text-xs font-medium text-[var(--muted)] mb-1">
                Monatliche Reports
              </div>
              <p>Security &amp; operations reports are exported manually from logs.</p>
              <p className="mt-2 text-[11px] text-[var(--muted)]">
                Recommendation: automated report jobs + scheduled delivery to management.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-4"
      >
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Unified Security &amp; Operations Data
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Mahoney Grow aggregates and normalizes structured and unstructured
              cybersecurity data into one analytics layer:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[var(--text)]">
              {[
                'SOC event streams',
                'SIEM logs',
                'Security event telemetry',
                'Endpoint and network monitoring data',
                'RMM system data',
                'Incident and alert histories',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Cybersecurity Intelligence Layer
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Through AI-assisted pattern recognition, Mahoney Grow links technical
              security events to operational impact:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[var(--text)]">
              {[
                'Event logs and alert metadata',
                'Incident response timelines',
                'Threat prioritization metrics',
                'Vulnerability patterns',
                'Asset behavior anomalies',
                'Escalation frequency and response performance',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Strategic Purpose
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Mahoney Grow schlägt die Brücke von technischen Security-Operationen zur
              Geschäftsführungsebene:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Verwandelt Rohdaten aus Event- &amp; SIEM-Logs in Executive-Dashboards</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Lieferung wachstumsorientierter Risiko-Analysen und Prognosen</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>AI-gestützte Empfehlungen für Security-Investitionen und Wachstum</span>
              </li>
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Business Intelligence Integration
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Optionally, Mahoney Grow can correlate cybersecurity telemetry with
              financial and operational data from your business systems:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              {[
                'Revenue metrics',
                'Operational costs',
                'Department performance indicators',
                'Growth KPIs',
                'Client acquisition data',
                'Service utilization metrics',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-[var(--muted)]">
              This unlocks views on how security posture, service quality and growth
              targets influence each other across clients, locations and services.
            </p>
            <div className="mt-4">
              <HapticButton
                label="Open Business Growth Analyst (Demo)"
                onClick={() => {
                  h.impact('medium')
                  setBusinessSheetOpen(true)
                }}
              />
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Outcomes for Leadership
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              By combining security and business data, Mahoney Grow supports
              board-level and C-level decisions:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              {[
                'Risk-adjusted growth modeling',
                'Cost-to-risk optimization',
                'Security investment prioritization',
                'Resource allocation optimization',
                'Executive-level forecasting',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-4">
            <h2 className="text-sm font-semibold text-[var(--text)] mb-2">
              Positioning
            </h2>
            <p className="text-xs text-[var(--muted)] mb-3">
              Mahoney Grow is positioned as the correlation layer between SOC
              operations and executive growth steering:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              {[
                'An AI-driven Security Intelligence Platform',
                'A Cybersecurity-to-Business Optimization Engine',
                'A Data Correlation Layer between SOC operations and executive strategy',
                'A Growth steering system powered by security telemetry',
              ].map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </motion.div>

      <Sheet
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? selected.title : 'Insight'}
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-[var(--muted)]">Summary</div>
                <div className="text-sm font-medium text-[var(--text)]">{selected.short}</div>
              </div>
              <Badge variant={applied[selected.id] ? 'accent' : 'secondary'}>
                {applied[selected.id] ? 'Applied' : 'Demo'}
              </Badge>
            </div>

            <Card className="p-4 bg-[var(--surface)]">
              <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Before → After (simulated)
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {selected.impact.map(eff => {
                  const before = applyInsightEffects(GROW_DEMO_BASELINE, { applied: { ...applied, [selected.id]: false } })[eff.metric]
                  const after = applyInsightEffects(GROW_DEMO_BASELINE, { applied: { ...applied, [selected.id]: true } })[eff.metric]
                  return (
                    <div key={eff.metric} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
                      <div className="text-xs text-[var(--muted)]">{eff.label}</div>
                      <div className="mt-1 text-sm font-semibold text-[var(--text)]">
                        {formatMetricValue(eff.metric, before)} → {formatMetricValue(eff.metric, after)}
                      </div>
                      <div className="mt-1 text-xs text-[var(--muted)]">
                        Δ {eff.delta > 0 ? '+' : ''}
                        {eff.delta}
                        {eff.unit ?? ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="p-4">
                <div className="text-sm font-semibold text-[var(--text)] mb-2">What gets optimized</div>
                <ul className="space-y-2 text-sm text-[var(--text)]">
                  {selected.whatOptimizes.map(x => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-4">
                <div className="text-sm font-semibold text-[var(--text)] mb-2">Why the AI recommends this</div>
                <ul className="space-y-2 text-sm text-[var(--text)]">
                  {selected.why.map(x => (
                    <li key={x} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="p-4">
              <div className="text-sm font-semibold text-[var(--text)] mb-2">Data sources used</div>
              <div className="flex flex-wrap gap-2">
                {selected.dataSources.map(s => (
                  <span
                    key={s}
                    className="px-2 py-1 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-xs text-[var(--text)]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </Card>

            <div className="flex gap-3">
              <button
                onClick={() => toggleApply(selected.id)}
                className={`flex-1 px-4 py-3 rounded-[16px] font-medium border transition-colors ${
                  applied[selected.id]
                    ? 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                    : 'bg-[var(--primary)] text-white border-transparent'
                }`}
              >
                {applied[selected.id] ? 'Remove optimization' : 'Apply optimization'}
              </button>
              <button
                onClick={() => {
                  h.impact('light')
                  setSelected(null)
                }}
                className="px-4 py-3 rounded-[16px] bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet
        isOpen={businessSheetOpen}
        onClose={() => setBusinessSheetOpen(false)}
        title="Business Growth Analyst – Demo intake"
      >
        <div className="space-y-5">
          <p className="text-sm text-[var(--muted)]">
            In a real engagement Mahoney would combine your customers&apos; security
            telemetry with key commercial data points to build a tailored growth model.
            This demo sheet illustrates which kind of information is typically used.
          </p>

          <Card className="p-4">
            <div className="text-sm font-semibold text-[var(--text)] mb-2">
              Example commercial inputs per customer
            </div>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Annual contract value &amp; contract term</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Service mix (managed security, workplace, cloud, projects)</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Target growth per segment (SMB, mid-market, enterprise)</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>Current margin band and utilization of your service teams</span>
              </li>
            </ul>
          </Card>

          <Card className="p-4">
            <div className="text-sm font-semibold text-[var(--text)] mb-2">
              How Mahoney Grow uses this (Demo)
            </div>
            <p className="text-xs text-[var(--muted)] mb-3">
              The Business Growth Analyst combines these inputs with the signals on this
              page (MTTR, noise, automation, risk exposure) to:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text)]">
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>
                  Prioritize which customers offer the strongest upside from security-led
                  optimization.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>
                  Quantify impact on margin and recurring revenue if automation and
                  service quality are improved.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                <span>
                  Prepare board-ready narratives that link security investments directly
                  to growth plans.
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </Sheet>

      <ToastManager toasts={toasts as any} removeToast={removeToast} />
    </motion.div>
  )
}


