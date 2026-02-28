/**
 * In-Memory-Speicher für SOC-Fragebogen-Antworten pro Mandant.
 * Später durch DB ersetzen.
 */

import type { SocQuestionnaireAnswers } from '@/lib/soc-questionnaire'

export interface StoredSocQuestionnaire {
  tenantId: string
  answers: SocQuestionnaireAnswers
  updatedAtISO: string
}

const store = new Map<string, StoredSocQuestionnaire>()

export function getSocQuestionnaireByTenant(tenantId: string): StoredSocQuestionnaire | null {
  return store.get(tenantId) ?? null
}

export function setSocQuestionnaireForTenant(
  tenantId: string,
  answers: SocQuestionnaireAnswers
): StoredSocQuestionnaire {
  const entry: StoredSocQuestionnaire = {
    tenantId,
    answers,
    updatedAtISO: new Date().toISOString(),
  }
  store.set(tenantId, entry)
  return entry
}
