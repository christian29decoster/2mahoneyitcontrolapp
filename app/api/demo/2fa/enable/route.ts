import { NextRequest, NextResponse } from 'next/server';
import { getActorUsername } from '@/lib/auth/session-from-cookie';
import { findUser, updateUserTotpSecret } from '@/lib/demo-users';
import { verifyTotp } from '@/lib/demo-totp';

/** POST /api/demo/2fa/enable – body: { code, secret }. Verifies code and enables 2FA for the current user. */
export async function POST(req: NextRequest) {
  const username = getActorUsername(req);
  if (!username) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  const user = findUser(username);
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  const secret = typeof body.secret === 'string' ? body.secret.trim() : '';
  if (!code || !secret) {
    return NextResponse.json({ error: 'Code and secret required.' }, { status: 400 });
  }

  if (!verifyTotp(code, secret)) {
    return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 400 });
  }

  updateUserTotpSecret(username, secret);
  return NextResponse.json({ ok: true });
}
