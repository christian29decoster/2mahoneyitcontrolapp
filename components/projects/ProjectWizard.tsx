'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sheet } from '../Sheets'
import { HapticButton } from '../HapticButton'
import { Badge } from '../Badge'
import { useHaptics } from '@/hooks/useHaptics'
import { useProjectsStore } from '@/lib/projects.store'
import { useActivityStore } from '@/lib/activity.store'
import { categorySubcategories, projectCostEstimates } from '@/lib/projects'
import { formatCurrency } from '@/lib/pricing'
import { 
  Building, 
  Server, 
  Monitor, 
  Wifi, 
  MoreHorizontal,
  CheckCircle,
  Calendar,
  MapPin,
  AlertCircle,
  FileText
} from 'lucide-react'

interface ProjectWizardProps {
  isOpen: boolean
  onClose: () => void
  preselectedCategory?: string
}

type WizardStep = 1 | 2 | 3 | 4

interface ProjectForm {
  category: string
  subcategories: string[]
  title: string
  description: string
  location: string
  desiredStartISO: string
  desiredEndISO: string
  onsite: boolean
  dependencies: string
  attachments: string[]
  relatedAssets: string[]
  budgetContact: {
    name: string
    email: string
    role: string
  }
  priority: 'Low' | 'Normal' | 'High' | 'Critical'
}

