'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  User,
  FileText,
  Euro,
  ClipboardList,
  StickyNote,
  Check,
  Circle,
  Lock,
} from 'lucide-react'
import Card from '@/components/ui/Card'
import { useGroupAdminFeature } from '@/hooks/useGroupAdminFeature'
import { useHaptics } from '@/hooks/useHaptics'
import { stagger } from '@/lib/ui/motion'
import { formatCurrency } from '@/lib/pricing'
import {
  getGroupAdminCustomers,
  ONBOARDING_TOPICS,
  type CustomerOnboarding,
  type OnboardingTopic,
} from '@/lib/groupAdmin'

const GROUP_ADMIN_PASSWORD = 'SuperMario64!'
const GROUP_ADMIN_STORAGE_KEY = 'group_admin_unlocked'

const TAB_STAMMDATEN = 'stammdaten'
const TAB_UMSATZ = 'umsatz'
const TAB_THEMEN = 'themen'
const TAB_ADMIN = 'admin'

function formatEur(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function useGroupAdminUnlocked() {
  const [unlocked, setUnlocked] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUnlocked(sessionStorage.getItem(GROUP_ADMIN_STORAGE_KEY) === '1')
    }
  }, [])
  const setUnlockedState = (v: boolean) => {
    if (typeof window !== 'undefined') {
      if (v) sessionStorage.setItem(GROUP_ADMIN_STORAGE_KEY, '1')
      else sessionStorage.removeItem(GROUP_ADMIN_STORAGE_KEY)
      setUnlocked(v)
    }
  }
  return [unlocked, setUnlockedState] as const
}

export default function GroupAdminPage() {
  const { showGroupAdmin, loading } = useGroupAdminFeature()
  const [unlocked, setUnlocked] = useGroupAdminUnlocked()
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [tab, setTab] = useState(TAB_STAMMDATEN)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const h = useHaptics()

  const customers = getGroupAdminCustomers()
  const customer = customerId ? customers.find((c) => c.id === customerId) ?? customers[0] : customers[0]

  useEffect(() => {
    if (!loading && !showGroupAdmin) {
      window.location.replace('/')
    }
  }, [loading, showGroupAdmin])

  useEffect(() => {
    if (customer && !customerId) setCustomerId(customer.id)
  }, [customer, customerId])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    h.impact('light')
    setPasswordError('')
    if (password === GROUP_ADMIN_PASSWORD) {
      setUnlocked(true)
      setPassword('')
    } else {
      setPasswordError('Falsches Passwort.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-sm text-[var(--muted)]">Lade …</p>
      </div>
    )
  }

  if (!showGroupAdmin) return null

  if (!unlocked) {
    return (
      <div className="mx-auto w-full max-w-[400px] px-4 py-8">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-[var(--muted)]" />
            <h1 className="text-xl font-bold text-[var(--text)]">Group Admin</h1>
          </div>
          <p className="text-sm text-[var(--muted)] mb-4">Bitte Passwort eingeben, um die Mahoney IT Group Admin-Ansicht zu öffnen.</p>
          <p className="text-xs text-[var(--muted)] mb-4">Hinweis: Nintendo</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
              placeholder="Passwort"
              className="w-full rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)]"
              autoFocus
              autoComplete="current-password"
            />
            {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-medium"
            >
              Entsperren
            </button>
          </form>
        </Card>
      </div>
    )
  }

  const tabs = [
    { id: TAB_STAMMDATEN, label: 'Stammdaten', icon: FileText },
    { id: TAB_UMSATZ, label: 'Umsatz', icon: Euro },
    { id: TAB_THEMEN, label: 'Onboarding-Themen', icon: ClipboardList },
    { id: TAB_ADMIN, label: 'Admin-Infos', icon: StickyNote },
  ] as const

  return (
    <motion.div className="mx-auto w-full max-w-[960px] px-4 py-4 space-y-6" variants={stagger} initial="initial" animate="animate">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Mahoney IT Group Admins</h1>
        <p className="text-sm text-[var(--muted)]">Kunden-Onboarding, Umsatz und Onboarding-Themen (intern)</p>
      </div>

      {/* Kundenauswahl */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-[var(--muted)]" />
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Kunde</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {customers.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { h.impact('light'); setCustomerId(c.id) }}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                customer?.id === c.id
                  ? 'border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--primary)]'
                  : 'border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {c.companyName}
            </button>
          ))}
        </div>
      </Card>

      {!customer ? (
        <p className="text-sm text-[var(--muted)]">Kein Kunde ausgewählt.</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-1 border-b border-[var(--border)]">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => { h.impact('light'); setTab(id) }}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-xl transition-colors ${
                  tab === id
                    ? 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] border-b-0 -mb-px'
                    : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {tab === TAB_STAMMDATEN && <StammdatenSection customer={customer} />}
          {tab === TAB_UMSATZ && <UmsatzSection customer={customer} />}
          {tab === TAB_THEMEN && <ThemenSection customer={customer} />}
          {tab === TAB_ADMIN && <AdminInfoSection customer={customer} />}
        </>
      )}
    </motion.div>
  )
}

