'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StatTile } from '@/components/StatTile'
import { Recommendation } from '@/components/Recommendation'
import { HapticButton } from '@/components/HapticButton'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { AlertItem } from '@/components/AlertItem'
import { MiniMap } from '@/components/MiniMap'
import { Sheet } from '@/components/Sheets'
import { Toast, ToastType } from '@/components/Toasts'
import { QuickAuditBlock } from '@/components/QuickAuditBlock'
import { demoTenant, stats, alerts, mail } from '@/lib/demo'
import { TrendingUp, CheckCircle } from 'lucide-react'
import { planMonthlyUSD, formatCurrency } from '@/lib/pricing'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import ServiceCockpitCard from '@/components/cockpit/ServiceCockpitCard'
import ServiceCockpitSheet from '@/components/cockpit/ServiceCockpitSheet'
import { useAuditStore } from '@/lib/store'
import { useActivityStore } from '@/lib/activity.store'
import UpgradeBanner from '@/components/dashboard/UpgradeBanner'
import KpiGrid from '@/components/dashboard/KpiGrid'
import CloudTiles from '@/components/dashboard/CloudTiles'
import { GROW_DEMO_BASELINE, growAiScore } from '@/lib/mahoney-grow-demo'
import { LineChart } from 'lucide-react'
import { partnerCustomers, partnerSummary, partnerMRRTrendMonths, partnerAppUpsells, partnerUpsellSummary, partnerAutomationImpacts, partnerAutomationSummary, PARTNER_PRICING, type PartnerCustomer } from '@/lib/mahoney-partner-demo'
import { useViewModeStore } from '@/lib/viewMode.store'
import { AlertsChart, MttrChart } from '@/components/dashboard/DesktopDashboardCharts'
import KpiTile from '@/components/dashboard/KpiTile'
import { computeMduCost } from '@/lib/mdu-pricing'
import { Database, DollarSign, AlertTriangle, Shield, CalendarClock, TrendingUp as TrendIcon, Zap } from 'lucide-react'
import { KEY_METRIC_TOOLTIPS, GROW_SCORE_TOOLTIP } from '@/lib/dashboard-metric-tooltips'
import MetricDeltaTooltip from '@/components/ui/MetricDeltaTooltip'

export type UsageData = {
  source: 'rmm' | 'demo'
  deviceCount: number
  estimatedEventsPerMonth: number
  eventsPerMonth?: number
  eventsSource?: 'siem' | 'estimate'
  realEventsPerMonth?: number | null
  realEventsCapped?: boolean
  realOpenAlertsCount?: number | null
  realResolvedAlertsCount?: number | null
  realResolvedCapped?: boolean
  sophosConfigured?: boolean
  sophosAlertsCount?: number | null
  sophosAlertsCapped?: boolean
}

