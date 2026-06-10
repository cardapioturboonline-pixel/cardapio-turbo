import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Backfill do histórico de assinaturas a partir do estado atual dos negócios:
// - 1 evento 'trial_started' por negócio (data = created_at)
// - 1 evento 'converted' por negócio Pro/Business (data = updated_at, aprox.)
// Idempotente: não duplica eventos já existentes do mesmo tipo para o mesmo negócio.
export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== 'turbo-seed-2026') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const dry = url.searchParams.get('dry') === '1'
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: biz, error: bizErr } = await supabase
    .from('businesses')
    .select('id, plan, city, state, created_at, updated_at')
  if (bizErr) return NextResponse.json({ error: bizErr.message }, { status: 500 })

  const { data: existing, error: exErr } = await supabase
    .from('subscription_events')
    .select('business_id, event_type')
  if (exErr) return NextResponse.json({ error: 'subscription_events não existe? ' + exErr.message }, { status: 500 })

  const has = new Set((existing ?? []).map(e => `${e.business_id}:${e.event_type}`))
  const rows: Record<string, unknown>[] = []

  for (const b of biz ?? []) {
    if (!has.has(`${b.id}:trial_started`)) {
      rows.push({
        business_id: b.id, event_type: 'trial_started', from_plan: null, to_plan: 'free',
        city: b.city ?? null, state: b.state ?? null,
        created_at: b.created_at, metadata: { backfill: true },
      })
    }
    const isPro = b.plan && b.plan !== 'free'
    if (isPro && !has.has(`${b.id}:converted`)) {
      rows.push({
        business_id: b.id, event_type: 'converted', from_plan: 'free', to_plan: b.plan,
        city: b.city ?? null, state: b.state ?? null,
        created_at: b.updated_at ?? b.created_at, metadata: { backfill: true },
      })
    }
  }

  const summary = {
    businesses: biz?.length ?? 0,
    pro: (biz ?? []).filter(b => b.plan && b.plan !== 'free').length,
    toInsert: rows.length,
    trialStarted: rows.filter(r => r.event_type === 'trial_started').length,
    converted: rows.filter(r => r.event_type === 'converted').length,
  }
  if (dry) return NextResponse.json({ dryRun: true, ...summary })

  let inserted = 0
  for (let i = 0; i < rows.length; i += 100) {
    const chunk = rows.slice(i, i + 100)
    const { error } = await supabase.from('subscription_events').insert(chunk)
    if (error) return NextResponse.json({ error: error.message, insertedSoFar: inserted }, { status: 500 })
    inserted += chunk.length
  }
  return NextResponse.json({ ok: true, inserted, ...summary })
}
