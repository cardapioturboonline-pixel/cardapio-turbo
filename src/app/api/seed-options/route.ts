import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const url = new URL(req.url)
  if (url.searchParams.get('secret') !== 'turbo-seed-2026') return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: biz } = await supabase.from('businesses').select('id').eq('slug', 'dogao-do-denis-ikir').single()
  if (!biz) return NextResponse.json({ error: 'no business' }, { status: 404 })
  if (url.searchParams.get('clean') === '1') {
    await supabase.from('products').delete().eq('business_id', biz.id).eq('name', 'X-Burger Monte o Seu')
    return NextResponse.json({ ok: true, cleaned: true })
  }
  const { data: cat } = await supabase.from('categories').select('id').eq('business_id', biz.id).eq('name', 'Hambúrgueres').single()
  await supabase.from('products').delete().eq('business_id', biz.id).eq('name', 'X-Burger Monte o Seu')
  const { error } = await supabase.from('products').insert({
    business_id: biz.id, category_id: cat?.id ?? null,
    name: 'X-Burger Monte o Seu', description: 'Hamburguer 150g do seu jeito', price: 22.90,
    is_available: true, is_featured: true, is_combo: false, sort_order: 0, views: 0, orders: 0,
    option_groups: [
      { name: 'Ponto da carne', required: true, max: 1, options: [
        { name: 'Mal passada', price: 0 }, { name: 'Ao ponto', price: 0 }, { name: 'Bem passada', price: 0 } ] },
      { name: 'Adicionais', required: false, max: 3, options: [
        { name: 'Bacon', price: 4 }, { name: 'Cheddar', price: 4 }, { name: 'Ovo', price: 3 }, { name: 'Cebola caramelizada', price: 3.5 } ] },
    ],
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
