import { answerFromKb } from './ai-copilot-kb'

/** Short answer for Co-Pilot (sheet or chat). Uses full KB. */
export function aiShortAnswer(q: string): string {
  return answerFromKb(q)
}
