'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ChefHat, Volume2, VolumeX, Printer, Clock, Bike, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { hasProAccess } from '@/lib/plan'
import { printComanda } from '@/lib/print-comanda'
import type { Order, OrderStatus } from '@/types'
import { toast } from '@/components/ui/sonner'

const COLUMNS: { id: OrderStatus; label: string; next?: OrderStatus; nextLabel?: string; head: string }[] = [
  { id: 'pending', label: 'Aguardando aprovação', next: 'preparing', nextLabel: 'Aceitar e enviar à cozinha', head: 'bg-orange-500' },
  { id: 'preparing', label: 'Em preparo', next: 'delivering', nextLabel: 'Marcar pronto', head: 'bg-blue-500' },
  { id: 'delivering', label: 'Prontos', next: 'delivered', nextLabel: 'Entregue', head: 'bg-green-600' },
]

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator(); const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    osc.type = 'sine'; osc.frequency.value = 880
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
    osc.start(); osc.stop(ctx.currentTime + 0.5)
  } catch { /* ignore */ }
}

function elapsed(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m} min`
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`
}

export default function CozinhaPage() {
  const { business, loading: bizLoading } = useBusiness()
  const proAccess = hasProAccess(business)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const soundRef = useRef(true); soundRef.current = soundOn
  const [, setTick] = useState(0)

  const load = useCallback(async () => {
    if (!business?.id) return
    const supabase = createClient()
    const { data } = await supabase.from('orders').select('*')
      .eq('business_id', business.id)
      .in('status', ['pending', 'preparing', 'delivering'])
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })
    setOrders((data as Order[]) ?? [])
    setLoading(false)
  }, [business?.id])

  useEffect(() => { load() }, [load])
  // atualiza o "tempo decorrido" a cada 30s
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 30000); return () => clearInterval(t) }, [])

  useEffect(() => {
    if (!business?.id || !proAccess) return
    const supabase = createClient()
    const ch = supabase.channel('cozinha-' + business.id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders', filter: `business_id=eq.${business.id}` },
        p => { setOrders(prev => [...prev, p.new as Order]); if (soundRef.current) beep(); toast.success('🔔 Novo pedido na cozinha!') })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `business_id=eq.${business.id}` },
        p => {
          const up = p.new as Order
          setOrders(prev => {
            const keep = ['pending', 'preparing', 'delivering'].includes(up.status)
            const exists = prev.some(o => o.id === up.id)
            if (!keep) return prev.filter(o => o.id !== up.id)
            return exists ? prev.map(o => o.id === up.id ? up : o) : [...prev, up]
          })
        })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [business?.id, proAccess])

  async function advance(o: Order, next: OrderStatus) {
    const supabase = createClient()
    setOrders(prev => next === 'delivered' ? prev.filter(x => x.id !== o.id) : prev.map(x => x.id === o.id ? { ...x, status: next } : x))
    const { error } = await supabase.from('orders').update({ status: next }).eq('id', o.id)
    if (error) { toast.error('Erro ao atualizar'); load() }
  }

  if (bizLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>

  if (!proAccess) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">Cozinha <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">PRO</span></h1>
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3"><ChefHat className="h-6 w-6" /><h3 className="font-semibold">Tela de cozinha em tempo real</h3></div>
          <p className="text-sm text-orange-100 mb-4">Uma tela pra cozinha acompanhar a fila de pedidos, avançar o status com um toque e imprimir a comanda. Recurso do plano Pro (R$ 29,90/mês).</p>
          <Link href="/dashboard/plans" className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Ver plano Pro</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><ChefHat className="h-6 w-6 text-orange-500" /> Cozinha</h1>
          <p className="text-sm text-gray-500">Fila de pedidos em tempo real. Toque no botão para avançar.</p>
        </div>
        <button onClick={() => setSoundOn(s => !s)} className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${soundOn ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500'}`}>
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />} Som
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLUMNS.map(col => {
            const list = orders.filter(o => o.status === col.id)
            return (
              <div key={col.id} className="rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden flex flex-col">
                <div className={`${col.head} text-white px-4 py-2.5 flex items-center justify-between`}>
                  <span className="font-bold">{col.label}</span>
                  <span className="rounded-full bg-white/25 px-2 py-0.5 text-sm font-bold">{list.length}</span>
                </div>
                <div className="p-3 space-y-3 min-h-[120px]">
                  {list.length === 0 && <p className="text-center text-sm text-gray-400 py-6">Vazio</p>}
                  {list.map(o => (
                    <div key={o.id} className="rounded-xl bg-white border border-gray-200 shadow-sm p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-extrabold text-gray-900">#{o.order_number ?? '—'}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="h-3.5 w-3.5" /> {elapsed(o.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
                        {o.order_type === 'pickup' ? <Store className="h-3.5 w-3.5" /> : <Bike className="h-3.5 w-3.5" />}
                        {o.order_type === 'pickup' ? 'Retirada' : 'Delivery'}{o.customer_name ? ` · ${o.customer_name}` : ''}
                      </p>
                      <div className="space-y-1 mb-3">
                        {o.items?.map((it, i) => (
                          <div key={i} className="text-sm text-gray-800">
                            <span className="font-bold">{it.quantity}x</span> {it.name}
                            {it.observations ? <span className="block text-xs text-orange-500 pl-5">↳ {it.observations}</span> : null}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => printComanda(o, business?.name || 'Pedido')} title="Imprimir"
                          className="rounded-lg border border-gray-200 px-2.5 py-2 text-gray-500 hover:text-orange-500 hover:border-orange-200">
                          <Printer className="h-4 w-4" />
                        </button>
                        {col.next && (
                          <button onClick={() => advance(o, col.next!)}
                            className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white hover:bg-orange-600">
                            {col.nextLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
