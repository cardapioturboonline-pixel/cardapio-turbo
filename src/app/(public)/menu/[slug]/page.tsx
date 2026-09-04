import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MenuClient } from './MenuClient'

// Preview do link (WhatsApp, redes) com a marca do RESTAURANTE, não a do Cardápio Turbo.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('name, description, logo_url')
    .eq('slug', slug)
    .single()

  if (!business) return { title: 'Cardápio não encontrado' }

  const title = business.name || 'Cardápio digital'
  const description = business.description?.trim()
    || `Faça seu pedido no ${business.name} pelo WhatsApp. Cardápio online, rápido e fácil.`
  const url = `https://cardapioturbo.com.br/menu/${slug}`
  const image = business.logo_url || undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: title,
      ...(image ? { images: [{ url: image, width: 600, height: 600, alt: title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!business) notFound()

  const [{ data: categories }, { data: products }, { data: reviews }] = await Promise.all([
    supabase.from('categories').select('*').eq('business_id', business.id).eq('is_active', true).order('sort_order'),
    supabase.from('products').select('*').eq('business_id', business.id).eq('is_available', true).order('sort_order'),
    supabase.from('reviews').select('*').eq('business_id', business.id).eq('approved', true).order('created_at', { ascending: false }).limit(50),
  ])

  return (
    <MenuClient
      business={business}
      categories={categories ?? []}
      products={products ?? []}
      reviews={reviews ?? []}
    />
  )
}