export default function DashboardPage() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [isUpgradeSheetOpen, setIsUpgradeSheetOpen] = useState(false)
  const [openCockpit, setOpenCockpit] = useState(false)
  const [view, setView] = useState<'customer' | 'partner'>('customer')
  const [selectedPartnerCustomer, setSelectedPartnerCustomer] = useState<PartnerCustomer | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [mrrChartHovered, setMrrChartHovered] = useState<number | null>(null)
  /** Which customer we're viewing in single-tenant view (partner's customer list) */
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(partnerCustomers[0]?.id ?? null)
  const h = useHaptics()

  useEffect(() => {
    fetch('/api/usage')
      .then((r) => r.json())
      .then((d: UsageData) => setUsage(d))
      .catch(() => setUsage({ source: 'demo', deviceCount: 130, estimatedEventsPerMonth: 39000, eventsPerMonth: 39000 }))
  }, [])
  const setAuditCounts = useAuditStore(s => s.setAuditCounts)
  const addActivity = useActivityStore((s) => s.addActivity)
  const viewMode = useViewModeStore((s) => s.viewMode)
  
  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
  
  const statsData = [
    { label: 'Active Alerts', value: stats.activeAlerts, change: `+${stats.trend.alerts}`, trend: 'up' as const },
    { label: 'Offline Devices', value: stats.offlineDevices, change: `${stats.trend.offline}`, trend: 'down' as const },
    { label: 'MTTR', value: `${stats.mttrHours}h`, change: `${stats.trend.mttr}h`, trend: 'down' as const },
    { label: 'Coverage', value: `${stats.coveragePct}%`, change: `+${stats.trend.coverage}%`, trend: 'up' as const }
  ]
  
  const handleAlertClick = (alert: any) => {
    h.impact('light')
    setSelectedAlert(alert)
  }
  
  const handleSendMessage = (message: string) => {
    h.success()
    addActivity({ type: 'changed', title: 'Message sent to SOC', message: 'Alert conversation' })
    addToast('success', 'Message sent to Mahoney SOC')
    setSelectedAlert(null)
  }
  
  const handleUpgradePreview = () => {
    h.impact('medium')
    addActivity({ type: 'changed', title: 'Upgrade angefordert', message: 'Tarif-Wechsel initiiert' })
    addToast('info', 'Upgrade Preview', 'This would initiate the upgrade process in production.')
    setIsUpgradeSheetOpen(false)
  }

  // Demo Audit Counts setzen (simuliert Quick Audit)
  useEffect(() => {
    // Simuliere Audit-Ergebnisse: 2 unprotected, 1 stale, 0 quarantined
    setAuditCounts({
      unprotected: 2,
      stale: 1,
      quarantined: 0,
    })
  }, [setAuditCounts])
  
  return (
    <>
      {viewMode === 'desktop' ? (
        <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
          {/* Desktop: Header + Executive summary */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
                Control Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-[var(--muted)]">
                  {view === 'customer' ? 'Single-tenant view' : 'Partner overview'}
                </p>
                {view === 'customer' && partnerCustomers.length > 0 && (
                  <select
                    value={selectedTenantId ?? ''}
                    onChange={(e) => setSelectedTenantId(e.target.value || null)}
                    className="text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    aria-label="Select customer"
                  >
                    {partnerCustomers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {view === 'partner' ? (
                <p className="text-sm text-[var(--muted)]">
                  <strong className="text-[var(--text)]">Partner pricing:</strong>
                  {' '}{PARTNER_PRICING.appDiscountPct}% off app · {PARTNER_PRICING.partnerSharePerCustomerPct}% per customer · MDU +{formatCurrency(PARTNER_PRICING.mduMarginPerUnitUSD)} margin
                  {' · '}
                  <button type="button" onClick={() => setIsUpgradeSheetOpen(true)} className="text-[var(--primary)] hover:underline">
                    Details
                  </button>
                </p>
              ) : (
                <p className="text-sm text-[var(--muted)]">
                  <strong className="text-[var(--text)]">{demoTenant.currentPlan.tier}</strong>
                  {' '}({formatCurrency(planMonthlyUSD('Essential', 5, 25))}/mo)
                  {' · '}
                  <button type="button" onClick={() => setIsUpgradeSheetOpen(true)} className="text-[var(--primary)] hover:underline">
                    Upgrade
                  </button>
                </p>
              )}
              <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface-2)] overflow-hidden">
                <button
                  className={`px-4 py-2 text-sm font-medium ${view === 'customer' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                  onClick={() => setView('customer')}
                >
                  Customer
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium border-l border-[var(--border)] ${view === 'partner' ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}
                  onClick={() => setView('partner')}
                >
                  Partner
                </button>
              </div>
            </div>
          </div>

          {view === 'customer' ? (
            <>
              {/* Executive summary – one line for C-level */}
              <Card className="card-desktop px-5 py-3 bg-[var(--surface-2)]/50 border-[var(--border)]">
                <p className="text-sm text-[var(--muted)]">
                  {selectedTenantId && (
                    <span className="text-[var(--primary)] font-medium">
                      Viewing: {partnerCustomers.find((c) => c.id === selectedTenantId)?.name ?? selectedTenantId}
                      {' · '}
                    </span>
                  )}
                  <span className="text-[var(--text)] font-semibold">At a glance:</span>
                  {' '}{stats.activeAlerts} active alerts · {stats.offlineDevices} offline devices · MTTR {stats.mttrHours}h · Coverage {stats.coveragePct}% · 2 open incidents · Compliance 78%
                </p>
              </Card>

              {/* KPI row – 6 tiles, clear numbers */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">Key metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <KpiTile label="Active Alerts" value={String(stats.activeAlerts)} trend={{ delta: `+${stats.trend.alerts}`, positive: false }} trendTooltip={KEY_METRIC_TOOLTIPS.activeAlerts} />
                  <KpiTile label="Offline Devices" value={String(stats.offlineDevices)} trend={{ delta: String(stats.trend.offline), positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.offlineDevices} />
                  <KpiTile label="MTTR" value={`${stats.mttrHours}h`} trend={{ delta: `${stats.trend.mttr}h`, positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.mttr} />
                  <KpiTile label="Coverage" value={`${stats.coveragePct}%`} trend={{ delta: `+${stats.trend.coverage}%`, positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.coverage} />
                  <KpiTile label="Open Incidents" value="2" trend={{ delta: '0', positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.openIncidents} />
                  <KpiTile label="Compliance" value="78%" trend={{ delta: '+3%', positive: true }} trendTooltip={KEY_METRIC_TOOLTIPS.compliance} />
                </div>
              </div>

              {/* Events & MDU (Data) – devices, events/month, cost */}
              <Card className="card-desktop p-5 border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="w-4 h-4 text-[var(--primary)]" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">Events & Data cost (MDU)</h2>
                </div>
                {usage ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-[var(--muted)]">Total devices</p>
                        <p className="text-xl font-semibold text-[var(--text)]">{usage.deviceCount.toLocaleString()}</p>
                        <p className="text-[10px] text-[var(--muted)]">{usage.source === 'rmm' ? 'Live from RMM' : 'Sample data (no RMM connected)'}</p>
                      </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">{usage.eventsSource === 'siem' ? 'Events (month)' : 'Events (month, estimated)'}</p>
                      <p className="text-xl font-semibold text-[var(--text)]">{(usage.eventsPerMonth ?? usage.estimatedEventsPerMonth).toLocaleString()}{(usage.realEventsCapped ? ' (≥)' : '')}</p>
                      <p className="text-[10px] text-[var(--muted)]">{usage.eventsSource === 'siem' ? 'From Sophos SIEM' : '~10 events/device/day'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted)]">MDU cost (Layer 3)</p>
                      <p className="text-xl font-semibold text-[var(--text)] flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatCurrency(computeMduCost(usage.eventsPerMonth ?? usage.estimatedEventsPerMonth).costUsd)}/mo
                      </p>
                      <p className="text-[10px] text-[var(--muted)]">0–1M included</p>
                    </div>
                    </div>
                    {((usage.realOpenAlertsCount != null || usage.realResolvedAlertsCount != null) && usage.source === 'rmm') && (
                      <div className="mt-3 pt-3 border-t border-[var(--border)]">
                        <p className="text-xs font-medium text-[var(--muted)] mb-1">Alerts (Datto RMM)</p>
                        <p className="text-sm text-[var(--text)]">
                          <strong>{usage.realOpenAlertsCount ?? 0}</strong> open
                          {usage.realResolvedAlertsCount != null && (
                            <> · <strong>{usage.realResolvedAlertsCount.toLocaleString()}</strong> resolved{usage.realResolvedCapped ? ' (≥)' : ''}</>
                          )}
                        </p>
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-[var(--border)]">
                      <p className="text-xs font-medium text-[var(--muted)] mb-1">Sophos EDR</p>
                      <p className="text-sm text-[var(--text)]">
                        {usage.sophosAlertsCount != null ? (
                          <><strong>{usage.sophosAlertsCount.toLocaleString()}</strong> alerts{usage.sophosAlertsCapped ? ' (≥)' : ''}</>
                        ) : usage.sophosConfigured ? (
                          <span className="text-[var(--muted)]">— (API error or no alerts)</span>
                        ) : (
                          <span className="text-[var(--muted)]">Not configured</span>
                        )}
                      </p>
                    </div>
                    {(() => {
                      const mdu = computeMduCost(usage.eventsPerMonth ?? usage.estimatedEventsPerMonth)
                      const hasCost = mdu.costUsd > 0
                      return (
                        <>
                          <p className="text-[10px] text-[var(--muted)] mt-3 border-t border-[var(--border)] pt-2">
                            {mdu.summary}
                            {' · '}
                            <strong>Projected cost this month</strong> (at current rate): {formatCurrency(mdu.costUsd)}/mo
                            {' · '}
                            <a href="/financials" className="text-[var(--primary)] hover:underline">View in Financials</a>
                          </p>
                          {hasCost && (
                            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                              <p className="text-sm text-[var(--text)]">
                                You&apos;re accruing data processing costs. After 2 months of sustained usage we recommend upgrading your plan to reduce per-event fees and get better value.
                              </p>
                              <a href="/marketplace" className="inline-block mt-2 text-sm font-medium text-[var(--primary)] hover:underline">
                                Go to Marketplace →
                              </a>
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
                    <div className="animate-pulse">
                      <div className="h-3 w-16 bg-[var(--border)] rounded mb-2" />
                      <div className="h-6 w-12 bg-[var(--surface-2)] rounded" />
                    </div>
                    <div className="animate-pulse">
                      <div className="h-3 w-24 bg-[var(--border)] rounded mb-2" />
                      <div className="h-6 w-14 bg-[var(--surface-2)] rounded" />
                    </div>
                    <div className="animate-pulse">
                      <div className="h-3 w-20 bg-[var(--border)] rounded mb-2" />
                      <div className="h-6 w-16 bg-[var(--surface-2)] rounded" />
                    </div>
                  </div>
                )}
              </Card>

              {/* Charts row – with Y-axis and units */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">Trends (last 7 days)</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AlertsChart />
                  <MttrChart />
                </div>
              </div>

              {/* Operational detail */}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">Operational detail</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="card-desktop p-5 lg:col-span-2">
                  <h3 className="text-base font-semibold text-[var(--text)] mb-4">Recent Alerts</h3>
                  <div className="space-y-2">
                    {alerts.map((alert) => (
                      <AlertItem key={alert.id} alert={alert} onClick={() => handleAlertClick(alert)} />
                    ))}
                  </div>
                </Card>
                <div className="space-y-6">
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)] mb-2">Cloud Security Posture</div>
                    <CloudTiles onOpen={() => window.location.assign('/cloud')} />
                  </div>
                </div>
              </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="card-desktop p-5 bg-gradient-to-r from-[var(--primary)]/5 to-transparent border-[var(--primary)]/20">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text)]">AI Growth & Risk</h3>
                      <p className="text-sm text-[var(--muted)] mt-1">
                        Security-to-Growth Score:{' '}
                        <MetricDeltaTooltip content={GROW_SCORE_TOOLTIP}>
                          <Badge variant="accent" className="ml-1 cursor-help">{growAiScore(GROW_DEMO_BASELINE).score}/100</Badge>
                        </MetricDeltaTooltip>
                      </p>
                    </div>
                    <HapticButton label="Open" variant="surface" onClick={() => window.location.assign('/mahoney-grow')} />
                  </div>
                </Card>
                <div className="lg:col-span-2">
                  <QuickAuditBlock />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ServiceCockpitCard onOpen={() => setOpenCockpit(true)} />
                <Card className="card-desktop p-5">
                  <h3 className="text-base font-semibold text-[var(--text)] mb-4">Microsoft 365 Mailboxes</h3>
                  <div className="space-y-2">
                    {mail.o365.map((mb) => (
                      <div key={mb.user} className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0">
                        <span className="text-sm text-[var(--text)] truncate">{mb.user}</span>
                        <Badge variant={mb.status === 'Healthy' ? 'accent' : 'secondary'}>{mb.status}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="card-desktop p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[var(--text)]">Security Enhancements</h3>
                  <HapticButton label="View All" onClick={() => window.location.href = '/upselling'} variant="surface" className="text-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5">
                    <span className="text-sm font-medium text-[var(--text)]">Virtual CISO</span>
                    <p className="text-xs text-[var(--muted)] mt-1">Strategic security leadership</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[var(--warn)]/20 bg-[var(--warn)]/5">
                    <span className="text-sm font-medium text-[var(--text)]">Compliance Package</span>
                    <p className="text-xs text-[var(--muted)] mt-1">Stay ahead of regulatory changes</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[var(--success)]/20 bg-[var(--success)]/5">
                    <span className="text-sm font-medium text-[var(--text)]">Mahoney Grow</span>
                    <p className="text-xs text-[var(--muted)] mt-1">Growth from Security & SIEM data</p>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Partner KPI strip */}
              <Card className="card-desktop p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-4">Partner overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <div className="text-xs text-[var(--muted)]">Managed customers</div>
                    <div className="text-xl font-semibold text-[var(--text)]">{partnerSummary.totalCustomers}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">Total MRR</div>
                    <div className="text-xl font-semibold text-[var(--text)]">${partnerSummary.totalMRR.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    {partnerSummary.mrrGrowthPct !== 0 && (
                      <span className={`text-xs font-medium ${partnerSummary.mrrGrowthPct >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                        {partnerSummary.mrrGrowthPct >= 0 ? '+' : ''}{partnerSummary.mrrGrowthPct}% vs last month
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">Avg Grow score</div>
                    <div className="text-xl font-semibold text-[var(--text)]">{partnerSummary.avgGrowScore}/100</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">Open alerts</div>
                    <div className="text-xl font-semibold text-[var(--text)]">{partnerSummary.totalOpenAlerts}</div>
                    <span className="text-xs text-[var(--muted)]">across portfolio</span>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">At-risk customers</div>
                    <div className={`text-xl font-semibold ${partnerSummary.atRiskCount > 0 ? 'text-[var(--warning)]' : 'text-[var(--text)]'}`}>
                      {partnerSummary.atRiskCount}
                    </div>
                    <span className="text-xs text-[var(--muted)]">churn risk ≥4%</span>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--muted)]">Renewals (30d)</div>
                    <div className="text-xl font-semibold text-[var(--text)]">{partnerSummary.renewalsThisMonth}</div>
                    <span className="text-xs text-[var(--muted)]">due this month</span>
                  </div>
                </div>
              </Card>

              {/* Partner pricing & margin (from marketplace) */}
              <Card className="card-desktop p-5">
                <h2 className="text-base font-semibold text-[var(--text)] mb-3">Partner pricing & margin</h2>
                <p className="text-xs text-[var(--muted)] mb-4">
                  Your terms from the Marketplace. Prices in single-tenant view are from your catalog; you receive the margins below.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted)]">App (your access)</div>
                    <div className="text-sm font-semibold text-[var(--success)]">{PARTNER_PRICING.appDiscountPct}% discount</div>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5">You pay 80% of list</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted)]">Per customer (Control Platform)</div>
                    <div className="text-sm font-semibold text-[var(--success)]">{PARTNER_PRICING.partnerSharePerCustomerPct}% to you</div>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5">70% of platform revenue per customer</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted)]">Sell your MSP in app</div>
                    <div className="text-sm font-semibold text-[var(--text)]">You keep 80%</div>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5">e.g. Mahoney One with your brand · we take {PARTNER_PRICING.mahoneyShareOnMspSellPct}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="text-xs text-[var(--muted)]">MDU (data/events)</div>
                    <div className="text-sm font-semibold text-[var(--success)]">+{formatCurrency(PARTNER_PRICING.mduMarginPerUnitUSD)}/unit your margin</div>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5">On top of base MDU</p>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Revenue trend */}
                <Card className="card-desktop p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-[var(--primary)]" />
                    <h3 className="text-base font-semibold text-[var(--text)]">MRR trend (portfolio)</h3>
                  </div>
                  {(() => {
                    const maxMrr = Math.max(...partnerMRRTrendMonths.map((x) => x.mrr))
                    const minMrr = Math.min(...partnerMRRTrendMonths.map((x) => x.mrr))
                    const range = maxMrr - minMrr || 1
                    const pad = 12
                    const w = 500
                    const h = 96
                    const points = partnerMRRTrendMonths.map((m, i) => {
                      const x = pad + (i / Math.max(1, partnerMRRTrendMonths.length - 1)) * (w - 2 * pad)
                      const y = h - pad - ((m.mrr - minMrr) / range) * (h - 2 * pad)
                      return { x, y, month: m.month, mrr: m.mrr }
                    })
                    const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ')
                    return (
                      <div className="w-full" onMouseLeave={() => setMrrChartHovered(null)}>
                        <div className="w-full" style={{ height: 96 }}>
                          <svg width="100%" height={96} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" preserveAspectRatio="xMidYMid meet">
                            <polyline
                              fill="none"
                              stroke="var(--primary)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={linePoints}
                            />
                            {points.map((p, i) => (
                              <circle
                                key={i}
                                cx={p.x}
                                cy={p.y}
                                r="5"
                                fill="var(--primary)"
                                stroke="var(--bg)"
                                strokeWidth="2"
                                className="cursor-pointer"
                                onMouseEnter={() => setMrrChartHovered(i)}
                                onMouseLeave={() => setMrrChartHovered(null)}
                              />
                            ))}
                          </svg>
                        </div>
                        <div className="flex justify-between mt-1 px-0.5">
                          {partnerMRRTrendMonths.map((m) => (
                            <span key={m.month} className="text-[10px] text-[var(--muted)]">{m.month}</span>
                          ))}
                        </div>
                        {mrrChartHovered !== null && (
                          <div className="mt-2 py-1.5 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-sm">
                            <span className="font-medium text-[var(--text)]">{partnerMRRTrendMonths[mrrChartHovered].month}</span>
                            {' · '}
                            <span className="text-[var(--primary)] font-semibold">
                              ${partnerMRRTrendMonths[mrrChartHovered].mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </span>
                            {' MRR'}
                          </div>
                        )}
                        <p className="text-xs text-[var(--muted)] mt-2">
                          Last 6 months · Total MRR ${partnerSummary.totalMRR.toLocaleString('en-US', { maximumFractionDigits: 0 })} (+{partnerSummary.mrrGrowthPct}% MoM)
                        </p>
                      </div>
                    )
                  })()}
                </Card>

                {/* Alerts & at-risk */}
                <Card className="card-desktop p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />
                    <h3 className="text-base font-semibold text-[var(--text)]">Alerts & risk</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <span className="text-sm text-[var(--text)]">Total open alerts</span>
                      <span className="font-semibold text-[var(--text)]">{partnerSummary.totalOpenAlerts}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <span className="text-sm text-[var(--text)]">Avg MTTR (portfolio)</span>
                      <span className="font-semibold text-[var(--text)]">{partnerSummary.avgMttr}h</span>
                    </div>
                    {partnerSummary.atRiskCount > 0 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--warning)]/10 border border-[var(--warning)]/30">
                        <span className="text-sm text-[var(--text)] flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[var(--warning)]" />
                          Customers with churn risk ≥4%
                        </span>
                        <span className="font-semibold text-[var(--warning)]">{partnerSummary.atRiskCount}</span>
                      </div>
                    )}
                    {partnerSummary.renewalsThisMonth > 0 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20">
                        <span className="text-sm text-[var(--text)] flex items-center gap-2">
                          <CalendarClock className="w-4 h-4 text-[var(--primary)]" />
                          Renewals in next 30 days
                        </span>
                        <span className="font-semibold text-[var(--primary)]">{partnerSummary.renewalsThisMonth}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* App-driven upsell & Automation efficiency */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Card className="card-desktop p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendIcon className="w-5 h-5 text-[var(--success)]" />
                    <h3 className="text-base font-semibold text-[var(--text)]">App-driven upsell</h3>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-3">
                    Revenue from recommendations, in-app prompts, and Mahoney Grow insights.
                  </p>
                  <div className="p-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 mb-4">
                    <div className="text-xs text-[var(--muted)]">Total MRR from app-driven upsell</div>
                    <div className="text-xl font-semibold text-[var(--success)]">
                      ${partnerUpsellSummary.totalMrrFromUpsell.toLocaleString('en-US')}/mo
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">{partnerUpsellSummary.count} deals</div>
                  </div>
                  <div className="space-y-2">
                    {partnerAppUpsells.map((u) => (
                      <div key={u.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-sm">
                        <div className="min-w-0">
                          <div className="font-medium text-[var(--text)] truncate">{u.customerName}</div>
                          <div className="text-xs text-[var(--muted)]">{u.product} · {u.sourceLabel}</div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="font-semibold text-[var(--success)]">+${u.mrrAddedUSD.toLocaleString()}</span>/mo
                          <div className="text-[10px] text-[var(--muted)]">{u.month}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="card-desktop p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5 text-[var(--primary)]" />
                    <h3 className="text-base font-semibold text-[var(--text)]">Automation & efficiency</h3>
                  </div>
                  <p className="text-xs text-[var(--muted)] mb-3">
                    RMM automations, MSP scripts, and Control dashboards – time and cost saved.
                  </p>
                  <div className="p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-4">
                    <div className="text-xs text-[var(--muted)]">Estimated savings (portfolio)</div>
                    <div className="text-xl font-semibold text-[var(--primary)]">
                      {partnerAutomationSummary.timeSavedHoursPerMonth}h/mo saved
                    </div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">
                      ~${partnerAutomationSummary.costSavedUsdPerMonth.toLocaleString('en-US')}/mo equivalent
                    </div>
                  </div>
                  <div className="space-y-2">
                    {partnerAutomationImpacts.map((a) => (
                      <div key={a.id} className="py-2 px-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="text-[10px]">{a.typeLabel}</Badge>
                          <span className="text-xs font-medium text-[var(--success)]">
                            {a.timeSavedHoursPerMonth}h saved · ${a.costSavedUsdPerMonth}/mo
                          </span>
                        </div>
                        <div className="font-medium text-[var(--text)] text-sm mt-1">{a.title}</div>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Customers table */}
              <Card className="card-desktop p-5">
                <h3 className="text-base font-semibold text-[var(--text)] mb-4">Customers – security, growth & commercial</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        <th className="text-left py-3 px-3 text-[var(--muted)] font-medium">Customer</th>
                        <th className="text-left py-3 px-3 text-[var(--muted)] font-medium">Segment</th>
                        <th className="text-right py-3 px-3 text-[var(--muted)] font-medium">MRR</th>
                        <th className="text-right py-3 px-3 text-[var(--muted)] font-medium">Grow</th>
                        <th className="text-right py-3 px-3 text-[var(--muted)] font-medium">Alerts</th>
                        <th className="text-right py-3 px-3 text-[var(--muted)] font-medium">MTTR</th>
                        <th className="text-right py-3 px-3 text-[var(--muted)] font-medium">Churn risk</th>
                        <th className="text-right py-3 px-3 text-[var(--muted)] font-medium">Renewal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {partnerCustomers.map((c) => (
                        <tr
                          key={c.id}
                          onClick={() => { h.impact('light'); setSelectedPartnerCustomer(c) }}
                          className="hover:bg-[var(--surface-2)] cursor-pointer transition-colors"
                        >
                          <td className="py-3 px-3 font-medium text-[var(--text)]">{c.name}</td>
                          <td className="py-3 px-3"><Badge variant="secondary">{c.segment}</Badge></td>
                          <td className="py-3 px-3 text-right text-[var(--text)]">${c.monthlyRecurringRevenueUSD.toLocaleString()}</td>
                          <td className="py-3 px-3 text-right text-[var(--text)]">{c.growScore}/100</td>
                          <td className="py-3 px-3 text-right">{c.activeAlerts}</td>
                          <td className="py-3 px-3 text-right text-[var(--muted)]">{c.mttrHours.toFixed(1)}h</td>
                          <td className={`py-3 px-3 text-right ${c.churnRiskPct >= 4 ? 'text-[var(--warning)] font-medium' : 'text-[var(--muted)]'}`}>
                            {c.churnRiskPct.toFixed(1)}%
                          </td>
                          <td className="py-3 px-3 text-right text-[var(--muted)]">
                            {c.renewalInDays != null ? `in ${c.renewalInDays}d` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-[var(--muted)] mt-3">Click a row to open customer context (tenant, Grow, alerts).</p>
              </Card>
            </>
          )}
        </motion.div>
      ) : (
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Upgrade / pricing hint */}
        <motion.div variants={stagger} className="text-center">
          {view === 'partner' ? (
            <p className="text-sm text-[var(--muted)]">
              <strong className="text-[var(--text)]">Partner pricing:</strong>
              {' '}{PARTNER_PRICING.appDiscountPct}% off app · {PARTNER_PRICING.partnerSharePerCustomerPct}% per customer · MDU +{formatCurrency(PARTNER_PRICING.mduMarginPerUnitUSD)} margin
              {' · '}
              <button type="button" onClick={() => setIsUpgradeSheetOpen(true)} className="text-[var(--primary)] underline underline-offset-2">Details</button>
            </p>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              You&apos;re on <strong className="text-[var(--text)]">{demoTenant.currentPlan.tier}</strong> ({formatCurrency(planMonthlyUSD('Essential', 5, 25))}/mo).
              {' '}
              <button type="button" onClick={() => setIsUpgradeSheetOpen(true)} className="underline underline-offset-2 text-[var(--primary)] hover:opacity-90">
                Upgrade to {demoTenant.upgradeOffer.target.tier} (+${demoTenant.upgradeOffer.deltaMonthly}/mo)
              </button>
            </p>
          )}
        </motion.div>

        {/* Hero Section */}
        <motion.div className="space-y-4" variants={stagger}>
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">
              Your Mahoney Control Dashboard.
            </h1>
            <p className="text-sm text-[var(--muted)]">
              Switch between a single-customer view and a partner view across all of your customers.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="inline-flex rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
              <button
                className={`px-4 py-2 text-xs font-medium ${
                  view === 'customer'
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
                onClick={() => setView('customer')}
              >
                Customer view
              </button>
              <button
                className={`px-4 py-2 text-xs font-medium border-l border-[var(--border)] ${
                  view === 'partner'
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}
                onClick={() => setView('partner')}
              >
                Partner view (MSSP/MSP)
              </button>
            </div>
            {view === 'customer' && partnerCustomers.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
                Viewing:
                <select
                  value={selectedTenantId ?? ''}
                  onChange={(e) => setSelectedTenantId(e.target.value || null)}
                  className="text-sm bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  aria-label="Select customer"
                >
                  {partnerCustomers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </motion.div>

        {view === 'customer' ? (
          <>
            {selectedTenantId && (
              <p className="text-sm text-[var(--muted)] text-center">
                Viewing: <span className="text-[var(--primary)] font-medium">{partnerCustomers.find((c) => c.id === selectedTenantId)?.name ?? selectedTenantId}</span>
              </p>
            )}
            {/* KPI Grid */}
            <div className="mt-4">
              <KpiGrid />
            </div>

            {/* Events & MDU (mobile) */}
            <Card className="mt-4 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Events & Data cost (MDU)</h3>
              </div>
              {usage ? (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-[10px] text-[var(--muted)]">Devices</p>
                      <p className="text-lg font-semibold text-[var(--text)]">{usage.deviceCount}</p>
                    </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted)]">Events/mo</p>
                    <p className="text-lg font-semibold text-[var(--text)]">{((usage.eventsPerMonth ?? usage.estimatedEventsPerMonth) / 1000).toFixed(0)}k{usage.realEventsCapped ? '+' : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--muted)]">Cost</p>
                    <p className="text-lg font-semibold text-[var(--text)]">{formatCurrency(computeMduCost(usage.eventsPerMonth ?? usage.estimatedEventsPerMonth).costUsd)}</p>
                  </div>
                  </div>
                  <p className="text-[10px] text-[var(--muted)] mt-1">
                    {usage.source === 'rmm' ? 'Live from RMM' : 'Sample data (no RMM connected)'}
                    {' · '}
                    Projected this month: {formatCurrency(computeMduCost(usage.eventsPerMonth ?? usage.estimatedEventsPerMonth).costUsd)}
                  </p>
                  {((usage.realOpenAlertsCount != null || usage.realResolvedAlertsCount != null) && usage.source === 'rmm') && (
                    <p className="text-[10px] text-[var(--muted)] mt-2">
                      RMM: {usage.realOpenAlertsCount ?? 0} open · {usage.realResolvedAlertsCount?.toLocaleString() ?? 0} resolved{usage.realResolvedCapped ? ' (≥)' : ''}
                    </p>
                  )}
                  <p className="text-[10px] text-[var(--muted)] mt-1">
                    Sophos EDR: {usage.sophosAlertsCount != null
                      ? `${usage.sophosAlertsCount.toLocaleString()} alerts${usage.sophosAlertsCapped ? ' (≥)' : ''}`
                      : usage.sophosConfigured ? '—' : 'Not configured'}
                  </p>
                  {computeMduCost(usage.eventsPerMonth ?? usage.estimatedEventsPerMonth).costUsd > 0 && (
                    <a href="/marketplace" className="text-xs text-[var(--primary)] font-medium hover:underline mt-2 inline-block">Upgrade to reduce costs → Marketplace</a>
                  )}
                  <a href="/financials" className="text-xs text-[var(--primary)] hover:underline mt-2 ml-0 inline-block block">View in Financials →</a>
                </>
              ) : (
                <div className="grid grid-cols-3 gap-3 text-center py-2">
                  <div className="animate-pulse"><div className="h-4 w-8 bg-[var(--surface-2)] rounded mx-auto mb-1" /><div className="h-5 w-10 bg-[var(--border)] rounded mx-auto" /></div>
                  <div className="animate-pulse"><div className="h-4 w-8 bg-[var(--surface-2)] rounded mx-auto mb-1" /><div className="h-5 w-10 bg-[var(--border)] rounded mx-auto" /></div>
                  <div className="animate-pulse"><div className="h-4 w-8 bg-[var(--surface-2)] rounded mx-auto mb-1" /><div className="h-5 w-10 bg-[var(--border)] rounded mx-auto" /></div>
                </div>
              )}
            </Card>

            {/* Cloud Security Posture */}
            <div className="mt-4">
              <div className="text-base font-semibold mb-3">Cloud Security Posture</div>
              <CloudTiles onOpen={() => window.location.assign('/cloud')} />
            </div>

            {/* Mahoney Grow Teaser */}
            <motion.div variants={stagger}>
              <Card className="p-4 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-600)]/5 border-[var(--primary)]/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center shrink-0">
                      <LineChart className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text)]">Mahoney Grow</h3>
                      <p className="text-sm text-[var(--muted)] mt-0.5">
                        Business Growth powered by Security Data – turn SOC &amp; SIEM signals into growth levers for your customers.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[var(--muted)]">Security-to-Growth Score:</span>
                        <Badge variant="accent">{growAiScore(GROW_DEMO_BASELINE).score}/100</Badge>
                      </div>
                    </div>
                  </div>
                  <HapticButton
                    label="Open Mahoney Grow"
                    onClick={() => window.location.assign('/mahoney-grow')}
                    variant="surface"
                    className="shrink-0"
                  />
                </div>
              </Card>
            </motion.div>

            {/* Enhanced Quick Audit Block */}
            <QuickAuditBlock />

            {/* Service Cockpit */}
            <ServiceCockpitCard onOpen={() => setOpenCockpit(true)} />
          </>
        ) : (
          <>
            {/* Partner overview */}
            <Card className="p-4">
              <h2 className="text-base font-semibold text-[var(--text)] mb-1">Partner overview</h2>
              <p className="text-xs text-[var(--muted)] mb-4">
                Portfolio view: security posture, revenue, and risk across all managed customers.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--surface-2)]">
                  <div className="text-[var(--muted)]">Customers</div>
                  <div className="text-lg font-semibold text-[var(--text)]">{partnerSummary.totalCustomers}</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-2)]">
                  <div className="text-[var(--muted)]">Total MRR</div>
                  <div className="text-lg font-semibold text-[var(--text)]">${(partnerSummary.totalMRR / 1000).toFixed(0)}k</div>
                  {partnerSummary.mrrGrowthPct !== 0 && (
                    <span className={`text-[10px] ${partnerSummary.mrrGrowthPct >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {partnerSummary.mrrGrowthPct >= 0 ? '+' : ''}{partnerSummary.mrrGrowthPct}% MoM
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-2)]">
                  <div className="text-[var(--muted)]">Avg Grow</div>
                  <div className="text-lg font-semibold text-[var(--text)]">{partnerSummary.avgGrowScore}/100</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-2)]">
                  <div className="text-[var(--muted)]">Open alerts</div>
                  <div className="text-lg font-semibold text-[var(--text)]">{partnerSummary.totalOpenAlerts}</div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-2)]">
                  <div className="text-[var(--muted)]">At-risk</div>
                  <div className={`text-lg font-semibold ${partnerSummary.atRiskCount > 0 ? 'text-[var(--warning)]' : 'text-[var(--text)]'}`}>
                    {partnerSummary.atRiskCount}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface-2)]">
                  <div className="text-[var(--muted)]">Renewals (30d)</div>
                  <div className="text-lg font-semibold text-[var(--text)]">{partnerSummary.renewalsThisMonth}</div>
                </div>
              </div>
            </Card>

            {/* Partner pricing & margin (mobile) */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Partner pricing & margin</h3>
              <p className="text-[11px] text-[var(--muted)] mb-3">
                Your Marketplace terms. Single-tenant prices come from your catalog; you keep the margins below.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted)]">App</div>
                  <div className="text-xs font-semibold text-[var(--success)]">{PARTNER_PRICING.appDiscountPct}% off</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted)]">Per customer</div>
                  <div className="text-xs font-semibold text-[var(--success)]">{PARTNER_PRICING.partnerSharePerCustomerPct}% to you</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted)]">Sell your MSP</div>
                  <div className="text-xs font-semibold text-[var(--text)]">You keep 80%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                  <div className="text-[10px] text-[var(--muted)]">MDU</div>
                  <div className="text-xs font-semibold text-[var(--success)]">+{formatCurrency(PARTNER_PRICING.mduMarginPerUnitUSD)}/unit</div>
                </div>
              </div>
            </Card>

            {/* MRR trend (compact) */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">MRR trend (last 6 months)</h3>
              </div>
              {(() => {
                const maxMrr = Math.max(...partnerMRRTrendMonths.map((x) => x.mrr))
                const minMrr = Math.min(...partnerMRRTrendMonths.map((x) => x.mrr))
                const range = maxMrr - minMrr || 1
                const pad = 10
                const w = 400
                const chartH = 56
                const points = partnerMRRTrendMonths.map((m, i) => {
                  const x = pad + (i / Math.max(1, partnerMRRTrendMonths.length - 1)) * (w - 2 * pad)
                  const y = chartH - pad - ((m.mrr - minMrr) / range) * (chartH - 2 * pad)
                  return { x, y, month: m.month, mrr: m.mrr }
                })
                const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ')
                return (
                  <div className="w-full" onMouseLeave={() => setMrrChartHovered(null)}>
                    <div className="w-full" style={{ height: 56 }}>
                      <svg width="100%" height={56} viewBox={`0 0 ${w} ${chartH}`} className="overflow-visible" preserveAspectRatio="xMidYMid meet">
                        <polyline fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={linePoints} />
                        {points.map((p, i) => (
                          <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="3.5"
                            fill="var(--primary)"
                            stroke="var(--bg)"
                            strokeWidth="1.5"
                            className="cursor-pointer"
                            onMouseEnter={() => setMrrChartHovered(i)}
                            onMouseLeave={() => setMrrChartHovered(null)}
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="flex justify-between mt-0.5 px-0.5">
                      {partnerMRRTrendMonths.map((m) => (
                        <span key={m.month} className="text-[9px] text-[var(--muted)]">{m.month}</span>
                      ))}
                    </div>
                    {mrrChartHovered !== null && (
                      <div className="mt-1.5 py-1 px-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs">
                        <span className="font-medium text-[var(--text)]">{partnerMRRTrendMonths[mrrChartHovered].month}</span>
                        {' · '}
                        <span className="text-[var(--primary)] font-semibold">
                          ${partnerMRRTrendMonths[mrrChartHovered].mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                        {' MRR'}
                      </div>
                    )}
                    <p className="text-[10px] text-[var(--muted)] mt-2">
                      Portfolio MRR ${partnerSummary.totalMRR.toLocaleString('en-US', { maximumFractionDigits: 0 })} (+{partnerSummary.mrrGrowthPct}% vs last month)
                    </p>
                  </div>
                )
              })()}
            </Card>

            {/* Alerts & risk */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-[var(--warning)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Alerts & risk</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Total open alerts</span>
                  <span className="font-medium text-[var(--text)]">{partnerSummary.totalOpenAlerts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted)]">Avg MTTR</span>
                  <span className="font-medium text-[var(--text)]">{partnerSummary.avgMttr}h</span>
                </div>
                {partnerSummary.atRiskCount > 0 && (
                  <div className="flex justify-between text-sm p-2 rounded-lg bg-[var(--warning)]/10">
                    <span className="text-[var(--text)]">Customers at risk (churn ≥4%)</span>
                    <span className="font-semibold text-[var(--warning)]">{partnerSummary.atRiskCount}</span>
                  </div>
                )}
                {partnerSummary.renewalsThisMonth > 0 && (
                  <div className="flex justify-between text-sm p-2 rounded-lg bg-[var(--primary)]/10">
                    <span className="text-[var(--text)]">Renewals in 30 days</span>
                    <span className="font-semibold text-[var(--primary)]">{partnerSummary.renewalsThisMonth}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* App-driven upsell (mobile) */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendIcon className="w-4 h-4 text-[var(--success)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">App-driven upsell</h3>
              </div>
              <p className="text-[11px] text-[var(--muted)] mb-3">
                Revenue from app recommendations, in-app prompts, and Grow insights.
              </p>
              <div className="p-2.5 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20 mb-3">
                <div className="text-[10px] text-[var(--muted)]">MRR from app-driven upsell</div>
                <div className="text-lg font-semibold text-[var(--success)]">${partnerUpsellSummary.totalMrrFromUpsell.toLocaleString('en-US')}/mo</div>
                <div className="text-[10px] text-[var(--muted)]">{partnerUpsellSummary.count} deals</div>
              </div>
              <div className="space-y-1.5">
                {partnerAppUpsells.map((u) => (
                  <div key={u.id} className="flex justify-between items-start py-2 px-2.5 rounded-lg bg-[var(--surface-2)] text-[11px]">
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--text)] truncate">{u.customerName}</div>
                      <div className="text-[10px] text-[var(--muted)]">{u.product} · {u.sourceLabel}</div>
                    </div>
                    <span className="font-semibold text-[var(--success)] shrink-0 ml-2">+${u.mrrAddedUSD.toLocaleString()}/mo</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Automation & efficiency (mobile) */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-[var(--primary)]" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Automation & efficiency</h3>
              </div>
              <p className="text-[11px] text-[var(--muted)] mb-3">
                RMM, MSP scripts, dashboards – time and cost saved.
              </p>
              <div className="p-2.5 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-3">
                <div className="text-[10px] text-[var(--muted)]">Portfolio savings</div>
                <div className="text-lg font-semibold text-[var(--primary)]">{partnerAutomationSummary.timeSavedHoursPerMonth}h/mo saved</div>
                <div className="text-[10px] text-[var(--muted)]">~${partnerAutomationSummary.costSavedUsdPerMonth.toLocaleString('en-US')}/mo</div>
              </div>
              <div className="space-y-2">
                {partnerAutomationImpacts.map((a) => (
                  <div key={a.id} className="py-2 px-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary" className="text-[9px]">{a.typeLabel}</Badge>
                      <span className="text-[10px] font-medium text-[var(--success)]">{a.timeSavedHoursPerMonth}h · ${a.costSavedUsdPerMonth}/mo</span>
                    </div>
                    <div className="font-medium text-[var(--text)] text-[11px] mt-1">{a.title}</div>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5">{a.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Partner customer list */}
            <Card className="p-4">
              <h3 className="text-base font-semibold text-[var(--text)] mb-3">
                Customers – security, growth & commercial
              </h3>
              <div className="space-y-2">
                {partnerCustomers.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      h.impact('light')
                      setSelectedPartnerCustomer(c)
                    }}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--primary)]/40 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-[var(--text)] truncate">{c.name}</span>
                          <Badge variant="secondary" className="text-[10px]">{c.segment}</Badge>
                          {c.churnRiskPct >= 4 && (
                            <Badge variant="destructive" className="text-[10px]">Risk</Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] mt-0.5">
                          MRR ${c.monthlyRecurringRevenueUSD.toLocaleString('en-US')} · Grow {c.growScore}/100 · Alerts {c.activeAlerts} · MTTR {c.mttrHours.toFixed(1)}h
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-[var(--muted)] shrink-0">
                        <div>Churn {c.churnRiskPct.toFixed(1)}%</div>
                        <div>{c.renewalInDays != null ? `Renewal in ${c.renewalInDays}d` : '—'}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-[var(--muted)]">
                Tap a customer to open their tenant context (Grow, alerts, billing).
              </p>
            </Card>
          </>
        )}

        {/* Upselling Recommendations */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text)]">Security Enhancements</h3>
            <HapticButton
              label="View All"
              onClick={() => window.location.href = '/upselling'}
              variant="surface"
              className="text-xs"
            />
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--primary-600)]/10 border border-[var(--primary)]/20 rounded-[16px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-[var(--primary)]/20 rounded-[6px] flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-[var(--primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text)]">Virtual CISO</span>
                <Badge variant="destructive" className="text-xs">-15%</Badge>
              </div>
              <p className="text-xs text-[var(--muted)] mb-2">
                Strategic security leadership for your organization
              </p>
              <HapticButton
                label="Learn More"
                onClick={() => window.location.href = '/upselling'}
                variant="surface"
                className="text-xs"
              />
            </div>
            
            <div className="p-3 bg-gradient-to-r from-[var(--warning)]/10 to-[var(--warning)]/10 border border-[var(--warning)]/20 rounded-[16px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-[var(--warning)]/20 rounded-[6px] flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-[var(--warning)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text)]">Compliance Package</span>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
              <p className="text-xs text-[var(--muted)] mb-2">
                Stay ahead of regulatory changes
              </p>
              <HapticButton
                label="Learn More"
                onClick={() => window.location.href = '/upselling'}
                variant="surface"
                className="text-xs"
              />
            </div>

            <div className="p-3 bg-gradient-to-r from-[var(--success)]/10 to-[var(--success)]/10 border border-[var(--success)]/20 rounded-[16px]">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-[var(--success)]/20 rounded-[6px] flex items-center justify-center">
                  <LineChart className="w-3 h-3 text-[var(--success)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text)]">Mahoney Grow</span>
                <Badge variant="accent" className="text-xs">Growth</Badge>
              </div>
              <p className="text-xs text-[var(--muted)] mb-2">
                Business Growth from Security & SIEM data
              </p>
              <HapticButton
                label="Open Grow"
                onClick={() => window.location.href = '/mahoney-grow'}
                variant="surface"
                className="text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Proactive Recommendations */}
        <Recommendation />

        {/* Recent Alerts */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Recent Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onClick={() => handleAlertClick(alert)}
              />
            ))}
          </div>
        </Card>

        {/* Office 365 / Exchange */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Microsoft 365 Mailboxes</h3>
            <div className="space-y-3">
              {mail.o365.map((mailbox) => (
                <div key={mailbox.user} className="flex items-center justify-between p-3 bg-[var(--surface)]/50 rounded-[16px]">
                  <div>
                    <p className="font-medium text-[var(--text)]">{mailbox.user}</p>
                    <p className="text-sm text-[var(--muted)]">{mailbox.sizeGB}GB / {mailbox.quotaGB}GB</p>
                  </div>
                  <Badge variant={mailbox.status === 'Healthy' ? 'accent' : 'secondary'}>
                    {mailbox.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4 text-[var(--text)]">Exchange On-Prem</h3>
            <div className="space-y-3">
              {mail.exchangeOnPrem.dbs.map((db) => (
                <div key={db.name} className="p-3 bg-[var(--surface)]/50 rounded-[16px]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-[var(--text)]">{db.name}</p>
                    <Badge variant={db.status === 'Healthy' ? 'accent' : 'secondary'}>
                      {db.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-[var(--muted)]">
                      <span>{db.usedGB}GB / {db.capacityGB}GB</span>
                      <span>{Math.round((db.usedGB / db.capacityGB) * 100)}%</span>
                    </div>
                    <div className="w-full bg-[var(--surface)] rounded-full h-2">
                      <div 
                        className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(db.usedGB / db.capacityGB) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.div>
      )}

      {/* Alert Details Sheet */}
      <Sheet
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title="Alert Details"
      >
        {selectedAlert && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">{selectedAlert.title}</h3>
              <div className="space-y-2 text-sm text-[var(--muted)]">
                <p><strong>Source:</strong> {selectedAlert.source}</p>
                <p><strong>Time:</strong> {new Date(selectedAlert.time).toLocaleString()}</p>
                <p><strong>Severity:</strong> {selectedAlert.severity}</p>
                <p><strong>Device:</strong> {selectedAlert.device}</p>
                <p><strong>OS:</strong> {selectedAlert.os}</p>
                <p><strong>IP:</strong> {selectedAlert.ip}</p>
                <p><strong>Last Login:</strong> {new Date(selectedAlert.lastLogin).toLocaleString()}</p>
                <p><strong>User:</strong> {selectedAlert.user}</p>
              </div>
            </div>
            
            {/* Mini Map */}
            <div>
              <h4 className="font-medium text-[var(--text)] mb-3">Location</h4>
              <MiniMap 
                lat={selectedAlert.location.lat} 
                lng={selectedAlert.location.lng} 
                name={selectedAlert.location.name}
              />
            </div>
            
            {selectedAlert.notes && (
              <div>
                <h4 className="font-medium text-[var(--text)] mb-3">Notes</h4>
                <div className="space-y-2">
                  {selectedAlert.notes.map((note: string, index: number) => (
                    <p key={index} className="text-sm text-[var(--muted)]">• {note}</p>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="font-medium text-[var(--text)] mb-3">Quick Actions</h4>
              <div className="space-y-3">
                <HapticButton
                  label="Send me more details"
                  variant="surface"
                  onClick={() => handleSendMessage('Please send me more details about this alert.')}
                />
                <HapticButton
                  label="Please contact me"
                  variant="surface"
                  onClick={() => handleSendMessage('Please contact me regarding this alert.')}
                />
                <HapticButton
                  label="Custom message..."
                  variant="surface"
                  onClick={() => handleSendMessage('Custom message regarding this alert.')}
                />
              </div>
            </div>
          </div>
        )}
      </Sheet>

      {/* Partner customer detail sheet (demo) */}
      <Sheet
        isOpen={!!selectedPartnerCustomer}
        onClose={() => setSelectedPartnerCustomer(null)}
        title={selectedPartnerCustomer ? selectedPartnerCustomer.name : 'Customer'}
      >
        {selectedPartnerCustomer && (
          <div className="space-y-5">
            <div>
              <div className="text-sm text-[var(--muted)] mb-1">
                Segment &amp; commercial summary
              </div>
              <div className="text-sm text-[var(--text)]">
                {selectedPartnerCustomer.segment} • {selectedPartnerCustomer.country}
              </div>
              <div className="mt-1 text-sm text-[var(--muted)]">
                Monthly recurring revenue:{' '}
                <span className="font-medium text-[var(--text)]">
                  ${selectedPartnerCustomer.monthlyRecurringRevenueUSD.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <Card className="p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-[11px] text-[var(--muted)]">Grow score</div>
                  <div className="text-lg font-semibold text-[var(--text)]">
                    {selectedPartnerCustomer.growScore}/100
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted)]">Churn risk</div>
                  <div className="text-lg font-semibold text-[var(--text)]">
                    {selectedPartnerCustomer.churnRiskPct.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted)]">Automation score</div>
                  <div className="text-lg font-semibold text-[var(--text)]">
                    {selectedPartnerCustomer.automationScorePct}%
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[var(--muted)]">MTTR</div>
                  <div className="text-lg font-semibold text-[var(--text)]">
                    {selectedPartnerCustomer.mttrHours.toFixed(1)}h
                  </div>
                </div>
              </div>
            </Card>

            <p className="text-xs text-[var(--muted)]">
              This is a demo aggregation. In a real tenant you could jump from here
              directly into the customer&apos;s Mahoney Grow workspace, trigger actions with
              your SOC and track the business impact over time.
            </p>

            <HapticButton
              label="Open Mahoney Grow (demo context)"
              onClick={() => {
                h.impact('medium')
                window.location.assign('/mahoney-grow')
              }}
            />
          </div>
        )}
      </Sheet>

      {/* Upgrade Details Sheet */}
      <Sheet
        isOpen={isUpgradeSheetOpen}
        onClose={() => setIsUpgradeSheetOpen(false)}
        title={`Upgrade to ${demoTenant.upgradeOffer.target.tier}`}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">
              {demoTenant.upgradeOffer.target.name}
            </h3>
            <div className="space-y-3">
              {demoTenant.upgradeOffer.reasons.map((reason, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[var(--primary)] rounded-full mt-2 flex-shrink-0" />
                  <p className="text-[var(--muted)]">{reason}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
            <p className="text-sm text-[var(--muted)] mb-2">Additional monthly cost:</p>
            <p className="text-2xl font-bold text-[var(--text)]">+${demoTenant.upgradeOffer.deltaMonthly}/month</p>
          </div>
          
          <HapticButton
            label="Upgrade Preview"
            onClick={handleUpgradePreview}
          />
        </div>
      </Sheet>

      {/* Service Cockpit Sheet */}
      {openCockpit && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-[520px] mx-auto rounded-t-3xl bg-[var(--bg)] border-t border-[var(--border)]">
            <ServiceCockpitSheet />
          </div>
        </div>
      )}

      {/* Toast Manager */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
