 "use client"

import { Home, Shield, Building2, FileText, FolderOpen, User, TrendingUp, LineChart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import IconButton from "@/components/ui/IconButton"
import { useHaptics } from "@/hooks/useHaptics"

const TABS = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/devices", icon: Shield, label: "Devices" },
  { href: "/company", icon: Building2, label: "Company" },
  { href: "/contracts", icon: FileText, label: "Contracts" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/mahoney-grow", icon: LineChart, label: "Mahoney Grow" },
  { href: "/marketplace", icon: TrendingUp, label: "Marketplace" },
  { href: "/profile", icon: User, label: "Profile" },
]

export default function BottomNav() {
  const path = usePathname()
  const h = useHaptics()

  const handleTabClick = () => {
    h.impact('light')
  }

  return (
    <motion.div
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex gap-2 px-2 py-2 rounded-[22px] border border-[var(--border)] bg-[rgba(21,26,44,.75)] backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,.45)]">
        {TABS.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="block" onClick={handleTabClick}>
            <IconButton active={path === href} title={label}>
              <Icon size={20} />
            </IconButton>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
