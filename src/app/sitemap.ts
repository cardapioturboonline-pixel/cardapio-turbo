import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE = 'https://cardapioturbo.com.br'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/blog`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/sobre`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contato`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/register`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/login`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/termos`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/privacidade`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const supabase = await createClient()
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('published', true)

    const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p: { slug: string; updated_at: string }) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
