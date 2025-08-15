'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Download, Send, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { Card } from './Card'
import { HapticButton } from './HapticButton'
import { Badge } from './Badge'
import { useHaptics } from '@/hooks/useHaptics'
import { useAuditStore } from '@/lib/store'

interface AuditResult {
  summary: {
    unprotected: number
    stale: number
    quarantined: number
  }
  compliance: {
    status: 'pass' | 'fail'
    score: number
    issues: string[]
  }
  edrStatus: {
    total: number
    active: number
    outdated: number
    missing: number
  }
  timestamp: string
}

export function QuickAuditBlock() {
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const h = useHaptics()
  const setAuditCounts = useAuditStore(s => s.setAuditCounts)

  const runQuickAudit = async (): Promise<AuditResult> => {
    // Simulate audit process
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const unprotected = Math.floor(Math.random() * 5) + 1
    const stale = Math.floor(Math.random() * 3)
    const quarantined = Math.floor(Math.random() * 2)
    
    const totalDevices = 25
    const activeEDR = Math.floor(Math.random() * 20) + 5
    const outdatedEDR = Math.floor(Math.random() * 5)
    const missingEDR = totalDevices - activeEDR - outdatedEDR
    
    const complianceScore = Math.floor(Math.random() * 40) + 60 // 60-100
    const complianceStatus = complianceScore >= 80 ? 'pass' : 'fail'
    
    return {
      summary: { unprotected, stale, quarantined },
      compliance: {
        status: complianceStatus,
        score: complianceScore,
        issues: complianceScore < 80 ? [
          'Missing EDR on 3 devices',
          'Outdated security definitions',
          'Incomplete backup configuration'
        ] : []
      },
      edrStatus: {
        total: totalDevices,
        active: activeEDR,
        outdated: outdatedEDR,
        missing: missingEDR
      },
      timestamp: new Date().toISOString()
    }
  }

  const handleRunAudit = async () => {
    h.impact('medium')
    setIsRunning(true)
    setResult(null)
    setError(null)
    
    try {
      const auditResult = await runQuickAudit()
      setResult(auditResult)
      setAuditCounts(auditResult.summary)
      
      const total = auditResult.summary.unprotected + auditResult.summary.stale + auditResult.summary.quarantined
      if (total > 0) {
        h.warning()
      } else {
        h.success()
      }
    } catch (error) {
      console.error('Audit failed:', error)
      setError('Audit failed. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleExportPDF = () => {
    h.impact('light')
    // Simulate PDF export
    setTimeout(() => {
      h.success()
    }, 1000)
  }

  const handleSendToSOC = () => {
    h.impact('medium')
    // Simulate sending to SOC
    setTimeout(() => {
      h.success()
    }, 1000)
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text)]">Quick Security Audit</h3>
        <HapticButton
          label={isRunning ? "Scanning..." : "Run Audit"}
          onClick={handleRunAudit}
          variant="surface"
          disabled={isRunning}
        />
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-[12px]">
          <p className="text-sm text-[var(--danger)]">{error}</p>
        </div>
      )}
      
      <p className="text-sm text-[var(--muted)] mb-4">
        Scan your environment for EDR/XDR installation status, compliance issues, and security vulnerabilities.
      </p>

      {/* Loading Animation */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-[var(--surface)]/50 rounded-[16px]"
        >
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-5 h-5 text-[var(--primary)]" />
            </motion.div>
            <div>
              <p className="text-sm font-medium text-[var(--text)]">Scanning devices...</p>
              <p className="text-xs text-[var(--muted)]">Checking EDR status and compliance</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Audit Results */}
      {result && !isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Security Findings */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-[var(--surface)]/50 rounded-[16px]">
              <div className="text-2xl font-bold text-[var(--danger)]">{result.summary.unprotected}</div>
              <div className="text-xs text-[var(--muted)]">Unprotected</div>
            </div>
            <div className="text-center p-3 bg-[var(--surface)]/50 rounded-[16px]">
              <div className="text-2xl font-bold text-[var(--warning)]">{result.summary.stale}</div>
              <div className="text-xs text-[var(--muted)]">Stale</div>
            </div>
            <div className="text-center p-3 bg-[var(--surface)]/50 rounded-[16px]">
              <div className="text-2xl font-bold text-[var(--muted)]">{result.summary.quarantined}</div>
              <div className="text-xs text-[var(--muted)]">Quarantined</div>
            </div>
          </div>

          {/* EDR Status */}
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
            <h4 className="font-medium text-[var(--text)] mb-3">EDR/XDR Protection Status</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--success)]">{result.edrStatus.active}</div>
                <div className="text-xs text-[var(--muted)]">Active</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--warning)]">{result.edrStatus.outdated}</div>
                <div className="text-xs text-[var(--muted)]">Outdated</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-[var(--danger)]">{result.edrStatus.missing}</div>
                <div className="text-xs text-[var(--muted)]">Missing</div>
              </div>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[var(--text)]">Compliance Report</h4>
              <Badge variant={result.compliance.status === 'pass' ? 'accent' : 'destructive'}>
                {result.compliance.status === 'pass' ? 'PASS' : 'FAIL'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 bg-[var(--surface)] rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    result.compliance.status === 'pass' ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'
                  }`}
                  style={{ width: `${result.compliance.score}%` }}
                />
              </div>
              <span className="text-sm font-medium text-[var(--text)]">{result.compliance.score}%</span>
            </div>
            {result.compliance.issues.length > 0 && (
              <div className="space-y-1">
                {result.compliance.issues.map((issue, index) => (
                  <p key={index} className="text-xs text-[var(--muted)]">• {issue}</p>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <HapticButton
              label="Export PDF"
              variant="surface"
              onClick={handleExportPDF}
              className="flex-1"
            />
            <HapticButton
              label="Send to SOC"
              onClick={handleSendToSOC}
              className="flex-1"
            />
          </div>
        </motion.div>
      )}

      {/* Default State */}
      {!result && !isRunning && (
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-[var(--surface)]/50 rounded-[16px]">
            <div className="text-2xl font-bold text-[var(--danger)]">2</div>
            <div className="text-xs text-[var(--muted)]">Unprotected</div>
          </div>
          <div className="text-center p-3 bg-[var(--surface)]/50 rounded-[16px]">
            <div className="text-2xl font-bold text-[var(--warning)]">1</div>
            <div className="text-xs text-[var(--muted)]">Stale</div>
          </div>
          <div className="text-center p-3 bg-[var(--surface)]/50 rounded-[16px]">
            <div className="text-2xl font-bold text-[var(--muted)]">0</div>
            <div className="text-xs text-[var(--muted)]">Quarantined</div>
          </div>
        </div>
      )}
    </Card>
  )
}
