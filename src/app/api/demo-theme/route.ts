import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// Endpoint TEMPORÁRIO para validar tema/layout/fonte na demo.
// Uso: /api/demo-theme?secret=turbo-seed-2026&theme=dark&layout=compact&font=Nunito
export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== 'turbo-seed-2026') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const patch: Record<string, string> = {}
  const theme = url.searchParams.get('theme'); if (theme) patch.theme = theme
  const layout = url.searchParams.get('layout'); if (layout) patch.layout = layout
  const font = url.searchParams.get('font'); if (font) patch.font = font
  const color = url.searchParams.get('color'); if (color) patch.primary_color = color
  const { error } = await supabase.from('businesses').update(patch).eq('slug', 'dogao-do-denis-ikir')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, applied: patch })
}