function StammdatenSection({ customer }: { customer: CustomerOnboarding }) {
  return (
    <motion.div className="space-y-4" variants={stagger}>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <Building2 size={14} />
          Unternehmen
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Row label="Firma" value={customer.companyName} />
          <Row label="Rechtsform" value={customer.legalForm} />
          <Row label="Branche" value={customer.industry} />
          <Row label="USt-IdNr." value={customer.vatId} />
          <Row label="Steuernummer" value={customer.taxId} />
          <Row label="Adresse" value={`${customer.address.street}, ${customer.address.postalCode} ${customer.address.city}, ${customer.address.country}`} />
        </dl>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <User size={14} />
          Ansprechpartner
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Row label="Hauptansprechpartner" value={customer.primaryContact.name} />
          <Row label="E-Mail" value={customer.primaryContact.email} />
          <Row label="Telefon" value={customer.primaryContact.phone} />
          <Row label="Rolle" value={customer.primaryContact.role} />
          {customer.technicalContact && (
            <>
              <Row label="Techn. Ansprechpartner" value={customer.technicalContact.name} />
              <Row label="Techn. E-Mail" value={customer.technicalContact.email} />
              <Row label="Techn. Telefon" value={customer.technicalContact.phone} />
            </>
          )}
        </dl>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Vertrag & Leistungen</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Row label="Vertragsbeginn" value={customer.contractStart} />
          <Row label="Vertragsende" value={customer.contractEnd} />
          <Row label="Tarif" value={customer.planTier} />
          <Row label="Lizenzen (Seats)" value={String(customer.seats)} />
          <Row label="Geräte" value={String(customer.devices)} />
          <Row label="Gebuchte Services" value={customer.bookedServices.join(', ')} />
          <Row label="Rahmenvertrag unterzeichnet" value={customer.msaSignedAt ?? '–'} />
          <Row label="AV-Vertrag unterzeichnet" value={customer.dpaSignedAt ?? '–'} />
        </dl>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Audit & Governance</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Row label="Audit-Status" value={auditStatusLabel(customer.auditStatus)} />
          <Row label="Nächstes Audit (geplant)" value={customer.auditNextDue ?? '–'} />
          <Row label="Governance-Framework" value={customer.governanceFramework ?? '–'} />
        </dl>
      </Card>
    </motion.div>
  )
}

function Row({ label, value }: { label: string; value: string | undefined }) {
  return (
    <>
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="text-[var(--text)]">{value ?? '–'}</dd>
    </>
  )
}

function auditStatusLabel(s: string) {
  const map: Record<string, string> = {
    not_scheduled: 'Nicht geplant',
    scheduled: 'Geplant',
    in_progress: 'Läuft',
    completed: 'Abgeschlossen',
  }
  return map[s] ?? s
}

