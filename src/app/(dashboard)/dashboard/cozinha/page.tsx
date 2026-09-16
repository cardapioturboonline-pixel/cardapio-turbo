'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ChefHat, Volume2, VolumeX, Printer, FileDown, Clock, Bike, Store, Maximize2, Minimize2, RotateCcw, History, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { hasProAccess } from '@/lib/plan'
import { printComanda, downloadComandaPdf } from '@/lib/print-comanda'
import type { Order, OrderStatus } from '@/types'
import { toast } from '@/components/ui/sonner'

const COLUMNS: { id: OrderStatus; label: string; next?: OrderStatus; nextLabel?: string; prev?: OrderStatus; head: string }[] = [
  { id: 'pending', label: 'Aguardando aprovação', next: 'preparing', nextLabel: 'Aceitar e enviar à cozinha', head: 'bg-orange-500' },
  { id: 'preparing', label: 'Em preparo', next: 'delivering', nextLabel: 'Marcar pronto', prev: 'pending', head: 'bg-blue-500' },
  { id: 'delivering', label: 'Prontos', next: 'delivered', nextLabel: 'Entregue', prev: 'preparing', head: 'bg-green-600' },
]

const STATUS_LABEL: Record<string, string> = {
  pending: 'Aguardando', preparing: 'Em preparo', delivering: 'Pronto', delivered: 'Entregue', cancelled: 'Cancelado',
}

// Campainha "ding-dong" (estilo sino), sintetizada — sem depender de arquivo.
function beep() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const note = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain()
      osc.type = 'sine'; osc.frequency.value = freq
      osc.connect(gain); gain.connect(ctx.destination)
      const t = ctx.currentTime + start
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      osc.start(t); osc.stop(t + dur)
    }
    note(988, 0, 0.7)     // ding
    note(784, 0.33, 0.95) // dong
  } catch { /* ignore */ }
}

