'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Clock, MapPin, Phone, CreditCard, Bike, Store, Volume2, VolumeX, RefreshCw, Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { hasProAccess } from '@/lib/plan'
import { formatCurrency } from '@/lib/utils/format'
import type { Order, OrderStatus } from '@/types'
import { toast } from '@/components/ui/sonner'

const FLOW: { id: OrderStatus; label: string; next?: OrderStatus; color: string }[] = [
  { id: 'pending', label: 'Novos', next: 'preparing', color: 'bg-orange-500' },
  { id: 'preparing', label: 'Preparando', next: 'delivering', color: 'bg-blue-500' },
  { id: 'delivering', label: 'Saiu / Pronto', next: 'delivered', color: 'bg-purple-500' },
  { id: 'delivered', label: 'Concluídos', color: 'bg-green-500' },
]

const NEXT_LABEL: Record<string, string> = {
  preparing: 'Aceitar e preparar',
  delivering: 'Marcar como pronto',
  delivered: 'Concluir pedido',
}

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'; osc.frequency.value = 880
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
    osc.start(); osc.stop(ctx.currentTime + 0.5)
  } catch { /* ignore */ }
}

export default function OrdersPage() {
  const { business, loading: bizLoading } = useBusiness()
  const proAccess = hasProAccess(business)

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus>('pending')
  const [soundOn, setSoundOn] = useState(true)
  const soundRef = useRef(true)
  soundRef.current = soundOn

  const load = useCallback(async () => {
    if (!business?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('business_id', business.id)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
    setOrders((data as Order[]) ?? [])
    setLoading(false)
  }, [business?.id])

  useEffect(() => { load() }, [load])

  // Realtime subscription
  useEffect(() => {
    if (!business?.id || !proAccess) return
    const supabase = createClient()
    const channel = supabase
      .channel('orders-' + business.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `business_id=eq.${business.id}` },
        payload => {
          setOrders(prev => [payload.new as Order, ...prev])
          if (soundRef.current) beep()
          toast.success('🔔 Novo pedido recebido!')
        })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `business_id=eq.${business.id}` },
        payload => {
          setOrders(prev => prev.map(o => o.id === (payload.new as Order).id ? payload.new as Order : o))
        })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [business?.id, proAccess])

  async function updateStatus(id: string, status: OrderStatus) {
    const supabase = createClient()
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) { toast.error('Erro ao atualizar pedido'); load() }
  }

  if (bizLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
  }

  if (!proAccess) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">Pedidos <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">PRO</span></h1>
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3"><Bell className="h-6 w-6" /><h3 className="font-semibold">Painel de pedidos em tempo real</h3></div>
          <p className="text-sm text-orange-100 mb-4">Receba os pedidos do cardápio organizados por status, com aviso sonoro e atualização ao vivo. Recurso do plano Pro (R$ 29,90/mês).</p>
          <Link href="/dashboard/plans" className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Ver plano Pro</Link>
        </div>
      </div>
    )
  }

  const counts = FLOW.reduce((acc, f) => { acc[f.id] = orders.filter(o => o.status === f.id).length; return acc }, {} as Record<string, number>)
  const filtered = orders.filter(o => o.status === filter)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-500">Pedidos recebidos pelo cardápio · atualização ao vivo</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSoundOn(s => !s)} title={soundOn ? 'Som ligado' : 'Som desligado'}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${soundOn ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500'}`}>
            {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button onClick={load} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" /> Atualizar
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FLOW.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${filter === f.id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
            {f.label}
            {counts[f.id] > 0 && <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${filter === f.id ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-600'}`}>{counts[f.id]}</span>}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Bell className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="font-medium text-gray-900">Nenhum pedido aqui</h3>
          <p className="text-sm text-gray-500 mt-1">Os pedidos do cardápio vão aparecer automaticamente</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map(order => {
            const flowStep = FLOW.find(f => f.id === order.status)
            return (
              <div key={order.id} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{order.customer_name || 'Cliente'}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${flowStep?.color || 'bg-gray-400'}`}>{flowStep?.label}</span>
                </div>

                <div className="space-y-1 text-sm">
                  {order.items?.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-700">{it.quantity}x {it.name}{it.observations ? <span className="text-orange-500 text-xs"> · {it.observations}</span> : ''}</span>
                      <span className="text-gray-500">{formatCurrency(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-2 space-y-1 text-xs text-gray-500">
                  <p className="flex items-center gap-1.5">{order.order_type === 'pickup' ? <Store className="h-3.5 w-3.5" /> : <Bike className="h-3.5 w-3.5" />}{order.order_type === 'pickup' ? 'Retirar no local' : 'Delivery'}{order.neighborhood ? ` · ${order.neighborhood}` : ''}</p>
                  {order.delivery_address && order.order_type !== 'pickup' && <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{order.delivery_address}</p>}
                  {order.customer_phone && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{order.customer_phone}</p>}
                  {order.payment_method && <p className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5" />{order.payment_method}</p>}
                  {order.schedule && <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{order.schedule}</p>}
                  {order.observations && <p className="text-orange-500">📝 {order.observations}</p>}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
                  <div className="flex gap-1.5">
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button onClick={() => updateStatus(order.id, 'cancelled')} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:text-red-500 hover:border-red-200">Cancelar</button>
                    )}
                    {flowStep?.next && (
                      <button onClick={() => updateStatus(order.id, flowStep.next!)} className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600">
                        {NEXT_LABEL[flowStep.next]}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
