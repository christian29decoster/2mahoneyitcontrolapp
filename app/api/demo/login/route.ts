import { NextRequest, NextResponse } from 'next/server';
import { findUser, isExpired } from '@/lib/demo-users';
import { verifyTotp } from '@/lib/demo-totp';

const COOKIE_MAX_AGE = 30 * 24 * 3600;

function setSessionCookies(res: NextResponse, session: { username: string; role: string; partnerId?: string; tenantId?: string }) {
  res.cookies.set('demo_authed', '1', { maxAge: COOKIE_MAX_AGE, path: '/', sameSite: 'lax' });
  res.cookies.set('demo_user', session.username, { maxAge: COOKIE_MAX_AGE, path: '/', sameSite: 'lax' });
  res.cookies.set('demo_role', session.role, { maxAge: COOKIE_MAX_AGE, path: '/', sameSite: 'lax' });
  if (session.partnerId) res.cookies.set('demo_partner_id', session.partnerId, { maxAge: COOKIE_MAX_AGE, path: '/', sameSite: 'lax' });
  if (session.tenantId) res.cookies.set('demo_tenant_id', session.tenantId, { maxAge: COOKIE_MAX_AGE, path: '/', sameSite: 'lax' });
}

/** POST /api/demo/login – body: { username, password, totpCode? }. Returns { ok } or { need2fa } or { error }. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = typeof body.username === 'string' ? body.username.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const totpCode = typeof body.totpCode === 'string' ? body.totpCode.trim() : undefined;

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
    }

    const user = findUser(username);
    if (!user || !user.active || isExpired(user)) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const session = { username: user.username, role: user.role, partnerId: user.partnerId, tenantId: user.tenantId };

    if (user.totpSecret) {
      if (!totpCode || !verifyTotp(totpCode, user.totpSecret)) {
        return NextResponse.json({ need2fa: true });
      }
    }

    const res = NextResponse.json({ ok: true });
    setSessionCookies(res, session);
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
