/**
 * GET /api/mission-briefing/briefings/[id]  – get briefing + participants + red flags
 * PATCH – update status, participant responses, lock
 */

import { NextRequest, NextResponse } from 'next/server'
import { getActorRole, getActorTenantId } from '@/lib/auth/session-from-cookie'
import {
  getBriefingById,
  getParticipants,
  getRedFlags,
  updateBriefing,
  setParticipantRedFlag,
  setParticipantReadback,
  setParticipantRiskAck,
  setParticipantSigned,
  addParticipant,
  addRedFlag,
  lockBriefing,
} from '@/lib/mission-briefing/store'

export const dynamic = 'force-dynamic'

function getUserId(req: NextRequest): string | null {
  const cookie = req.headers.get('cookie') || ''
  const m = cookie.match(/demo_user=([^;]+)/)
  return m?.[1] ?? null
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = getActorRole(req)
  const sessionTenantId = getActorTenantId(req)
  const tenantId = req.nextUrl.searchParams.get('tenantId') ?? sessionTenantId
  const id = params?.id

  if (!id || !tenantId) return NextResponse.json({ error: 'id and tenant required' }, { status: 400 })
  if (role === 'tenant_user' && tenantId !== sessionTenantId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const briefing = getBriefingById(id, tenantId)
  if (!briefing) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const participantsList = getParticipants(id, tenantId)
  const redFlagsList = getRedFlags(id, tenantId)
  const currentUserId = getUserId(req)
  return NextResponse.json({
    item: briefing,
    participants: participantsList,
    redFlags: redFlagsList,
    currentUserId: currentUserId ?? undefined,
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const role = getActorRole(req)
  const sessionTenantId = getActorTenantId(req)
  const tenantId = req.nextUrl.searchParams.get('tenantId') ?? sessionTenantId
  const id = params?.id
  if (!id || !tenantId) return NextResponse.json({ error: 'id and tenant required' }, { status: 400 })
  if (role === 'tenant_user' && tenantId !== sessionTenantId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const briefing = getBriefingById(id, tenantId)
  if (!briefing) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (briefing.lockedAtISO) return NextResponse.json({ error: 'briefing_locked' }, { status: 409 })

  if (body.status) {
    updateBriefing(id, tenantId, { status: body.status })
  }
  if (body.participantId && body.redFlagResponse != null) {
    setParticipantRedFlag(body.participantId, tenantId, body.redFlagResponse)
  }
  if (body.participantId && body.readbackText != null) {
    setParticipantReadback(body.participantId, tenantId, body.readbackText)
  }
  if (body.participantId && body.riskAcknowledged === true) {
    setParticipantRiskAck(body.participantId, tenantId)
  }
  if (body.participantId && body.signed === true) {
    setParticipantSigned(body.participantId, tenantId)
  }
  if (body.addParticipant) {
    const p = addParticipant({
      briefingId: id,
      tenantId,
      userId: body.addParticipant.userId ?? getUserId(req) ?? 'unknown',
      displayName: body.addParticipant.displayName ?? body.addParticipant.userId ?? 'Operator',
      role: body.addParticipant.role,
    })
    const updated = getBriefingById(id, tenantId)
    return NextResponse.json({ item: updated, addedParticipant: p })
  }
  if (body.addRedFlag) {
    const r = addRedFlag({
      briefingId: id,
      tenantId,
      participantId: body.addRedFlag.participantId,
      flagType: body.addRedFlag.flagType ?? 'risk',
      escalationToLeadership: body.addRedFlag.escalationToLeadership === true,
      anonymous: body.addRedFlag.anonymous === true,
      contentText: body.addRedFlag.contentText ?? '',
    })
    return NextResponse.json({ item: getBriefingById(id, tenantId), addedRedFlag: r })
  }
  if (body.lock === true) {
    const locked = lockBriefing(id, tenantId)
    return NextResponse.json({ item: locked })
  }

  const updated = getBriefingById(id, tenantId)
  return NextResponse.json({ item: updated })
}
