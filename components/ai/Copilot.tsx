'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import SheetBody from '@/components/SheetBody'
import { HapticButton } from '@/components/HapticButton'
import { aiShortAnswer } from '@/lib/ai'
import { useHaptics } from '@/hooks/useHaptics'

export default function Copilot() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [a, setA] = useState<string | null>(null)
  const h = useHaptics()

  const handleAsk = () => {
    h.impact('medium')
    setA(aiShortAnswer(q))
  }

  const handleQuickQuestion = (question: string) => {
    h.impact('light')
    setQ(question)
    setA(aiShortAnswer(question))
  }

  return (
    <>
      {/* FAB */}
      <motion.button
        aria-label="AI Co-Pilot"
        className="fixed bottom-20 left-6 rounded-2xl px-3 py-3 bg-[var(--surface)] border border-[var(--border)] shadow-[0_8px_24px_rgba(0,0,0,.35)] z-40"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileTap={{ scale: .96 }}
        onClick={() => {
          h.impact('medium')
          setOpen(true)
        }}
      >
        <MessageSquare size={18} className="text-[var(--text)]" />
      </motion.button>

      {/* Sheet (simple) */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-[520px] mx-auto rounded-t-3xl bg-[var(--bg)] border-t border-[var(--border)]">
            <SheetBody>
              <div className="text-lg font-semibold mb-2 text-[var(--text)]">AI Co-Pilot</div>
              <div className="text-xs text-[var(--muted)] mb-3">Short, executive answers. No external data is sent in demo mode.</div>

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ask about risk, EDR, mail, backups, upgrades, projects…"
                className="w-full rounded-xl bg-[var(--surface)] border border-[var(--border)] p-3 text-sm text-[var(--text)] placeholder-[var(--muted)]"
                onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              />
              
              <div className="mt-2 flex gap-2">
                <HapticButton label="Ask" onClick={handleAsk} />
                <HapticButton 
                  variant="surface" 
                  label="Close" 
                  onClick={() => {
                    h.impact('light')
                    setOpen(false)
                    setQ('')
                    setA(null)
                  }} 
                />
              </div>

              {a && (
                <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-3 text-sm">
                  <p className="text-[var(--text)]">{a}</p>
                </div>
              )}

              {/* Quick suggestions */}
              <div className="mt-3 text-xs text-[var(--muted)]">Try:</div>
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  'What is my current risk?',
                  'Which devices are unprotected?',
                  'Any mailbox near quota?',
                  'Should I upgrade to Prime?',
                  'Create a VLAN project.'
                ].map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(s)}
                    className="px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs text-[var(--text)] hover:bg-[var(--surface)]/50 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </SheetBody>
          </div>
        </div>
      )}
    </>
  )
}
