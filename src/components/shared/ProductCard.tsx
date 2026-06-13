'use client'

import { useState } from 'react'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils/format'
import { useCartStore } from '@/lib/stores/cart'
import { ShoppingCart, Star, Plus, Minus, X } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { PizzaOrderModal } from '@/components/menu/PizzaOrderModal'

interface ProductCardProps {
  product: Product
  compact?: boolean
  pizzaFlavors?: Product[]
}

export function ProductCard({ product, compact = false, pizzaFlavors = [] }: ProductCardProps) {
  const addItem = useCartStore(s => s.addItem)
  const [showModal, setShowModal] = useState(false)
  const [showPizza, setShowPizza] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState('')
  const isPizza = !!product.pizza
  function openProduct() {
    if (!product.is_available) return
    if (isPizza) setShowPizza(true)
    else setShowModal(true)
  }

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

  const priceBlock = (
    isPizza ? (
      <span className="text-base font-bold text-[var(--text)]">a partir de <span className="text-[var(--brand)]">{formatCurrency(product.price)}</span></span>
    ) : product.promotional_price ? (
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0">
        <span className="text-lg font-bold text-[var(--brand)]">{formatCurrency(product.promotional_price)}</span>
        <span className="text-xs text-[var(--muted)] line-through">{formatCurrency(product.price)}</span>
      </div>
    ) : (
      <span className="text-lg font-bold text-[var(--text)]">{formatCurrency(product.price)}</span>
    )
  )

  return (
    <>
      {compact ? (
        /* ---- Layout compacto: linha horizontal ---- */
        <div
          onClick={openProduct}
          className={`relative flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!product.is_available ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-orange-50 flex items-center justify-center text-2xl">
            {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : '🍔'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[var(--text)] line-clamp-1">{product.name}</h3>
              {product.is_featured && <Star className="h-3.5 w-3.5 shrink-0 text-[var(--brand)] fill-[var(--brand)]" />}
            </div>
            {product.description && <p className="mt-0.5 text-xs text-[var(--muted)] line-clamp-1">{product.description}</p>}
            <div className="mt-1">{priceBlock}</div>
          </div>
          {product.is_available && (
            <button className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)] text-white hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        /* ---- Layout premium: card com imagem ---- */
        <div
          onClick={openProduct}
          className={`relative rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${!product.is_available ? 'opacity-60 cursor-not-allowed' : ''}`}
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
                <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-[var(--brand)] px-2 py-0.5 text-xs font-medium text-white">
                  <Star className="h-3 w-3" /> Destaque
                </span>
              )}
            </div>
          ) : (
            <div className="h-40 w-full bg-orange-50 flex items-center justify-center text-4xl">🍔</div>
          )}

          <div className="p-4">
            <h3 className="font-semibold text-[var(--text)] line-clamp-1">{product.name}</h3>
            {product.description && (
              <p className="mt-1 text-xs text-[var(--muted)] line-clamp-2">{product.description}</p>
            )}
            <div className="mt-3 flex flex-col gap-2">
              <div className="min-w-0">{priceBlock}</div>
              {product.is_available && (
                <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                  <ShoppingCart className="h-4 w-4 shrink-0" />
                  Adicionar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-md bg-[var(--surface)] rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
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
                <h3 className="text-xl font-bold text-[var(--text)]">{product.name}</h3>
                {product.description && <p className="text-sm text-[var(--muted)] mt-1">{product.description}</p>}
              </div>

              {/* Observation */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text)]">Observações</label>
                <textarea
                  value={observation}
                  onChange={e => setObservation(e.target.value)}
                  placeholder="Tem alguma observação? Ex: sem cebola, bem passado..."
                  rows={2}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text)]">Quantidade</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] hover:opacity-80">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-lg font-semibold text-[var(--text)]">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand)] text-white hover:opacity-90">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add button */}
              <button onClick={handleAdd}
                className="w-full flex items-center justify-between rounded-xl bg-[var(--brand)] px-5 py-3.5 font-semibold text-white hover:opacity-90 transition-opacity">
                <span>Adicionar ao carrinho</span>
                <span>{formatCurrency(price * quantity)}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pizza Modal */}
      {showPizza && (
        <PizzaOrderModal product={product} flavors={pizzaFlavors} onClose={() => setShowPizza(false)} />
      )}
    </>
  )
}
