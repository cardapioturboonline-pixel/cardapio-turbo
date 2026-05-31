'use client'

import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils/format'
import { useCartStore } from '@/lib/stores/cart'
import { ShoppingCart, Star } from 'lucide-react'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)

  return (
    <div className={`relative rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow ${!product.is_available ? 'opacity-60' : ''}`}>
      {product.image_url ? (
        <div className="relative h-40 w-full overflow-hidden bg-gray-100">
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white">Indisponível</span>
            </div>
          )}
          {product.is_featured && (
            <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
              <Star className="h-3 w-3" /> Destaque
            </span>
          )}
        </div>
      ) : (
        <div className="h-40 w-full bg-orange-50 flex items-center justify-center text-4xl">
          🍔
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div>
            {product.promotional_price ? (
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-orange-500">{formatCurrency(product.promotional_price)}</span>
                <span className="text-xs text-gray-400 line-through">{formatCurrency(product.price)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
            )}
          </div>
          {product.is_available && (
            <button
              onClick={() => addItem(product)}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Adicionar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
