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

/** ROI Simulator inputs. */
export interface ROISimulatorInputs {
  avgHourlyEmployeeCostUsd: number
  avgDowntimeCostPerHourUsd: number
  incidentFrequencyPerYear: number
  manualWorkflowHoursPerMonth: number
}

export const defaultROIInputs: ROISimulatorInputs = {
  avgHourlyEmployeeCostUsd: 65,
  avgDowntimeCostPerHourUsd: 1800,
  incidentFrequencyPerYear: 8,
  manualWorkflowHoursPerMonth: 40,
}

/** ROI Simulator outputs. */
export interface ROISimulatorOutputs {
  estimatedAnnualRiskCostUsd: number
  estimatedCostReductionViaAutomationUsd: number
  estimatedSavingsFromAIRecommendationsUsd: number
}

export function computeROIOutputs(inputs: ROISimulatorInputs): ROISimulatorOutputs {
  const incidentCost = inputs.incidentFrequencyPerYear * 6 * inputs.avgDowntimeCostPerHourUsd // assume 6h avg per incident
  const manualCost = inputs.manualWorkflowHoursPerMonth * 12 * inputs.avgHourlyEmployeeCostUsd
  const estimatedAnnualRiskCostUsd = Math.round(incidentCost + manualCost * 0.4)
  const estimatedCostReductionViaAutomationUsd = Math.round(manualCost * 0.35)
  const estimatedSavingsFromAIRecommendationsUsd = Math.round(estimatedAnnualRiskCostUsd * 0.15)
  return {
    estimatedAnnualRiskCostUsd,
    estimatedCostReductionViaAutomationUsd,
    estimatedSavingsFromAIRecommendationsUsd,
  }
}
