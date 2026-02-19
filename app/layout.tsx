'use client'

import type { Metadata } from 'next'
import './globals.css'
import { AnimatePresence, motion } from 'framer-motion'
import AppShell from '@/components/AppShell'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="iphone-frame">
          <AppShell>
            <AnimatePresence mode="wait">
              <motion.main
                key={typeof window !== 'undefined' ? location.pathname : 'ssr'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
                className="safe px-4 pt-3 pb-8"
              >
                {children}
              </motion.main>
            </AnimatePresence>
          </AppShell>
        </div>
      </body>
    </html>
  )
}
