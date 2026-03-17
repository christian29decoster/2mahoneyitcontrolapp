/**
 * TOTP (Google Authenticator–compatible) helpers for demo 2FA. Server-only.
 */
import { generateSecret, generateURI, verifySync } from 'otplib';

const ISSUER = 'Mahoney Control App';

export function generateTotpSecret(): string {
  return generateSecret();
}

export function getTotpUri(secret: string, accountName: string, issuer: string = ISSUER): string {
  return generateURI({ issuer, label: accountName, secret });
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    const result = verifySync({ secret, token: token.replace(/\s/g, '') });
    return result.valid;
  } catch {
    return false;
  }
}
