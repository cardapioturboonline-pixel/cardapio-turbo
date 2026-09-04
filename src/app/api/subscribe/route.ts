import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const PRICE = 29.9
const REASON = 'Cardápio Turbo - Plano Pro'
const BACK_URL = 'https://cardapioturbo.com.br/dashboard/plans?assinado=1'

// Cria uma assinatura mensal no Mercado Pago JÁ com external_reference = business_id.
// Assim o webhook consegue casar 100% das vezes (libera e rebaixa sozinho),
// sem depender de bater o e-mail do pagador com o e-mail da conta.
export async function POST() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!token) return NextResponse.json({ error: 'pagamento não configurado' }, { status: 503 })

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

  const email = user.email
  if (!email) return NextResponse.json({ error: 'conta sem e-mail' }, { status: 400 })

  try {
    const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reason: REASON,
        external_reference: business.id, // <- a chave que resolve o problema
        payer_email: email,
        back_url: BACK_URL,
        status: 'pending',
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: PRICE,
          currency_id: 'BRL',
        },
      }),
    })

    const data = await mpRes.json()
    if (!mpRes.ok) {
      console.error('[subscribe] MP error:', mpRes.status, JSON.stringify(data))
      return NextResponse.json({ error: 'falha ao criar assinatura' }, { status: 502 })
    }

    const initPoint = data?.init_point || data?.sandbox_init_point
    if (!initPoint) return NextResponse.json({ error: 'sem link de pagamento' }, { status: 502 })

    return NextResponse.json({ init_point: initPoint })
  } catch (e) {
    console.error('[subscribe] error:', e)
    return NextResponse.json({ error: 'erro inesperado' }, { status: 500 })
  }
}
