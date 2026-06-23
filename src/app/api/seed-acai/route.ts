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
    await supabase.from('products').delete().eq('business_id', biz.id).eq('name', 'Açaí Montável')
    await supabase.from('categories').delete().eq('business_id', biz.id).eq('name', 'Açaí')
    return NextResponse.json({ ok: true, cleaned: true })
  }
  await supabase.from('products').delete().eq('business_id', biz.id).eq('name', 'Açaí Montável')
  await supabase.from('categories').delete().eq('business_id', biz.id).eq('name', 'Açaí')
  const { data: cat } = await supabase.from('categories').insert({ business_id: biz.id, name: 'Açaí', icon: '🍧', sort_order: 0, is_active: true }).select('id').single()
  const { error } = await supabase.from('products').insert({
    business_id: biz.id, category_id: cat?.id ?? null,
    name: 'Açaí Montável', description: 'Monte o seu açaí do jeitinho que voce gosta', price: 0,
    is_available: true, is_featured: true, is_combo: false, sort_order: 0, views: 0, orders: 0,
    option_groups: [
      { name: 'Tamanho', required: true, max: 1, options: [
        { name: '300ml', price: 15 }, { name: '500ml', price: 20 }, { name: '700ml', price: 26 } ] },
      { name: 'Acompanhamentos gratis', required: false, max: 3, options: [
        { name: 'Granola', price: 0 }, { name: 'Banana', price: 0 }, { name: 'Leite em po', price: 0 }, { name: 'Pacoca', price: 0 } ] },
      { name: 'Adicionais', required: false, max: 5, options: [
        { name: 'Leite condensado', price: 3 }, { name: 'Morango', price: 4 }, { name: 'Nutella', price: 6 }, { name: 'Ovomaltine', price: 4 } ] },
    ],
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
