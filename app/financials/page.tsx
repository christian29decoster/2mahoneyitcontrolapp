'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import { HapticButton } from '@/components/HapticButton'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'
import { formatCurrency } from '@/lib/pricing'
import {
  financialKpis,
  incidentCostHistory,
  getTopExpensiveIncidents,
  defaultSimpleROIInputs,
  deriveROIInputs,
  computeROIOutputs,
  type SimpleROIInputs,
  type ROISimulatorOutputs,
} from '@/lib/financials'
import { DollarSign, TrendingUp, TrendingDown, HelpCircle, Info } from 'lucide-react'

function KpiCard({
  label,
  value,
  trend,
  tooltip,
}: {
  label: string
  value: string
  trend?: number
  tooltip?: string
}) {
  const [showTip, setShowTip] = useState(false)
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-[var(--muted)] flex items-center gap-1">
            {label}
            {tooltip && (
              <button
                type="button"
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                className="text-[var(--muted)]"
                aria-label="Explain"
              >
                <HelpCircle size={12} />
              </button>
            )}
          </p>
          <p className="text-xl font-semibold text-[var(--text)] mt-1">{value}</p>
          {trend != null && (
            <span className={`text-[10px] flex items-center gap-0.5 mt-1 ${trend >= 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
              {trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {trend >= 0 ? '+' : ''}{trend}% 30d
            </span>
          )}
        </div>
      </div>
      {tooltip && showTip && (
        <p className="text-[10px] text-[var(--muted)] mt-2 border-t border-[var(--border)] pt-2">{tooltip}</p>
      )}
    </Card>
  )
}

export default function FinancialsPage() {
  const [simpleInputs, setSimpleInputs] = useState<SimpleROIInputs>(defaultSimpleROIInputs)
  const derivedInputs = useMemo(() => deriveROIInputs(simpleInputs), [simpleInputs])
  const roiOutputs = useMemo(() => computeROIOutputs(derivedInputs), [derivedInputs])
  const topIncidents = useMemo(() => getTopExpensiveIncidents(5), [])
  const h = useHaptics()

  return (
    <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">Security Financials</h1>
        <p className="text-sm text-[var(--muted)]">Security spend, cost per incident, ROI and risk exposure</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          label="Security Spend per User"
          value={formatCurrency(financialKpis.securitySpendPerUserUsd)}
          trend={financialKpis.trend30d.spendPerUser}
          tooltip="Monthly security-related cost per user (licenses, tools, labor share)."
        />
        <KpiCard
          label="Cost per Protected Device"
          value={formatCurrency(financialKpis.costPerProtectedDeviceUsd)}
          trend={financialKpis.trend30d.costPerDevice}
          tooltip="Total security spend divided by number of protected endpoints."
        />
        <KpiCard
          label="Cost per Incident"
          value={formatCurrency(financialKpis.costPerIncidentUsd)}
          trend={financialKpis.trend30d.costPerIncident}
          tooltip="Average cost (downtime + labor) per resolved incident."
        />
        <KpiCard
          label="MTTR vs Financial Impact"
          value={`${financialKpis.mttrHours}h × ${formatCurrency(financialKpis.financialImpactPerMttrHourUsd)}/h`}
          tooltip="Mean time to resolve × estimated cost per hour of downtime."
        />
        <KpiCard
          label="Automation Savings Estimate"
          value={formatCurrency(financialKpis.automationSavingsEstimateUsd)}
          tooltip="Estimated monthly savings from current automation (e.g. playbooks, EDR)."
        />
        <KpiCard
          label="Risk Exposure Value"
          value={formatCurrency(financialKpis.riskExposureValueUsd)}
          tooltip="Estimated value at risk from open gaps and unresolved findings."
        />
      </div>

      {/* ROI Simulator – potential, downtime, risks, ROI (all English) */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-1">Security ROI Simulator</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Two inputs – we derive manual workload, downtime exposure, and risk drivers. With Mahoney Grow we collect these metrics for you.
        </p>
        <div className="rounded-xl bg-[var(--surface-2)]/50 border border-[var(--border)] p-3 mb-4 flex gap-2">
          <Info size={18} className="shrink-0 text-[var(--primary)] mt-0.5" />
          <p className="text-xs text-[var(--muted)]">
            <strong className="text-[var(--text)]">Note:</strong> If you have Mahoney Grow, we capture these figures for you; this form is for a quick estimate or comparison.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                Number of employees / users
              </label>
              <input
                type="number"
                min={1}
                value={simpleInputs.employeeCount}
                onChange={(e) => setSimpleInputs((s) => ({ ...s, employeeCount: Math.max(1, +e.target.value || 0) }))}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                Average personnel cost per head per month (USD)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={simpleInputs.avgMonthlyCostPerHeadUsd}
                onChange={(e) => setSimpleInputs((s) => ({ ...s, avgMonthlyCostPerHeadUsd: Math.max(0, +e.target.value || 0) }))}
                className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text)]"
              />
              <p className="text-[10px] text-[var(--muted)] mt-1">
                e.g. salary + overhead, rough estimate
              </p>
            </div>
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Derived by system</p>
              <ul className="text-xs text-[var(--muted)] space-y-1">
                <li>Hourly personnel cost: {formatCurrency(derivedInputs.avgHourlyEmployeeCostUsd)}/h</li>
                <li>Downtime cost (typical factor): {formatCurrency(derivedInputs.avgDowntimeCostPerHourUsd)}/h</li>
                <li>Incidents/year (guideline): {derivedInputs.incidentFrequencyPerYear}</li>
                <li>Manual hours/month (guideline): {derivedInputs.manualWorkflowHoursPerMonth} h</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-[var(--muted)] mb-2">Potential & risk breakdown</p>
              <ul className="space-y-3 text-sm">
                <li className="border-b border-[var(--border)] pb-2">
                  <p className="text-[var(--muted)] font-medium">Manual workflow (per employee)</p>
                  <p className="text-[var(--text)] mt-0.5">{roiOutputs.manualWorkflowHoursPerMonth} h/month total · {(roiOutputs.manualWorkflowHoursPerMonth / Math.max(1, simpleInputs.employeeCount)).toFixed(1)} h/employee → {formatCurrency(roiOutputs.manualLaborCostUsd)}/yr at risk</p>
                </li>
                <li className="border-b border-[var(--border)] pb-2">
                  <p className="text-[var(--muted)] font-medium">Potential downtime</p>
                  <p className="text-[var(--text)] mt-0.5">{roiOutputs.downtimeHoursPerYear} h/yr ({roiOutputs.incidentFrequencyPerYear} incidents × ~6 h) → {formatCurrency(roiOutputs.downtimeCostUsd)}/yr</p>
                </li>
                <li className="border-b border-[var(--border)] pb-2">
                  <p className="text-[var(--muted)] font-medium">Risk drivers</p>
                  <p className="text-[var(--text)] mt-0.5">Incident-related downtime · manual steps · labor cost</p>
                </li>
              </ul>
            </div>
            <div className="pt-2 border-t border-[var(--border)]">
              <p className="text-xs font-medium text-[var(--muted)] mb-2">ROI summary</p>
              <p className="text-sm text-[var(--text)]">
                <strong>Estimated annual risk cost:</strong> {formatCurrency(roiOutputs.estimatedAnnualRiskCostUsd)}
              </p>
              <p className="text-sm text-[var(--text)]">
                <strong>Cost reduction via automation:</strong> {formatCurrency(roiOutputs.estimatedCostReductionViaAutomationUsd)}
              </p>
              <p className="text-sm text-[var(--text)]">
                <strong>Savings from AI recommendations:</strong> {formatCurrency(roiOutputs.estimatedSavingsFromAIRecommendationsUsd)}
              </p>
              <HapticButton
                label="Apply optimization plan"
                onClick={() => h.impact('medium')}
                className="mt-4"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Incident Cost Mapping */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Incident Cost Mapping</h2>
        <p className="text-xs text-[var(--muted)] mb-4">
          For each closed incident: duration, affected assets, estimated downtime cost, labor cost.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                <th className="pb-2 pr-4 font-medium">Incident</th>
                <th className="pb-2 pr-4 font-medium">Closed</th>
                <th className="pb-2 pr-4 font-medium">Duration</th>
                <th className="pb-2 pr-4 font-medium">Assets</th>
                <th className="pb-2 pr-4 font-medium">Downtime cost</th>
                <th className="pb-2 pr-4 font-medium">Labor cost</th>
                <th className="pb-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {incidentCostHistory.map((inc) => (
                <tr key={inc.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 pr-4 font-medium text-[var(--text)]">{inc.title}</td>
                  <td className="py-3 pr-4 text-[var(--muted)]">
                    {new Date(inc.closedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 text-[var(--muted)]">{inc.durationHours}h</td>
                  <td className="py-3 pr-4 text-[var(--muted)]">{inc.affectedAssets}</td>
                  <td className="py-3 pr-4 text-[var(--muted)]">{formatCurrency(inc.estimatedDowntimeCostUsd)}</td>
                  <td className="py-3 pr-4 text-[var(--muted)]">{formatCurrency(inc.laborCostUsd)}</td>
                  <td className="py-3 font-semibold text-[var(--text)]">{formatCurrency(inc.totalCostUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-sm font-semibold text-[var(--text)] mt-6 mb-2">Top 5 most expensive incidents</h3>
        <ul className="space-y-2">
          {topIncidents.map((inc) => (
            <li key={inc.id} className="flex justify-between text-sm">
              <span className="text-[var(--text)]">{inc.title}</span>
              <span className="font-medium text-[var(--text)]">{formatCurrency(inc.totalCostUsd)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </motion.div>
  )
}
