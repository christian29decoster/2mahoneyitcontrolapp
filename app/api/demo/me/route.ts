import { NextRequest, NextResponse } from 'next/server'
import { getPartnerById } from '@/lib/data/partners'

type DemoRole = 'superadmin' | 'admin' | 'partner' | 'tenant_user' | 'sales' | 'demo'

function getRole(req: NextRequest): DemoRole | null {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/demo_role=([^;]+)/)
  const role = match?.[1] as DemoRole | undefined
  if (role && ['superadmin', 'admin', 'sales', 'partner', 'tenant_user', 'demo'].includes(role)) return role
  return null
}

function getPartnerId(req: NextRequest): string | null {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/demo_partner_id=([^;]+)/)
  return match?.[1] ?? null
}

/** GET /api/demo/me – current session role, partnerId, and (for partner) partnerTier + partnerName. */
export async function GET(req: NextRequest) {
  const role = getRole(req)
  const partnerId = getPartnerId(req)
  let partnerTier: string | undefined
  let partnerName: string | undefined
  let partnerBranding: { appName?: string; logoDataUrl?: string } | undefined
  let partnerRegion: 'us' | 'eu' | 'asia' | undefined
  if (role === 'partner' && partnerId) {
    const partner = getPartnerById(partnerId)
    if (partner) {
      partnerTier = partner.tier
      partnerName = partner.name
      partnerRegion = partner.region ?? 'us'
      if (partner.branding && (partner.branding.appName || partner.branding.logoDataUrl)) partnerBranding = partner.branding
    }
  }
  return NextResponse.json({
    role,
    partnerId,
    partnerTier,
    partnerName,
    partnerBranding,
    partnerRegion,
  })
}
