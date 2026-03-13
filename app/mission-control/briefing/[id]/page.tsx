'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Radio, Check, Lock, AlertTriangle, Flag, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'
import type { BriefingStatus } from '@/lib/mission-briefing/types'
import { BRIEFING_DEMO_SITREP } from '@/lib/mission-briefing/briefing-demo'

type Briefing = {
  id: string
  tenantId: string
  briefingDate: string
  status: BriefingStatus
  autoSummary: {
    threatLandscapeScore: number
    infrastructureHealthScore: number
    operationalLoadScore: number
    complianceExposureScore: number
    customerRiskIndex: number
    perCustomer: { customerName: string; riskIndex: number; level: string }[]
    rawMetrics: Record<string, number>
    generatedAtISO: string
  } | null
  lockedAtISO: string | null
}
type Participant = {
  id: string
  userId: string
  displayName: string
  redFlagResponse: string | null
  riskAcknowledgedAtISO: string | null
  readbackText: string | null
  signedAtISO: string | null
}

const STATUS_STEPS: BriefingStatus[] = [
  'in_progress',
  'red_flag_round',
  'risk_confirm',
  'readback',
  'signed',
  'locked',
]

export default function BriefingFlowPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | undefined>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [redFlagText, setRedFlagText] = useState('')
  const [escalateToLeadership, setEscalateToLeadership] = useState(false)
  const [anonymousNearMiss, setAnonymousNearMiss] = useState(false)
  const [riskAck, setRiskAck] = useState(false)
  const [readbackText, setReadbackText] = useState('')

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/mission-briefing/briefings/${id}`)
      if (!res.ok) {
        setBriefing(null)
        setLoading(false)
        return
      }
      const j = await res.json()
      setBriefing(j.item)
      setParticipants(j.participants ?? [])
      setCurrentUserId(j.currentUserId)
      const me = (j.participants ?? []).find((p: Participant) => p.userId === j.currentUserId)
      if (me?.redFlagResponse) setRedFlagText(me.redFlagResponse)
      if (me?.readbackText) setReadbackText(me.readbackText)
      if (me?.riskAcknowledgedAtISO) setRiskAck(true)
    } catch {
      setBriefing(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  const patch = useCallback(
    async (body: Record<string, unknown>) => {
      setSaving(true)
      setError(null)
      try {
        const res = await fetch(`/api/mission-briefing/briefings/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          setError(e.error ?? 'Request failed')
          return false
        }
        const j = await res.json()
        setBriefing(j.item)
        if (j.participants) setParticipants(j.participants)
        return true
      } catch {
        setError('Request failed')
        return false
      } finally {
        setSaving(false)
      }
    },
    [id]
  )

  const me = participants.find((p) => p.userId === currentUserId)
  const currentStepIndex = briefing ? STATUS_STEPS.indexOf(briefing.status) : -1
  const isLocked = briefing?.lockedAtISO != null

  const handleContinueFromSummary = async () => {
    const ok = await patch({ status: 'red_flag_round' })
    if (ok) load()
  }

  const handleSubmitRedFlag = async () => {
    if (!me) return
    const ok = await patch({
      participantId: me.id,
      redFlagResponse: redFlagText.trim() || '(No red flags)',
    })
    if (ok) {
      await patch({ status: 'risk_confirm' })
      load()
    }
  }

  const handleSubmitRiskAck = async () => {
    if (!me || !riskAck) return
    const ok = await patch({ participantId: me.id, riskAcknowledged: true })
    if (ok) {
      await patch({ status: 'readback' })
      load()
    }
  }

  const handleSubmitReadback = async () => {
    if (!me) return
    const ok = await patch({
      participantId: me.id,
      readbackText: readbackText.trim() || '(Readback acknowledged)',
    })
    if (ok) {
      await patch({ participantId: me.id, signed: true })
      await patch({ status: 'signed' })
      load()
    }
  }

  const handleLock = async () => {
    const ok = await patch({ lock: true })
    if (ok) load()
  }

  if (loading && !briefing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-[var(--muted)]">Loading briefing…</p>
      </div>
    )
  }

  if (!briefing) {
    return (
      <div className="mx-auto max-w-[700px] px-4 py-6">
        <p className="text-[var(--muted)]">Briefing not found.</p>
        <Link href="/mission-control" className="text-[var(--primary)] mt-2 inline-block">
          Back to Mission Control
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--text)] flex items-center gap-2">
          <Radio className="w-6 h-6 text-[var(--primary)]" />
          Mission Briefing — {briefing.briefingDate}
        </h1>
        <Link
          href="/mission-control"
          className="text-sm text-[var(--muted)] hover:text-[var(--text)]"
        >
          Back to Mission Control
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-sm">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Briefing (SITREP) – always visible in flow */}
      <Card className="p-4 border-[var(--border)]">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
          <FileText size={14} />
          Briefing — Situation Report
        </h2>
        <div className="space-y-3">
          {BRIEFING_DEMO_SITREP.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wide mb-1">{section.title}</h3>
              <ul className="list-disc list-inside text-xs text-[var(--muted)] space-y-0.5">
                {section.items.slice(0, 2).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {isLocked && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/50 text-emerald-200 text-sm">
          <Lock size={18} />
          Briefing locked. Immutable audit record.
        </div>
      )}

      {/* Step 1: Auto-generated Summary */}
      {briefing.status === 'in_progress' && briefing.autoSummary && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Step 1 — Auto-generated Summary
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">{Math.round(briefing.autoSummary.threatLandscapeScore)}</div>
              <div className="text-[10px] text-[var(--muted)]">Threat</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">{Math.round(briefing.autoSummary.infrastructureHealthScore)}</div>
              <div className="text-[10px] text-[var(--muted)]">Infrastructure</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">{Math.round(briefing.autoSummary.operationalLoadScore)}</div>
              <div className="text-[10px] text-[var(--muted)]">Load</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">{Math.round(briefing.autoSummary.complianceExposureScore)}</div>
              <div className="text-[10px] text-[var(--muted)]">Compliance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--text)]">{Math.round(briefing.autoSummary.customerRiskIndex)}</div>
              <div className="text-[10px] text-[var(--muted)]">Risk Index</div>
            </div>
          </div>
          {briefing.autoSummary.perCustomer?.length > 0 && (
            <p className="text-xs text-[var(--muted)] mb-3">
              Top risks: {briefing.autoSummary.perCustomer.slice(0, 3).map((c) => c.customerName).join(', ')}
            </p>
          )}
          <button
            type="button"
            onClick={handleContinueFromSummary}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Continue to Red Flag Round'}
          </button>
        </Card>
      )}

      {/* Step 2: Red Flag Round */}
      {briefing.status === 'red_flag_round' && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
            <Flag size={14} />
            Step 2 — CRM Red Flag Round (mandatory)
          </h2>
          <p className="text-xs text-[var(--muted)] mb-3">
            Each participant must submit. No silent participation.
          </p>
          {me ? (
            <>
              <textarea
                value={redFlagText}
                onChange={(e) => setRedFlagText(e.target.value)}
                placeholder="Your red flags or concerns…"
                className="w-full min-h-[120px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--muted)]"
                maxLength={2000}
              />
              <div className="flex flex-wrap gap-4 mt-3">
                <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={escalateToLeadership}
                    onChange={(e) => setEscalateToLeadership(e.target.checked)}
                    className="rounded border-[var(--border)]"
                  />
                  Flag risk to leadership
                </label>
                <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={anonymousNearMiss}
                    onChange={(e) => setAnonymousNearMiss(e.target.checked)}
                    className="rounded border-[var(--border)]"
                  />
                  Anonymous near-miss report
                </label>
              </div>
              <button
                type="button"
                onClick={handleSubmitRedFlag}
                disabled={saving}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Submit & Continue'}
              </button>
            </>
          ) : (
            <p className="text-sm text-[var(--muted)]">You are not listed as a participant.</p>
          )}
        </Card>
      )}

      {/* Step 3: Risk Confirmation */}
      {briefing.status === 'risk_confirm' && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Step 3 — Risk Confirmation
          </h2>
          <p className="text-xs text-[var(--muted)] mb-3">
            Acknowledge that you have reviewed the risks in this briefing.
          </p>
          {me && (
            <>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={riskAck}
                  onChange={(e) => setRiskAck(e.target.checked)}
                  className="rounded border-[var(--border)]"
                />
                I acknowledge the risks above and understand my role in mitigating them.
              </label>
              <button
                type="button"
                onClick={handleSubmitRiskAck}
                disabled={saving || !riskAck}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Confirm & Continue'}
              </button>
            </>
          )}
        </Card>
      )}

      {/* Step 4: Readback */}
      {briefing.status === 'readback' && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
            Step 4 — Closed Loop Confirmation (readback)
          </h2>
          <p className="text-xs text-[var(--muted)] mb-3">
            Structured readback: summarize key actions or decisions from this briefing.
          </p>
          {me && (
            <>
              <textarea
                value={readbackText}
                onChange={(e) => setReadbackText(e.target.value)}
                placeholder="Readback: key actions and decisions…"
                className="w-full min-h-[100px] px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] placeholder-[var(--muted)]"
                maxLength={2000}
              />
              <button
                type="button"
                onClick={handleSubmitReadback}
                disabled={saving}
                className="mt-4 px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Submit readback & sign'}
              </button>
            </>
          )}
        </Card>
      )}

      {/* Step 5 & 6: Signed / Lock */}
      {briefing.status === 'signed' && !isLocked && (
        <Card className="p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)] mb-3 flex items-center gap-2">
            <Check size={14} />
            Step 5 — Digital signature recorded
          </h2>
          <p className="text-xs text-[var(--muted)] mb-3">
            All participants have signed. Lock the briefing to create an immutable audit record.
          </p>
          <button
            type="button"
            onClick={handleLock}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Locking…' : 'Lock briefing'}
          </button>
        </Card>
      )}

      {isLocked && (
        <Card className="p-4 text-center text-[var(--muted)]">
          <Lock className="w-10 h-10 mx-auto mb-2 opacity-60" />
          <p className="text-sm">This briefing is locked. No further changes.</p>
          <Link href="/mission-control" className="text-[var(--primary)] mt-2 inline-block">
            Return to Mission Control
          </Link>
        </Card>
      )}
    </div>
  )
}
