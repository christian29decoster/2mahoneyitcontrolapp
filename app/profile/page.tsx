'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Bell, Shield, Settings, LogOut } from 'lucide-react'
import { Card } from '@/components/Card'
import { HapticButton } from '@/components/HapticButton'
import { Toast, ToastType } from '@/components/Toasts'
import { stagger } from '@/lib/ui/motion'
import { useHaptics } from '@/hooks/useHaptics'

export default function ProfilePage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  })
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const h = useHaptics()
  
  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }
  
  const handleToggleNotification = (type: keyof typeof notifications) => {
    h.impact('light')
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
    addToast('success', `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${notifications[type] ? 'disabled' : 'enabled'}`)
  }
  
  const handleLogout = () => {
    h.impact('medium')
    addToast('info', 'Logout', 'Logout functionality would be implemented in production.')
  }
  
  return (
    <>
      <motion.div className="space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Profile Header */}
        <Card>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold text-white">JD</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)]">John Doe</h1>
              <p className="text-[var(--muted)]">Chief Information Security Officer</p>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[var(--muted)]" />
              <div>
                <p className="text-[var(--text)]">john.doe@acme.com</p>
                <p className="text-sm text-[var(--muted)]">Primary email</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-[var(--muted)]" />
              <div>
                <p className="text-[var(--text)]">+1 (555) 123-4567</p>
                <p className="text-sm text-[var(--muted)]">Mobile</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[var(--muted)]" />
                <div>
                  <p className="text-[var(--text)]">Email Notifications</p>
                  <p className="text-sm text-[var(--muted)]">Security alerts and updates</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleNotification('email')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.email ? 'bg-[var(--primary)]' : 'bg-[var(--surface)]'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-[var(--muted)]" />
                <div>
                  <p className="text-[var(--text)]">Push Notifications</p>
                  <p className="text-sm text-[var(--muted)]">Real-time alerts</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleNotification('push')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.push ? 'bg-[var(--primary)]' : 'bg-[var(--surface)]'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.push ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[var(--muted)]" />
                <div>
                  <p className="text-[var(--text)]">SMS Notifications</p>
                  <p className="text-sm text-[var(--muted)]">Critical alerts only</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleNotification('sms')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications.sms ? 'bg-[var(--primary)]' : 'bg-[var(--surface)]'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications.sms ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Security Status */}
        <Card>
          <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Security Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[var(--success)]/10 rounded-[16px] border border-[var(--success)]/20">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-[var(--success)]" />
                <div>
                  <p className="text-[var(--text)] font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-[var(--muted)]">Enabled</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-[var(--success)] rounded-full" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-[var(--success)]/10 rounded-[16px] border border-[var(--success)]/20">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-[var(--success)]" />
                <div>
                  <p className="text-[var(--text)] font-medium">Last Login</p>
                  <p className="text-sm text-[var(--muted)]">Today at 9:24 AM</p>
                </div>
              </div>
              <div className="w-2 h-2 bg-[var(--success)] rounded-full" />
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <div className="space-y-3">
          <HapticButton
            label="Account Settings"
            variant="surface"
            onClick={() => addToast('info', 'Account Settings', 'Settings would be available in production.')}
            className="w-full"
          />
          
          <HapticButton
            label="Logout"
            variant="danger"
            onClick={handleLogout}
            className="w-full"
          />
        </div>
      </motion.div>

      {/* Toast Manager */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            />
          </div>
        ))}
      </div>
    </>
  )
}
