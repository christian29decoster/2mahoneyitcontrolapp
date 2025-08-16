'use client';
import { useEffect, useMemo, useState } from 'react';

type User = {
  id:string; username:string; role:'admin'|'sales'|'demo';
  active:boolean; createdAtISO:string; expiresAtISO?:string;
};

type AuditItem = { atISO:string; username:string; ipMasked:string; tz?:string; ua?:string };

function TabButton({active, children, onClick}:{active:boolean; children:React.ReactNode; onClick:()=>void}){
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-xl border ${active ? 'border-[rgba(59,130,246,.4)] text-[var(--primary)] bg-[rgba(59,130,246,.08)]' : 'border-[var(--border)] text-[var(--muted)]'}`}>
      {children}
    </button>
  );
}

export default function AdminPage(){
  const [tab, setTab] = useState<'users'|'audit'>('users');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [form, setForm] = useState({ username:'', password:'Mahoney#1', role:'sales', expiresAtISO:'' });

  async function loadAll(){
    setLoading(true);
    const [u, a] = await Promise.all([
      fetch('/api/demo/users').then(r=>r.json()).catch(()=>({items:[]})),
      fetch('/api/demo/audit').then(r=>r.json()).catch(()=>({items:[]})),
    ]);
    setUsers(u.items||[]);
    setAudit(a.items||[]);
    setLoading(false);
  }
  useEffect(()=>{ loadAll(); }, []);

  async function addUser(){
    await fetch('/api/demo/users', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form),
    });
    setForm({ username:'', password:'Mahoney#1', role:'sales', expiresAtISO:'' });
    loadAll();
  }
  async function setActive(id:string, v:boolean){
    await fetch('/api/demo/users', {
      method:'PATCH',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ op:'toggle', id, active:v }),
    });
    loadAll();
  }
  async function delUser(id:string){
    await fetch('/api/demo/users?id='+encodeURIComponent(id), { method:'DELETE' });
    loadAll();
  }

  // guard: only admins
  useEffect(()=>{
    const roleCookie = (document.cookie.match(/(?:^|;) ?demo_role=([^;]+)/)?.[1]||'').toLowerCase();
    if (roleCookie !== 'admin') window.location.assign('/');
  }, []);

  return (
    <div className="mx-auto w-full max-w-[920px] px-4 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <TabButton active={tab==='users'} onClick={()=>setTab('users')}>Users</TabButton>
          <TabButton active={tab==='audit'} onClick={()=>setTab('audit')}>Login Activity</TabButton>
        </div>
      </div>

      {tab==='users' && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Create user */}
          <div className="rounded-2xl border border-[var(--border)] p-4">
            <div className="font-semibold mb-2">Create Sales Rep</div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-[var(--muted)]">Username</label>
                <input value={form.username} onChange={e=>setForm(s=>({...s, username:e.target.value}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Password (demo only)</label>
                <input value={form.password} onChange={e=>setForm(s=>({...s, password:e.target.value}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[var(--muted)]">Role</label>
                  <select value={form.role} onChange={e=>setForm(s=>({...s, role:e.target.value}))}
                          className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2">
                    <option value="sales">sales</option>
                    <option value="demo">demo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Expires at (optional)</label>
                  <input type="datetime-local" value={form.expiresAtISO}
                         onChange={e=>setForm(s=>({...s, expiresAtISO:e.target.value}))}
                         className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={addUser}
                        className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white">
                  Create
                </button>
              </div>
            </div>
          </div>

          {/* Users table */}
          <div className="rounded-2xl border border-[var(--border)] p-4 overflow-auto">
            <div className="font-semibold mb-2">Users</div>
            {loading ? <div className="text-sm text-[var(--muted)]">Loading…</div> : (
              <table className="w-full text-sm">
                <thead className="text-[var(--muted)]">
                  <tr><th className="text-left py-2">Username</th><th>Role</th><th>Status</th><th>Expires</th><th></th></tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id} className="border-t border-[var(--border)]">
                      <td className="py-2">{u.username}</td>
                      <td className="text-center">{u.role}</td>
                      <td className="text-center">
                        <span className={`px-2 py-1 rounded-lg text-xs ${u.active?'bg-emerald-600/20 text-emerald-300':'bg-zinc-600/20 text-zinc-300'}`}>
                          {u.active?'active':'disabled'}
                        </span>
                      </td>
                      <td className="text-center">{u.expiresAtISO ? new Date(u.expiresAtISO).toLocaleString() : '-'}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={()=>setActive(u.id, !u.active)}
                                  className="px-2 py-1 rounded-lg border border-[var(--border)]">
                            {u.active?'Disable':'Enable'}
                          </button>
                          {u.role!=='admin' && (
                            <button onClick={()=>delUser(u.id)}
                                    className="px-2 py-1 rounded-lg border border-[var(--border)] text-red-300">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab==='audit' && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] p-4 overflow-auto">
          <div className="font-semibold mb-2">Login Activity</div>
          {loading ? <div className="text-sm text-[var(--muted)]">Loading…</div> : (
            <table className="w-full text-sm">
              <thead className="text-[var(--muted)]">
                <tr><th className="text-left py-2">Time</th><th>User</th><th>IP (masked)</th><th>Approx Location</th><th>Device</th></tr>
              </thead>
              <tbody>
                {audit.map((a,i)=>(
                  <tr key={i} className="border-t border-[var(--border)]">
                    <td className="py-2">{new Date(a.atISO).toLocaleString()}</td>
                    <td>{a.username}</td>
                    <td>{a.ipMasked}</td>
                    <td>{a.tz || '-'}</td>
                    <td className="truncate max-w-[280px]">{a.ua || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