export function ProjectWizard({ isOpen, onClose, preselectedCategory }: ProjectWizardProps) {
  const [step, setStep] = useState<WizardStep>(1)
  const [form, setForm] = useState<ProjectForm>({
    category: preselectedCategory || '',
    subcategories: [],
    title: '',
    description: '',
    location: '',
    desiredStartISO: '',
    desiredEndISO: '',
    onsite: false,
    dependencies: '',
    attachments: [],
    relatedAssets: [],
    budgetContact: { name: '', email: '', role: '' },
    priority: 'Normal'
  })

  const h = useHaptics()
  const { addProject } = useProjectsStore()
  const addActivity = useActivityStore((s) => s.addActivity)

  const categories = [
    { key: 'Building Cabling', label: 'Building Cabling', icon: Building },
    { key: 'Server', label: 'Server', icon: Server },
    { key: 'Workstation', label: 'Workstation', icon: Monitor },
    { key: 'Network', label: 'Network', icon: Wifi },
    { key: 'Other', label: 'Other', icon: MoreHorizontal }
  ]

  const locations = [
    'HQ Frankfurt',
    'NYC Office', 
    'Austin Office',
    'Seattle Office',
    'New location'
  ]

  const priorities = ['Low', 'Normal', 'High', 'Critical'] as const

  const handleNext = () => {
    h.impact('medium')
    if (step < 4) {
      setStep((step + 1) as WizardStep)
    }
  }

  const handleBack = () => {
    h.impact('light')
    if (step > 1) {
      setStep((step - 1) as WizardStep)
    }
  }

  const handleSubmit = () => {
    h.success()
    
    const newProject = {
      id: `p${Date.now()}`,
      ref: `PRJ-${Math.floor(Math.random() * 9000) + 1000}`,
      title: form.title,
      category: form.category as any,
      subcategories: form.subcategories,
      description: form.description,
      priority: form.priority,
      onsite: form.onsite,
      location: { name: form.location },
      relatedAssetIds: form.relatedAssets,
      desiredStartISO: form.desiredStartISO,
      desiredEndISO: form.desiredEndISO,
      status: 'Submitted' as const,
      createdBy: 'user@acme.com',
      createdAtISO: new Date().toISOString(),
      updatedAtISO: new Date().toISOString(),
      approvals: form.budgetContact.name ? {
        budgetContact: form.budgetContact,
        status: 'pending' as const
      } : undefined,
      comments: []
    }

    addProject(newProject)
    addActivity({ type: 'added', title: 'Projekt angelegt', message: newProject.title })
    onClose()
    setStep(1)
    setForm({
      category: '',
      subcategories: [],
      title: '',
      description: '',
      location: '',
      desiredStartISO: '',
      desiredEndISO: '',
      onsite: false,
      dependencies: '',
      attachments: [],
      relatedAssets: [],
      budgetContact: { name: '', email: '', role: '' },
      priority: 'Normal'
    })
  }

  const canProceed = () => {
    switch (step) {
      case 1: return form.category !== ''
      case 2: return form.subcategories.length > 0
      case 3: return form.title !== '' && form.description !== '' && form.location !== ''
      case 4: return true
      default: return false
    }
  }

  const estimate = form.category ? projectCostEstimates[form.category as keyof typeof projectCostEstimates] : null

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      maxHeight="90vh"
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step 
                  ? 'bg-[var(--primary)] text-white' 
                  : 'bg-[var(--surface)] text-[var(--muted)]'
              }`}>
                {stepNumber < step ? <CheckCircle className="w-4 h-4" /> : stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-8 h-1 mx-2 ${
                  stepNumber < step ? 'bg-[var(--primary)]' : 'bg-[var(--surface)]'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Category */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-[var(--text)]">Select Category</h3>
              <p className="text-sm text-[var(--muted)]">Choose the primary category for your project</p>
              
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <div
                      key={category.key}
                      onClick={() => {
                        h.impact('light')
                        setForm(prev => ({ ...prev, category: category.key }))
                      }}
                      className={`p-4 rounded-[16px] border cursor-pointer transition-colors ${
                        form.category === category.key
                          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                          : 'border-[var(--border)] bg-[var(--surface)]/50 hover:bg-[var(--surface)]/70'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-6 h-6 text-[var(--primary)]" />
                        <span className="font-medium text-[var(--text)]">{category.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Subcategories */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-[var(--text)]">Select Subcategories</h3>
              <p className="text-sm text-[var(--muted)]">Choose all relevant subcategories</p>
              
              <div className="space-y-3">
                {categorySubcategories[form.category as keyof typeof categorySubcategories]?.map((subcategory) => (
                  <label key={subcategory} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.subcategories.includes(subcategory)}
                      onChange={(e) => {
                        h.impact('light')
                        if (e.target.checked) {
                          setForm(prev => ({
                            ...prev,
                            subcategories: [...prev.subcategories, subcategory]
                          }))
                        } else {
                          setForm(prev => ({
                            ...prev,
                            subcategories: prev.subcategories.filter(s => s !== subcategory)
                          }))
                        }
                      }}
                      className="w-4 h-4 text-[var(--primary)] bg-[var(--surface)] border-[var(--border)] rounded"
                    />
                    <span className="text-[var(--text)]">{subcategory}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Scope & Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-[var(--text)]">Project Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief project title"
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What problem are we solving? Deliverables? Success criteria?"
                    rows={4}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[var(--text)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Location</label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[var(--text)]"
                  >
                    <option value="">Select location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Start Date</label>
                    <input
                      type="date"
                      value={form.desiredStartISO}
                      onChange={(e) => setForm(prev => ({ ...prev, desiredStartISO: e.target.value }))}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">End Date</label>
                    <input
                      type="date"
                      value={form.desiredEndISO}
                      onChange={(e) => setForm(prev => ({ ...prev, desiredEndISO: e.target.value }))}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[var(--text)]"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={form.onsite}
                    onChange={(e) => setForm(prev => ({ ...prev, onsite: e.target.checked }))}
                    className="w-4 h-4 text-[var(--primary)] bg-[var(--surface)] border-[var(--border)] rounded"
                  />
                  <span className="text-[var(--text)]">On-site required</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Priority</label>
                  <div className="flex space-x-2">
                    {priorities.map(priority => (
                      <button
                        key={priority}
                        onClick={() => setForm(prev => ({ ...prev, priority }))}
                        className={`px-3 py-1 rounded-[8px] text-sm ${
                          form.priority === priority
                            ? 'bg-[var(--primary)] text-white'
                            : 'bg-[var(--surface)] text-[var(--text)]'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-[var(--text)]">Review & Submit</h3>
              
              <div className="space-y-4">
                <div className="bg-[var(--surface)]/50 rounded-[16px] p-4">
                  <h4 className="font-medium text-[var(--text)] mb-2">Project Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {form.title}</div>
                    <div><strong>Category:</strong> {form.category}</div>
                    <div><strong>Subcategories:</strong> {form.subcategories.join(', ')}</div>
                    <div><strong>Location:</strong> {form.location}</div>
                    <div><strong>Priority:</strong> {form.priority}</div>
                    <div><strong>On-site:</strong> {form.onsite ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                {estimate && (
                  <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-[16px] p-4">
                    <h4 className="font-medium text-[var(--text)] mb-2">Cost Estimate</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Package Estimate:</strong> {formatCurrency(estimate.package)}</div>
                      <div><strong>Hourly Rate:</strong> {formatCurrency(estimate.hourly)}/hour</div>
                      <p className="text-xs text-[var(--muted)]">
                        This will generate a formal quote for approval.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t border-[var(--border)]">
          <HapticButton
            label="Back"
            onClick={handleBack}
            variant="surface"
            disabled={step === 1}
          />
          
          {step < 4 ? (
            <HapticButton
              label="Next"
              onClick={handleNext}
              disabled={!canProceed()}
            />
          ) : (
            <HapticButton
              label="Submit Project"
              onClick={handleSubmit}
            />
          )}
        </div>
      </div>
    </Sheet>
  )
}
