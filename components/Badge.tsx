import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'secondary' | 'accent' | 'destructive' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const baseClasses = 'badge'
  const variantClasses = {
    default: 'badge-default',
    secondary: 'badge-secondary',
    accent: 'badge-accent',
    destructive: 'badge-destructive',
    outline: 'badge-outline',
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}
