import { mockBusiness, mockCategories, mockProducts } from '@/lib/mock-data'
import { MenuClient } from './MenuClient'

export default async function MenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // In production: fetch from Supabase by slug
  // For now, use mock data
  const business = slug === mockBusiness.slug ? mockBusiness : mockBusiness

  return (
    <MenuClient
      business={business}
      categories={mockCategories.filter(c => c.is_active)}
      products={mockProducts}
    />
  )
}
