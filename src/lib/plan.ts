import type { Business } from '@/types'

// Retorna true se o negócio tem acesso aos recursos Pro:
// - plano pago (pro/business), OU
// - trial ainda ativo (7 dias grátis para testar tudo)
export function hasProAccess(business: Business | null | undefined): boolean {
  if (!business) return false
  if (business.plan && business.plan !== 'free') return true
  if (business.trial_ends_at) {
    return new Date(business.trial_ends_at).getTime() > Date.now()
  }
  return false
}

// True somente durante o período de trial (Free + trial ativo)
export function isOnTrial(business: Business | null | undefined): boolean {
  if (!business) return false
  if (business.plan && business.plan !== 'free') return false
  if (!business.trial_ends_at) return false
  return new Date(business.trial_ends_at).getTime() > Date.now()
}
