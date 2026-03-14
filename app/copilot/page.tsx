'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Send, Sparkles } from 'lucide-react'
import { aiShortAnswer } from '@/lib/ai'
import { useHaptics } from '@/hooks/useHaptics'
import { stagger, fadeUp } from '@/lib/ui/motion'

type Message = { id: string; role: 'user' | 'assistant'; text: string }

const SUGGESTIONS = [
  'What is my current risk?',
  'Which devices need attention?',
  'How is our backup scope?',
  'Should we upgrade to Prime?',
  'What should I do next?',
  'What can you help me with?',
]

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const h = useHaptics()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text: string) => {
    const q = text.trim()
    if (!q) return
    h.impact('medium')
    setInput('')
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: q }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    // Simulate brief delay so UI feels responsive
    setTimeout(() => {
      const answer = aiShortAnswer(q)
      const assistantMsg: Message = { id: `a-${Date.now()}`, role: 'assistant', text: answer }
      setMessages((prev) => [...prev, assistantMsg])
      setLoading(false)
    }, 200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const handleSuggestion = (s: string) => {
    h.impact('light')
    send(s)
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-6rem)]"
      variants={stagger}
      initial="initial"
      animate="animate"
    >
      <motion.div className="py-4 pb-2" variants={fadeUp}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30">
            <MessageSquare className="w-6 h-6 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text)]">Ask AI Co-Pilot</h1>
            <p className="text-sm text-[var(--muted)]">
              Ask anything about risk, devices, backups, compliance, incidents—get answers from your control surface.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-h-0 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <motion.div className="text-center py-8" variants={fadeUp}>
              <Sparkles className="w-10 h-10 text-[var(--primary)]/60 mx-auto mb-3" />
              <p className="text-sm text-[var(--muted)] mb-4">
                Ask a question. I use your app&apos;s data (demo or live) to answer.
              </p>
              <p className="text-xs text-[var(--muted)] mb-4">Try one of these:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSuggestion(s)}
                    className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface-elev)] hover:border-[var(--primary)]/30 text-sm text-[var(--text)] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text)]'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{m.text}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-[var(--surface-2)] border border-[var(--border)]">
                <span className="text-sm text-[var(--muted)]">…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border)] bg-[var(--bg)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about risk, devices, backups, compliance…"
              className="flex-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none transition-opacity"
              aria-label="Send"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-2 text-center">
            Answers use your dashboard and demo/live data. No external data is sent.
          </p>
        </form>
      </div>
    </motion.div>
  )
}
