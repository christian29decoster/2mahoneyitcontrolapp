// Demo in-memory user "DB" (resets on cold start). Replace with real DB or Vercel KV later.
// Rollen: superadmin (geschützt), admin, partner, tenant_user; sales/demo für Abwärtskompatibilität.
export type DemoRole = 'superadmin' | 'admin' | 'partner' | 'tenant_user' | 'sales' | 'demo';
export type DemoUser = {
  id: string;
  username: string;
  password: string;        // DEMO ONLY
  role: DemoRole;
  /** Bei Partner: zugeordnete Partner-ID für Tenant-Filter. */
  partnerId?: string;
  /** Bei Tenant-User: zugeordneter Mandant. */
  tenantId?: string;
  active: boolean;
  expiresAtISO?: string;   // optional expiry
  createdAtISO: string;
};

let users: DemoUser[] = [
  { id: 'u-superadmin', username: 'superadmin', password: 'SuperAdmin321#', role: 'superadmin', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-admin', username: 'admin', password: 'Admin321#', role: 'admin', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-demo',  username: 'demo123', password: 'Demo321#', role: 'demo',  active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-s-1', username: 'sales.jane', password: 'Mahoney#1', role: 'sales', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-s-2', username: 'sales.john', password: 'Mahoney#1', role: 'sales', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-tenant-1', username: 'tenant.acme', password: 'Mahoney#1', role: 'tenant_user', tenantId: 'O-25-001', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-partner-1', username: 'partner.demo', password: 'Mahoney#1', role: 'partner', partnerId: 'partner-1', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-karen', username: 'karen.thompson', password: 'Mahoney#1', role: 'sales', active: true, createdAtISO: new Date().toISOString() },
];

export function listUsers(){ return users.slice(); }
export function findUser(username: string){ return users.find(u => u.username === username); }
export function upsertUser(u: Partial<DemoUser> & {username: string, password?: string}){
  const existing = users.find(x => x.username === u.username);
  if (existing) {
    // Update existing user
    Object.assign(existing, {
      ...u,
      id: existing.id, // Keep existing ID
      createdAtISO: existing.createdAtISO // Keep original creation date
    });
    return existing;
  }
  
  // Create new user
  const nu: DemoUser = {
    id: 'u-' + Math.random().toString(36).slice(2,9),
    username: u.username,
    password: u.password || 'Mahoney#1',
    role: (u.role as DemoRole) || 'sales',
    active: u.active ?? true,
    expiresAtISO: u.expiresAtISO,
    createdAtISO: new Date().toISOString(),
    partnerId: u.partnerId,
    tenantId: u.tenantId,
  };
  users.push(nu);
  return nu;
}
export function toggleActive(id: string, v: boolean){
  const u = users.find(x=>x.id===id); if (u) u.active = v;
  return u;
}
export function removeUser(id: string){
  users = users.filter(x=>x.id!==id);
}

export function findUserById(id: string): DemoUser | undefined {
  return users.find(u => u.id === id);
}

/** True, wenn der User SuperAdmin ist (Passwort/Löschen durch andere verboten). */
export function isSuperAdminUser(u: DemoUser): boolean {
  return u.role === 'superadmin';
}
export function isExpired(u: DemoUser){
  return !!(u.expiresAtISO && new Date(u.expiresAtISO).getTime() < Date.now());
}
