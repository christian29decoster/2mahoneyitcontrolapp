'use client'

export type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

function vibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // @ts-ignore
      navigator.vibrate(pattern)
    }
  } catch {}
}

export function useHaptics() {
  function impact(style: HapticStyle = 'light') {
    // iOS Safari lacks vibrate → no-op; animations will convey feedback
    if (style === 'light') vibrate(10)
    if (style === 'medium') vibrate([12, 20])
    if (style === 'heavy') vibrate([20, 30, 20])
  }
  
  function success() { 
    vibrate([10, 50, 10]) 
  }
  
  function warning() { 
    vibrate([40, 20]) 
  }
  
  function error() { 
    vibrate([60, 20, 60]) 
  }
  
  return { impact, success, warning, error }
}
