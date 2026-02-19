import { NextResponse } from 'next/server'

/**
 * Feature flags controlled by the backend (server env at runtime).
 * In production (Live): do not set SHOW_GROUP_ADMIN → Group-Admin view is hidden.
 * In development: show Group Admin by default so the menu entry is visible without .env.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const isProd = process.env.NODE_ENV === 'production'
  const showGroupAdmin = process.env.SHOW_GROUP_ADMIN === 'true' || !isProd
  return NextResponse.json({ showGroupAdmin })
}
