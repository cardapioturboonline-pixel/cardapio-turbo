import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Mercado Pago sends notifications here when subscription status changes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    // Only handle subscription events
    if (type !== 'subscription_preapproval') {
      return NextResponse.json({ ok: true })
    }

    const subscriptionId = data?.id
    if (!subscriptionId) return NextResponse.json({ ok: true })

    // Fetch subscription details from Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    })

    if (!mpRes.ok) {
      console.error('[MP Webhook] Failed to fetch subscription:', mpRes.status)
      return NextResponse.json({ error: 'MP fetch failed' }, { status: 500 })
    }

    const subscription = await mpRes.json()
    const { status, external_reference, payer_email } = subscription

    // external_reference = business_id (set when creating the payment link)
    // If not set, try to find by payer email
    const supabase = await createClient()

    let businessId = external_reference

    if (!businessId && payer_email) {
      // Find business by user email
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', payer_email)
        .single()

      if (user) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', user.id)
          .single()
        businessId = biz?.id
      }
    }

    if (!businessId) {
      console.error('[MP Webhook] Could not find business for subscription', subscriptionId)
      return NextResponse.json({ ok: true })
    }

    // Snapshot current state (plano/cidade/estado) antes de atualizar — para o histórico
    const { data: snapshot } = await supabase
      .from('businesses')
      .select('plan, city, state')
      .eq('id', businessId)
      .single()
    const prevPlan = snapshot?.plan ?? 'free'

    // Loga um evento de assinatura (best-effort; nunca quebra o webhook se a tabela não existir)
    async function logEvent(eventType: string, toPlan: string) {
      try {
        await supabase.from('subscription_events').insert({
          business_id: businessId,
          event_type: eventType,
          from_plan: prevPlan,
          to_plan: toPlan,
          mp_subscription_id: String(subscriptionId),
          mp_status: status,
          city: snapshot?.city ?? null,
          state: snapshot?.state ?? null,
          amount: subscription?.auto_recurring?.transaction_amount ?? null,
        })
      } catch (e) {
        console.error('[MP Webhook] failed to log subscription_event:', e)
      }
    }

    // Update plan based on subscription status
    if (status === 'authorized') {
      // Payment successful — upgrade to Pro
      await supabase
        .from('businesses')
        .update({
          plan: 'pro',
          trial_ends_at: null, // clear trial, subscription is active
        })
        .eq('id', businessId)

      console.log(`[MP Webhook] Upgraded business ${businessId} to Pro`)
      await logEvent(prevPlan === 'free' ? 'converted' : 'renewed', 'pro')

      // Send Pro welcome email
      try {
        const { data: bizOwner } = await supabase
          .from('businesses')
          .select('user_id, name')
          .eq('id', businessId)
          .single()
        const recipientEmail = payer_email || (bizOwner?.user_id
          ? (await supabase.from('users').select('email, name').eq('id', bizOwner.user_id).single()).data?.email
          : null)
        const recipientName = bizOwner?.name || 'amigo(a)'
        if (recipientEmail) {
          const { sendProWelcomeEmail } = await import('@/lib/email/send')
          await sendProWelcomeEmail(recipientEmail, recipientName)
        }
      } catch (emailErr) {
        console.error('[MP Webhook] failed to send Pro welcome email:', emailErr)
      }

    } else if (status === 'cancelled' || status === 'paused') {
      // Subscription cancelled or paused — give 30-day grace period
      const graceEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      await supabase
        .from('businesses')
        .update({
          plan: 'free',
          trial_ends_at: graceEnd, // 30 days of grace access
        })
        .eq('id', businessId)

      console.log(`[MP Webhook] Downgraded business ${businessId} to Free with 30-day grace until ${graceEnd}`)
      await logEvent(status === 'cancelled' ? 'cancelled' : 'paused', 'free')

    } else if (status === 'pending') {
      // Payment pending — keep current plan, no action needed
      console.log(`[MP Webhook] Subscription ${subscriptionId} pending payment`)
    }

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[MP Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// Mercado Pago sometimes sends GET to validate the endpoint
export async function GET() {
  return NextResponse.json({ ok: true, service: 'Cardápio Turbo Webhook' })
}
