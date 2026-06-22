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
  const [{ data: bizData }, { data: userData }] = await Promise.all([
    admin.from('businesses').select('id, user_id, name, plan, trial_ends_at'),
    admin.from('users').select('id, email, name'),
  ])

  const emailById = new Map<string, string>()
  const nameById = new Map<string, string>()
  for (const u of userData ?? []) {
    if (u.email) emailById.set(u.id, u.email)
    if (u.name) nameById.set(u.id, u.name)
  }

  const now = Date.now()
  // Trial expirado sem converter: plano free e trial_ends_at no passado (ou ausente)
  const targets = (bizData ?? []).filter(b =>
    (!b.plan || b.plan === 'free') &&
    (!b.trial_ends_at || new Date(b.trial_ends_at).getTime() <= now)
  )

  let sent = 0
  const failed: string[] = []
  const seen = new Set<string>()
  for (const b of targets) {
    const email = emailById.get(b.user_id)
    if (!email || seen.has(email)) continue
    seen.add(email)
    const name = nameById.get(b.user_id) || b.name || 'amigo(a)'
    const ok = await sendWinbackEmail(email, name)
    if (ok) sent++; else failed.push(email)
  }

  return NextResponse.json({ ok: true, targets: targets.length, sent, failed: failed.length })
}
