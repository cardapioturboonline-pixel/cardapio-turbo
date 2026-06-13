'use client'

import { useMemo, useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { formatCurrency } from '@/lib/utils/format'
import { useCartStore } from '@/lib/stores/cart'
import { toast } from '@/components/ui/sonner'

interface PizzaOrderModalProps {
  product: Product
  flavors: Product[]   // outros sabores de pizza (mesma categoria)
  onClose: () => void
}

// Preço do sabor para um tamanho (por nome). Retorna null se não houver.
function sizePrice(p: Product, sizeName: string): number | null {
  const s = p.pizza?.sizes.find(x => x.name === sizeName)
  return s ? s.price : null
}

export function PizzaOrderModal({ product, flavors, onClose }: PizzaOrderModalProps) {
  const addPizzaItem = useCartStore(s => s.addPizzaItem)
  const sizes = product.pizza?.sizes ?? []
  const maxFlavors = product.pizza?.maxFlavors ?? 1
  const [sizeName, setSizeName] = useState(sizes[0]?.name ?? '')
  const [half, setHalf] = useState(false)
  const [secondId, setSecondId] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState('')

  // Sabores válidos para o 2º (mesma categoria, com o tamanho escolhido, diferente do atual)
  const secondOptions = useMemo(
    () => flavors.filter(f => f.id !== product.id && f.category_id === product.category_id && sizePrice(f, sizeName) != null),
    [flavors, product.id, product.category_id, sizeName]
  )
  const second = secondOptions.find(f => f.id === secondId) || null

  const base = sizePrice(product, sizeName)
  const otherPrice = second ? sizePrice(second, sizeName) : null
  // Meio a meio: média dos dois sabores. Inteira: preço do sabor.
  const unitPrice = half && otherPrice != null && base != null ? (base + otherPrice) / 2 : (base ?? 0)

  function handleAdd() {
    if (base == null) { toast.error('Escolha um tamanho'); return }
    if (half && !second) { toast.error('Escolha o segundo sabor'); return }
    const flavorsSel = half && second
      ? [{ id: product.id, name: product.name }, { id: second.id, name: second.name }]
      : [{ id: product.id, name: product.name }]
    for (let i = 0; i < quantity; i++) {
      addPizzaItem(product, { sizeName, flavors: flavorsSel, unitPrice }, observation || undefined)
    }
    toast.success('Pizza adicionada ao carrinho!')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-md bg-[var(--surface,#fff)] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {product.image_url && (
          <div className="h-40 w-full overflow-hidden">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}
        <button onClick={onClose} className="absolute top-3 right-3 rounded-full bg-white p-1.5 shadow-md text-gray-600 hover:text-gray-900">
          <X className="h-5 w-5" />
        </button>

        <div className="p-5 space-y-5">
          <div>
            <h3 className="text-xl font-bold text-[var(--text,#111827)]">{product.name}</h3>
            {product.description && <p className="text-sm text-[var(--muted,#6b7280)] mt-1">{product.description}</p>}
          </div>

          {/* Tamanho */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-[var(--text,#111827)]">Escolha o tamanho</p>
            <div className="grid grid-cols-2 gap-2">
              {sizes.map(s => (
                <button key={s.name} type="button"
                  onClick={() => { setSizeName(s.name); setSecondId('') }}
                  className={`flex items-center justify-between rounded-xl border-2 px-3 py-2.5 text-sm transition-colors ${sizeName === s.name ? 'border-[var(--brand,#f97316)] bg-orange-50' : 'border-gray-200'}`}>
                  <span className="font-medium text-[var(--text,#111827)]">{s.name}</span>
                  <span className="text-[var(--brand,#f97316)] font-semibold">{formatCurrency(s.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Meio a meio */}
          {maxFlavors >= 2 && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button type="button" onClick={() => setHalf(false)}
                  className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-colors ${!half ? 'border-[var(--brand,#f97316)] bg-orange-50 text-[var(--brand,#f97316)]' : 'border-gray-200 text-gray-600'}`}>
                  Inteira
                </button>
                <button type="button" onClick={() => setHalf(true)} disabled={secondOptions.length === 0}
                  className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-colors disabled:opacity-40 ${half ? 'border-[var(--brand,#f97316)] bg-orange-50 text-[var(--brand,#f97316)]' : 'border-gray-200 text-gray-600'}`}>
                  Meio a meio
                </button>
              </div>
              {half && (
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-[var(--text,#111827)]">2º sabor</p>
                  <select value={secondId} onChange={e => setSecondId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand,#f97316)]">
                    <option value="">Escolha o segundo sabor</option>
                    {secondOptions.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({formatCurrency(sizePrice(f, sizeName) ?? 0)})</option>
                    ))}
                  </select>
                  <p className="text-xs text-[var(--muted,#6b7280)]">O preço é a média dos dois sabores.</p>
                </div>
              )}
            </div>
          )}

          {/* Observação */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text,#111827)]">Observações</label>
            <textarea value={observation} onChange={e => setObservation(e.target.value)} rows={2}
              placeholder="Ex: sem cebola, borda recheada..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand,#f97316)] resize-none" />
          </div>

          {/* Quantidade */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text,#111827)]">Quantidade</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-lg font-semibold text-[var(--text,#111827)]">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand,#f97316)] text-white">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button onClick={handleAdd}
            className="w-full flex items-center justify-between rounded-xl bg-[var(--brand,#f97316)] px-5 py-3.5 font-semibold text-white hover:opacity-90 transition-opacity">
            <span>Adicionar ao carrinho</span>
            <span>{formatCurrency(unitPrice * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
