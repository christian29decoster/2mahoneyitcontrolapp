/**
 * Mission Briefing – list and create.
 * GET ?tenantId=&limit=  |  POST { tenantId, timezone } → start briefing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getActorRole, getActorTenantId, getActorUserId } from '@/lib/auth/session-from-cookie'
import { listBriefings, createBriefing, addParticipant } from '@/lib/mission-briefing/store'
import { generateAutoSummary } from '@/lib/mission-briefing/aggregation'

export const dynamic = 'force-dynamic'

function getActorUserIdFromCookie(req: NextRequest): string | null {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/demo_user=([^;]+)/)
  return match?.[1] ?? null
}

export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  const sessionTenantId = getActorTenantId(req)
  const { searchParams } = new URL(req.url)
  const tenantId = searchParams.get('tenantId') ?? sessionTenantId
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '30', 10) || 30)

  if (!tenantId) return NextResponse.json({ error: 'tenant_id_required' }, { status: 400 })
  if (role === 'tenant_user' && tenantId !== sessionTenantId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const items = listBriefings(tenantId, limit)
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const role = getActorRole(req)
  const sessionTenantId = getActorTenantId(req)
  const userId = getActorUserIdFromCookie(req)
  const body = await req.json().catch(() => ({}))
  const tenantId = body.tenantId ?? sessionTenantId
  const timezone = body.timezone ?? 'UTC'

  if (!tenantId) return NextResponse.json({ error: 'tenant_id_required' }, { status: 400 })
  if (role === 'tenant_user' && tenantId !== sessionTenantId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const briefingDate = body.briefingDate ?? new Date().toISOString().slice(0, 10)
  const existing = listBriefings(tenantId, 1).find((b) => b.briefingDate === briefingDate)
  if (existing && existing.status !== 'draft') {
    return NextResponse.json({ error: 'briefing_already_exists', briefing: existing }, { status: 409 })
  }

  try {
    const autoSummary = await generateAutoSummary(tenantId)
    const briefing = createBriefing({ tenantId, briefingDate, timezone, autoSummary })
    if (userId) {
      addParticipant({
        briefingId: briefing.id,
        tenantId,
        userId,
        displayName: userId,
        role: 'lead',
      })
    }
    return NextResponse.json({ item: briefing })
  } catch (e) {
    console.error('mission-briefing create:', e)
    return NextResponse.json({ error: 'create_failed' }, { status: 500 })
  }
}
