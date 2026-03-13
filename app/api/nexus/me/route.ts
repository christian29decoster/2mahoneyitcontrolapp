import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getSession(req: NextRequest): { username: string; name: string; id: string; role: string } | null {
  const cookie = req.cookies.get('nexus_session')?.value
  if (!cookie) return null
  try {
    return JSON.parse(decodeURIComponent(cookie)) as { username: string; name: string; id: string; role: string }
  } catch {
    return null
  }
}

/** GET /api/nexus/me – Current Nexus user from cookie. */
export async function GET(req: NextRequest) {
  const session = getSession(req)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  return NextResponse.json({ user: session })
}
