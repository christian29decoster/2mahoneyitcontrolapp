'use client';
import { useEffect, useMemo, useState } from 'react';

type User = {
  id:string; username:string; role:string;
  active:boolean; createdAtISO:string; expiresAtISO?:string;
};

type AuditItem = { atISO:string; username:string; ipMasked:string; tz?:string; ua?:string };

type PartnerItem = { id: string; name: string; externalId?: string; active: boolean; createdAtISO: string };
type TenantConnectors = { rmm?: { apiUrl?: string; tenantId?: string; label?: string }; sophos?: { tenantId?: string; partnerId?: string; label?: string }; [k: string]: unknown };
type TenantItem = { id: string; name: string; partnerId?: string; connectors: TenantConnectors; active: boolean; createdAtISO: string };

function TabButton({active, children, onClick}:{active:boolean; children:React.ReactNode; onClick:()=>void}){
  return (
    <button onClick={onClick}
      className={`px-3 py-1.5 rounded-xl border ${active ? 'border-[rgba(59,130,246,.4)] text-[var(--primary)] bg-[rgba(59,130,246,.08)]' : 'border-[var(--border)] text-[var(--muted)]'}`}>
      {children}
    </button>
  );
}

export default function AdminPage(){
  const [tab, setTab] = useState<'users'|'audit'|'partners'|'tenants'|'settings'>('users');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [audit, setAudit] = useState<AuditItem[]>([]);
  const [form, setForm] = useState({ username:'', password:'Mahoney#1', role:'sales', expiresAtISO:'' });

  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [partnerForm, setPartnerForm] = useState<{ id: string; name: string; externalId: string; active: boolean }>({ id: '', name: '', externalId: '', active: true });
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);

  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [tenantsLoading, setTenantsLoading] = useState(false);
  const [tenantForm, setTenantForm] = useState<{ id: string; name: string; partnerId: string; active: boolean; connectors: TenantConnectors }>({
    id: '', name: '', partnerId: '', active: true,
    connectors: { rmm: {}, sophos: {} },
  });
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);

  type SettingsForm = { appName: string; sessionDurationMinutes: number; defaultRoleForNewUsers: string; adminNotice: string; logoDataUrl: string };
  const [settings, setSettings] = useState<SettingsForm>({ appName: '', sessionDurationMinutes: 30, defaultRoleForNewUsers: 'demo', adminNotice: '', logoDataUrl: '' });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  async function loadAll(){
    setLoading(true);
    try {
      const [u, a] = await Promise.all([
        fetch('/api/demo/users').then(r=>r.json()).catch(()=>({items:[]})),
        fetch('/api/demo/audit').then(r=>r.json()).catch(()=>({items:[]})),
      ]);
      
      console.log('Users response:', u);
      console.log('Audit response:', a);
      
      setUsers(u.items||[]);
      setAudit(a.items||[]);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{ loadAll(); }, []);

  async function loadPartners() {
    setPartnersLoading(true);
    try {
      const r = await fetch('/api/partners');
      if (!r.ok) throw new Error('forbidden');
      const j = await r.json();
      setPartners(j.items ?? []);
    } catch {
      setPartners([]);
    } finally {
      setPartnersLoading(false);
    }
  }
  async function loadTenants() {
    setTenantsLoading(true);
    try {
      const r = await fetch('/api/tenants');
      if (!r.ok) throw new Error('forbidden');
      const j = await r.json();
      setTenants(j.items ?? []);
    } catch {
      setTenants([]);
    } finally {
      setTenantsLoading(false);
    }
  }
  useEffect(() => { if (tab === 'partners') loadPartners(); }, [tab]);
  useEffect(() => { if (tab === 'tenants') loadTenants(); }, [tab]);

  async function loadSettings() {
    setSettingsLoading(true);
    try {
      const r = await fetch('/api/demo/settings');
      if (!r.ok) return;
      const j = await r.json();
      setSettings({
        appName: j.appName ?? '',
        sessionDurationMinutes: j.sessionDurationMinutes ?? 30,
        defaultRoleForNewUsers: j.defaultRoleForNewUsers ?? 'demo',
        adminNotice: j.adminNotice ?? '',
        logoDataUrl: j.logoDataUrl ?? '',
      });
    } finally {
      setSettingsLoading(false);
    }
  }
  const MAX_LOGO_BYTES = 300 * 1024; // 300 KB
  function handleLogoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) { alert('Bitte ein Bild wählen (PNG, JPG, SVG).'); return; }
    if (file.size > MAX_LOGO_BYTES) { alert(`Logo max. ${MAX_LOGO_BYTES / 1024} KB.`); return; }
    const reader = new FileReader();
    reader.onload = () => { setSettings(s => ({ ...s, logoDataUrl: (reader.result as string) ?? '' })); };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
  useEffect(() => { if (tab === 'settings') loadSettings(); }, [tab]);

  async function saveSettings() {
      setSettingsSaving(true);
    try {
      const r = await fetch('/api/demo/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...settings, logoDataUrl: settings.logoDataUrl || undefined }) });
      if (!r.ok) { alert('Speichern fehlgeschlagen'); return; }
      await loadSettings();
    } finally {
      setSettingsSaving(false);
    }
  }

  async function savePartner() {
    if (!partnerForm.name.trim()) { alert('Name erforderlich'); return; }
    try {
      if (editingPartnerId) {
        const res = await fetch(`/api/partners/${editingPartnerId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: partnerForm.name, externalId: partnerForm.externalId || undefined, active: partnerForm.active }) });
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Fehler'); return; }
        setEditingPartnerId(null);
      } else {
        const res = await fetch('/api/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: partnerForm.id || undefined, name: partnerForm.name, externalId: partnerForm.externalId || undefined, active: partnerForm.active }) });
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Fehler'); return; }
      }
      setPartnerForm({ id: '', name: '', externalId: '', active: true });
      await loadPartners();
    } catch (err) { console.error(err); alert('Fehler beim Speichern'); }
  }
  function startEditPartner(p: PartnerItem) {
    setEditingPartnerId(p.id);
    setPartnerForm({ id: p.id, name: p.name, externalId: p.externalId ?? '', active: p.active });
  }

  async function saveTenant() {
    if (!tenantForm.name.trim()) { alert('Name erforderlich'); return; }
    try {
      if (editingTenantId) {
        const res = await fetch(`/api/tenants/${editingTenantId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: tenantForm.name, partnerId: tenantForm.partnerId || undefined, active: tenantForm.active, connectors: tenantForm.connectors }) });
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Fehler'); return; }
        setEditingTenantId(null);
      } else {
        const res = await fetch('/api/tenants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: tenantForm.id || undefined, name: tenantForm.name, partnerId: tenantForm.partnerId || undefined, active: tenantForm.active, connectors: tenantForm.connectors }) });
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Fehler'); return; }
      }
      setTenantForm({ id: '', name: '', partnerId: '', active: true, connectors: { rmm: {}, sophos: {} } });
      await loadTenants();
    } catch (err) { console.error(err); alert('Fehler beim Speichern'); }
  }
  function clearLogo() { setSettings(s => ({ ...s, logoDataUrl: '' })); }
  function startEditTenant(t: TenantItem) {
    setEditingTenantId(t.id);
    setTenantForm({ id: t.id, name: t.name, partnerId: t.partnerId ?? '', active: t.active, connectors: { ...t.connectors } });
  }
  async function deleteTenant(id: string) {
    if (!confirm('Tenant wirklich deaktivieren/entfernen?')) return;
    try {
      const res = await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
      if (res.ok) await loadTenants(); else alert((await res.json()).error || 'Fehler');
    } catch (err) { console.error(err); alert('Fehler'); }
  }

  async function addUser(){
    if (!form.username.trim()) {
      alert('Username is required');
      return;
    }
    
    try {
      const response = await fetch('/api/demo/users', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      
      if (response.ok) {
        setForm({ username:'', password:'Mahoney#1', role:'sales', expiresAtISO:'' });
        await loadAll();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create user'}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  }
  async function setActive(id:string, v:boolean){
    try {
      const response = await fetch('/api/demo/users', {
        method:'PATCH',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ op:'toggle', id, active:v }),
      });
      
      if (response.ok) {
        await loadAll();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update user'}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    }
  }
  
  async function delUser(id:string){
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/demo/users?id=${encodeURIComponent(id)}`, {
        method:'DELETE',
      });
      
      if (response.ok) {
        await loadAll();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete user'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  }

  const [currentRole, setCurrentRole] = useState('');
  const isSuperAdmin = currentRole === 'superadmin';

  useEffect(() => {
    const role = (document.cookie.match(/(?:^|;) ?demo_role=([^;]+)/)?.[1] || '').toLowerCase();
    setCurrentRole(role);
    if (!['admin', 'superadmin'].includes(role)) {
      window.location.assign('/');
    }
  }, []);

  return (
    <div className="mx-auto w-full max-w-[920px] px-4 py-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2 flex-wrap">
          <TabButton active={tab==='users'} onClick={()=>setTab('users')}>Users</TabButton>
          <TabButton active={tab==='audit'} onClick={()=>setTab('audit')}>Login Activity</TabButton>
          <TabButton active={tab==='partners'} onClick={()=>setTab('partners')}>Partner</TabButton>
          <TabButton active={tab==='tenants'} onClick={()=>setTab('tenants')}>Tenants</TabButton>
          <TabButton active={tab==='settings'} onClick={()=>setTab('settings')}>Einstellungen</TabButton>
        </div>
      </div>
      {currentRole === 'superadmin' && (
        <p className="text-xs text-[var(--muted)] mt-1">SuperAdmin: Passwort und Löschen anderer SuperAdmins nur durch Sie änderbar.</p>
      )}

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
                    {isSuperAdmin && <option value="superadmin">superadmin</option>}
                    <option value="admin">admin</option>
                    <option value="partner">partner</option>
                    <option value="tenant_user">tenant_user</option>
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
                        <div className="flex justify-end gap-2 items-center">
                          {u.role === 'superadmin' && <span className="text-xs text-amber-400">geschützt</span>}
                          <button onClick={()=>setActive(u.id, !u.active)}
                                  disabled={u.role === 'superadmin' && !isSuperAdmin}
                                  className="px-2 py-1 rounded-lg border border-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed">
                            {u.active?'Disable':'Enable'}
                          </button>
                          {(u.role !== 'admin' && u.role !== 'superadmin') || (u.role === 'superadmin' && isSuperAdmin) ? (
                            <button onClick={()=>delUser(u.id)}
                                    className="px-2 py-1 rounded-lg border border-[var(--border)] text-red-300">
                              Delete
                            </button>
                          ) : null}
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

      {tab==='partners' && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--border)] p-4">
            <div className="font-semibold mb-2">{editingPartnerId ? 'Partner bearbeiten' : 'Partner anlegen'}</div>
            <div className="space-y-2">
              {!editingPartnerId && (
                <div>
                  <label className="text-xs text-[var(--muted)]">ID (optional)</label>
                  <input value={partnerForm.id} onChange={e=>setPartnerForm(s=>({...s, id:e.target.value}))}
                         className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2" placeholder="z.B. partner-1"/>
                </div>
              )}
              <div>
                <label className="text-xs text-[var(--muted)]">Name</label>
                <input value={partnerForm.name} onChange={e=>setPartnerForm(s=>({...s, name:e.target.value}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Externe ID (z.B. Sophos Partner-ID)</label>
                <input value={partnerForm.externalId} onChange={e=>setPartnerForm(s=>({...s, externalId:e.target.value}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={partnerForm.active} onChange={e=>setPartnerForm(s=>({...s, active:e.target.checked}))}/>
                <span className="text-sm">Aktiv</span>
              </label>
              <div className="flex gap-2">
                <button onClick={savePartner} className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white">
                  {editingPartnerId ? 'Speichern' : 'Anlegen'}
                </button>
                {editingPartnerId && (
                  <button onClick={()=>{ setEditingPartnerId(null); setPartnerForm({ id: '', name: '', externalId: '', active: true }); }} className="px-4 py-2 rounded-xl border border-[var(--border)]">Abbrechen</button>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-4 overflow-auto">
            <div className="font-semibold mb-2">Partner</div>
            {partnersLoading ? <div className="text-sm text-[var(--muted)]">Laden…</div> : (
              <table className="w-full text-sm">
                <thead className="text-[var(--muted)]"><tr><th className="text-left py-2">ID</th><th>Name</th><th>Externe ID</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {partners.map(p=>(
                    <tr key={p.id} className="border-t border-[var(--border)]">
                      <td className="py-2">{p.id}</td>
                      <td>{p.name}</td>
                      <td>{p.externalId ?? '-'}</td>
                      <td><span className={`px-2 py-1 rounded-lg text-xs ${p.active?'bg-emerald-600/20 text-emerald-300':'bg-zinc-600/20 text-zinc-300'}`}>{p.active?'aktiv':'inaktiv'}</span></td>
                      <td><button onClick={()=>startEditPartner(p)} className="px-2 py-1 rounded-lg border border-[var(--border)]">Bearbeiten</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab==='tenants' && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[var(--border)] p-4 overflow-auto">
            <div className="font-semibold mb-2">{editingTenantId ? 'Tenant bearbeiten' : 'Tenant anlegen'}</div>
            <div className="space-y-2">
              {!editingTenantId && (
                <div>
                  <label className="text-xs text-[var(--muted)]">ID (optional)</label>
                  <input value={tenantForm.id} onChange={e=>setTenantForm(s=>({...s, id:e.target.value}))}
                         className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2" placeholder="z.B. tenant-1"/>
                </div>
              )}
              <div>
                <label className="text-xs text-[var(--muted)]">Name</label>
                <input value={tenantForm.name} onChange={e=>setTenantForm(s=>({...s, name:e.target.value}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Partner-ID</label>
                <input value={tenantForm.partnerId} onChange={e=>setTenantForm(s=>({...s, partnerId:e.target.value}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2" placeholder="Leer = Mahoney"/>
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={tenantForm.active} onChange={e=>setTenantForm(s=>({...s, active:e.target.checked}))}/>
                <span className="text-sm">Aktiv</span>
              </label>
              <div className="text-xs font-medium text-[var(--muted)] mt-2">Konnektoren (RMM / Sophos)</div>
              <div className="rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3 space-y-3">
                <div>
                  <span className="text-xs text-[var(--muted)]">RMM (Datto)</span>
                  <input value={tenantForm.connectors?.rmm?.apiUrl ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, rmm: { ...s.connectors?.rmm, apiUrl: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="API-URL"/>
                  <input value={tenantForm.connectors?.rmm?.tenantId ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, rmm: { ...s.connectors?.rmm, tenantId: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="Tenant-ID"/>
                  <input value={tenantForm.connectors?.rmm?.label ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, rmm: { ...s.connectors?.rmm, label: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="Label"/>
                </div>
                <div>
                  <span className="text-xs text-[var(--muted)]">Sophos</span>
                  <input value={tenantForm.connectors?.sophos?.tenantId ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, sophos: { ...s.connectors?.sophos, tenantId: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="Tenant-ID"/>
                  <input value={tenantForm.connectors?.sophos?.partnerId ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, sophos: { ...s.connectors?.sophos, partnerId: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="Partner-ID"/>
                  <input value={tenantForm.connectors?.sophos?.label ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, sophos: { ...s.connectors?.sophos, label: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="Label"/>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={saveTenant} className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white">
                  {editingTenantId ? 'Speichern' : 'Anlegen'}
                </button>
                {editingTenantId && (
                  <button onClick={()=>{ setEditingTenantId(null); setTenantForm({ id: '', name: '', partnerId: '', active: true, connectors: { rmm: {}, sophos: {} } }); }} className="px-4 py-2 rounded-xl border border-[var(--border)]">Abbrechen</button>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] p-4 overflow-auto">
            <div className="font-semibold mb-2">Tenants</div>
            {tenantsLoading ? <div className="text-sm text-[var(--muted)]">Laden…</div> : (
              <table className="w-full text-sm">
                <thead className="text-[var(--muted)]"><tr><th className="text-left py-2">ID</th><th>Name</th><th>Partner</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {tenants.map(t=>(
                    <tr key={t.id} className="border-t border-[var(--border)]">
                      <td className="py-2">{t.id}</td>
                      <td>{t.name}</td>
                      <td>{t.partnerId ?? '-'}</td>
                      <td><span className={`px-2 py-1 rounded-lg text-xs ${t.active?'bg-emerald-600/20 text-emerald-300':'bg-zinc-600/20 text-zinc-300'}`}>{t.active?'aktiv':'inaktiv'}</span></td>
                      <td>
                        <button onClick={()=>startEditTenant(t)} className="px-2 py-1 rounded-lg border border-[var(--border)] mr-1">Bearbeiten</button>
                        <button onClick={()=>deleteTenant(t.id)} className="px-2 py-1 rounded-lg border border-[var(--border)] text-red-300">Löschen</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {tab==='settings' && (
        <div className="mt-4 rounded-2xl border border-[var(--border)] p-4 max-w-xl">
          <div className="font-semibold mb-2">App-Parameter &amp; Einstellungen</div>
          <p className="text-xs text-[var(--muted)] mb-4">Steuern Sie Anzeigename, Session-Dauer und Standard-Rolle. (Demo: In-Memory; Produktion später über DB/Env.)</p>
          {settingsLoading ? (
            <div className="text-sm text-[var(--muted)]">Laden…</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted)]">App-Name (Anzeige)</label>
                <input value={settings.appName} onChange={e=>setSettings(s=>({...s, appName:e.target.value}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Session-Dauer (Minuten)</label>
                <input type="number" min={5} max={1440} value={settings.sessionDurationMinutes}
                       onChange={e=>setSettings(s=>({...s, sessionDurationMinutes:Number(e.target.value)||30}))}
                       className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Standard-Rolle für neue User</label>
                <select value={settings.defaultRoleForNewUsers} onChange={e=>setSettings(s=>({...s, defaultRoleForNewUsers:e.target.value}))}
                        className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2">
                  <option value="demo">demo</option>
                  <option value="sales">sales</option>
                  <option value="admin">admin</option>
                  <option value="partner">partner</option>
                  <option value="tenant_user">tenant_user</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Logo für Anmeldeseite (optional, max. 300 KB)</label>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <input type="file" accept="image/*" onChange={handleLogoFile}
                         className="text-sm text-[var(--muted)] file:mr-2 file:rounded-lg file:border file:border-[var(--border)] file:bg-[var(--surface-2)] file:px-3 file:py-1.5 file:text-sm"/>
                  {settings.logoDataUrl && (
                    <>
                      <img src={settings.logoDataUrl} alt="Logo" className="h-12 object-contain rounded border border-[var(--border)]"/>
                      <button type="button" onClick={clearLogo} className="text-xs text-red-400 hover:underline">Entfernen</button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Admin-Hinweis (optional, z. B. für Wartung)</label>
                <textarea value={settings.adminNotice} onChange={e=>setSettings(s=>({...s, adminNotice:e.target.value}))}
                          rows={2} className="w-full mt-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2"/>
              </div>
              <button onClick={saveSettings} disabled={settingsSaving}
                      className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white disabled:opacity-50">
                {settingsSaving ? 'Speichern…' : 'Einstellungen speichern'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
