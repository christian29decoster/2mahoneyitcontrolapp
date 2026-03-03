/**
 * POST /api/mission-briefing/debrief – create post-shift review
 * GET ?tenantId=&limit= – list reviews
 */

import { NextRequest, NextResponse } from 'next/server'
import { getActorRole, getActorTenantId } from '@/lib/auth/session-from-cookie'
import { createPostShiftReview, listPostShiftReviews } from '@/lib/mission-briefing/store'

export const dynamic = 'force-dynamic'

function getUserId(req: NextRequest): string | null {
  const cookie = req.headers.get('cookie') || ''
  const m = cookie.match(/demo_user=([^;]+)/)
  return m?.[1] ?? null
}

export async function GET(req: NextRequest) {
  const sessionTenantId = getActorTenantId(req)
  const tenantId = req.nextUrl.searchParams.get('tenantId') ?? sessionTenantId
  const limit = Math.min(50, parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10) || 20
  if (!tenantId) return NextResponse.json({ error: 'tenant_id_required' }, { status: 400 })
  const role = getActorRole(req)
  if (role === 'tenant_user' && tenantId !== sessionTenantId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const items = listPostShiftReviews(tenantId, limit)
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const sessionTenantId = getActorTenantId(req)
  const role = getActorRole(req)
  const body = await req.json().catch(() => ({}))
  const tenantId = body.tenantId ?? sessionTenantId
  if (!tenantId) return NextResponse.json({ error: 'tenant_id_required' }, { status: 400 })
  if (role === 'tenant_user' && tenantId !== sessionTenantId) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const reviewDate = body.reviewDate ?? new Date().toISOString().slice(0, 10)
  const item = createPostShiftReview({
    tenantId,
    briefingId: body.briefingId ?? null,
    reviewDate,
    whatWentWell: body.whatWentWell ?? '',
    whatFailed: body.whatFailed ?? '',
    nearMiss: body.nearMiss ?? '',
    lessonsLearned: body.lessonsLearned ?? '',
    preventiveActionTicketId: body.preventiveActionTicketId ?? null,
    createdByUserId: getUserId(req) ?? 'unknown',
  })
  return NextResponse.json({ item })
}
