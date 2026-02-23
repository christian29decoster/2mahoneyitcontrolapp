import { NextResponse } from 'next/server'
import { getAppSettings } from '@/lib/data/app-settings'

export const dynamic = 'force-dynamic'

/** GET – öffentliche Branding-Daten (App-Name, Logo) für Login-Seite. Kein Auth nötig. */
export async function GET() {
  const settings = getAppSettings()
  return NextResponse.json({
    appName: settings.appName,
    logoDataUrl: settings.logoDataUrl ?? null,
  })
}
