'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import {
  SOC_QUESTIONNAIRE_SECTIONS,
  getEmptyAnswers,
  type SocQuestionnaireAnswers,
  type QuestionnaireSection,
  type QuestionnaireField,
} from '@/lib/soc-questionnaire'
import { ArrowLeft, ArrowRight, FileText, Save, CheckCircle } from 'lucide-react'

const STORAGE_KEY = 'soc-questionnaire-answers'

function getStoredAnswers(): SocQuestionnaireAnswers | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SocQuestionnaireAnswers
    return typeof parsed === 'object' && parsed !== null ? parsed : null
  } catch {
    return null
  }
}

function setStoredAnswers(answers: SocQuestionnaireAnswers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // ignore
  }
}

async function saveToServer(answers: SocQuestionnaireAnswers): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/governance/soc-questionnaire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error ?? 'Speichern fehlgeschlagen' }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Netzwerkfehler' }
  }
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: QuestionnaireField
  value: string | number | string[]
  onChange: (v: string | number | string[]) => void
}) {
  const id = `soc-${field.id}`

  if (field.type === 'text' || field.type === 'number' || field.type === 'date') {
    return (
      <input
        id={id}
        type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={String(value ?? '')}
        onChange={(e) => onChange(field.type === 'number' ? (e.target.value ? Number(e.target.value) : 0) : e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)]"
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <textarea
        id={id}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        rows={3}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] resize-y"
      />
    )
  }

  if (field.type === 'select') {
    return (
      <select
        id={id}
        value={String(value ?? '')}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm text-[var(--text)]"
      >
        <option value="">— Bitte wählen —</option>
        {(field.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    )
  }

  if (field.type === 'multiselect') {
    const arr = Array.isArray(value) ? value : []
    return (
      <div className="flex flex-wrap gap-2">
        {(field.options ?? []).map((o) => {
          const checked = arr.includes(o.value)
          return (
            <label key={o.value} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] cursor-pointer hover:border-[var(--primary)]/50">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const next = checked ? arr.filter((x) => x !== o.value) : [...arr, o.value]
                  onChange(next)
                }}
                className="rounded border-[var(--border)]"
              />
              <span className="text-sm text-[var(--text)]">{o.label}</span>
            </label>
          )
        })}
      </div>
    )
  }

  return null
}

export default function SocQuestionnairePage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<SocQuestionnaireAnswers>(() => getStoredAnswers() ?? getEmptyAnswers())
  const [loaded, setLoaded] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [handbookCreating, setHandbookCreating] = useState(false)

  useEffect(() => {
    setStoredAnswers(answers)
  }, [answers])

  // Beim Start: von Server laden (pro Mandant), sonst localStorage
  useEffect(() => {
    if (loaded) return
    fetch('/api/governance/soc-questionnaire', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: { answers: SocQuestionnaireAnswers | null }) => {
        if (data.answers && typeof data.answers === 'object') {
          setAnswers((prev) => ({ ...getEmptyAnswers(), ...prev, ...data.answers }))
          setStoredAnswers({ ...getEmptyAnswers(), ...data.answers })
        }
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [loaded])

  const handleSave = useCallback(async () => {
    setSaveStatus('saving')
    const result = await saveToServer(answers)
    setSaveStatus(result.ok ? 'saved' : 'error')
    if (result.ok) setTimeout(() => setSaveStatus('idle'), 2500)
  }, [answers])

  const section = SOC_QUESTIONNAIRE_SECTIONS[step]
  const isLastStep = step === SOC_QUESTIONNAIRE_SECTIONS.length - 1
  const isFirstStep = step === 0

  const setAnswer = useCallback((fieldId: string, value: string | number | string[]) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))
  }, [])

  const progressPct = ((step + 1) / SOC_QUESTIONNAIRE_SECTIONS.length) * 100

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/governance"
          className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)]"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-[var(--text)]">SOC-Compliance & Handbook</h1>
          <p className="text-sm text-[var(--muted)]">
            Fragebogen für neue und Bestandskunden – Grundlage für Ihr SOC-Handbook und Governance-Unterlagen
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface)] disabled:opacity-50 shrink-0"
          title="Fortschritt pro Mandant speichern"
        >
          {saveStatus === 'saving' && <span className="animate-pulse">…</span>}
          {saveStatus === 'saved' && <CheckCircle size={16} className="text-emerald-500" />}
          {saveStatus === 'error' && <span className="text-red-400 text-xs">Fehler</span>}
          <Save size={16} />
          <span className="text-sm">Speichern</span>
        </button>
      </div>

      {/* Progress – wirtschaftspsychologisch: sichtbarer Fortschritt */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
          <span>Schritt {step + 1} von {SOC_QUESTIONNAIRE_SECTIONS.length}</span>
          <span>{Math.round(progressPct)}% abgeschlossen</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
          <motion.div
            className="h-full bg-[var(--primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-start gap-2 mb-2">
              <span className="text-sm font-bold text-[var(--primary)]">{section.number}</span>
              <h2 className="text-lg font-semibold text-[var(--text)]">{section.title}</h2>
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">{section.description}</p>
            {section.complianceRef && (
              <p className="text-[10px] text-[var(--muted)] mb-4 border-l-2 border-[var(--border)] pl-2">
                {section.complianceRef}
              </p>
            )}

            <div className="space-y-6">
              {section.subsections.map((sub) => (
                <div key={sub.id}>
                  <h3 className="text-sm font-medium text-[var(--text)] mb-3">{sub.title}</h3>
                  {sub.description && (
                    <p className="text-xs text-[var(--muted)] mb-2">{sub.description}</p>
                  )}
                  <div className="space-y-3">
                    {sub.fields.map((field) => (
                      <div key={field.id}>
                        <label htmlFor={`soc-${field.id}`} className="block text-xs font-medium text-[var(--muted)] mb-1">
                          {field.label}
                          {field.required && <span className="text-red-400 ml-0.5">*</span>}
                          {field.autoFromRmm && (
                            <span className="ml-1.5 text-[10px] text-emerald-500">(aus RMM übernehmbar)</span>
                          )}
                        </label>
                        <FieldRenderer
                          field={field}
                          value={answers[field.id] ?? (field.type === 'multiselect' ? [] : '')}
                          onChange={(v) => setAnswer(field.id, v)}
                        />
                        {field.hint && (
                          <p className="text-[10px] text-[var(--muted)] mt-1">{field.hint}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={isFirstStep}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--surface)]"
        >
          <ArrowLeft size={16} />
          Zurück
        </button>
        {!isLastStep ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(SOC_QUESTIONNAIRE_SECTIONS.length - 1, s + 1))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white"
          >
            Weiter
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            disabled={handbookCreating}
            onClick={async () => {
              setHandbookCreating(true)
              await saveToServer(answers)
              setHandbookCreating(false)
              router.push('/governance/handbook')
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white disabled:opacity-70"
          >
            <FileText size={16} />
            {handbookCreating ? 'Wird gespeichert…' : 'Handbook erstellen'}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-[var(--muted)] mt-6">
        Mit „Speichern“ werden die Angaben Ihrem Mandanten zugeordnet und serverseitig gespeichert. Zusätzlich werden sie lokal im Browser gehalten. Ohne Mandant bleibt nur die lokale Speicherung – dann beim nächsten Besuch mit Mandant erneut speichern.
      </p>
    </div>
  )
}
