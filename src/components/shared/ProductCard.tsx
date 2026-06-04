'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils/format'
import { useCartStore } from '@/lib/stores/cart'
import { ShoppingCart, Star, Plus, Minus, X } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)
  const [showModal, setShowModal] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState('')

  function handleAdd() {
    for (let i = 0; i < quantity; i++) {
      addItem(product, [], observation || undefined)
    }
    toast.success(`${quantity}x ${product.name} adicionado!`)
    setShowModal(false)
    setQuantity(1)
    setObservation('')
  }

  const price = product.promotional_price ?? product.price

  return (
    <>
      <div
        onClick={() => product.is_available && setShowModal(true)}
        className={`relative rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!product.is_available ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
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
          <div className="h-40 w-full bg-orange-50 flex items-center justify-center text-4xl">🍔</div>
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
              <div className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white">
                <ShoppingCart className="h-4 w-4" />
                Adicionar
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Product image */}
            {product.image_url && (
              <div className="h-48 w-full overflow-hidden">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}

            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 rounded-full bg-white p-1.5 shadow-md text-gray-600 hover:text-gray-900">
              <X className="h-5 w-5" />
            </button>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                {product.description && <p className="text-sm text-gray-500 mt-1">{product.description}</p>}
              </div>

              {/* Observation */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Observações</label>
                <textarea
                  value={observation}
                  onChange={e => setObservation(e.target.value)}
                  placeholder="Tem alguma observação? Ex: sem cebola, bem passado..."
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Quantidade</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-lg font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add button */}
              <button onClick={handleAdd}
                className="w-full flex items-center justify-between rounded-xl bg-orange-500 px-5 py-3.5 font-semibold text-white hover:bg-orange-600 transition-colors">
                <span>Adicionar ao carrinho</span>
                <span>{formatCurrency(price * quantity)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
