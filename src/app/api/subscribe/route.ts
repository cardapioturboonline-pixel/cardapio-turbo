import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const PLAN_ID = 'cda0003141c949a8976b7fc106bd85ed'
const CHECKOUT_BASE = 'https://www.mercadopago.com.br/subscriptions/checkout'

// Monta o link do checkout hospedado do Mercado Pago JÁ com external_reference = business_id.
// Assim, quando o cliente paga, a assinatura fica vinculada ao restaurante e o webhook
// consegue casar 100% das vezes (libera e rebaixa sozinho), mesmo que o e-mail do
// pagamento seja diferente do e-mail da conta. Não usa a API de preapproval (que exige
// card_token) — apenas redireciona para a tela de pagamento do próprio Mercado Pago.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'não autenticado' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses')
    .select('id, plan')
    .eq('user_id', user.id)
    .single()

  if (!business) return NextResponse.json({ error: 'negócio não encontrado' }, { status: 404 })
  if (business.plan && business.plan !== 'free') {
    return NextResponse.json({ error: 'já é Pro' }, { status: 400 })
  }

  const initPoint = `${CHECKOUT_BASE}?preapproval_plan_id=${PLAN_ID}&external_reference=${encodeURIComponent(business.id)}`
  return NextResponse.json({ init_point: initPoint })
}
