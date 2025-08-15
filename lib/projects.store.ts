import { create } from 'zustand'
import { Project, demoProjects } from './projects'

interface ProjectsStore {
  projects: Project[]
  selectedProject: Project | null
  filters: {
    status: string
    category: string
    priority: string
    location: string
  }
  
  // Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  setSelectedProject: (project: Project | null) => void
  setFilters: (filters: Partial<ProjectsStore['filters']>) => void
  addComment: (projectId: string, comment: { atISO: string; by: string; text: string }) => void
  updateStatus: (projectId: string, status: Project['status']) => void
  
  // Computed
  filteredProjects: Project[]
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: demoProjects,
  selectedProject: null,
  filters: {
    status: '',
    category: '',
    priority: '',
    location: ''
  },

  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [project, ...state.projects]
  })),
  
  updateProject: (id, updates) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === id ? { ...project, ...updates, updatedAtISO: new Date().toISOString() } : project
    )
  })),
  
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  addComment: (projectId, comment) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === projectId
        ? {
            ...project,
            comments: [comment, ...project.comments],
            updatedAtISO: new Date().toISOString()
          }
        : project
    )
  })),
  
  updateStatus: (projectId, status) => set((state) => ({
    projects: state.projects.map(project =>
      project.id === projectId
        ? {
            ...project,
            status,
            updatedAtISO: new Date().toISOString()
          }
        : project
    )
  })),

  get filteredProjects() {
    const { projects, filters } = get()
    return projects.filter(project => {
      if (filters.status && project.status !== filters.status) return false
      if (filters.category && project.category !== filters.category) return false
      if (filters.priority && project.priority !== filters.priority) return false
      if (filters.location && project.location.name !== filters.location) return false
      return true
    })
  }
}))
