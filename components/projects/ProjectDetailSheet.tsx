'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sheet } from '../Sheets'
import { HapticButton } from '../HapticButton'
import { Badge } from '../Badge'
import { MiniMap } from '../MiniMap'
import { useHaptics } from '@/hooks/useHaptics'
import { useProjectsStore } from '@/lib/projects.store'
import { Project } from '@/lib/projects'
import { formatCurrency } from '@/lib/pricing'
import { projectCostEstimates } from '@/lib/projects'
import { 
  Calendar, 
  MapPin, 
  User, 
  MessageSquare, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Pause,
  X
} from 'lucide-react'

interface ProjectDetailSheetProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectDetailSheet({ project, isOpen, onClose }: ProjectDetailSheetProps) {
  const [newComment, setNewComment] = useState('')
  const [showQuoteStub, setShowQuoteStub] = useState(false)
  
  const h = useHaptics()
  const { updateStatus, addComment } = useProjectsStore()

  if (!project) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'secondary'
      case 'Submitted': return 'secondary'
      case 'Under Review': return 'warning'
      case 'Needs Info': return 'warning'
      case 'Approved': return 'accent'
      case 'Scheduled': return 'accent'
      case 'In Progress': return 'primary'
      case 'Blocked': return 'destructive'
      case 'Completed': return 'success'
      case 'Closed': return 'secondary'
      default: return 'secondary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'secondary'
      case 'Normal': return 'accent'
      case 'High': return 'warning'
      case 'Critical': return 'destructive'
      default: return 'secondary'
    }
  }

  const handleStatusUpdate = (newStatus: Project['status']) => {
    h.impact('medium')
    updateStatus(project.id, newStatus)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      h.impact('light')
      addComment(project.id, {
        atISO: new Date().toISOString(),
        by: 'user@acme.com',
        text: newComment.trim()
      })
      setNewComment('')
    }
  }

  const handleCreateQuote = () => {
    h.impact('medium')
    setShowQuoteStub(true)
  }

  const estimate = projectCostEstimates[project.category]

  const canUpdateStatus = (currentStatus: string, targetStatus: string) => {
    const statusFlow = {
      'Submitted': ['Under Review'],
      'Under Review': ['Approved', 'Needs Info'],
      'Needs Info': ['Under Review'],
      'Approved': ['Scheduled'],
      'Scheduled': ['In Progress'],
      'In Progress': ['Blocked', 'Completed'],
      'Blocked': ['In Progress'],
      'Completed': ['Closed']
    }
    return statusFlow[currentStatus as keyof typeof statusFlow]?.includes(targetStatus)
  }

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={onClose}
        title={project.title}
        maxHeight="90vh"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">{project.title}</h2>
              <p className="text-sm text-[var(--muted)]">{project.ref}</p>
            </div>
            <Badge variant={getStatusColor(project.status) as any}>
              {project.status}
            </Badge>
          </div>

          {/* Summary */}
          <div className="bg-[var(--surface)]/50 rounded-[16px] p-4 space-y-3">
            <h3 className="font-medium text-[var(--text)]">Summary</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--muted)]">Category:</span>
                <div className="font-medium text-[var(--text)]">{project.category}</div>
              </div>
              <div>
                <span className="text-[var(--muted)]">Priority:</span>
                <Badge variant={getPriorityColor(project.priority) as any} className="text-xs">
                  {project.priority}
                </Badge>
              </div>
              <div>
                <span className="text-[var(--muted)]">Location:</span>
                <div className="font-medium text-[var(--text)]">{project.location.name}</div>
              </div>
              <div>
                <span className="text-[var(--muted)]">On-site:</span>
                <div className="font-medium text-[var(--text)]">{project.onsite ? 'Yes' : 'No'}</div>
              </div>
            </div>

            {project.subcategories.length > 0 && (
              <div>
                <span className="text-[var(--muted)] text-sm">Subcategories:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.subcategories.map((subcategory, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {subcategory}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {project.location.lat && project.location.lng && (
              <div>
                <span className="text-[var(--muted)] text-sm">Location:</span>
                <div className="mt-2">
                  <MiniMap
                    lat={project.location.lat}
                    lng={project.location.lng}
                    name={project.location.name}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Scope */}
          <div className="space-y-3">
            <h3 className="font-medium text-[var(--text)]">Scope</h3>
            <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
              <p className="text-sm text-[var(--text)]">{project.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-medium text-[var(--text)]">Timeline</h3>
            <div className="bg-[var(--surface)]/50 rounded-[16px] p-4 space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[var(--muted)]" />
                <span className="text-[var(--muted)]">Created:</span>
                <span className="text-[var(--text)]">{formatDate(project.createdAtISO)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[var(--muted)]" />
                <span className="text-[var(--muted)]">Updated:</span>
                <span className="text-[var(--text)]">{formatDate(project.updatedAtISO)}</span>
              </div>
              {project.desiredStartISO && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[var(--muted)]" />
                  <span className="text-[var(--muted)]">Desired Start:</span>
                  <span className="text-[var(--text)]">{formatDate(project.desiredStartISO)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <h3 className="font-medium text-[var(--text)]">Comments</h3>
            
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {project.comments.map((comment, index) => (
                <div key={index} className="bg-[var(--surface)]/50 rounded-[12px] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--text)]">{comment.by}</span>
                    <span className="text-xs text-[var(--muted)]">{formatDate(comment.atISO)}</span>
                  </div>
                  <p className="text-sm text-[var(--text)]">{comment.text}</p>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-sm text-[var(--text)]"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <HapticButton
                label="Add"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="text-xs"
              />
            </div>
          </div>

          {/* Cost Estimate */}
          {estimate && (
            <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-[16px] p-4">
              <h3 className="font-medium text-[var(--text)] mb-2">Cost Estimate</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Package Estimate:</strong> {formatCurrency(estimate.package)}</div>
                <div><strong>Hourly Rate:</strong> {formatCurrency(estimate.hourly)}/hour</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <h3 className="font-medium text-[var(--text)]">Actions</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {canUpdateStatus(project.status, 'Under Review') && (
                <HapticButton
                  label="Start Review"
                  onClick={() => handleStatusUpdate('Under Review')}
                  variant="primary"
                  className="text-xs"
                />
              )}
              
              {canUpdateStatus(project.status, 'Approved') && (
                <HapticButton
                  label="Approve"
                  onClick={() => handleStatusUpdate('Approved')}
                  variant="primary"
                  className="text-xs"
                />
              )}
              
                             {canUpdateStatus(project.status, 'Needs Info') && (
                 <HapticButton
                   label="Request Info"
                   onClick={() => handleStatusUpdate('Needs Info')}
                   variant="surface"
                   className="text-xs"
                 />
               )}
              
                             {canUpdateStatus(project.status, 'Scheduled') && (
                 <HapticButton
                   label="Schedule"
                   onClick={() => handleStatusUpdate('Scheduled')}
                   variant="primary"
                   className="text-xs"
                 />
               )}
              
              {canUpdateStatus(project.status, 'In Progress') && (
                <HapticButton
                  label="Start"
                  onClick={() => handleStatusUpdate('In Progress')}
                  variant="primary"
                  className="text-xs"
                />
              )}
              
                             {canUpdateStatus(project.status, 'Blocked') && (
                 <HapticButton
                   label="Mark Blocked"
                   onClick={() => handleStatusUpdate('Blocked')}
                   variant="surface"
                   className="text-xs"
                 />
               )}
              
                             {canUpdateStatus(project.status, 'Completed') && (
                 <HapticButton
                   label="Complete"
                   onClick={() => handleStatusUpdate('Completed')}
                   variant="primary"
                   className="text-xs"
                 />
               )}
              
                             {canUpdateStatus(project.status, 'Closed') && (
                 <HapticButton
                   label="Close"
                   onClick={() => handleStatusUpdate('Closed')}
                   variant="surface"
                   className="text-xs"
                 />
               )}
            </div>

            {/* Create Quote Button */}
            {project.status === 'Approved' && (
              <HapticButton
                label="Create Quote"
                onClick={handleCreateQuote}
                variant="primary"
                className="w-full"
              />
            )}
          </div>
        </div>
      </Sheet>

      {/* Quote Stub */}
      {showQuoteStub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg)] rounded-[16px] p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[var(--text)]">Create Quote</h3>
              <button
                onClick={() => setShowQuoteStub(false)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[var(--surface)]/50 rounded-[12px] p-4">
                <h4 className="font-medium text-[var(--text)] mb-2">{project.title}</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Category:</strong> {project.category}</div>
                  <div><strong>Estimated Cost:</strong> {estimate ? formatCurrency(estimate.package) : 'TBD'}</div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <HapticButton
                  label="Cancel"
                  onClick={() => setShowQuoteStub(false)}
                  variant="surface"
                  className="flex-1"
                />
                <HapticButton
                  label="Send to Contracts"
                  onClick={() => {
                    h.success()
                    setShowQuoteStub(false)
                    // TODO: Add to contracts pending requests
                  }}
                  className="flex-1"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
