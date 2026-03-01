'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import { SOC_QUESTIONNAIRE_SECTIONS } from '@/lib/soc-questionnaire'
import type { SocQuestionnaireAnswers } from '@/lib/soc-questionnaire'
import { ArrowLeft, Download, FileText } from 'lucide-react'

const STORAGE_KEY = 'soc-questionnaire-answers'

function getStoredAnswers(): SocQuestionnaireAnswers | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SocQuestionnaireAnswers
  } catch {
    return null
  }
}

function formatValue(v: unknown): string {
  if (v == null || v === '') return '—'
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—'
  if (typeof v === 'number') return String(v)
  return String(v)
}

export default function HandbookPage() {
  const [answers, setAnswers] = useState<SocQuestionnaireAnswers | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/governance/soc-questionnaire', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data: { answers: SocQuestionnaireAnswers | null }) => {
        if (data.answers && typeof data.answers === 'object') {
          setAnswers(data.answers)
        } else {
          setAnswers(getStoredAnswers())
        }
        setLoading(false)
      })
      .catch(() => {
        setAnswers(getStoredAnswers())
        setLoading(false)
      })
  }, [])

  const handlePrint = () => {
    window.print()
  }

  if (loading || answers === null) {
    if (loading) {
      return (
        <div className="mx-auto max-w-[800px] px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/governance/soc-questionnaire" className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)]">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-xl font-bold text-[var(--text)]">SOC-Handbook</h1>
          </div>
          <Card className="p-8 text-center text-[var(--muted)]">Lade Daten…</Card>
        </div>
      )
    }
    return (
      <div className="mx-auto max-w-[800px] px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/governance/soc-questionnaire" className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)]">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[var(--text)]">SOC-Handbook</h1>
        </div>
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto text-[var(--muted)] mb-4" />
          <p className="text-[var(--muted)] mb-4">
            No questionnaire data yet. Please complete the <strong>Compliance & Handbook questionnaire</strong> first to generate your SOC handbook.
          </p>
          <Link
            href="/governance/soc-questionnaire"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white"
          >
            Go to questionnaire
          </Link>
        </Card>
      </div>
    )
  }

  const hasAnyAnswer = Object.values(answers).some((v) => {
    if (Array.isArray(v)) return v.length > 0
    return v !== '' && v != null
  })

  if (!hasAnyAnswer) {
    return (
      <div className="mx-auto max-w-[800px] px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/governance/soc-questionnaire" className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)]">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-xl font-bold text-[var(--text)]">SOC-Handbook</h1>
        </div>
        <Card className="p-8 text-center">
          <p className="text-[var(--muted)] mb-4">The questionnaire has not been completed yet. Please answer at least some questions.</p>
          <Link href="/governance/soc-questionnaire" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white">
            Go to questionnaire
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <Link href="/governance/soc-questionnaire" className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-2)] text-[var(--text)]">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-xl font-bold text-[var(--text)]">SOC-Handbook</h1>
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface)]"
        >
          <Download size={16} />
          Print / Save as PDF
        </button>
      </div>

      <div className="handbook-doc space-y-8 print:space-y-6">
        <header className="border-b border-[var(--border)] pb-4">
          <h1 className="text-2xl font-bold text-[var(--text)] print:text-xl">SOC Compliance & Governance Handbook</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Generated from the SOC Customer Onboarding Questionnaire · ISO 27001 | NIS2 | GDPR | SOC 2</p>
          <p className="text-xs text-[var(--muted)] mt-2">As of: {new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
        </header>

        {SOC_QUESTIONNAIRE_SECTIONS.map((section) => {
          const sectionAnswers = section.subsections.flatMap((sub) =>
            sub.fields.map((f) => ({ field: f, value: answers[f.id] }))
          ).filter((a) => {
            const v = a.value
            if (Array.isArray(v)) return v.length > 0
            return v !== '' && v != null
          })
          if (sectionAnswers.length === 0) return null

          return (
            <section key={section.id} className="break-inside-avoid">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
                <span className="text-[var(--primary)]">{section.number}</span>
                {section.title}
              </h2>
              {section.complianceRef && (
                <p className="text-[10px] text-[var(--muted)] mb-3">{section.complianceRef}</p>
              )}
              <div className="space-y-4">
                {section.subsections.map((sub) => {
                  const subAnswers = sub.fields
                    .map((f) => ({ field: f, value: answers[f.id] }))
                    .filter((a) => {
                      const v = a.value
                      if (Array.isArray(v)) return v.length > 0
                      return v !== '' && v != null
                    })
                  if (subAnswers.length === 0) return null
                  return (
                    <div key={sub.id}>
                      <h3 className="text-sm font-medium text-[var(--text)] mb-2">{sub.title}</h3>
                      <dl className="grid gap-2 text-sm">
                        {subAnswers.map(({ field, value }) => (
                          <div key={field.id} className="flex gap-2 border-b border-[var(--border)]/50 pb-1.5">
                            <dt className="text-[var(--muted)] min-w-[180px] shrink-0">{field.label}</dt>
                            <dd className="text-[var(--text)]">{formatValue(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        <footer className="pt-6 border-t border-[var(--border)] text-xs text-[var(--muted)]">
          This handbook was generated from your SOC compliance questionnaire. It serves as a reference for SOC services and governance. To make changes, update the questionnaire and regenerate the handbook.
        </footer>
      </div>

      <div className="mt-8 print:hidden flex justify-end">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white"
        >
          <Download size={16} />
          Print / Save as PDF
        </button>
      </div>
    </div>
  )
}
