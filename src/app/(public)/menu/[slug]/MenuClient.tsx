'use client'

import { useState } from 'react'
import { MessageCircle, Search, ShoppingCart, Link as LinkIcon, MapPin, Clock } from 'lucide-react'
import type { Business, Category, Product } from '@/types'
import { ProductCard } from '@/components/shared/ProductCard'
import { CartDrawer } from '@/components/menu/CartDrawer'
import { useCartStore } from '@/lib/stores/cart'
import { isOpenNow } from '@/lib/utils/format'

interface MenuClientProps {
  business: Business
  categories: Category[]
  products: Product[]
}

export function MenuClient({ business, categories, products }: MenuClientProps) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [cartOpen, setCartOpen] = useState(false)
  const totalItems = useCartStore(s => s.getTotalItems())

  const isOpen = isOpenNow(business.opening_hours as Record<string, { open: string; close: string; closed: boolean }> | undefined)

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchCat = activeCategory === 'all' || p.category_id === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div className="pb-24">
      {/* Banner */}
      {business.banner_url && (
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img src={business.banner_url} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Business header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-start gap-4">
            {business.logo_url ? (
              <img
                src={business.logo_url}
                alt={business.name}
                className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-md shrink-0 -mt-8 relative z-10 bg-white"
                onError={(e) => {
                  const img = e.currentTarget
                  img.style.display = 'none'
                  const fallback = img.nextElementSibling as HTMLElement | null
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className="h-16 w-16 rounded-xl border-2 border-white shadow-md shrink-0 -mt-8 relative z-10 bg-orange-500 items-center justify-center text-3xl font-bold text-white"
              style={{ display: business.logo_url ? 'none' : 'flex' }}
            >
              {business.name?.[0]?.toUpperCase() ?? '🍽️'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{business.name}</h1>
              {business.description && <p className="text-sm text-gray-500 mt-0.5">{business.description}</p>}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className={`flex items-center gap-1 text-xs font-medium ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                  <Clock className="h-3 w-3" />
                  {isOpen ? 'Aberto agora' : 'Fechado'}
                </span>
                {business.city && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" /> {business.city}
                  </span>
                )}
                <a
                  href={`https://wa.me/55${business.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-medium text-white hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-3 w-3" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar no cardápio..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Categories filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}
          >
            Tudo
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products by category */}
        {activeCategory === 'all' ? (
          categories.map(cat => {
            const catProducts = filtered.filter(p => p.category_id === cat.id)
            if (catProducts.length === 0) return null
            return (
              <div key={cat.id} id={`cat-${cat.id}`}>
                <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  {cat.icon && <span>{cat.icon}</span>}
                  {cat.name}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {catProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            )
          })
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">🔍</p>
            <p className="font-medium text-gray-900">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-500">Tente outra busca</p>
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {totalItems > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full bg-orange-500 px-6 py-3 text-white shadow-lg hover:bg-orange-600 transition-colors z-40"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold">Ver carrinho</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-orange-500">
            {totalItems}
          </span>
        </button>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-6">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center gap-4">
            {business.instagram && (
              <a href={`https://instagram.com/${business.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-500">
                <LinkIcon className="h-4 w-4" /> Instagram
              </a>
            )}
            {business.facebook && (
              <a href={`https://facebook.com/${business.facebook}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500">
                <LinkIcon className="h-4 w-4" /> Facebook
              </a>
            )}
          </div>
          {(business.show_watermark ?? true) && (
            <p className="text-xs text-gray-400">
              Powered by{' '}
              <a href="https://cardapioturbo.com.br" className="font-medium text-orange-500 hover:underline">Cardápio Turbo</a>
            </p>
          )}
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} business={business} />
    </div>
  )
}
