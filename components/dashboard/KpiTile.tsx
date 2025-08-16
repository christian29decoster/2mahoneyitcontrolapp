"use client"

import Card from "@/components/ui/Card"
import { motion, AnimatePresence } from "framer-motion"

export default function KpiTile({
  label,
  value,
  trend,
}: {
  label: string
  value: string
  trend?: { delta: string; positive: boolean }
}) {
  return (
    <Card className="p-4">
      <div className="text-sm text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-[var(--text)]">{value}</div>
      {trend && (
        <AnimatePresence mode="wait">
          <motion.div
            key={trend.delta}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className={`text-xs mt-1 ${
              trend.positive ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {trend.positive ? "▲" : "▼"} {trend.delta}
          </motion.div>
        </AnimatePresence>
      )}
    </Card>
  )
}
