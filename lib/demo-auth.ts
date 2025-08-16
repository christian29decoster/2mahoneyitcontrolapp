import { findUser, isExpired } from './demo-users';

export type Session = { username: string; role: 'admin'|'sales'|'demo' };

export function checkCredentials(u: string, p: string): Session | null {
  const user = findUser(u);
  if (!user || !user.active || isExpired(user)) return null;
  if (user.password !== p) return null; // DEMO ONLY
  return { username: user.username, role: user.role };
}

// Keep legacy function for backward compatibility
export const DEMO_USER = 'demo123';
export const DEMO_PASS = 'Demo321#';
export function checkDemoCredentials(u: string, p: string) { 
  const session = checkCredentials(u, p);
  return session !== null;
}
