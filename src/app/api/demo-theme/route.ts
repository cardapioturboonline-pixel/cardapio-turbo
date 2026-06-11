import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// TEMPORÁRIO: validar tema/layout/fonte na demo.
export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== 'turbo-seed-2026') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const patch: Record<string, string> = {}
  for (const k of ['theme', 'layout', 'font', 'color'] as const) {
    const v = url.searchParams.get(k)
    if (v) patch[k === 'color' ? 'primary_color' : k] = v
  }
  const { error } = await supabase.from('businesses').update(patch).eq('slug', 'dogao-do-denis-ikir')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, applied: patch })
}
