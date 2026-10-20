import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'
import { sendConversionEmail } from '@/lib/email/send'

export const dynamic = 'force-dynamic'

// Ação de admin: envia um e-mail individual de conversão para um cliente em trial,
// com copy personalizada pelo que ele já montou (produtos/categorias/pedidos) e
// os ganhos do Plano Pro (R$ 29,90). Só admins autorizados podem chamar.
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: { businessId?: string } = {}
  try { body = await req.json() } catch { /* ignore */ }
  const businessId = body.businessId
  if (!businessId) {
    return NextResponse.json({ error: 'parâmetros inválidos' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: biz } = await admin
    .from('businesses')
    .select('id, user_id, name, slug, trial_ends_at')
    .eq('id', businessId)
    .single()
  if (!biz) {
    return NextResponse.json({ error: 'negócio não encontrado' }, { status: 404 })
  }

  // E-mail do dono
  const { data: owner } = await admin
    .from('users')
    .select('email, name')
    .eq('id', biz.user_id)
    .single()
  const to = owner?.email
  if (!to) {
    return NextResponse.json({ error: 'cliente sem e-mail cadastrado' }, { status: 400 })
  }

  // Atividade do cliente (contagens leves via head+count)
  const [{ count: productCount }, { count: categoryCount }, { count: orderCount }] = await Promise.all([
    admin.from('products').select('id', { count: 'exact', head: true }).eq('business_id', businessId),
    admin.from('categories').select('id', { count: 'exact', head: true }).eq('business_id', businessId),
    admin.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', businessId),
  ])

  const daysLeft = biz.trial_ends_at
    ? Math.ceil((new Date(biz.trial_ends_at).getTime() - Date.now()) / 86400000)
    : null

  const ok = await sendConversionEmail(to, {
    name: owner?.name || biz.name || '',
    productCount: productCount ?? 0,
    categoryCount: categoryCount ?? 0,
    orderCount: orderCount ?? 0,
    daysLeft,
    slug: biz.slug,
  })

  if (!ok) {
    return NextResponse.json({ error: 'falha ao enviar o e-mail' }, { status: 500 })
  }

  // Marca a data do envio (best-effort; nao quebra se a coluna nao existir)
  const sentAt = new Date().toISOString()
  try {
    await admin.from('businesses').update({ conversion_email_sent_at: sentAt }).eq('id', businessId)
  } catch (e) {
    console.error('[convert-email] failed to mark sent_at:', e)
  }

  return NextResponse.json({ ok: true, to, sentAt })
}
