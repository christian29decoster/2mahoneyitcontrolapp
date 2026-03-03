/**
 * Mission Briefing – in-memory store (replace with DB for production).
 * All access must be tenant-scoped (tenant_id).
 */

import type {
  MissionBriefing,
  BriefingParticipant,
  RedFlagEntry,
  PostShiftReview,
  BriefingAutoSummary,
  BriefingStatus,
} from './types'

const briefings: MissionBriefing[] = []
const participants: BriefingParticipant[] = []
const redFlags: RedFlagEntry[] = []
const postShiftReviews: PostShiftReview[] = []

function uuid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function createBriefing(params: {
  tenantId: string
  briefingDate: string
  timezone: string
  autoSummary: BriefingAutoSummary
}): MissionBriefing {
  const now = new Date().toISOString()
  const b: MissionBriefing = {
    id: `mb-${uuid()}`,
    tenantId: params.tenantId,
    briefingDate: params.briefingDate,
    scheduledAtISO: null,
    startedAtISO: now,
    completedAtISO: null,
    status: 'in_progress',
    autoSummary: params.autoSummary,
    timezone: params.timezone,
    lockedAtISO: null,
    createdAtISO: now,
    updatedAtISO: now,
  }
  briefings.push(b)
  return b
}

export function getBriefingById(id: string, tenantId: string): MissionBriefing | undefined {
  return briefings.find((b) => b.id === id && b.tenantId === tenantId)
}

export function getBriefingByDate(tenantId: string, briefingDate: string): MissionBriefing | undefined {
  return briefings.find((b) => b.tenantId === tenantId && b.briefingDate === briefingDate)
}

export function listBriefings(tenantId: string, limit = 30): MissionBriefing[] {
  return briefings
    .filter((b) => b.tenantId === tenantId)
    .sort((a, b) => b.briefingDate.localeCompare(a.briefingDate))
    .slice(0, limit)
}

export function updateBriefing(
  id: string,
  tenantId: string,
  updates: Partial<Pick<MissionBriefing, 'status' | 'completedAtISO' | 'lockedAtISO' | 'updatedAtISO'>>
): MissionBriefing | undefined {
  const b = briefings.find((x) => x.id === id && x.tenantId === tenantId)
  if (!b || b.lockedAtISO) return undefined
  Object.assign(b, updates, { updatedAtISO: new Date().toISOString() })
  return b
}

export function addParticipant(params: {
  briefingId: string
  tenantId: string
  userId: string
  displayName: string
  role?: string
}): BriefingParticipant {
  const p: BriefingParticipant = {
    id: `bp-${uuid()}`,
    briefingId: params.briefingId,
    tenantId: params.tenantId,
    userId: params.userId,
    displayName: params.displayName,
    role: params.role ?? '',
    joinedAtISO: new Date().toISOString(),
    redFlagResponse: null,
    redFlagSubmittedAtISO: null,
    riskAcknowledgedAtISO: null,
    readbackText: null,
    readbackSubmittedAtISO: null,
    signedAtISO: null,
  }
  participants.push(p)
  return p
}

export function getParticipants(briefingId: string, tenantId: string): BriefingParticipant[] {
  return participants.filter((p) => p.briefingId === briefingId && p.tenantId === tenantId)
}

export function setParticipantRedFlag(
  participantId: string,
  tenantId: string,
  redFlagResponse: string
): BriefingParticipant | undefined {
  const p = participants.find((x) => x.id === participantId && x.tenantId === tenantId)
  if (!p) return undefined
  p.redFlagResponse = redFlagResponse
  p.redFlagSubmittedAtISO = new Date().toISOString()
  return p
}

export function setParticipantReadback(
  participantId: string,
  tenantId: string,
  readbackText: string
): BriefingParticipant | undefined {
  const p = participants.find((x) => x.id === participantId && x.tenantId === tenantId)
  if (!p) return undefined
  p.readbackText = readbackText
  p.readbackSubmittedAtISO = new Date().toISOString()
  return p
}

export function setParticipantRiskAck(participantId: string, tenantId: string): BriefingParticipant | undefined {
  const p = participants.find((x) => x.id === participantId && x.tenantId === tenantId)
  if (!p) return undefined
  p.riskAcknowledgedAtISO = new Date().toISOString()
  return p
}

export function setParticipantSigned(participantId: string, tenantId: string): BriefingParticipant | undefined {
  const p = participants.find((x) => x.id === participantId && x.tenantId === tenantId)
  if (!p) return undefined
  p.signedAtISO = new Date().toISOString()
  return p
}

export function addRedFlag(params: {
  briefingId: string
  tenantId: string
  participantId: string
  flagType: 'risk' | 'near_miss' | 'escalation'
  escalationToLeadership: boolean
  anonymous: boolean
  contentText: string
}): RedFlagEntry {
  const e: RedFlagEntry = {
    id: `rf-${uuid()}`,
    ...params,
    createdAtISO: new Date().toISOString(),
  }
  redFlags.push(e)
  return e
}

export function getRedFlags(briefingId: string, tenantId: string): RedFlagEntry[] {
  return redFlags.filter((r) => r.briefingId === briefingId && r.tenantId === tenantId)
}

export function createPostShiftReview(params: {
  tenantId: string
  briefingId: string | null
  reviewDate: string
  whatWentWell: string
  whatFailed: string
  nearMiss: string
  lessonsLearned: string
  preventiveActionTicketId: string | null
  createdByUserId: string
}): PostShiftReview {
  const r: PostShiftReview = {
    id: `psr-${uuid()}`,
    ...params,
    createdAtISO: new Date().toISOString(),
  }
  postShiftReviews.push(r)
  return r
}

export function listPostShiftReviews(tenantId: string, limit = 20): PostShiftReview[] {
  return postShiftReviews
    .filter((r) => r.tenantId === tenantId)
    .sort((a, b) => b.createdAtISO.localeCompare(a.createdAtISO))
    .slice(0, limit)
}

export function lockBriefing(id: string, tenantId: string): MissionBriefing | undefined {
  const b = briefings.find((x) => x.id === id && x.tenantId === tenantId)
  if (!b) return undefined
  if (b.lockedAtISO) return b
  b.status = 'locked'
  b.lockedAtISO = new Date().toISOString()
  b.completedAtISO = b.lockedAtISO
  b.updatedAtISO = b.lockedAtISO
  return b
}
