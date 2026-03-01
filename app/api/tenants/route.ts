import { NextRequest, NextResponse } from 'next/server'
import { listTenants, createTenant, getTenantById } from '@/lib/data/tenants'
import { getActorRole, getActorPartnerId, canManageTenants } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/** GET /api/tenants – Liste (optional ?partnerId=; bei role=partner nur eigene). */
export async function GET(req: NextRequest) {
  const role = getActorRole(req)
  if (!canManageTenants(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const { searchParams } = new URL(req.url)
  let partnerId = searchParams.get('partnerId') ?? undefined
  if (role === 'partner') partnerId = getActorPartnerId(req) ?? undefined
  const items = listTenants(partnerId)
  return NextResponse.json({ items })
}

/** POST /api/tenants – Tenant anlegen. */
export async function POST(req: NextRequest) {
  const role = getActorRole(req)
  if (!canManageTenants(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json()
  const id = body.id ?? `tenant-${Date.now()}`
  const existing = getTenantById(id)
  if (existing) return NextResponse.json({ error: 'Tenant ID already exists.' }, { status: 400 })
  const partnerId = body.partnerId ?? undefined
  if (role === 'partner' && partnerId !== getActorPartnerId(req)) {
    return NextResponse.json({ error: 'Partner can only create tenants with their own partnerId.' }, { status: 403 })
  }
  const tenant = createTenant({
    id,
    name: body.name ?? 'New tenant',
    partnerId,
    connectors: body.connectors ?? {},
    active: body.active ?? true,
  })
  return NextResponse.json({ item: tenant })
}
