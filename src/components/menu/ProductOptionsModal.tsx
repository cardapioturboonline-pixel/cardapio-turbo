'use client'

import { useMemo, useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import type { Product, OptionGroup, Additional } from '@/types'
import { formatCurrency } from '@/lib/utils/format'
import { useCartStore } from '@/lib/stores/cart'
import { toast } from '@/components/ui/sonner'

interface ProductOptionsModalProps {
  product: Product
  onClose: () => void
}

// chave única de uma opção dentro de um grupo
const key = (g: number, o: number) => `${g}:${o}`

export function ProductOptionsModal({ product, onClose }: ProductOptionsModalProps) {
  const addConfiguredItem = useCartStore(s => s.addConfiguredItem)
  const groups = (product.option_groups ?? []) as OptionGroup[]
  const base = product.promotional_price ?? product.price
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [quantity, setQuantity] = useState(1)
  const [observation, setObservation] = useState('')

  function toggle(gi: number, oi: number, group: OptionGroup) {
    setSelected(prev => {
      const next = new Set(prev)
      const k = key(gi, oi)
      if (next.has(k)) { next.delete(k); return next }
      // escolha única (max 1): substitui a opção do grupo
      if (group.max <= 1) {
        group.options.forEach((_, idx) => next.delete(key(gi, idx)))
        next.add(k)
        return next
      }
      // múltipla: respeita o limite do grupo
      const countInGroup = group.options.reduce((n, _, idx) => n + (next.has(key(gi, idx)) ? 1 : 0), 0)
      if (countInGroup >= group.max) { toast.error(`Escolha até ${group.max} em "${group.name}"`); return prev }
      next.add(k)
      return next
    })
  }

  const extra = useMemo(() => {
    let sum = 0
    groups.forEach((g, gi) => g.options.forEach((o, oi) => { if (selected.has(key(gi, oi))) sum += Number(o.price) || 0 }))
    return sum
  }, [selected, groups])
  const unit = base + extra

  function handleAdd() {
    // valida grupos obrigatórios
    for (let gi = 0; gi < groups.length; gi++) {
      const g = groups[gi]
      const chosen = g.options.some((_, oi) => selected.has(key(gi, oi)))
      if (g.required && !chosen) { toast.error(`Escolha uma opção em "${g.name}"`); return }
    }
    const additionals: Additional[] = []
    groups.forEach((g, gi) => g.options.forEach((o, oi) => {
      if (selected.has(key(gi, oi))) additionals.push({
        id: `${gi}-${oi}`, product_id: product.id, name: o.name, price: Number(o.price) || 0, is_required: g.required, max_qty: g.max,
      })
    }))
    addConfiguredItem(product, additionals, observation || undefined, quantity)
    toast.success(`${quantity}x ${product.name} adicionado!`)
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

          {groups.map((g, gi) => (
            <div key={gi} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--text,#111827)]">{g.name}</p>
                <span className="text-xs text-[var(--muted,#6b7280)]">
                  {g.required ? 'Obrigatório' : 'Opcional'}{g.max > 1 ? ` · até ${g.max}` : ''}
                </span>
              </div>
              <div className="space-y-1.5">
                {g.options.map((o, oi) => {
                  const isSel = selected.has(key(gi, oi))
                  return (
                    <button key={oi} type="button" onClick={() => toggle(gi, oi, g)}
                      className={`flex w-full items-center justify-between rounded-xl border-2 px-3 py-2.5 text-sm transition-colors ${isSel ? 'border-[var(--brand,#f97316)] bg-orange-50' : 'border-gray-200'}`}>
                      <span className="flex items-center gap-2 text-[var(--text,#111827)]">
                        <span className={`inline-flex h-5 w-5 items-center justify-center ${g.max <= 1 ? 'rounded-full' : 'rounded'} border-2 ${isSel ? 'border-[var(--brand,#f97316)] bg-[var(--brand,#f97316)]' : 'border-gray-300'}`}>
                          {isSel && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                        {o.name}
                      </span>
                      {Number(o.price) > 0 && <span className="text-[var(--brand,#f97316)] font-semibold">+ {formatCurrency(Number(o.price))}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[var(--text,#111827)]">Observações</label>
            <textarea value={observation} onChange={e => setObservation(e.target.value)} rows={2}
              placeholder="Ex: sem cebola, capricha no molho..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand,#f97316)] resize-none" />
          </div>

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
            <span>{formatCurrency(unit * quantity)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
