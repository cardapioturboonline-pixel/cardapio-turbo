import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MenuClient } from './MenuClient'

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!business) notFound()

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from('categories').select('*').eq('business_id', business.id).eq('is_active', true).order('sort_order'),
    supabase.from('products').select('*').eq('business_id', business.id).eq('is_available', true).order('sort_order'),
  ])

  return (
    <MenuClient
      business={business}
      categories={categories ?? []}
      products={products ?? []}
    />
  )
}
