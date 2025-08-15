'use client'

import { motion } from 'framer-motion'
import { Badge } from '../Badge'
import { useProjectsStore } from '@/lib/projects.store'
import { Filter, X } from 'lucide-react'

export function ProjectFilterBar() {
  const { filters, setFilters } = useProjectsStore()

  const clearFilter = (key: keyof typeof filters) => {
    setFilters({ [key]: '' })
  }

  const clearAllFilters = () => {
    setFilters({ status: '', category: '', priority: '', location: '' })
  }

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '')

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-sm text-[var(--text)]"
        >
          <option value="">All Status</option>
          <option value="Draft">Draft</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Needs Info">Needs Info</option>
          <option value="Approved">Approved</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-sm text-[var(--text)]"
        >
          <option value="">All Categories</option>
          <option value="Building Cabling">Building Cabling</option>
          <option value="Server">Server</option>
          <option value="Workstation">Workstation</option>
          <option value="Network">Network</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value })}
          className="px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-sm text-[var(--text)]"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <select
          value={filters.location}
          onChange={(e) => setFilters({ location: e.target.value })}
          className="px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-sm text-[var(--text)]"
        >
          <option value="">All Locations</option>
          <option value="HQ Frankfurt">HQ Frankfurt</option>
          <option value="NYC Office">NYC Office</option>
          <option value="Austin Office">Austin Office</option>
          <option value="Seattle Office">Seattle Office</option>
        </select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[var(--muted)]" />
          <span className="text-sm text-[var(--muted)]">Active filters:</span>
          
          {filters.status && (
            <Badge variant="secondary" className="text-xs">
              Status: {filters.status}
              <button
                onClick={() => clearFilter('status')}
                className="ml-1 hover:text-[var(--danger)]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.category && (
            <Badge variant="secondary" className="text-xs">
              Category: {filters.category}
              <button
                onClick={() => clearFilter('category')}
                className="ml-1 hover:text-[var(--danger)]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.priority && (
            <Badge variant="secondary" className="text-xs">
              Priority: {filters.priority}
              <button
                onClick={() => clearFilter('priority')}
                className="ml-1 hover:text-[var(--danger)]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {filters.location && (
            <Badge variant="secondary" className="text-xs">
              Location: {filters.location}
              <button
                onClick={() => clearFilter('location')}
                className="ml-1 hover:text-[var(--danger)]"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          <button
            onClick={clearAllFilters}
            className="text-xs text-[var(--primary)] hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </motion.div>
  )
}
