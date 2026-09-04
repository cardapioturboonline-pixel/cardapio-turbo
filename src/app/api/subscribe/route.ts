import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const PLAN_ID = 'cda0003141c949a8976b7fc106bd85ed'
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
        preapproval_plan_id: PLAN_ID, // usa o plano ja existente (mensal R$ 29,90)
        external_reference: business.id, // <- a chave que resolve o problema
        payer_email: email,
        back_url: BACK_URL,
      }),
    })

    const data = await mpRes.json()
    if (!mpRes.ok) {
      console.error('[subscribe] MP error:', mpRes.status, JSON.stringify(data))
      // Temporario: devolve o motivo do MP para diagnostico
      const detail = data?.message || data?.error || (Array.isArray(data?.cause) ? JSON.stringify(data.cause) : '') || `HTTP ${mpRes.status}`
      return NextResponse.json({ error: 'falha ao criar assinatura', detail }, { status: 502 })
    }

    const initPoint = data?.init_point || data?.sandbox_init_point
    if (!initPoint) return NextResponse.json({ error: 'sem link de pagamento' }, { status: 502 })

    return NextResponse.json({ init_point: initPoint })
  } catch (e) {
    console.error('[subscribe] error:', e)
    return NextResponse.json({ error: 'erro inesperado' }, { status: 500 })
  }
}
