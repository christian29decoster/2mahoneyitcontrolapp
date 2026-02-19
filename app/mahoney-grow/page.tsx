 'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { Badge } from '@/components/Badge'
import { HapticButton } from '@/components/HapticButton'
import { stagger } from '@/lib/ui/motion'

type GrowInputs = {
  annualRevenue: number
  itSpend: number
  employees: number
  managedDevices: number
  churnRate: number
  growthTarget: number
}

const DEMO_INPUTS: GrowInputs = {
  annualRevenue: 3200000,
  itSpend: 210000,
  employees: 85,
  managedDevices: 140,
  churnRate: 3.2,
  growthTarget: 18,
}

function calculateEfficiency(inputs: GrowInputs) {
  const itRatio = inputs.itSpend / inputs.annualRevenue
  const revenuePerEmployee = inputs.annualRevenue / inputs.employees
  const devicesPerEmployee = inputs.managedDevices / inputs.employees

  // 0–100 Score (rein demohaft, keine echte Finanzberatung)
  let score = 100

  // IT-Kostenanteil – ideal im Bereich 5–9 %
  if (itRatio < 0.04) score -= 10
  else if (itRatio > 0.11) score -= 15

  // Churn & Wachstumsziel
  if (inputs.churnRate > 5) score -= 15
  if (inputs.growthTarget > 20) score -= 10

  // Skalierung der Organisation
  if (revenuePerEmployee < 70000) score -= 10
  if (devicesPerEmployee < 1.2) score -= 5

  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    itRatio: itRatio * 100,
    revenuePerEmployee,
    devicesPerEmployee,
  }
}

