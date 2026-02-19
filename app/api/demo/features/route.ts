import { NextResponse } from 'next/server'

/**
 * Feature flags controlled by the backend (server env at runtime).
 * In production (Live): do not set SHOW_GROUP_ADMIN → Group-Admin view is hidden.
 * For internal/Mahoney IT Group admins: set SHOW_GROUP_ADMIN=true in the backend env.
 */
export const dynamic = 'force-dynamic'

export async function GET() {
  const showGroupAdmin = process.env.SHOW_GROUP_ADMIN === 'true'
  return NextResponse.json({ showGroupAdmin })
}
