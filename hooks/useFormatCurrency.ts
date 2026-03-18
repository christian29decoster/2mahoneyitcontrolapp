'use client'

import { useLocaleStore } from '@/lib/locale.store'
import { formatCurrency as formatCurrencyBase, type CurrencyLocale } from '@/lib/pricing'

/** Returns a formatCurrency function that uses the current locale (USD for en-US, EUR with € after for de). */
export function useFormatCurrency(): (amount: number) => string {
  const locale = useLocaleStore((s) => s.locale)
  return (amount: number) => formatCurrencyBase(amount, locale as CurrencyLocale)
}
