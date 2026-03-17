'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Bell, Shield, Settings, Camera } from 'lucide-react'
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
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; title: string; message?: string }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      h.impact('medium')
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
        addToast('success', 'Profile Picture Updated', 'Your profile picture has been updated successfully.')
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileUpload = () => {
    h.impact('light')
    fileInputRef.current?.click()
  }

  return (
    <>
      <motion.div className="max-w-2xl mx-auto space-y-6" variants={stagger} initial="initial" animate="animate">
        {/* Page header */}
        <div className="mb-2">
          <h1 className="text-xl font-semibold text-[var(--text)]">Profile</h1>
          <p className="text-sm text-[var(--muted)]">Personal details, notifications, and security</p>
        </div>

        {/* Profile Header */}
        <Card>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)] rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                {profileImage ? (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profileImage}
                      alt="Profile picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 64 64" className="text-white shrink-0">
                      <circle cx="32" cy="20" r="8" fill="currentColor" />
                      <path d="M8 56c0-13.3 10.7-24 24-24s24 10.7 24 24" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={triggerFileUpload}
                className="absolute -bottom-0.5 -right-0.5 w-9 h-9 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-lg hover:bg-[var(--primary-600)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
                title="Upload profile picture"
                aria-label="Upload profile picture"
              >
                <Camera size={18} className="text-white" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-hidden
            />
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[var(--text)]">John Doe</h2>
              <p className="text-sm text-[var(--muted)]">Chief Information Security Officer</p>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[var(--muted)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text)]">Contact</h2>
              <p className="text-xs text-[var(--muted)]">Email and phone</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="block text-xs font-medium text-[var(--muted)] mb-1">Email</p>
              <p className="text-[var(--text)]">john.doe@acme.com</p>
            </div>
            <div>
              <p className="block text-xs font-medium text-[var(--muted)] mb-1">Phone</p>
              <p className="text-[var(--text)]">+1 (555) 123-4567</p>
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-[var(--muted)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text)]">Notifications</h2>
              <p className="text-xs text-[var(--muted)]">Email, push, and SMS</p>
            </div>
          </div>
          <div className="space-y-4 divide-y divide-[var(--border)]">
            <div className="flex items-center justify-between gap-4 pt-0 first:pt-0">
              <div className="min-w-0">
                <p className="text-[var(--text)] font-medium">Email</p>
                <p className="text-xs text-[var(--muted)]">Security alerts and updates</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('email')}
                className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 shrink-0 ${
                  notifications.email ? 'bg-[var(--primary)]' : 'bg-[var(--surface-2)]'
                }`}
                aria-pressed={notifications.email}
                aria-label="Email notifications"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notifications.email ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="text-[var(--text)] font-medium">Push</p>
                <p className="text-xs text-[var(--muted)]">Real-time alerts</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('push')}
                className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 shrink-0 ${
                  notifications.push ? 'bg-[var(--primary)]' : 'bg-[var(--surface-2)]'
                }`}
                aria-pressed={notifications.push}
                aria-label="Push notifications"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notifications.push ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 pt-4">
              <div className="min-w-0">
                <p className="text-[var(--text)] font-medium">SMS</p>
                <p className="text-xs text-[var(--muted)]">Critical alerts only</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggleNotification('sms')}
                className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 shrink-0 ${
                  notifications.sms ? 'bg-[var(--primary)]' : 'bg-[var(--surface-2)]'
                }`}
                aria-pressed={notifications.sms}
                aria-label="SMS notifications"
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  notifications.sms ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </Card>

        {/* Security Status */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--success)]/15 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[var(--success)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text)]">Security</h2>
              <p className="text-xs text-[var(--muted)]">2FA and last sign-in</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--success)]/10 border border-[var(--success)]/20">
              <div className="flex items-center gap-3 min-w-0">
                <Shield className="w-5 h-5 text-[var(--success)] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[var(--text)] font-medium">Two-factor authentication</p>
                  <p className="text-xs text-[var(--muted)]">Enabled</p>
                </div>
              </div>
              <span className="w-2 h-2 bg-[var(--success)] rounded-full shrink-0" aria-hidden />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              <div className="flex items-center gap-3 min-w-0">
                <Shield className="w-5 h-5 text-[var(--muted)] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[var(--text)] font-medium">Last sign-in</p>
                  <p className="text-xs text-[var(--muted)]">Today at 9:24 AM</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Account Actions */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5 text-[var(--muted)]" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[var(--text)]">Account</h2>
              <p className="text-xs text-[var(--muted)]">Settings and sign out</p>
            </div>
          </div>
          <div className="space-y-3">
            <HapticButton
              label="Settings"
              variant="surface"
              onClick={() => addToast('info', 'Settings', 'Settings will be available in production.')}
              className="w-full"
            />
            <HapticButton
              label="Sign out"
              variant="danger"
              onClick={handleLogout}
              className="w-full"
            />
          </div>
        </Card>
      </motion.div>

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
