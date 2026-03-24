'use client'

import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import Card from '@/components/ui/Card'
import {
  monthlyTrendHistory12M,
  buildAutomationWaterfall,
  type MonthlyTrendPoint,
} from '@/data/financials-mock'
import { useFormatCurrency } from '@/hooks/useFormatCurrency'
import { useLocaleStore } from '@/lib/locale.store'
import { financialsExtended } from '@/lib/financials-i18n'

type Range = '3m' | '6m' | '12m'

function sliceRange(data: MonthlyTrendPoint[], range: Range) {
  const n = range === '3m' ? 3 : range === '6m' ? 6 : 12
  return data.slice(-n)
}

export function TrendChartsSection() {
  const formatCurrency = useFormatCurrency()
  const locale = useLocaleStore((s) => s.locale)
  const t = financialsExtended(locale)
  const [range, setRange] = useState<Range>('12m')

  const data = useMemo(() => sliceRange(monthlyTrendHistory12M, range), [range])
  const waterfall = useMemo(() => buildAutomationWaterfall(data), [data])

  const chartData = useMemo(() => {
    return data.map((d, i, arr) => {
      const prev = i > 0 ? arr[i - 1] : d
      return {
        ...d,
        deltaSpend: d.securitySpendUsd - prev.securitySpendUsd,
        deltaCpi: d.costPerIncidentUsd - prev.costPerIncidentUsd,
        deltaMttr: d.mttrHours - prev.mttrHours,
      }
    })
  }, [data])

  const tip = (d: (typeof chartData)[0]) => (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs shadow-lg max-w-xs">
      <p className="font-medium text-[var(--text)] mb-1">{d.label}</p>
      <p className="text-[var(--text)]">
        Spend: {formatCurrency(d.securitySpendUsd)} (Δ {d.deltaSpend >= 0 ? '+' : ''}
        {formatCurrency(d.deltaSpend)} vs prior)
      </p>
      <p className="text-[var(--text)]">
        Cost/incident: {formatCurrency(d.costPerIncidentUsd)} (Δ {d.deltaCpi >= 0 ? '+' : ''}
        {formatCurrency(d.deltaCpi)})
      </p>
      <p className="text-[var(--text)]">
        MTTR: {d.mttrHours.toFixed(2)} h (Δ {d.deltaMttr >= 0 ? '+' : ''}
        {d.deltaMttr.toFixed(2)} h)
      </p>
    </div>
  )

  return (
    <Card id="trends" className="p-6 scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-[var(--text)]">{t.trendsTitle}</h2>
        <div className="flex rounded-lg border border-[var(--border)] p-0.5 bg-[var(--surface-2)]">
          {(['3m', '6m', '12m'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                range === r ? 'bg-[var(--primary)] text-white' : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {r === '3m' ? '3M' : r === '6m' ? '6M' : '12M'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] mb-4">
        {locale === 'de'
          ? 'Monatliche Sicherheitsausgaben, Kosten pro Vorfall und MTTR. Tooltip: Werte und Delta zum Vormonat.'
          : 'Monthly security spend, cost per incident, and MTTR (hours). Tooltip: value and delta vs. prior month.'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64">
          <p className="text-xs font-medium text-[var(--muted)] mb-2">Security spend</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={({ active, payload }) => active && payload?.[0] && tip(payload[0].payload as (typeof chartData)[0])} />
              <Line type="monotone" dataKey="securitySpendUsd" name="Spend" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-64">
          <p className="text-xs font-medium text-[var(--muted)] mb-2">Cost / incident & MTTR</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip content={({ active, payload }) => active && payload?.[0] && tip(payload[0].payload as (typeof chartData)[0])} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="costPerIncidentUsd" name="Cost/incident" stroke="#a855f7" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="mttrHours" name="MTTR (h)" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-[var(--text)] mt-8 mb-2">
        {locale === 'de' ? 'Wasserfall: Kumulierte Einsparung (Automatisierung)' : 'Waterfall: cumulative automation cost reduction'}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {waterfall.map((step, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <p className="text-[10px] text-[var(--muted)] uppercase tracking-wide line-clamp-2">{step.label}</p>
            <p className={`text-sm font-semibold mt-1 ${step.valueUsd < 0 ? 'text-emerald-400' : 'text-[var(--text)]'}`}>
              {formatCurrency(step.valueUsd)}
            </p>
            <p className="text-xs text-[var(--muted)] mt-1">
              {locale === 'de' ? 'Kumulativ' : 'Cum.'}: {formatCurrency(step.cumulativeUsd)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
