'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Building2,
  Shield,
  DollarSign,
  TrendingUp,
  Users,
  Scale,
  Radio,
  Settings,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Search,
} from 'lucide-react'
import { FAQ_CATEGORIES, type FaqCategory } from '@/lib/faq-data'
import { useHaptics } from '@/hooks/useHaptics'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Shield,
  DollarSign,
  TrendingUp,
  Users,
  Scale,
  Radio,
  Settings,
  ShoppingBag,
}

function FaqCategoryBlock({
  category,
  expanded,
  onToggle,
  searchQuery,
}: {
  category: FaqCategory
  expanded: boolean
  onToggle: () => void
  searchQuery: string
}) {
  const h = useHaptics()
  const Icon = CATEGORY_ICONS[category.icon] ?? HelpCircle
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return category.items
    const q = searchQuery.toLowerCase()
    return category.items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    )
  }, [category.items, searchQuery])

  if (filteredItems.length === 0) return null

  return (
    <Card className="overflow-hidden border border-[var(--border)]">
      <button
        type="button"
        onClick={() => {
          h.impact('light')
          onToggle()
        }}
        className="flex w-full items-center gap-3 p-4 text-left hover:bg-[var(--surface-2)]/50 transition-colors"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)]/15 text-[var(--primary)]">
          <Icon size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-[var(--text)]">{category.title}</h2>
          <p className="text-xs text-[var(--muted)]">
            {filteredItems.length} question{filteredItems.length !== 1 ? 's' : ''}
          </p>
        </div>
        {expanded ? (
          <ChevronDown size={20} className="shrink-0 text-[var(--muted)]" />
        ) : (
          <ChevronRight size={20} className="shrink-0 text-[var(--muted)]" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[var(--border)]"
          >
            <ul className="divide-y divide-[var(--border)]">
              {filteredItems.map((item, idx) => (
                <FaqItem key={idx} question={item.question} answer={item.answer} />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  const h = useHaptics()
  return (
    <li>
      <button
        type="button"
        onClick={() => {
          h.impact('light')
          setOpen((o) => !o)
        }}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-[var(--surface-2)]/30 transition-colors"
      >
        <span className="font-medium text-[var(--text)] text-sm">{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[var(--muted)] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 pl-4 text-sm text-[var(--muted)] leading-relaxed border-l-2 border-[var(--primary)]/30 ml-4">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(FAQ_CATEGORIES[0]?.id ?? null)

  const hasSearch = searchQuery.trim().length > 0
  const categoriesWithMatches = useMemo(() => {
    if (!hasSearch) return FAQ_CATEGORIES
    const q = searchQuery.toLowerCase()
    return FAQ_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.items.length > 0)
  }, [searchQuery, hasSearch])

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)]">
          FAQ – How the app works
        </h1>
        <p className="text-sm text-[var(--muted)]">
          Find answers to common questions about the Mahoney Control App: dashboard, billing, MDU,
          partners, admin, and more.
        </p>
      </div>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions and answers…"
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] py-2.5 pl-10 pr-4 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--primary)]/50 focus:outline-none"
          aria-label="Search FAQ"
        />
      </div>

      {categoriesWithMatches.length === 0 ? (
        <Card className="p-8 text-center">
          <HelpCircle size={40} className="mx-auto mb-3 text-[var(--muted)]" />
          <p className="text-sm text-[var(--muted)]">No questions match your search.</p>
          <p className="text-xs text-[var(--muted)] mt-1">Try a different term or clear the search.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {categoriesWithMatches.map((category) => (
            <FaqCategoryBlock
              key={category.id}
              category={category}
              expanded={expandedId === category.id}
              onToggle={() =>
                setExpandedId((id) => (id === category.id ? null : category.id))
              }
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}

      <p className="text-xs text-[var(--muted)] text-center pt-4">
        {FAQ_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)} questions in {FAQ_CATEGORIES.length} categories.
      </p>
    </div>
  )
}
