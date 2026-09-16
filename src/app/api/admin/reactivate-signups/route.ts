import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'
import { sendReactivateSignupEmail } from '@/lib/email/send'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Envia um lembrete para quem se cadastrou mas NÃO terminou (não tem restaurante).
// GET  -> só conta quantos alvos existem (preview, não envia).
// POST -> envia o lembrete e retorna quantos foram enviados.
async function getTargets() {
  const admin = createAdminClient()

  // negócios existentes -> user_ids que JÁ concluíram o cadastro
  const { data: biz } = await admin.from('businesses').select('user_id')
  const doneUserIds = new Set((biz ?? []).map(b => b.user_id))

  // todos os usuários do Auth
  const targets: { email: string; name: string }[] = []
  let page = 1
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error || !data?.users?.length) break
    for (const u of data.users) {
      if (!u.email) continue
      if (doneUserIds.has(u.id)) continue // já tem restaurante = concluiu
      const name = (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || u.email.split('@')[0]
      targets.push({ email: u.email, name })
    }
    if (data.users.length < 200) break
    page++
  }
  return targets
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  const targets = await getTargets()
  return NextResponse.json({ count: targets.length, emails: targets.map(t => t.email) })
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const targets = await getTargets()
  let sent = 0
  const failed: string[] = []
  for (const t of targets) {
    const ok = await sendReactivateSignupEmail(t.email, t.name)
    if (ok) sent++
    else failed.push(t.email)
  }
  return NextResponse.json({ ok: true, targets: targets.length, sent, failed: failed.length })
}
