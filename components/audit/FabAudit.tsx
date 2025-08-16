"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { motion } from "framer-motion"
import Card from "@/components/ui/Card"
import { useHaptics } from "@/hooks/useHaptics"

export default function FabAudit() {
  const [open, setOpen] = useState(false)
  const h = useHaptics()

  const handleOpen = () => {
    h.impact('medium')
    setOpen(true)
  }

  const handleClose = () => {
    h.impact('light')
    setOpen(false)
  }

  return (
    <>
      <motion.button
        onClick={handleOpen}
        className="fixed right-5 bottom-20 z-50 h-12 w-12 rounded-2xl grid place-items-center bg-[var(--primary)] text-white shadow-[0_10px_35px_rgba(59,130,246,.45)]"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.96 }}
        aria-label="Run Audit"
      >
        <Search size={20} />
      </motion.button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end">
          <div className="w-full max-w-[520px] mx-auto rounded-t-3xl bg-[var(--surface)] border-t border-[var(--border)] max-h-[85dvh] overflow-y-auto">
            <div className="p-4">
              <div className="text-lg font-semibold text-[var(--text)]">Quick Security Audit</div>
              <div className="text-sm text-[var(--muted)]">
                Scan your environment for EDR coverage and stale agents.
              </div>

              {/* Demo content – integrate your audit hook/result list here */}
              <Card className="p-3 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
                  <span className="text-sm text-[var(--text)]">Running… (demo animation)</span>
                </div>
              </Card>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-3 py-2 rounded-xl border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  className="px-3 py-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-600)] transition-colors"
                  onClick={handleClose}
                >
                  View Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