function elapsed(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (m < 1) return 'agora'
  if (m < 60) return `${m} min`
  return `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function CozinhaPage() {
  const { business, loading: bizLoading } = useBusiness()
  const proAccess = hasProAccess(business)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [soundOn, setSoundOn] = useState(true)
  const soundRef = useRef(true); soundRef.current = soundOn
  const [, setTick] = useState(0)
  const [fs, setFs] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<Order[]>([])
  const rootRef = useRef<HTMLDivElement>(null)

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

  const loadHistory = useCallback(async () => {
    if (!business?.id) return
    const supabase = createClient()
    const { data } = await supabase.from('orders').select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false }).limit(40)
    setHistory((data as Order[]) ?? [])
  }, [business?.id])

  useEffect(() => { load() }, [load])
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 30000); return () => clearInterval(t) }, [])

  // acompanha estado de tela cheia
  useEffect(() => {
    const on = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])

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

  async function changeStatus(o: Order, status: OrderStatus) {
    const supabase = createClient()
    setOrders(prev => ['pending', 'preparing', 'delivering'].includes(status)
      ? (prev.some(x => x.id === o.id) ? prev.map(x => x.id === o.id ? { ...x, status } : x) : [...prev, { ...o, status }])
      : prev.filter(x => x.id !== o.id))
    const { error } = await supabase.from('orders').update({ status }).eq('id', o.id)
    if (error) { toast.error('Erro ao atualizar'); load() }
    else if (showHistory) loadHistory()
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) rootRef.current?.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
  }

  function openHistory() { setShowHistory(true); loadHistory() }

  if (bizLoading) return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>

  if (!proAccess) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">Cozinha <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">PRO</span></h1>
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3"><ChefHat className="h-6 w-6" /><h3 className="font-semibold">Tela de cozinha em tempo real</h3></div>
          <p className="text-sm text-orange-100 mb-4">Fila de pedidos com aviso sonoro, tela cheia para TV, voltar status e histórico. Recurso do plano Pro (R$ 29,90/mês).</p>
          <Link href="/dashboard/plans" className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Ver plano Pro</Link>
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="space-y-4 bg-white">
      {/* fullscreen precisa de fundo/preenchimento próprios */}
      <div className={fs ? 'p-4 min-h-screen' : ''}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"><ChefHat className="h-6 w-6 text-orange-500" /> Cozinha</h1>
            <p className="text-xs sm:text-sm text-gray-500">Fila em tempo real. Toque para avançar; use a setinha para voltar.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setSoundOn(s => !s)} title="Som" className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium ${soundOn ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-500'}`}>
              {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}<span className="hidden sm:inline">Som</span>
            </button>
            <button onClick={openHistory} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              <History className="h-4 w-4" /><span className="hidden sm:inline">Histórico</span>
            </button>
            <button onClick={toggleFullscreen} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
              {fs ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}<span className="hidden sm:inline">{fs ? 'Sair' : 'Tela cheia'}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {COLUMNS.map(col => {
              const list = orders.filter(o => o.status === col.id)
              return (
                <div key={col.id} className="rounded-2xl bg-gray-50 border border-gray-200 overflow-hidden flex flex-col">
                  <div className={`${col.head} text-white px-4 py-2.5 flex items-center justify-between`}>
                    <span className="font-bold text-sm sm:text-base">{col.label}</span>
                    <span className="rounded-full bg-white/25 px-2 py-0.5 text-sm font-bold">{list.length}</span>
                  </div>
                  <div className="p-3 space-y-3 min-h-[100px]">
                    {list.length === 0 && <p className="text-center text-sm text-gray-400 py-6">Vazio</p>}
                    {list.map(o => (
                      <div key={o.id} className="rounded-xl bg-white border border-gray-200 shadow-sm p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-extrabold text-gray-900">#{o.order_number ?? '—'}</span>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="h-3.5 w-3.5" /> {elapsed(o.created_at)}</span>
                            {col.prev && (
                              <button onClick={() => changeStatus(o, col.prev!)} title="Voltar status"
                                className="rounded-md p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50"><RotateCcw className="h-4 w-4" /></button>
                            )}
                          </div>
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
                            className="rounded-lg border border-gray-200 px-2.5 py-2 text-gray-500 hover:text-orange-500 hover:border-orange-200"><Printer className="h-4 w-4" /></button>
                          <button onClick={() => downloadComandaPdf(o, business?.name || 'Pedido')} title="Baixar PDF"
                            className="rounded-lg border border-gray-200 px-2.5 py-2 text-gray-500 hover:text-orange-500 hover:border-orange-200"><FileDown className="h-4 w-4" /></button>
                          {col.next && (
                            <button onClick={() => changeStatus(o, col.next!)}
                              className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-sm font-bold text-white hover:bg-orange-600">{col.nextLabel}</button>
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

      {/* Histórico / linha do tempo */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><History className="h-5 w-5 text-orange-500" /> Histórico de pedidos</h2>
              <button onClick={() => setShowHistory(false)} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {history.length === 0 ? <p className="text-center text-sm text-gray-400 py-8">Nenhum pedido recente.</p> : history.map(o => (
                <div key={o.id} className="rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">#{o.order_number ?? '—'}</span>
                    <span className="text-xs text-gray-400">{fmtTime(o.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>{STATUS_LABEL[o.status] ?? o.status}</span>
                    <span className="text-sm text-gray-500">{o.customer_name || 'Cliente'}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500 truncate flex-1">{(o.items ?? []).map(it => `${it.quantity}x ${it.name}`).join(', ')}</p>
                    <button onClick={() => printComanda(o, business?.name || 'Pedido')} className="shrink-0 rounded-md border border-gray-200 p-1.5 text-gray-400 hover:text-orange-500"><Printer className="h-3.5 w-3.5" /></button>
                  </div>
                  {(o.status === 'delivered' || o.status === 'cancelled') && (
                    <button onClick={() => { changeStatus(o, 'preparing'); toast.success(`Pedido #${o.order_number ?? ''} reaberto na cozinha`) }}
                      className="mt-2 w-full rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:bg-orange-50">
                      Reabrir na cozinha
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
