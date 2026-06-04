'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Minus, Plus, Trash2, ShoppingCart, Tag } from 'lucide-react'
import type { Business } from '@/types'
import { useCartStore } from '@/lib/stores/cart'
import { formatCurrency, buildWhatsAppMessage } from '@/lib/utils/format'
import { toast } from '@/components/ui/sonner'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  business: Business
}

const DEFAULT_PAYMENT_OPTIONS = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix']

export function CartDrawer({ open, onClose, business }: CartDrawerProps) {
  const paymentOptions = (business.payment_methods && business.payment_methods.length > 0)
    ? business.payment_methods
    : DEFAULT_PAYMENT_OPTIONS
  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTotal, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore()
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState('')
  const [observations, setObservations] = useState('')
  const [couponInput, setCouponInput] = useState('')

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const applyCouponCode = useCallback(async () => {
    if (!couponInput) return
    const supabase = createClient()
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponInput.toUpperCase())
      .eq('business_id', business.id)
      .eq('is_active', true)
      .single()

    if (!coupon) { toast.error('Cupom inválido ou expirado'); setCouponInput(''); return }
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) { toast.error('Cupom expirado'); setCouponInput(''); return }
    if (coupon.min_order_value && getSubtotal() < coupon.min_order_value) {
      toast.error(`Pedido mínimo de ${formatCurrency(coupon.min_order_value)} para este cupom`)
      setCouponInput(''); return
    }

    const discount = coupon.discount_type === 'percentage'
      ? getSubtotal() * (coupon.discount_value / 100)
      : coupon.discount_value

    applyCoupon(coupon.code, discount)
    toast.success(`Cupom aplicado! ${coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : formatCurrency(coupon.discount_value)} de desconto`)
    setCouponInput('')
  }, [couponInput, business.id, getSubtotal, applyCoupon])

  function handleSendOrder() {
    if (items.length === 0) return
    const whatsappNumber = business.whatsapp.replace(/\D/g, '')
    const message = buildWhatsAppMessage(
      business.name,
      items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.promotional_price ?? item.product.price,
        additionals: item.additionals.map(a => a.name),
      })),
      getSubtotal(),
      couponDiscount,
      getTotal(),
      address,
      payment,
      observations,
      couponCode ?? undefined,
    )
    window.open(`https://wa.me/55${whatsappNumber}?text=${message}`, '_blank')
    clearCart()
    onClose()
    toast.success('Pedido enviado pelo WhatsApp!')
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Carrinho</h2>
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-600">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-200 mb-3" />
              <p className="font-medium text-gray-500">Carrinho vazio</p>
              <p className="text-sm text-gray-400">Adicione produtos para continuar</p>
            </div>
          )}

          {items.map(item => (
            <div key={item.product.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
              {item.product.image_url && (
                <img src={item.product.image_url} alt={item.product.name} className="h-14 w-14 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">{item.product.name}</p>
                {item.additionals.length > 0 && (
                  <p className="text-xs text-gray-500 truncate">+{item.additionals.map(a => a.name).join(', ')}</p>
                )}
                <p className="text-sm font-semibold text-orange-500 mt-1">
                  {formatCurrency((item.product.promotional_price ?? item.product.price) * item.quantity)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white hover:bg-orange-600">
                  <Plus className="h-3 w-3" />
                </button>
                <button onClick={() => removeItem(item.product.id)} className="ml-1 text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Coupon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><Tag className="h-4 w-4" />Cupom de desconto</label>
                {couponCode ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                    <span className="text-sm font-medium text-green-700">{couponCode} — -{formatCurrency(couponDiscount)}</span>
                    <button onClick={removeCoupon} className="text-green-500 hover:text-green-700"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} placeholder="CÓDIGO" className="flex-1 h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 uppercase" />
                    <button onClick={applyCouponCode} className="rounded-lg bg-gray-100 px-3 text-sm font-medium text-gray-700 hover:bg-gray-200">Aplicar</button>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Endereço de entrega</label>
                <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Rua, número, bairro..." className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>

              {/* Payment */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Forma de pagamento</label>
                <div className="flex flex-wrap gap-2">
                  {paymentOptions.map(opt => (
                    <button key={opt} onClick={() => setPayment(opt)} className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${payment === opt ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observations */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Observações</label>
                <textarea value={observations} onChange={e => setObservations(e.target.value)} placeholder="Alergias, preferências..." rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>{formatCurrency(getSubtotal())}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto</span><span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span><span className="text-orange-500">{formatCurrency(getTotal())}</span>
              </div>
            </div>
            <button
              onClick={handleSendOrder}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar pedido pelo WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  )
}
