'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectFilterBar } from '@/components/projects/ProjectFilterBar'
import { ProjectWizard } from '@/components/projects/ProjectWizard'
import { ProjectDetailSheet } from '@/components/projects/ProjectDetailSheet'
import { useProjectsStore } from '@/lib/projects.store'
import { Project } from '@/lib/projects'
import { useHaptics } from '@/hooks/useHaptics'
import { stagger } from '@/lib/ui/motion'
import { Plus, FolderOpen, Clock, CheckCircle } from 'lucide-react'

export default function ProjectsPage() {
  const [showWizard, setShowWizard] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDetailSheet, setShowDetailSheet] = useState(false)
  
  const searchParams = useSearchParams()
  const { filteredProjects } = useProjectsStore()
  const h = useHaptics()

  // Handle deep links
  useEffect(() => {
    const newParam = searchParams.get('new')
    const refParam = searchParams.get('ref')
    
    if (newParam === '1') {
      setShowWizard(true)
    }
    
    if (refParam) {
      const project = filteredProjects.find(p => p.ref === refParam)
      if (project) {
        setSelectedProject(project)
        setShowDetailSheet(true)
      }
    }
  }, [searchParams, filteredProjects])

  const handleProjectClick = (project: Project) => {
    h.impact('medium')
    setSelectedProject(project)
    setShowDetailSheet(true)
  }

  const handleNewProject = () => {
    h.impact('medium')
    setShowWizard(true)
  }

  const handleCloseDetailSheet = () => {
    setShowDetailSheet(false)
    setSelectedProject(null)
  }

  const getStatusCounts = () => {
    const counts = {
      active: 0,
      completed: 0,
      pending: 0
    }
    
    filteredProjects.forEach(project => {
      if (['Completed', 'Closed'].includes(project.status)) {
        counts.completed++
      } else if (['Submitted', 'Under Review', 'Needs Info', 'Approved', 'Scheduled', 'In Progress', 'Blocked'].includes(project.status)) {
        counts.active++
      } else {
        counts.pending++
      }
    })
    
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text)]">Projects</h1>
            <p className="text-[var(--muted)]">Manage and track your project requests</p>
          </div>
          <HapticButton
            label="New Project"
            onClick={handleNewProject}
            className="flex items-center space-x-2"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--primary)]/10 rounded-[8px] flex items-center justify-center">
                <FolderOpen className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text)]">{statusCounts.active}</p>
                <p className="text-xs text-[var(--muted)]">Active</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--warning)]/10 rounded-[8px] flex items-center justify-center">
                <Clock className="w-4 h-4 text-[var(--warning)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text)]">{statusCounts.pending}</p>
                <p className="text-xs text-[var(--muted)]">Pending</p>
              </div>
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[var(--success)]/10 rounded-[8px] flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[var(--success)]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--text)]">{statusCounts.completed}</p>
                <p className="text-xs text-[var(--muted)]">Completed</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <ProjectFilterBar />

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleProjectClick}
              />
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-[var(--muted)] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[var(--text)] mb-2">No projects found</h3>
                <p className="text-[var(--muted)] mb-4">
                  {Object.values(useProjectsStore.getState().filters).some(f => f !== '') 
                    ? 'Try adjusting your filters'
                    : 'Get started by creating your first project'
                  }
                </p>
                {!Object.values(useProjectsStore.getState().filters).some(f => f !== '') && (
                  <HapticButton
                    label="Create Project"
                    onClick={handleNewProject}
                  />
                )}
              </div>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Project Wizard */}
      <ProjectWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
      />

      {/* Project Detail Sheet */}
      <ProjectDetailSheet
        project={selectedProject}
        isOpen={showDetailSheet}
        onClose={handleCloseDetailSheet}
      />
    </>
  )
}
