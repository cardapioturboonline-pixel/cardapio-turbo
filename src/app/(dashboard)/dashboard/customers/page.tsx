'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Users, Search, MessageCircle, Crown, Repeat, Clock, Sparkles, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { hasProAccess } from '@/lib/plan'
import { formatCurrency } from '@/lib/utils/format'
import type { Customer } from '@/types'
import { DAY, TAG_META, tagsFor, daysSinceLast, waLink, type Tag } from '@/lib/customers'

function greetWa(phone: string, name?: string) {
  return waLink(phone, `Oi${name ? ' ' + name.split(' ')[0] : ''}! Tudo bem? Aqui é do nosso delivery 😊`)
}

export default function CustomersPage() {
  const { business, loading: bizLoading } = useBusiness()
  const proAccess = hasProAccess(business)

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [seg, setSeg] = useState<'todos' | Tag>('todos')

  const load = useCallback(async () => {
    if (!business?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('business_id', business.id)
      .order('last_order_at', { ascending: false })
    setCustomers((data as Customer[]) ?? [])
    setLoading(false)
  }, [business?.id])

  useEffect(() => { load() }, [load])

  const stats = useMemo(() => {
    const total = customers.length
    const recorrentes = customers.filter(c => c.orders_count >= 2).length
    const sumidos = customers.filter(c => (Date.now() - new Date(c.last_order_at).getTime()) / DAY >= 30).length
    const spent = customers.reduce((a, c) => a + (c.total_spent || 0), 0)
    const orders = customers.reduce((a, c) => a + (c.orders_count || 0), 0)
    const ticket = orders ? spent / orders : 0
    return { total, recorrentes, sumidos, ticket }
  }, [customers])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return customers.filter(c => {
      if (seg !== 'todos' && !tagsFor(c).includes(seg)) return false
      if (!q) return true
      return (c.name || '').toLowerCase().includes(q) || c.phone.includes(q.replace(/\D/g, ''))
    })
  }, [customers, query, seg])

  if (bizLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
  }

  if (!proAccess) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">Clientes <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">PRO</span></h1>
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3"><Users className="h-6 w-6" /><h3 className="font-semibold">Seja dono do seu cliente</h3></div>
          <p className="text-sm text-orange-100 mb-4">Sua própria base de clientes: veja quem mais compra, quem sumiu e fale direto no WhatsApp. Os apps escondem isso de você. Recurso do plano Pro (R$ 29,90/mês).</p>
          <Link href="/dashboard/plans" className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Ver plano Pro</Link>
        </div>
      </div>
    )
  }

  const segTabs: { id: 'todos' | Tag; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'vip', label: 'VIP' },
    { id: 'recorrente', label: 'Recorrentes' },
    { id: 'novo', label: 'Novos' },
    { id: 'sumido', label: 'Sumidos' },
  ]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500">Sua base de clientes, atualizada automaticamente a cada pedido</p>
        </div>
        <button onClick={() => { setLoading(true); load() }} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><Users className="h-3.5 w-3.5" /> Total de clientes</div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><Repeat className="h-3.5 w-3.5" /> Recorrentes</div>
          <p className="text-2xl font-bold text-blue-500">{stats.recorrentes}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><Sparkles className="h-3.5 w-3.5" /> Ticket médio</div>
          <p className="text-2xl font-bold text-orange-500">{formatCurrency(stats.ticket)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500"><Clock className="h-3.5 w-3.5" /> Sumidos (+30d)</div>
          <p className="text-2xl font-bold text-red-500">{stats.sumidos}</p>
        </div>
      </div>

      {/* Busca + segmentos */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nome ou telefone..."
            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {segTabs.map(t => (
            <button key={t.id} onClick={() => setSeg(t.id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${seg === t.id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Users className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="font-medium text-gray-900">{customers.length === 0 ? 'Nenhum cliente ainda' : 'Nada encontrado'}</h3>
          <p className="text-sm text-gray-500 mt-1">{customers.length === 0 ? 'A cada pedido pelo cardápio, o cliente aparece aqui automaticamente' : 'Tente outro nome, telefone ou segmento'}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {filtered.map((c, i) => {
            const tags = tagsFor(c)
            const daysSince = daysSinceLast(c)
            return (
              <div key={c.id} className={`flex items-center gap-3 p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-semibold">
                  {(c.name?.[0] || '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate">{c.name || 'Cliente'}</p>
                    {tags.map(t => (
                      <span key={t} className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${TAG_META[t].cls}`}>
                        {t === 'vip' && <Crown className="inline h-2.5 w-2.5 mr-0.5" />}{TAG_META[t].label}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {c.orders_count} pedido{c.orders_count !== 1 ? 's' : ''} · {formatCurrency(c.total_spent)} · {daysSince === 0 ? 'pediu hoje' : `há ${daysSince}d`}
                  </p>
                </div>
                <a href={greetWa(c.phone, c.name)} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white hover:bg-green-600">
                  <MessageCircle className="h-4 w-4" /> <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
