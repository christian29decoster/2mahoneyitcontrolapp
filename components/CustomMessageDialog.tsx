'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { HapticButton } from './HapticButton'

export default function CustomMessageDialog({ 
  open, 
  onOpenChange, 
  onSend 
}: { 
  open: boolean
  onOpenChange: (v: boolean) => void
  onSend: (msg: string) => void 
}) {
  const [msg, setMsg] = useState('')

  const handleSend = () => {
    if (msg.trim()) {
      onSend(msg.trim())
      setMsg('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Custom message to SOC</DialogTitle>
        </DialogHeader>
        <textarea
          rows={6}
          className="w-full rounded-xl bg-[var(--surface)] border border-[var(--border)] p-3 text-sm text-[var(--text)] placeholder-[var(--muted)]"
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <DialogFooter className="gap-2">
          <HapticButton 
            variant="surface" 
            label="Cancel" 
            onClick={() => onOpenChange(false)} 
          />
          <HapticButton 
            label="Send" 
            onClick={handleSend}
            disabled={!msg.trim()}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
