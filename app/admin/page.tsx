'use client';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { Users, Activity, Building2, Layers, CreditCard, Settings, Shield, UserPlus } from 'lucide-react';

type User = {
  id:string; username:string; role:string;
  active:boolean; createdAtISO:string; expiresAtISO?:string;
};

type AuditItem = { atISO:string; username:string; ipMasked:string; tz?:string; ua?:string };

type PartnerItem = { id: string; name: string; externalId?: string; active: boolean; createdAtISO: string };
type TenantConnectors = { rmm?: { apiUrl?: string; tenantId?: string; label?: string }; sophos?: { tenantId?: string; partnerId?: string; label?: string }; [k: string]: unknown };
type TenantItem = { id: string; name: string; partnerId?: string; connectors: TenantConnectors; active: boolean; createdAtISO: string };

const TABS = [
  { id: 'users' as const, label: 'Users', icon: Users },
  { id: 'audit' as const, label: 'Login Activity', icon: Activity },
  { id: 'partners' as const, label: 'Partners', icon: Building2 },
  { id: 'tenants' as const, label: 'Tenants', icon: Layers },
  { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
] as const;

export default function AdminPage(){
  const [tab, setTab] = useState<'users'|'audit'|'partners'|'tenants'|'billing'|'settings'>('users');
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
    connectors: { rmm: {}, sophos: {}, autotask: {} },
  });
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);
  type AutotaskCompanyItem = { id: number; companyName?: string };
  const [autotaskCompanies, setAutotaskCompanies] = useState<AutotaskCompanyItem[]>([]);
  const [autotaskCompaniesLoading, setAutotaskCompaniesLoading] = useState(false);
  const [autotaskCompaniesError, setAutotaskCompaniesError] = useState<string | null>(null);
  const [importAutotaskLoading, setImportAutotaskLoading] = useState(false);
  const [importAutotaskResult, setImportAutotaskResult] = useState<{ imported: number; skipped: number } | null>(null);

  type SettingsForm = { appName: string; sessionDurationMinutes: number; defaultRoleForNewUsers: string; adminNotice: string; logoDataUrl: string };
  const [settings, setSettings] = useState<SettingsForm>({ appName: '', sessionDurationMinutes: 30, defaultRoleForNewUsers: 'demo', adminNotice: '', logoDataUrl: '' });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  type BillingItem = { id: string; title: string; status: string; source?: string; loggedAtISO: string; tenantId?: string; eventLog?: Array<{ atISO: string; message: string; source?: string }> };
  type CostRefs = {
    marketplaceLink: string; schwellwertEvents?: number;
    mdu: { name: string; description?: string; tiers: { label: string; perThousandUsd: number }[] };
    socTiers: { id: string; name: string; price: string }[];
    claude?: {
      customerName: string;
      marginPercent: number;
      source: string;
      reference: { model: string; inputUsdPerM: number; outputUsdPerM: number; marginPercent: number; customerInputUsdPerM: number; customerOutputUsdPerM: number; source: string }[];
      typicalCopilotRequest: { apiCostUsd: number; customerPriceUsd: number; marginPercent: number; model: string; summary: string };
    };
  };
  type MonthlyTotal = { month: string; label: string; incidentsCount: number; eventsCount: number; thresholdExceeded: boolean; thresholdEvents: number; mduCostUsd: number; mduSummary: string };
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [billingMonthlyTotals, setBillingMonthlyTotals] = useState<MonthlyTotal[]>([]);
  const [billingCostRefs, setBillingCostRefs] = useState<CostRefs | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingExpandedId, setBillingExpandedId] = useState<string | null>(null);
  const [billingCopyDone, setBillingCopyDone] = useState(false);

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
  useEffect(() => { loadPartners(); }, []);
  useEffect(() => { loadTenants(); }, []);
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
    if (!file || !file.type.startsWith('image/')) { alert('Please choose an image (PNG, JPG, SVG).'); return; }
    if (file.size > MAX_LOGO_BYTES) { alert(`Logo max. ${MAX_LOGO_BYTES / 1024} KB.`); return; }
    const reader = new FileReader();
    reader.onload = () => { setSettings(s => ({ ...s, logoDataUrl: (reader.result as string) ?? '' })); };
    reader.readAsDataURL(file);
    e.target.value = '';
  }
  useEffect(() => { if (tab === 'settings') loadSettings(); }, [tab]);

  async function loadBilling() {
    setBillingLoading(true);
    try {
      const r = await fetch('/api/admin/billing');
      if (!r.ok) { setBillingItems([]); setBillingCostRefs(null); return; }
      const j = await r.json();
      setBillingItems(j.items ?? []);
      setBillingMonthlyTotals(j.monthlyTotals ?? []);
      setBillingCostRefs(j.costRefs ?? null);
    } catch {
      setBillingItems([]);
      setBillingMonthlyTotals([]);
      setBillingCostRefs(null);
    } finally {
      setBillingLoading(false);
    }
  }
  useEffect(() => { if (tab === 'billing') loadBilling(); }, [tab]);

  async function saveSettings() {
      setSettingsSaving(true);
    try {
      const r = await fetch('/api/demo/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...settings, logoDataUrl: settings.logoDataUrl || undefined }) });
      if (!r.ok) { alert('Save failed'); return; }
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
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Error'); return; }
        setEditingPartnerId(null);
      } else {
        const res = await fetch('/api/partners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: partnerForm.id || undefined, name: partnerForm.name, externalId: partnerForm.externalId || undefined, active: partnerForm.active }) });
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Error'); return; }
      }
      setPartnerForm({ id: '', name: '', externalId: '', active: true });
      await loadPartners();
    } catch (err) { console.error(err); alert('Error saving'); }
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
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Error'); return; }
        setEditingTenantId(null);
      } else {
        const res = await fetch('/api/tenants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: tenantForm.id || undefined, name: tenantForm.name, partnerId: tenantForm.partnerId || undefined, active: tenantForm.active, connectors: tenantForm.connectors }) });
        if (!res.ok) { const e = await res.json(); alert(e.error || 'Error'); return; }
      }
      setTenantForm({ id: '', name: '', partnerId: '', active: true, connectors: { rmm: {}, sophos: {}, autotask: {} } });
      await loadTenants();
    } catch (err) { console.error(err); alert('Error saving'); }
  }
  function clearLogo() { setSettings(s => ({ ...s, logoDataUrl: '' })); }
  function startEditTenant(t: TenantItem) {
    setEditingTenantId(t.id);
    setTenantForm({ id: t.id, name: t.name, partnerId: t.partnerId ?? '', active: t.active, connectors: { ...t.connectors } });
  }
  async function deleteTenant(id: string) {
    if (!confirm('Really deactivate or remove this tenant?')) return;
    try {
      const res = await fetch(`/api/tenants/${id}`, { method: 'DELETE' });
      if (res.ok) await loadTenants(); else alert((await res.json()).error || 'Error');
    } catch (err) { console.error(err); alert('Error'); }
  }

  async function loadAutotaskCompanies() {
    setAutotaskCompaniesLoading(true);
    setAutotaskCompaniesError(null);
    try {
      const res = await fetch('/api/companies/autotask');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAutotaskCompaniesError(data.error === 'forbidden' ? 'No permission' : (data.error || `Error ${res.status}`));
        setAutotaskCompanies([]);
        return;
      }
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      setAutotaskCompanies(items);
      if (items.length === 0) setAutotaskCompaniesError('No companies loaded. In Autotask: check API user permission for Companies (View); check zone (webservices3 vs. webservices4) and env vars in Vercel.');
    } catch (err) {
      setAutotaskCompaniesError('Netzwerkfehler');
      setAutotaskCompanies([]);
    } finally {
      setAutotaskCompaniesLoading(false);
    }
  }

  async function importAutotaskCompanies() {
    setImportAutotaskLoading(true);
    setImportAutotaskResult(null);
    try {
      const res = await fetch('/api/tenants/import-autotask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data.error || `Error ${res.status}`);
        return;
      }
      setImportAutotaskResult({ imported: data.imported ?? 0, skipped: data.skipped ?? 0 });
      await loadTenants();
    } catch (err) {
      console.error(err);
      alert('Import fehlgeschlagen');
    } finally {
      setImportAutotaskLoading(false);
    }
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
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--muted)] mt-1">Manage users, partners, tenants, billing, and app settings.</p>
        {currentRole === 'superadmin' && (
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-400/90">
            <Shield size={14} className="shrink-0" />
            <span>SuperAdmin: Only you can change passwords and delete other SuperAdmins.</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="p-3">
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Users</div>
          <div className="text-xl font-semibold text-[var(--text)] mt-0.5">{users.length}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">{users.filter(u=>u.active).length} active</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Login activity</div>
          <div className="text-xl font-semibold text-[var(--text)] mt-0.5">{audit.length}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">last 30 days</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Partners</div>
          <div className="text-xl font-semibold text-[var(--text)] mt-0.5">{partners.length}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">{partners.filter(p=>p.active).length} active</div>
        </Card>
        <Card className="p-3">
          <div className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide">Tenants</div>
          <div className="text-xl font-semibold text-[var(--text)] mt-0.5">{tenants.length}</div>
          <div className="text-[10px] text-[var(--muted)] mt-0.5">{tenants.filter(t=>t.active).length} active</div>
        </Card>
      </div>

      <nav className="flex flex-wrap gap-1 p-1 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] mb-6 w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${tab === id ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]'}`}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {tab==='users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">Create user</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">Add a new user (sales rep, partner, tenant user, or admin).</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Username</label>
                <input value={form.username} onChange={e=>setForm(s=>({...s, username:e.target.value}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)]" placeholder="e.g. sales.jane"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Password (demo only)</label>
                <input value={form.password} onChange={e=>setForm(s=>({...s, password:e.target.value}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Role</label>
                  <select value={form.role} onChange={e=>setForm(s=>({...s, role:e.target.value}))}
                          className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]">
                    {isSuperAdmin && <option value="superadmin">superadmin</option>}
                    <option value="admin">admin</option>
                    <option value="partner">partner</option>
                    <option value="tenant_user">tenant_user</option>
                    <option value="sales">sales</option>
                    <option value="demo">demo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">Expires at (optional)</label>
                  <input type="datetime-local" value={form.expiresAtISO}
                         onChange={e=>setForm(s=>({...s, expiresAtISO:e.target.value}))}
                         className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"/>
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button onClick={addUser}
                        className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity">
                  Create user
                </button>
              </div>
            </div>
          </Card>

          <Card className="p-5 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">Users</h2>
            </div>
            {loading ? <div className="text-sm text-[var(--muted)] py-4">Loading…</div> : (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-2)]">
                    <tr>
                      <th className="text-left py-3 px-3 font-medium text-[var(--muted)]">Username</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Role</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Status</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Expires</th>
                      <th className="text-right py-3 px-3 font-medium text-[var(--muted)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {users.map(u=>(
                      <tr key={u.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-[var(--text)]">{u.username}</td>
                        <td className="py-3 px-3 text-[var(--text)]">{u.role}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${u.active?'bg-emerald-500/20 text-emerald-400':'bg-zinc-500/20 text-zinc-400'}`}>
                            {u.active?'Active':'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[var(--muted)]">{u.expiresAtISO ? new Date(u.expiresAtISO).toLocaleString() : '—'}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            {u.role === 'superadmin' && <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">Protected</span>}
                            <button onClick={()=>setActive(u.id, !u.active)}
                                    disabled={u.role === 'superadmin' && !isSuperAdmin}
                                    className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium">
                              {u.active?'Disable':'Enable'}
                            </button>
                            {(u.role !== 'admin' && u.role !== 'superadmin') || (u.role === 'superadmin' && isSuperAdmin) ? (
                              <button onClick={()=>delUser(u.id)}
                                      className="px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium">
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab==='audit' && (
        <Card className="p-5 overflow-auto">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={20} className="text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text)]">Login Activity</h2>
          </div>
          <p className="text-xs text-[var(--muted)] mb-4">Recent sign-ins with masked IP, timezone, and device info.</p>
          {loading ? <div className="text-sm text-[var(--muted)] py-4">Loading…</div> : (
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    <th className="text-left py-3 px-3 font-medium text-[var(--muted)]">Time</th>
                    <th className="py-3 px-3 font-medium text-[var(--muted)]">User</th>
                    <th className="py-3 px-3 font-medium text-[var(--muted)]">IP (masked)</th>
                    <th className="py-3 px-3 font-medium text-[var(--muted)]">Location</th>
                    <th className="py-3 px-3 font-medium text-[var(--muted)]">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {audit.map((a,i)=>(
                    <tr key={i} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                      <td className="py-3 px-3 text-[var(--text)]">{new Date(a.atISO).toLocaleString()}</td>
                      <td className="py-3 px-3 font-medium text-[var(--text)]">{a.username}</td>
                      <td className="py-3 px-3 text-[var(--muted)]">{a.ipMasked}</td>
                      <td className="py-3 px-3 text-[var(--muted)]">{a.tz || '—'}</td>
                      <td className="py-3 px-3 text-[var(--muted)] truncate max-w-[280px]">{a.ua || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {tab==='partners' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">{editingPartnerId ? 'Edit partner' : 'Add partner'}</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">Partners can own multiple tenants. Link external IDs (e.g. Sophos Partner ID) for API mapping.</p>
            <div className="space-y-3">
              {!editingPartnerId && (
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">ID (optional)</label>
                  <input value={partnerForm.id} onChange={e=>setPartnerForm(s=>({...s, id:e.target.value}))}
                         className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]" placeholder="e.g. partner-1"/>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Name</label>
                <input value={partnerForm.name} onChange={e=>setPartnerForm(s=>({...s, name:e.target.value}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]" placeholder="Partner name"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">External ID (e.g. Sophos Partner ID)</label>
                <input value={partnerForm.externalId} onChange={e=>setPartnerForm(s=>({...s, externalId:e.target.value}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"/>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={partnerForm.active} onChange={e=>setPartnerForm(s=>({...s, active:e.target.checked}))} className="rounded border-[var(--border)]"/>
                <span className="text-sm text-[var(--text)]">Active</span>
              </label>
              <div className="flex gap-2 pt-1">
                <button onClick={savePartner} className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90">
                  {editingPartnerId ? 'Save' : 'Add partner'}
                </button>
                {editingPartnerId && (
                  <button onClick={()=>{ setEditingPartnerId(null); setPartnerForm({ id: '', name: '', externalId: '', active: true }); }} className="px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]">Cancel</button>
                )}
              </div>
            </div>
          </Card>
          <Card className="p-5 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">Partners</h2>
            </div>
            {partnersLoading ? <div className="text-sm text-[var(--muted)] py-4">Loading…</div> : (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-2)]">
                    <tr>
                      <th className="text-left py-3 px-3 font-medium text-[var(--muted)]">ID</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Name</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">External ID</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Status</th>
                      <th className="text-right py-3 px-3 font-medium text-[var(--muted)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {partners.map(p=>(
                      <tr key={p.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-[var(--text)]">{p.id}</td>
                        <td className="py-3 px-3 text-[var(--text)]">{p.name}</td>
                        <td className="py-3 px-3 text-[var(--muted)]">{p.externalId ?? '—'}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${p.active?'bg-emerald-500/20 text-emerald-400':'bg-zinc-500/20 text-zinc-400'}`}>{p.active?'Active':'Inactive'}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button onClick={()=>startEditPartner(p)} className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] text-xs font-medium">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab==='tenants' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">{editingTenantId ? 'Edit tenant' : 'Add tenant'}</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">Tenants are customers or organizations. Assign partners and configure RMM, Sophos, and Autotask connectors.</p>
            <div className="space-y-3">
              {!editingTenantId && (
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-1">ID (optional)</label>
                  <input value={tenantForm.id} onChange={e=>setTenantForm(s=>({...s, id:e.target.value}))}
                         className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]" placeholder="e.g. tenant-1"/>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Name</label>
                <input value={tenantForm.name} onChange={e=>setTenantForm(s=>({...s, name:e.target.value}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Partner ID</label>
                <input value={tenantForm.partnerId} onChange={e=>setTenantForm(s=>({...s, partnerId:e.target.value}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]" placeholder="Empty = Mahoney"/>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={tenantForm.active} onChange={e=>setTenantForm(s=>({...s, active:e.target.checked}))} className="rounded border-[var(--border)]"/>
                <span className="text-sm text-[var(--text)]">Active</span>
              </label>
              <div className="text-xs font-medium text-[var(--muted)] pt-2 border-t border-[var(--border)]">Connectors (RMM / Sophos / Autotask)</div>
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
                <div>
                  <span className="text-xs text-[var(--muted)]">Autotask PSA (map company)</span>
                  <div className="flex gap-2 mt-1">
                    <button type="button" onClick={loadAutotaskCompanies} disabled={autotaskCompaniesLoading}
                            className="px-2 py-1 rounded-lg border border-[var(--border)] text-sm bg-[var(--surface-2)] hover:bg-[var(--surface)] disabled:opacity-50">
                      {autotaskCompaniesLoading ? 'Loading…' : 'Load companies from Autotask'}
                    </button>
                  </div>
                  {autotaskCompaniesError && <p className="text-xs text-amber-400 mt-1">{autotaskCompaniesError}</p>}
                  {autotaskCompanies.length > 0 && (
                    <select value={(tenantForm.connectors as Record<string,{ companyId?: string }|undefined>)?.autotask?.companyId ?? ''}
                            onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, autotask: { ...(s.connectors as Record<string,{ companyId?: string; label?: string }|undefined>)?.autotask, companyId: e.target.value } } }))}
                            className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1.5 text-sm bg-[var(--surface-2)]">
                      <option value="">— No Autotask company —</option>
                      {autotaskCompanies.map(c=>(
                        <option key={c.id} value={String(c.id)}>{(c as { companyName?: string; CompanyName?: string }).companyName ?? (c as { CompanyName?: string }).CompanyName ?? `Company ${c.id}`}</option>
                      ))}
                    </select>
                  )}
                  <input value={(tenantForm.connectors as Record<string,{ companyId?: string; label?: string }|undefined>)?.autotask?.companyId ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, autotask: { ...(s.connectors as Record<string,{ companyId?: string; label?: string }|undefined>)?.autotask, companyId: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="Or enter company ID manually"/>
                  <input value={(tenantForm.connectors as Record<string,{ companyId?: string; label?: string }|undefined>)?.autotask?.label ?? ''} onChange={e=>setTenantForm(s=>({...s, connectors: { ...s.connectors, autotask: { ...(s.connectors as Record<string,{ companyId?: string; label?: string }|undefined>)?.autotask, label: e.target.value } } }))}
                         className="w-full mt-1 rounded-lg border border-[var(--border)] px-2 py-1 text-sm" placeholder="Label (optional)"/>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={saveTenant} className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90">
                  {editingTenantId ? 'Save' : 'Add tenant'}
                </button>
                {editingTenantId && (
                  <button onClick={()=>{ setEditingTenantId(null); setTenantForm({ id: '', name: '', partnerId: '', active: true, connectors: { rmm: {}, sophos: {}, autotask: {} } }); }} className="px-4 py-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]">Cancel</button>
                )}
              </div>
            </div>
          </Card>
          <Card className="p-5 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">Tenants</h2>
            </div>
            <div className="mb-4 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              <div className="text-xs font-medium text-[var(--muted)] mb-2">Import Autotask customers</div>
              <p className="text-xs text-[var(--muted)] mb-2">Creates a new tenant per Autotask company. Existing mappings are skipped.</p>
              <button type="button" onClick={importAutotaskCompanies} disabled={importAutotaskLoading}
                      className="px-3 py-1.5 rounded-lg border border-[var(--primary)]/40 text-sm bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 disabled:opacity-50 font-medium">
                {importAutotaskLoading ? 'Importing…' : 'Import from Autotask'}
              </button>
              {importAutotaskResult && (
                <p className="text-xs mt-2 text-[var(--text)]">
                  {importAutotaskResult.imported} imported, {importAutotaskResult.skipped} already present.
                </p>
              )}
            </div>
            {tenantsLoading ? <div className="text-sm text-[var(--muted)] py-4">Loading…</div> : (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-2)]">
                    <tr>
                      <th className="text-left py-3 px-3 font-medium text-[var(--muted)]">ID</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Name</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Partner</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Status</th>
                      <th className="text-right py-3 px-3 font-medium text-[var(--muted)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {tenants.map(t=>(
                      <tr key={t.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-[var(--text)]">{t.id}</td>
                        <td className="py-3 px-3 text-[var(--text)]">{t.name}</td>
                        <td className="py-3 px-3 text-[var(--muted)]">{t.partnerId ?? '—'}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium ${t.active?'bg-emerald-500/20 text-emerald-400':'bg-zinc-500/20 text-zinc-400'}`}>{t.active?'Active':'Inactive'}</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button onClick={()=>startEditTenant(t)} className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] text-xs font-medium mr-1">Edit</button>
                          <button onClick={()=>deleteTenant(t.id)} className="px-2.5 py-1 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {tab==='billing' && (
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">Cost references (Marketplace)</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">
              Billing is based on evaluated incidents (Resolved/Closed) and event data from RMM, EDR/Sophos, and Autotask. Specific costs and rates are in the Marketplace.
            </p>
            {billingCostRefs && (
              <>
                <div className="mb-3">
                  <span className="text-sm font-medium text-[var(--text)]">{billingCostRefs.mdu.name}</span>
                  {billingCostRefs.mdu.description && <p className="text-xs text-[var(--muted)]">{billingCostRefs.mdu.description}</p>}
                  <ul className="text-xs text-[var(--muted)] mt-1 list-disc list-inside">
                    {billingCostRefs.mdu.tiers.map((t, i) => (
                      <li key={i}>{t.label}{t.perThousandUsd > 0 ? ` · $${t.perThousandUsd}/1k Events` : ' included'}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <span className="text-sm font-medium text-[var(--text)]">SOC tiers</span>
                  <ul className="text-xs text-[var(--muted)] mt-1 space-y-0.5">
                    {billingCostRefs.socTiers.map((s) => (
                      <li key={s.id}>{s.name}: {s.price}</li>
                    ))}
                  </ul>
                </div>
                {billingCostRefs.claude && (
                  <div className="mb-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                    <span className="text-sm font-medium text-[var(--text)]">{billingCostRefs.claude.customerName}</span>
                    <p className="text-xs text-[var(--muted)] mt-1">Usage-based pricing (per 1M tokens input/output). Margin {billingCostRefs.claude.marginPercent}%.</p>
                    <table className="text-xs text-[var(--muted)] mt-2 w-full max-w-md">
                      <thead><tr><th className="text-left py-1">Tier</th><th className="text-right">Input / 1M tokens</th><th className="text-right">Output / 1M tokens</th></tr></thead>
                      <tbody>
                        {billingCostRefs.claude.reference.map((r, i) => (
                          <tr key={r.model} className="border-t border-[var(--border)]">
                            <td className="py-1 font-medium text-[var(--text)]">{['Standard', 'Pro', 'Premium'][i] ?? r.model}</td>
                            <td className="text-right text-[var(--text)]">${r.customerInputUsdPerM}</td>
                            <td className="text-right text-[var(--text)]">${r.customerOutputUsdPerM}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-[var(--muted)] mt-2">Typical request (1 question): ${billingCostRefs.claude.typicalCopilotRequest.customerPriceUsd.toFixed(4)}.</p>
                  </div>
                )}
                <a href={billingCostRefs.marketplaceLink} className="text-sm text-[var(--primary)] hover:underline font-medium">To Marketplace →</a>
              </>
            )}
          </Card>
          <Card className="p-5 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">Monthly accumulation (for invoice)</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">Per month: number of alerts (incidents), event total, threshold check (1M events included), and MDU cost. Usable for invoicing at month end.</p>
            {billingLoading ? (
              <div className="text-sm text-[var(--muted)]">Loading…</div>
            ) : billingMonthlyTotals.length === 0 ? (
              <div className="text-sm text-[var(--muted)]">No data for monthly accumulation (no evaluated incidents in the last 90 days).</div>
            ) : (
              <>
                <div className="rounded-xl border border-[var(--border)] overflow-hidden mb-3">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-2)]">
                    <tr>
                      <th className="text-left py-3 px-3 font-medium text-[var(--muted)]">Month</th>
                      <th className="text-right py-3 px-3 font-medium text-[var(--muted)]">Alerts</th>
                      <th className="text-right py-3 px-3 font-medium text-[var(--muted)]">Events</th>
                      <th className="text-center py-3 px-3 font-medium text-[var(--muted)]">Threshold (1M)</th>
                      <th className="text-right py-3 px-3 font-medium text-[var(--muted)]">MDU (USD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {billingMonthlyTotals.map((row) => (
                      <tr key={row.month} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                        <td className="py-3 px-3 font-medium text-[var(--text)]">{row.label}</td>
                        <td className="py-3 px-3 text-right text-[var(--text)]">{row.incidentsCount}</td>
                        <td className="py-3 px-3 text-right text-[var(--text)]">{row.eventsCount.toLocaleString()}</td>
                        <td className="py-3 px-3 text-center">
                          {row.thresholdExceeded ? (
                            <span className="inline-flex px-2 py-1 rounded-lg text-xs font-medium bg-amber-500/20 text-amber-400">Exceeded</span>
                          ) : (
                            <span className="inline-flex px-2 py-1 rounded-lg text-xs font-medium bg-emerald-500/20 text-emerald-400">Under 1M</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right text-[var(--text)]">{row.mduCostUsd > 0 ? `$${row.mduCostUsd.toFixed(2)}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const lines = ['Billing data (monthly accumulation)', '—'];
                      billingMonthlyTotals.forEach((row) => {
                        lines.push(`${row.label}: ${row.incidentsCount} alerts, ${row.eventsCount.toLocaleString()} events, threshold ${row.thresholdExceeded ? 'exceeded' : 'under 1M'}, MDU: ${row.mduCostUsd > 0 ? `$${row.mduCostUsd.toFixed(2)}` : '0'}`);
                      });
                      const text = lines.join('\n');
                      navigator.clipboard.writeText(text).then(() => { setBillingCopyDone(true); setTimeout(() => setBillingCopyDone(false), 2000); }).catch(() => alert('Copy failed'));
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-sm bg-[var(--surface-2)] hover:bg-[var(--surface)]"
                  >
                    {billingCopyDone ? 'Copied!' : 'Copy for invoice'}
                  </button>
                  <span className="text-xs text-[var(--muted)]">Accumulated monthly values as text (paste into invoice or email).</span>
                </div>
              </>
            )}
          </Card>
          <Card className="p-5 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={20} className="text-[var(--primary)]" />
              <h2 className="font-semibold text-[var(--text)]">Evaluated incidents (Resolved/Closed) – last 90 days</h2>
            </div>
            <p className="text-xs text-[var(--muted)] mb-4">All pulled events and data per incident are viewable below (expand Event log). Basis for billing.</p>
            {billingLoading ? (
              <div className="text-sm text-[var(--muted)] py-4">Loading…</div>
            ) : billingItems.length === 0 ? (
              <div className="text-sm text-[var(--muted)] py-4">No evaluated incidents (Resolved/Closed) in the last 90 days.</div>
            ) : (
              <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-2)]">
                    <tr>
                      <th className="text-left py-3 px-3 font-medium text-[var(--muted)]">Incident</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Source</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Status</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Tenant</th>
                      <th className="py-3 px-3 font-medium text-[var(--muted)]">Events</th>
                      <th className="text-right py-3 px-3 font-medium text-[var(--muted)]"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                  {billingItems.map((inc) => (
                    <tr key={inc.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-medium text-[var(--text)]">{inc.title}</div>
                        <div className="text-xs text-[var(--muted)]">{inc.id} · {new Date(inc.loggedAtISO).toLocaleString()}</div>
                      </td>
                      <td className="py-3 px-3 text-[var(--text)]">{inc.source === 'rmm' ? 'RMM' : inc.source === 'edr' ? 'EDR' : inc.id?.startsWith('autotask-') ? 'Autotask' : inc.source ?? '—'}</td>
                      <td className="py-3 px-3 text-[var(--text)]">{inc.status}</td>
                      <td className="py-3 px-3 text-[var(--muted)]">{inc.tenantId ?? '—'}</td>
                      <td className="py-3 px-3 text-[var(--text)]">{(inc.eventLog?.length ?? 0)}</td>
                      <td className="py-3 px-3 text-right">
                        <button type="button" onClick={()=>setBillingExpandedId(billingExpandedId === inc.id ? null : inc.id)}
                                className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-xs font-medium text-[var(--text)] hover:bg-[var(--surface-2)]">
                          {billingExpandedId === inc.id ? 'Collapse' : 'Event log'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            )}
            {billingItems.length > 0 && billingExpandedId && (
              <div className="mt-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <div className="text-xs font-medium text-[var(--muted)] mb-2">Event log: {billingItems.find(i => i.id === billingExpandedId)?.title ?? billingExpandedId}</div>
                <ul className="space-y-2 text-xs">
                  {(billingItems.find(i => i.id === billingExpandedId)?.eventLog ?? []).map((e, idx) => (
                    <li key={idx} className="flex flex-wrap gap-2">
                      <span className="text-[var(--muted)]">{new Date(e.atISO).toLocaleString()}</span>
                      <span className="text-[var(--text)]">{e.message}</span>
                      {e.source && <span className="px-1.5 py-0.5 rounded bg-[var(--surface)]">{e.source}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {tab==='settings' && (
        <Card className="p-5 max-w-xl">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={20} className="text-[var(--primary)]" />
            <h2 className="font-semibold text-[var(--text)]">App settings</h2>
          </div>
          <p className="text-xs text-[var(--muted)] mb-5">Display name, session duration, default role for new users, and optional logo and admin notice.</p>
          {settingsLoading ? (
            <div className="text-sm text-[var(--muted)] py-4">Loading…</div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">App name (display)</label>
                <input value={settings.appName} onChange={e=>setSettings(s=>({...s, appName:e.target.value}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]" placeholder="e.g. Mahoney Control"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Session duration (minutes)</label>
                <input type="number" min={5} max={1440} value={settings.sessionDurationMinutes}
                       onChange={e=>setSettings(s=>({...s, sessionDurationMinutes:Number(e.target.value)||30}))}
                       className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]"/>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Default role for new users</label>
                <select value={settings.defaultRoleForNewUsers} onChange={e=>setSettings(s=>({...s, defaultRoleForNewUsers:e.target.value}))}
                        className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)]">
                  <option value="demo">demo</option>
                  <option value="sales">sales</option>
                  <option value="admin">admin</option>
                  <option value="partner">partner</option>
                  <option value="tenant_user">tenant_user</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Login page logo (optional, max. 300 KB)</label>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <input type="file" accept="image/*" onChange={handleLogoFile}
                         className="text-sm text-[var(--muted)] file:mr-2 file:rounded-lg file:border file:border-[var(--border)] file:bg-[var(--surface-2)] file:px-3 file:py-1.5 file:text-sm file:text-[var(--text)]"/>
                  {settings.logoDataUrl && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={settings.logoDataUrl} alt="Logo" className="h-12 object-contain rounded-lg border border-[var(--border)]"/>
                      <button type="button" onClick={clearLogo} className="text-xs text-red-400 hover:underline font-medium">Remove</button>
                    </>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1">Admin notice (optional, e.g. maintenance)</label>
                <textarea value={settings.adminNotice} onChange={e=>setSettings(s=>({...s, adminNotice:e.target.value}))}
                          rows={2} className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)]" placeholder="Shown to admins on login"/>
              </div>
              <button onClick={saveSettings} disabled={settingsSaving}
                      className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50">
                {settingsSaving ? 'Saving…' : 'Save settings'}
              </button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
