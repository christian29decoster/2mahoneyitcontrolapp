/**
 * Mahoney Mission Briefing (MMB) – types and constants.
 * Multi-tenant; tenant_id required on all entities.
 */

export const MMB_BRIEFING_STATUS = [
  'draft',
  'in_progress',
  'red_flag_round',
  'risk_confirm',
  'readback',
  'signed',
  'locked',
] as const
export type BriefingStatus = (typeof MMB_BRIEFING_STATUS)[number]

export const MMB_RISK_LEVEL = ['green', 'yellow', 'red', 'critical'] as const
export type RiskLevel = (typeof MMB_RISK_LEVEL)[number]

/** Weights for Customer Risk Index (sum = 1). */
export const RISK_INDEX_WEIGHTS = {
  threat: 0.3,
  patchGap: 0.2,
  backupRisk: 0.15,
  slaPressure: 0.2,
  capacityRisk: 0.15,
} as const

export interface MissionBriefing {
  id: string
  tenantId: string
  briefingDate: string
  scheduledAtISO: string | null
  startedAtISO: string | null
  completedAtISO: string | null
  status: BriefingStatus
  autoSummary: BriefingAutoSummary | null
  timezone: string
  lockedAtISO: string | null
  createdAtISO: string
  updatedAtISO: string
}

export interface BriefingAutoSummary {
  threatLandscapeScore: number
  infrastructureHealthScore: number
  operationalLoadScore: number
  complianceExposureScore: number
  customerRiskIndex: number
  perCustomer: PerCustomerRisk[]
  rawMetrics: RawMetrics
  generatedAtISO: string
}

export interface PerCustomerRisk {
  customerId: string
  customerName: string
  threat: number
  patchGap: number
  backupRisk: number
  slaPressure: number
  capacityRisk: number
  riskIndex: number
  level: RiskLevel
}

export interface RawMetrics {
  highSeveritySiemAlerts24h: number
  activeSophosIncidents: number
  devicesOfflineOver12h: number
  devicesTotal: number
  patchCompliancePercent: number
  backupFailures: number
  agentDisconnectCount: number
  openP1Tickets: number
  openP2Tickets: number
  slaBreachesPending: number
  resourceUtilizationPercent: number
  kritisClientsWithActiveRisks: number
  nis2OpenIssues: number
}

export interface BriefingParticipant {
  id: string
  briefingId: string
  tenantId: string
  userId: string
  displayName: string
  role: string
  joinedAtISO: string
  redFlagResponse: string | null
  redFlagSubmittedAtISO: string | null
  riskAcknowledgedAtISO: string | null
  readbackText: string | null
  readbackSubmittedAtISO: string | null
  signedAtISO: string | null
}

export interface RedFlagEntry {
  id: string
  briefingId: string
  tenantId: string
  participantId: string
  flagType: 'risk' | 'near_miss' | 'escalation'
  escalationToLeadership: boolean
  anonymous: boolean
  contentText: string
  createdAtISO: string
}

export interface PostShiftReview {
  id: string
  tenantId: string
  briefingId: string | null
  reviewDate: string
  whatWentWell: string
  whatFailed: string
  nearMiss: string
  lessonsLearned: string
  preventiveActionTicketId: string | null
  createdByUserId: string
  createdAtISO: string
}

export function scoreToLevel(score: number): RiskLevel {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'red'
  if (score >= 25) return 'yellow'
  return 'green'
}