function UmsatzSection({ customer }: { customer: CustomerOnboarding }) {
  const months = customer.revenueLastMonths
  const totalEur = months.reduce((s, m) => s + m.revenueEur, 0)
  const avgEur = months.length ? Math.round(totalEur / months.length) : 0

  return (
    <motion.div className="space-y-4" variants={stagger}>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <Euro size={14} />
          Umsatz der letzten Monate
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--muted)] border-b border-[var(--border)]">
                <th className="pb-2 pr-4">Monat</th>
                <th className="pb-2 pr-4 text-right">Umsatz (EUR)</th>
                <th className="pb-2 pr-4 text-right">Umsatz (USD)</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m.month} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{m.label}</td>
                  <td className="py-2 pr-4 text-right text-[var(--text)]">{formatEur(m.revenueEur)}</td>
                  <td className="py-2 pr-4 text-right text-[var(--text)]">{formatCurrency(m.revenueUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-4 text-sm">
          <span className="text-[var(--muted)]">Summe ({months.length} Monate): <strong className="text-[var(--text)]">{formatEur(totalEur)}</strong></span>
          <span className="text-[var(--muted)]">Durchschnitt/Monat: <strong className="text-[var(--text)]">{formatEur(avgEur)}</strong></span>
        </div>
      </Card>
      {months[0]?.servicesBreakdown && (
        <Card className="p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">Aufschlüsselung (aktuellster Monat)</h3>
          <ul className="space-y-1 text-sm">
            {months[0].servicesBreakdown.map((s) => (
              <li key={s.name} className="flex justify-between gap-4">
                <span className="text-[var(--text)]">{s.name}</span>
                <span className="text-[var(--muted)]">{formatEur(s.amountEur)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </motion.div>
  )
}

function ThemenSection({ customer }: { customer: CustomerOnboarding }) {
  const registeredIds = new Set(customer.onboardingTopics)
  const byCategory = ONBOARDING_TOPICS.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {} as Record<string, OnboardingTopic[]>)

  return (
    <motion.div className="space-y-6" variants={stagger}>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <ClipboardList size={14} />
          Onboarding-Themen anmelden
        </h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Themen für das Kunden-Onboarding: Audit, IT-Governance und weitere für Admins relevante Schulungen.
        </p>
        {Object.entries(byCategory).map(([category, topics]) => (
          <div key={category} className="mb-4 last:mb-0">
            <h3 className="text-xs font-semibold text-[var(--muted)] mb-2">{category}</h3>
            <ul className="space-y-2">
              {topics.map((t) => {
                const registered = registeredIds.has(t.id)
                return (
                  <li
                    key={t.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)]/50"
                  >
                    {registered ? (
                      <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-[var(--muted)] shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--text)]">{t.label}</div>
                      <div className="text-xs text-[var(--muted)]">{t.description}</div>
                      {t.completedAt && (
                        <div className="text-[10px] text-[var(--muted)] mt-1">Abgeschlossen: {t.completedAt}</div>
                      )}
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-1 rounded-lg ${registered ? 'bg-emerald-600/20 text-emerald-300' : 'bg-[var(--surface-elev)] text-[var(--muted)]'}`}>
                      {registered ? 'Angemeldet' : 'Offen'}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </Card>
    </motion.div>
  )
}

function AdminInfoSection({ customer }: { customer: CustomerOnboarding }) {
  return (
    <motion.div className="space-y-4" variants={stagger}>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <StickyNote size={14} />
          Interne Notizen
        </h2>
        <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{customer.internalNotes ?? '–'}</p>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Nächste Schritte</h2>
        <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{customer.nextSteps ?? '–'}</p>
      </Card>
      <Card className="p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">Übergabe / Eskalation</h2>
        <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{customer.handoverNotes ?? '–'}</p>
      </Card>
      <div className="text-[10px] text-[var(--muted)]">
        Zuletzt aktualisiert: {customer.updatedAt ? new Date(customer.updatedAt).toLocaleString('de-DE') : '–'}
      </div>
    </motion.div>
  )
}
