import { NextRequest, NextResponse } from 'next/server'
import { verifyNexusCredentials } from '@/lib/nexus-auth'

export const dynamic = 'force-dynamic'

/** POST /api/nexus/auth – Login. Body: { username, password }. Sets nexus_session cookie. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required.' }, { status: 400 })
    }
    const user = verifyNexusCredentials(username, password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
    }
    const payload = JSON.stringify({ username: user.username, name: user.name, id: user.id, role: user.role })
    const cookie = `nexus_session=${encodeURIComponent(payload)}; Path=/; Max-Age=86400; SameSite=Lax; HttpOnly`
    const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, username: user.username, role: user.role } })
    res.headers.set('Set-Cookie', cookie)
    return res
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

/** DELETE /api/nexus/auth – Logout (clear cookie). */
export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.headers.set('Set-Cookie', 'nexus_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly')
  return res
}
