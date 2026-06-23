import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'
import { sendWinbackEmail } from '@/lib/email/send'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Envia e-mail de reativação para donos cujo trial expirou e que NÃO assinaram o Pro.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const admin = createAdminClient()

  // Tenta incluir winback_sent_at; se a coluna ainda não existe, faz fallback sem cooldown.
  const COOLDOWN_DAYS = 7
  let hasCooldownColumn = true
  let bizData: { id: string; user_id: string; name: string; plan: string; trial_ends_at: string | null; winback_sent_at?: string | null }[] | null = null
  const withCol = await admin.from('businesses').select('id, user_id, name, plan, trial_ends_at, winback_sent_at')
  if (withCol.error) {
    hasCooldownColumn = false
    const fallback = await admin.from('businesses').select('id, user_id, name, plan, trial_ends_at')
    bizData = fallback.data
  } else {
    bizData = withCol.data
  }
  const { data: userData } = await admin.from('users').select('id, email, name')

  const emailById = new Map<string, string>()
  const nameById = new Map<string, string>()
  for (const u of userData ?? []) {
    if (u.email) emailById.set(u.id, u.email)
    if (u.name) nameById.set(u.id, u.name)
  }

  const now = Date.now()
  const cooldownMs = COOLDOWN_DAYS * 24 * 60 * 60 * 1000
  // Trial expirado sem converter: plano free e trial_ends_at no passado (ou ausente)
  const expired = (bizData ?? []).filter(b =>
    (!b.plan || b.plan === 'free') &&
    (!b.trial_ends_at || new Date(b.trial_ends_at).getTime() <= now)
  )
  // Cooldown: pula quem recebeu e-mail nos últimos 7 dias
  const targets = expired.filter(b =>
    !b.winback_sent_at || (now - new Date(b.winback_sent_at).getTime()) > cooldownMs
  )
  const skipped = expired.length - targets.length

  let sent = 0
  const failed: string[] = []
  const seen = new Set<string>()
  const sentBizIds: string[] = []
  for (const b of targets) {
    const email = emailById.get(b.user_id)
    if (!email || seen.has(email)) continue
    seen.add(email)
    const name = nameById.get(b.user_id) || b.name || 'amigo(a)'
    const ok = await sendWinbackEmail(email, name)
    if (ok) { sent++; sentBizIds.push(b.id) } else failed.push(email)
  }

  // Marca o envio (best-effort) para respeitar o cooldown nas próximas vezes
  if (hasCooldownColumn && sentBizIds.length > 0) {
    try {
      await admin.from('businesses').update({ winback_sent_at: new Date().toISOString() }).in('id', sentBizIds)
    } catch (e) {
      console.error('[winback] failed to mark winback_sent_at:', e)
    }
  }

  return NextResponse.json({ ok: true, expired: expired.length, targets: targets.length, sent, failed: failed.length, skipped, cooldownDays: COOLDOWN_DAYS })
}
