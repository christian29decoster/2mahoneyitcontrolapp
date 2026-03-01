import { NextRequest, NextResponse } from 'next/server'
import { listPartners, createPartner, getPartnerById } from '@/lib/data/partners'
import { getActorRole, canManagePartners } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/** GET /api/partners – Liste (SuperAdmin/Admin: alle; Partner: später nur eigenes). */
export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  if (!canManagePartners(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const items = listPartners()
  return NextResponse.json({ items })
}

/** POST /api/partners – Partner anlegen (nur SuperAdmin/Admin). */
export async function POST(req: NextRequest) {
  const role = getActorRole(req)
  if (!canManagePartners(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json()
  const id = body.id ?? `partner-${Date.now()}`
  const existing = getPartnerById(id)
  if (existing) return NextResponse.json({ error: 'Partner ID already exists.' }, { status: 400 })
  const partner = createPartner({
    id,
    name: body.name ?? 'New partner',
    externalId: body.externalId,
    active: body.active ?? true,
  })
  return NextResponse.json({ item: partner })
}
