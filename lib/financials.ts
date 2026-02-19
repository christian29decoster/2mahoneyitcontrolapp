/**
 * Security Financials – derived financial metrics and incident cost data.
 */

import { stats } from './demo'

/** KPI inputs (from ops data). */
export const financialKpis = {
  securitySpendPerUserUsd: 124,
  costPerProtectedDeviceUsd: 89,
  costPerIncidentUsd: 4200,
  mttrHours: stats.mttrHours,
  financialImpactPerMttrHourUsd: 1800,
  automationSavingsEstimateUsd: 12400,
  riskExposureValueUsd: 85000,
  trend30d: { spendPerUser: 2, costPerDevice: -1, costPerIncident: -5 },
}

export interface ClosedIncidentCost {
  id: string
  title: string
  closedAt: string
  durationHours: number
  affectedAssets: number
  estimatedDowntimeCostUsd: number
  laborCostUsd: number
  totalCostUsd: number
}

/** Demo closed incidents with cost mapping. */
export const incidentCostHistory: ClosedIncidentCost[] = [
  { id: 'INC-001', title: 'Ransomware containment', closedAt: '2025-08-10T14:00:00Z', durationHours: 18, affectedAssets: 12, estimatedDowntimeCostUsd: 22000, laborCostUsd: 4800, totalCostUsd: 26800 },
  { id: 'INC-002', title: 'Phishing credential reset', closedAt: '2025-08-08T11:00:00Z', durationHours: 4, affectedAssets: 1, estimatedDowntimeCostUsd: 800, laborCostUsd: 1200, totalCostUsd: 2000 },
  { id: 'INC-003', title: 'EDR false positive rollout', closedAt: '2025-08-05T09:00:00Z', durationHours: 6, affectedAssets: 45, estimatedDowntimeCostUsd: 5400, laborCostUsd: 1800, totalCostUsd: 7200 },
  { id: 'INC-004', title: 'Unauthorized access investigation', closedAt: '2025-08-02T16:00:00Z', durationHours: 8, affectedAssets: 3, estimatedDowntimeCostUsd: 2400, laborCostUsd: 3200, totalCostUsd: 5600 },
  { id: 'INC-005', title: 'Cloud misconfiguration', closedAt: '2025-07-28T12:00:00Z', durationHours: 12, affectedAssets: 8, estimatedDowntimeCostUsd: 9600, laborCostUsd: 3600, totalCostUsd: 13200 },
]

export function getTopExpensiveIncidents(n: number): ClosedIncidentCost[] {
  return [...incidentCostHistory].sort((a, b) => b.totalCostUsd - a.totalCostUsd).slice(0, n)
}

/** ROI Simulator – interne abgeleitete Werte (für Berechnung). */
export interface ROISimulatorInputs {
  avgHourlyEmployeeCostUsd: number
  avgDowntimeCostPerHourUsd: number
  incidentFrequencyPerYear: number
  manualWorkflowHoursPerMonth: number
}

/** Simple inputs: employee count, cost per head, optional manual hours override. */
export interface SimpleROIInputs {
  employeeCount: number
  avgMonthlyCostPerHeadUsd: number
  /** Manual workflow hours per month. If 0, derived from employee count. */
  manualWorkflowHoursPerMonth: number
}

export const defaultSimpleROIInputs: SimpleROIInputs = {
  employeeCount: 50,
  avgMonthlyCostPerHeadUsd: 6500,
  manualWorkflowHoursPerMonth: 0,
}

/** Derives ROI inputs. If manualWorkflowHoursPerMonth > 0, uses it; else derives from employee count. */
export function deriveROIInputs(simple: SimpleROIInputs): ROISimulatorInputs {
  const annualHoursPerHead = 2080
  const avgHourlyEmployeeCostUsd = (simple.avgMonthlyCostPerHeadUsd * 12) / annualHoursPerHead
  const avgDowntimeCostPerHourUsd = Math.round(avgHourlyEmployeeCostUsd * 8)
  const incidentFrequencyPerYear = Math.max(1, Math.round(simple.employeeCount * 0.14))
  const manualWorkflowHoursPerMonth =
    simple.manualWorkflowHoursPerMonth > 0
      ? simple.manualWorkflowHoursPerMonth
      : Math.max(5, Math.round(simple.employeeCount * 0.9))
  return {
    avgHourlyEmployeeCostUsd: Math.round(avgHourlyEmployeeCostUsd * 100) / 100,
    avgDowntimeCostPerHourUsd,
    incidentFrequencyPerYear,
    manualWorkflowHoursPerMonth,
  }
}

export const defaultROIInputs: ROISimulatorInputs = deriveROIInputs(defaultSimpleROIInputs)

const AVG_INCIDENT_DURATION_HOURS = 6

/** ROI Simulator outputs – includes breakdown for potential, downtime, risks. */
export interface ROISimulatorOutputs {
  estimatedAnnualRiskCostUsd: number
  estimatedCostReductionViaAutomationUsd: number
  estimatedSavingsFromAIRecommendationsUsd: number
  /** Manual workflow hours per month (total). */
  manualWorkflowHoursPerMonth: number
  /** Estimated downtime hours per year (incidents × avg duration). */
  downtimeHoursPerYear: number
  /** Downtime cost component (USD/year). */
  downtimeCostUsd: number
  /** Manual labor cost component (USD/year). */
  manualLaborCostUsd: number
  /** Incident count per year. */
  incidentFrequencyPerYear: number
}

export function computeROIOutputs(inputs: ROISimulatorInputs): ROISimulatorOutputs {
  const downtimeHoursPerYear = inputs.incidentFrequencyPerYear * AVG_INCIDENT_DURATION_HOURS
  const downtimeCostUsd = Math.round(downtimeHoursPerYear * inputs.avgDowntimeCostPerHourUsd)
  const manualLaborAnnualHours = inputs.manualWorkflowHoursPerMonth * 12
  const manualLaborCostUsd = Math.round(manualLaborAnnualHours * inputs.avgHourlyEmployeeCostUsd * 0.4)
  const estimatedAnnualRiskCostUsd = downtimeCostUsd + manualLaborCostUsd
  const estimatedCostReductionViaAutomationUsd = Math.round(manualLaborAnnualHours * inputs.avgHourlyEmployeeCostUsd * 0.35)
  const estimatedSavingsFromAIRecommendationsUsd = Math.round(estimatedAnnualRiskCostUsd * 0.15)
  return {
    estimatedAnnualRiskCostUsd,
    estimatedCostReductionViaAutomationUsd,
    estimatedSavingsFromAIRecommendationsUsd,
    manualWorkflowHoursPerMonth: inputs.manualWorkflowHoursPerMonth,
    downtimeHoursPerYear,
    downtimeCostUsd,
    manualLaborCostUsd,
    incidentFrequencyPerYear: inputs.incidentFrequencyPerYear,
  }
}