export default function MahoneyGrowPage() {
  const [inputs, setInputs] = useState<GrowInputs>(DEMO_INPUTS)
  const metrics = calculateEfficiency(inputs)

  const handleChange = (field: keyof GrowInputs, value: string) => {
    const num = Number(value.replace(',', '.'))
    if (Number.isNaN(num)) return
    setInputs(prev => ({ ...prev, [field]: num }))
  }

  const handleResetDemo = () => {
    setInputs(DEMO_INPUTS)
  }

  const efficiencyLevel =
    metrics.score >= 80 ? 'High' : metrics.score >= 55 ? 'Balanced' : 'Improvement'

  return (
    <motion.div
      className="space-y-6"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <motion.div variants={stagger} className="space-y-2">
        <Badge variant="accent" className="mb-1">
          Mahoney Grow
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
          Wachstums- & Effizienz-Cockpit
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Erfassen Sie betriebswirtschaftliche Kennzahlen und simulieren Sie, wie sich
          Wachstum und IT-Investitionen auf Ihre Effizienz auswirken. Die Werte sind
          Demo-Daten und können jederzeit überschrieben werden.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
              Efficiency Score
            </span>
            <Badge
              variant={
                efficiencyLevel === 'High'
                  ? 'accent'
                  : efficiencyLevel === 'Balanced'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {efficiencyLevel}
            </Badge>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-[var(--text)]">
              {metrics.score}
            </span>
            <span className="text-sm text-[var(--muted)]">/ 100 Punkten</span>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Kombinierter Score aus IT-Kostenanteil, Mitarbeiter-Produktivität,
            Geräteabdeckung, Churn und Wachstumszielen.
          </p>
        </Card>

        <Card>
          <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-2">
            IT-Kostenanteil
          </div>
          <div className="text-2xl font-semibold text-[var(--text)]">
            {metrics.itRatio.toFixed(1)}%
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Verhältnis aus jährlichem IT-Budget zu Umsatz. Viele wachsende
            Organisationen liegen zwischen 5–9&nbsp;%.
          </p>
        </Card>

        <Card>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                Umsatz / FTE
              </div>
              <div className="text-lg font-semibold text-[var(--text)]">
                {metrics.revenuePerEmployee.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-[var(--muted)] mb-1">
                Geräte / FTE
              </div>
              <div className="text-lg font-semibold text-[var(--text)]">
                {metrics.devicesPerEmployee.toFixed(1)}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Zeigt, wie gut Ihre Organisation skaliert und wie eng IT-Assets mit
            Mitarbeitenden verknüpft sind.
          </p>
        </Card>
      </motion.div>

      <motion.div
        variants={stagger}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[var(--text)]">
                Betriebswirtschaftliche Eingaben
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Diese Daten werden nur für die Simulation im Demo-Tenant genutzt.
              </p>
            </div>
            <HapticButton
              label="Demo-Werte laden"
              variant="surface"
              onClick={handleResetDemo}
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                Jahresumsatz (EUR)
              </label>
              <input
                type="number"
                value={inputs.annualRevenue}
                onChange={e => handleChange('annualRevenue', e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                  Jährliche IT-Ausgaben (EUR)
                </label>
                <input
                  type="number"
                  value={inputs.itSpend}
                  onChange={e => handleChange('itSpend', e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                  Mitarbeitende (FTE)
                </label>
                <input
                  type="number"
                  value={inputs.employees}
                  onChange={e => handleChange('employees', e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                  Verwaltete Geräte (inkl. Mobile)
                </label>
                <input
                  type="number"
                  value={inputs.managedDevices}
                  onChange={e => handleChange('managedDevices', e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                  Kunden-Churn p.a. (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.churnRate}
                  onChange={e => handleChange('churnRate', e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                Wachstumsziel (Umsatz) in den nächsten 12&nbsp;Monaten (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={inputs.growthTarget}
                onChange={e => handleChange('growthTarget', e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text)]"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-[var(--text)] mb-3">
            Ableitung für Mahoney Services
          </h2>
          <p className="text-xs text-[var(--muted)] mb-4">
            Auf Basis Ihrer Eingaben können Mahoney-Partner konkrete Servicepakete
            ableiten – z.&nbsp;B. mehr Automatisierung, Cloud-Migration oder
            Optimierung der Gerätemischung.
          </p>

          <ul className="space-y-3 text-sm text-[var(--text)]">
            <li className="flex gap-2">
              <span className="mt-[6px] h-2 w-2 rounded-full bg-[var(--primary)]" />
              <div>
                <div className="font-medium">IT-Kosten und Wachstum balancieren</div>
                <p className="text-xs text-[var(--muted)]">
                  Bei einem IT-Anteil von ca. {metrics.itRatio.toFixed(1)}&nbsp;% kann
                  zusätzlicher Spielraum für Wachstumsprojekte entstehen – solange
                  Security- und Betriebsrisiken abgedeckt sind.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-2 w-2 rounded-full bg-[var(--primary)]" />
              <div>
                <div className="font-medium">Fokus auf produktive Mitarbeitende</div>
                <p className="text-xs text-[var(--muted)]">
                  Ein Umsatz je FTE von{' '}
                  {metrics.revenuePerEmployee.toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  })}{' '}
                  zeigt, wie stark Ihre Organisation bereits skaliert – Mahoney Grow
                  kann helfen, Engpässe in IT-gestützten Prozessen zu identifizieren.
                </p>
              </div>
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-2 w-2 rounded-full bg-[var(--primary)]" />
              <div>
                <div className="font-medium">Geräteabdeckung und Security-Services</div>
                <p className="text-xs text-[var(--muted)]">
                  Mit durchschnittlich {metrics.devicesPerEmployee.toFixed(1)}{' '}
                  Geräten pro Mitarbeitenden lassen sich Managed-Services-Pakete
                  (z.&nbsp;B. SOC, EDR, Patch-Management) klar bepreisen und als
                  Wachstumshebel darstellen.
                </p>
              </div>
            </li>
          </ul>

          <p className="mt-4 text-[10px] text-[var(--muted)]">
            Hinweis: Alle Berechnungen dienen ausschließlich der Illustration im
            Demo-Tenant und ersetzen keine Finanz- oder Rechtsberatung.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  )

