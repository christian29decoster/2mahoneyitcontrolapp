'use client'

import React from 'react'

const size = 20

/** Small provider logos as inline SVGs (no external assets). */
export function ConnectorLogo({ id, className = '' }: { id: string; className?: string }) {
  const c = `fill-current text-[var(--muted)] ${className}`.trim()
  switch (id) {
    case 'sharepoint':
    case 'outlook':
    case 'teams':
      return <MicrosoftLogo className={c} />
    case 'github':
      return <GitHubLogo className={c} />
    case 'azure':
      return <AzureLogo className={c} />
    case 'siem':
      return <SiemLogo className={c} />
    case 'rmm':
      return <RmmLogo className={c} />
    case 'ticketing':
      return <TicketingLogo className={c} />
    default:
      return null
  }
}

function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 21 21" className={className} aria-hidden>
      <path fill="#F25022" d="M0 0h10v10H0z" />
      <path fill="#7FBA00" d="M11 0h10v10H11z" />
      <path fill="#00A4EF" d="M0 11h10v10H0z" />
      <path fill="#FFB900" d="M11 11h10v10H11z" />
    </svg>
  )
}

function GitHubLogo({ className }: { className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
    </svg>
  )
}

function AzureLogo({ className }: { className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#0078D4" d="M5.483 21.3H2.697L12 2.7l2.816 5.382-4.635 2.088 5.318 11.13h-2.816l-2.9-6.082H8.383L5.483 21.3zm13.2 0h-2.817l-4.27-8.52 2.9-.624L18.683 21.3z" />
    </svg>
  )
}

function SiemLogo({ className }: { className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M12 2L4 6v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V6l-8-4zm0 2.18l6 3v4.91c0 3.96-2.55 7.64-6 8.83-3.45-1.19-6-4.87-6-8.83V7.18l6-3z" />
    </svg>
  )
}

function RmmLogo({ className }: { className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2zm0 6a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2v-2a2 2 0 012-2zm0 6a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2v-2a2 2 0 012-2zm6-12a2 2 0 00-2 2v2a2 2 0 002 2 2 2 0 002-2V4a2 2 0 00-2-2zm0 6a2 2 0 00-2 2v2a2 2 0 002 2 2 2 0 002-2v-2a2 2 0 00-2-2zm0 6a2 2 0 00-2 2v2a2 2 0 002 2 2 2 0 002-2v-2a2 2 0 00-2-2z" />
    </svg>
  )
}

function TicketingLogo({ className }: { className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-5.5-6zM6 4h6v4h6v12H6V4zm2 8v2h8v-2H8zm0 4v2h5v-2H8z" />
    </svg>
  )
}
