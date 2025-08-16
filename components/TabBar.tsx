'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Shield, 
  Building2, 
  FileText, 
  FolderOpen, 
  User,
  TrendingUp
} from 'lucide-react'
import { useHaptics } from '@/hooks/useHaptics'

const tabs = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/devices', icon: Shield, label: 'Devices' },
  { path: '/company', icon: Building2, label: 'Company' },
  { path: '/contracts', icon: FileText, label: 'Contracts' },
  { path: '/projects', icon: FolderOpen, label: 'Projects' },
  { path: '/marketplace', icon: TrendingUp, label: 'Marketplace' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const h = useHaptics()

  const handleTabClick = (path: string) => {
    h.impact('light')
    router.push(path)
  }

  return (
    <motion.div 
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center bg-[#1C1C1E]/90 backdrop-blur-xl border border-[#2C2C2E] rounded-2xl px-2 py-2 shadow-2xl">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path
          const Icon = tab.icon
          
          return (
            <motion.button
              key={tab.path}
              onClick={() => handleTabClick(tab.path)}
              className={`relative p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-[#3B82F6] bg-[#3B82F6]/10' 
                  : 'text-[#8E8E93] hover:text-[#A1A1A6] hover:bg-[#2C2C2E]/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={20} />
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#3B82F6] rounded-full"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1C1C1E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                {tab.label}
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
