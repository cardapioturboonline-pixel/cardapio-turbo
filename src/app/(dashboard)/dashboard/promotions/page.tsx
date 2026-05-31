'use client'

import { useState } from 'react'
import { Plus, Trash2, Megaphone, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { mockCoupons, mockBusiness } from '@/lib/mock-data'
import type { Coupon } from '@/types'
import { toast } from '@/components/ui/sonner'

export default function PromotionsPage() {
  const isPro = mockBusiness.plan !== 'free'
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discount_type: 'percentage' as 'percentage' | 'fixed', discount_value: '', min_order_value: '', expires_at: '' })

  function createCoupon() {
    if (!form.code || !form.discount_value) { toast.error('Preencha código e valor do desconto'); return }
    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`, business_id: 'biz-001',
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_value: form.min_order_value ? parseFloat(form.min_order_value) : undefined,
      expires_at: form.expires_at || undefined,
      uses: 0, is_active: true,
    }
    setCoupons(prev => [...prev, newCoupon])
    setShowForm(false)
    setForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_value: '', expires_at: '' })
    toast.success('Cupom criado!')
  }

  function toggleCoupon(id: string) {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c))
  }

  function deleteCoupon(id: string) {
    setCoupons(prev => prev.filter(c => c.id !== id))
    toast.success('Cupom excluído!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Promoções</h1>
        <p className="text-sm text-gray-500">Gerencie cupons de desconto e promoções</p>
      </div>

      {/* Coupons section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Cupons de desconto</h2>
            {!isPro && <Badge variant="secondary"><Lock className="h-3 w-3 mr-1" />Pro</Badge>}
          </div>
          {isPro && (
            <button onClick={() => setShowForm(s => !s)} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600">
              <Plus className="h-4 w-4" /> Novo cupom
            </button>
          )}
        </div>

        {!isPro && (
          <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Megaphone className="h-6 w-6" />
              <h3 className="font-semibold">Crie cupons de desconto no plano Pro</h3>
            </div>
            <p className="text-sm text-orange-100 mb-4">Cupons aumentam a frequência de compra em até 35%. Faça upgrade e comece a usar!</p>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Ver planos</button>
          </div>
        )}

        {isPro && showForm && (
          <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Código do cupom</Label>
                <Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="BEMVINDO10" />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo de desconto</Label>
                <select value={form.discount_type} onChange={e => setForm(p => ({ ...p, discount_type: e.target.value as 'percentage' | 'fixed' }))}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="percentage">Porcentagem (%)</option>
                  <option value="fixed">Valor fixo (R$)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Valor do desconto</Label>
                <Input type="number" value={form.discount_value} onChange={e => setForm(p => ({ ...p, discount_value: e.target.value }))} placeholder={form.discount_type === 'percentage' ? '10' : '5.00'} />
              </div>
              <div className="space-y-1.5">
                <Label>Pedido mínimo (R$)</Label>
                <Input type="number" value={form.min_order_value} onChange={e => setForm(p => ({ ...p, min_order_value: e.target.value }))} placeholder="30.00" />
              </div>
              <div className="space-y-1.5">
                <Label>Válido até</Label>
                <Input type="date" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={createCoupon} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Criar cupom</button>
              <button onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
            </div>
          </div>
        )}

        {isPro && (
          <div className="space-y-2">
            {coupons.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">Nenhum cupom cadastrado</p>}
            {coupons.map(coupon => (
              <div key={coupon.id} className="flex items-center gap-4 rounded-lg border border-gray-200 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-gray-900">{coupon.code}</span>
                    <Badge variant={coupon.is_active ? 'success' : 'secondary'}>{coupon.is_active ? 'Ativo' : 'Inativo'}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% de desconto` : `R$ ${coupon.discount_value} de desconto`}
                    {coupon.min_order_value ? ` • Mín. R$ ${coupon.min_order_value}` : ''}
                    {coupon.expires_at ? ` • Até ${new Date(coupon.expires_at).toLocaleDateString('pt-BR')}` : ''}
                    {` • ${coupon.uses} usos`}
                  </p>
                </div>
                <Switch checked={coupon.is_active} onCheckedChange={() => toggleCoupon(coupon.id)} />
                <button onClick={() => deleteCoupon(coupon.id)} className="rounded-md p-1.5 text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
