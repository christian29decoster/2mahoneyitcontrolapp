import { NextRequest, NextResponse } from 'next/server'
import { getAppSettings, updateAppSettings } from '@/lib/data/app-settings'

export const dynamic = 'force-dynamic'

function getRole(req: NextRequest): string | null {
  const c = req.headers.get('cookie') || ''
  const m = c.match(/demo_role=([^;]+)/)
  return m?.[1]?.toLowerCase() ?? null
}

/** GET – aktuelle App-Einstellungen (nur Admin/SuperAdmin). */
export async function GET(req: NextRequest) {
  const role = getRole(req)
  if (role !== 'admin' && role !== 'superadmin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const settings = getAppSettings()
  return NextResponse.json(settings)
}

/** PATCH – Einstellungen ändern (nur Admin/SuperAdmin). */
export async function PATCH(req: NextRequest) {
  const role = getRole(req)
  if (role !== 'admin' && role !== 'superadmin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const updated = updateAppSettings({
    appName: body.appName,
    sessionDurationMinutes: body.sessionDurationMinutes,
    defaultRoleForNewUsers: body.defaultRoleForNewUsers,
    adminNotice: body.adminNotice,
  })
  return NextResponse.json(updated)
}
