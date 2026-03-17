import { NextRequest, NextResponse } from 'next/server'
import { getTenantById, updateTenant, listTenants } from '@/lib/data/tenants'
import { getActorRole, getActorPartnerId, getActorTenantId, canManageTenants } from '@/lib/auth/session-from-cookie'

export const dynamic = 'force-dynamic'

/** GET /api/tenants/[id] – Ein Tenant inkl. Connectors. tenant_user nur eigenes [id]. */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const role = getActorRole(req)
  const tenant = getTenantById(params.id)
  if (!tenant) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (canManageTenants(role)) {
    if (role === 'partner' && tenant.partnerId !== getActorPartnerId(req))
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    return NextResponse.json({ item: tenant })
  }
  if (role === 'tenant_user' && getActorTenantId(req) === params.id)
    return NextResponse.json({ item: tenant })
  return NextResponse.json({ error: 'forbidden' }, { status: 403 })
}

/** PATCH /api/tenants/[id] – Tenant + Connectors bearbeiten. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const role = getActorRole(req)
  if (!canManageTenants(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const tenant = getTenantById(params.id)
  if (!tenant) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (role === 'partner' && tenant.partnerId !== getActorPartnerId(req))
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const body = await req.json()
  const updated = updateTenant(params.id, {
    name: body.name,
    partnerId: body.partnerId,
    connectors: body.connectors,
    active: body.active,
    locations: body.locations,
    certificates: body.certificates,
    billing: body.billing,
    region: body.region,
    frameworks: body.frameworks,
    documentUploads: body.documentUploads,
    frameworkDocuments: body.frameworkDocuments,
    userSync: body.userSync,
  })
  return NextResponse.json({ item: updated })
}

/** DELETE /api/tenants/[id] – Tenant entfernen (In-Memory; später soft delete). */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const role = getActorRole(req)
  if (!canManageTenants(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const tenant = getTenantById(params.id)
  if (!tenant) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  if (role === 'partner' && tenant.partnerId !== getActorPartnerId(req))
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  updateTenant(params.id, { active: false })
  return NextResponse.json({ ok: true })
}
