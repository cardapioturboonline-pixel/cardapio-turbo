import type { Customer } from '@/types'

export const DAY = 24 * 60 * 60 * 1000

export type Tag = 'novo' | 'recorrente' | 'vip' | 'sumido'

export const TAG_META: Record<Tag, { label: string; cls: string }> = {
  vip: { label: 'VIP', cls: 'bg-amber-100 text-amber-700' },
  recorrente: { label: 'Recorrente', cls: 'bg-blue-100 text-blue-700' },
  novo: { label: 'Novo', cls: 'bg-green-100 text-green-700' },
  sumido: { label: 'Sumido', cls: 'bg-red-100 text-red-600' },
}

// Calcula as tags do cliente a partir das metricas (sem cron).
export function tagsFor(c: Customer): Tag[] {
  const tags: Tag[] = []
  const daysSince = (Date.now() - new Date(c.last_order_at).getTime()) / DAY
  if (c.total_spent >= 200 || c.orders_count >= 5) tags.push('vip')
  if (c.orders_count >= 2) tags.push('recorrente')
  else tags.push('novo')
  if (daysSince >= 30) tags.push('sumido')
  return tags
}

export function daysSinceLast(c: Customer): number {
  return Math.floor((Date.now() - new Date(c.last_order_at).getTime()) / DAY)
}

// Monta o link do WhatsApp com mensagem personalizada.
export function waLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, '')
  const num = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}

// Substitui as variaveis da mensagem ({nome}, {cupom}) pelos valores do cliente.
export function renderMessage(template: string, c: Customer, coupon?: string): string {
  const first = (c.name || 'tudo bem').split(' ')[0]
  return template
    .replace(/\{nome\}/gi, first)
    .replace(/\{cupom\}/gi, coupon || '')
}
