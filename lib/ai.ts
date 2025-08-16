import { aiIntents } from './cockpit'

export function aiShortAnswer(q: string): string {
  const m = aiIntents.find(x => x.match.test(q))
  if (m) return m.answer
  // default concise fallback
  return 'Summary: Risk is Moderate. No critical gaps detected that require immediate escalation. Open the Service Cockpit for next steps.'
}
