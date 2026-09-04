import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

// Ação de admin: liberar (Pro) ou rebaixar (Free) o plano de um negócio manualmente,
// sem depender do SQL do Supabase. Só admins autorizados podem chamar.
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  let body: { businessId?: string; plan?: string } = {}
  try { body = await req.json() } catch { /* ignore */ }
  const businessId = body.businessId
  const plan = body.plan
  if (!businessId || (plan !== 'pro' && plan !== 'free')) {
    return NextResponse.json({ error: 'parâmetros inválidos' }, { status: 400 })
  }

  const admin = createAdminClient()

  // snapshot pro histórico
  const { data: snap } = await admin
    .from('businesses')
    .select('plan, city, state')
    .eq('id', businessId)
    .single()
  const fromPlan = snap?.plan ?? 'free'

  // IMPORTANTE: update cirúrgico (só plan + trial_ends_at). Nao tocar em outras colunas.
  const { error } = await admin
    .from('businesses')
    .update({ plan, trial_ends_at: null })
    .eq('id', businessId)

  if (error) {
    console.error('[set-plan] update error:', error)
    return NextResponse.json({ error: 'falha ao atualizar' }, { status: 500 })
  }

  // loga evento (best-effort; nao quebra se a tabela nao existir)
  try {
    await admin.from('subscription_events').insert({
      business_id: businessId,
      event_type: plan === 'pro' ? 'manual_pro' : 'manual_free',
      from_plan: fromPlan,
      to_plan: plan,
      mp_status: 'manual_admin',
      city: snap?.city ?? null,
      state: snap?.state ?? null,
    })
  } catch (e) {
    console.error('[set-plan] log event failed:', e)
  }

  return NextResponse.json({ ok: true, plan })
}
