'use client'

import { motion } from 'framer-motion'
import { Badge } from '../Badge'
import { Project } from '@/lib/projects'
import { formatCurrency } from '@/lib/pricing'
import { projectCostEstimates } from '@/lib/projects'
import { Calendar, MapPin, Clock, User } from 'lucide-react'

interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const estimate = projectCostEstimates[project.category]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onClick(project)}
      className="p-4 bg-[var(--surface)]/50 rounded-[16px] border border-[var(--border)] cursor-pointer hover:bg-[var(--surface)]/70 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text)] mb-1">{project.title}</h3>
          <p className="text-sm text-[var(--muted)]">{project.ref}</p>
        </div>
        <Badge variant={getStatusColor(project.status) as any} className="text-xs">
          {project.status}
        </Badge>
      </div>

      <div className="flex items-center space-x-2 mb-3">
        <Badge variant="secondary" className="text-xs">
          {project.category}
        </Badge>
        <Badge variant={getPriorityColor(project.priority) as any} className="text-xs">
          {project.priority}
        </Badge>
        {project.onsite && (
          <Badge variant="accent" className="text-xs">
            On-site
          </Badge>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2 text-xs text-[var(--muted)]">
          <MapPin className="w-3 h-3" />
          <span>{project.location.name}</span>
        </div>
        {project.desiredStartISO && (
          <div className="flex items-center space-x-2 text-xs text-[var(--muted)]">
            <Calendar className="w-3 h-3" />
            <span>Start: {formatDate(project.desiredStartISO)}</span>
          </div>
        )}
        <div className="flex items-center space-x-2 text-xs text-[var(--muted)]">
          <User className="w-3 h-3" />
          <span>{project.createdBy}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-[var(--muted)]">
          <Clock className="w-3 h-3" />
          <span>Updated {formatDate(project.updatedAtISO)}</span>
        </div>
        {estimate && (
          <div className="text-xs text-[var(--muted)]">
            Est. {formatCurrency(estimate.package)}
          </div>
        )}
      </div>
    </motion.div>
  )
}
