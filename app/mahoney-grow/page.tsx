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
  growAiScore,
  type GrowInsight,
  type GrowInsightId,
} from '@/lib/mahoney-grow-demo'
import { Sheet } from '@/components/Sheets'
import { useHaptics } from '@/hooks/useHaptics'
import { ToastManager, type ToastType } from '@/components/Toasts'

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
  const [selected, setSelected] = useState<GrowInsight | null>(null)
  const [applied, setApplied] = useState<Partial<Record<GrowInsightId, boolean>>>({})
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
          Business Growth powered by Security Data
        </h1>
        <p className="text-sm md:text-base text-[var(--muted)] max-w-2xl">
          Mahoney Grow zeigt Ihren Kunden, wie <strong>Security- und SIEM-Daten</strong>{' '}
          direkt in <strong>Business-Wachstum</strong> übersetzt werden können. Die Demo
          verbindet Security-Telemetrie mit Umsatz-, Margin- und Churn-Kennzahlen – als
          Steuerungs-Cockpit für das Management des Kundenunternehmens.
        </p>
        <div className="inline-flex flex-wrap gap-2 mt-1 text-[11px]">
          <span className="px-2 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)]">
            Security Posture → Effizienz → Business Growth
          </span>
          <span className="px-2 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)]">
            From SOC/SIEM events to P&amp;L impact
          </span>
        </div>
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
            Bewertet, wie gut Ihr aktuelles Security-Setup Wachstumsziele stützt – basierend
            auf MTTR, Rauschen, Automatisierung, Risikoexposure und Margin.
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
            Security-Ebene beim Kunden: Wie schnell Incidents in seiner Umgebung
            geschlossen werden – mit direktem Einfluss auf Ticketkosten, SLA-Qualität und
            Zufriedenheit der Fachbereiche.
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
            Business-Ebene: Was ein „Worst-Case-Jahr“ an Schaden bedeuten könnte.
            Je niedriger, desto stabiler planbar sind Wachstum und Cashflow.
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
              Wie Security- und Operationsdaten in den Kundenumgebungen genutzt werden,
              um das technologische Fundament zu stabilisieren und effizienter zu machen.
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
            Wie aus denselben Security-/Eventdaten konkrete Hebel für Marge, Auslastung
            und Wachstum im Kundenunternehmen abgeleitet werden – über alle Mandanten
            hinweg.
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
            In this demo Mahoney Grow highlights not only security topics, but also
            manual business workflows inside the customer environment that surface in
            event and ticket logs – ideal candidates for automation and growth without
            adding headcount.
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
          <Card>
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

          <Card>
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

          <Card>
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
          <Card>
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
          </Card>

          <Card>
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

          <Card>
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

      <ToastManager toasts={toasts as any} removeToast={removeToast} />
    </motion.div>
  )
}


