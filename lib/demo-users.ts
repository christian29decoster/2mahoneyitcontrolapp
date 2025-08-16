// Demo in-memory user "DB" (resets on cold start). Replace with real DB or Vercel KV later.
export type DemoRole = 'admin'|'sales'|'demo';
export type DemoUser = {
  id: string;
  username: string;
  password: string;        // DEMO ONLY
  role: DemoRole;
  active: boolean;
  expiresAtISO?: string;   // optional expiry
  createdAtISO: string;
};

let users: DemoUser[] = [
  { id: 'u-admin', username: 'admin', password: 'Admin321#', role: 'admin', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-demo',  username: 'demo123', password: 'Demo321#', role: 'demo',  active: true, createdAtISO: new Date().toISOString() },
  // example sales reps:
  { id: 'u-s-1', username: 'sales.jane', password: 'Mahoney#1', role: 'sales', active: true, createdAtISO: new Date().toISOString() },
  { id: 'u-s-2', username: 'sales.john', password: 'Mahoney#1', role: 'sales', active: true, createdAtISO: new Date().toISOString() },
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
    createdAtISO: new Date().toISOString()
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
export function isExpired(u: DemoUser){
  return !!(u.expiresAtISO && new Date(u.expiresAtISO).getTime() < Date.now());
}
