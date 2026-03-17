import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getActorUsername } from '@/lib/auth/session-from-cookie';
import { findUser } from '@/lib/demo-users';
import { generateTotpSecret, getTotpUri } from '@/lib/demo-totp';

/** POST /api/demo/2fa/setup – returns { secret, qrDataUrl } for the current user. Does not enable 2FA until /enable is called. */
export async function POST(req: NextRequest) {
  const username = getActorUsername(req);
  if (!username) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  const user = findUser(username);
  if (!user) {
    return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  }
  if (user.totpSecret) {
    return NextResponse.json({ error: '2FA is already enabled. Disable it first to set up again.' }, { status: 400 });
  }

  const secret = generateTotpSecret();
  const uri = getTotpUri(secret, user.username, 'Mahoney Control App');
  const qrDataUrl = await QRCode.toDataURL(uri, { width: 200, margin: 1 });
  return NextResponse.json({ secret, qrDataUrl, uri });
}
