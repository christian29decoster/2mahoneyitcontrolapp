import { NextRequest, NextResponse } from 'next/server';
import { getActorUsername } from '@/lib/auth/session-from-cookie';
import { findUser, updateUserTotpSecret } from '@/lib/demo-users';
import { verifyTotp } from '@/lib/demo-totp';

/** POST /api/demo/2fa/disable – body: { code }. Verifies code and disables 2FA for the current user. */
export async function POST(req: NextRequest) {
  const username = getActorUsername(req);
  if (!username) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  const user = findUser(username);
  if (!user || !user.totpSecret) {
    return NextResponse.json({ error: '2FA is not enabled.' }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === 'string' ? body.code.trim() : '';
  if (!code) {
    return NextResponse.json({ error: 'Code required.' }, { status: 400 });
  }

  if (!verifyTotp(code, user.totpSecret)) {
    return NextResponse.json({ error: 'Invalid code.' }, { status: 400 });
  }

  updateUserTotpSecret(username, null);
  return NextResponse.json({ ok: true });
}
