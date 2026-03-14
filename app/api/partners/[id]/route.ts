import { NextRequest, NextResponse } from 'next/server'
import { getPartnerById, updatePartner } from '@/lib/data/partners'
import { getActorRole, canManagePartners } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/** GET /api/partners/[id] */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const role = getActorRole(req)
  if (!canManagePartners(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const partner = getPartnerById(params.id)
  if (!partner) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({ item: partner })
}

/** PATCH /api/partners/[id] */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const role = getActorRole(req)
  if (!canManagePartners(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const partner = getPartnerById(params.id)
  if (!partner) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const body = await req.json()
  const updated = updatePartner(params.id, {
    name: body.name,
    externalId: body.externalId,
    tier: body.tier,
    active: body.active,
    branding: body.branding,
  })
  return NextResponse.json({ item: updated })
}
