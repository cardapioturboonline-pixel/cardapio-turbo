'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Megaphone, MessageCircle, Check, Ticket, Sparkles, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { hasProAccess } from '@/lib/plan'
import type { Customer, Coupon } from '@/types'
import { tagsFor, waLink, renderMessage, type Tag } from '@/lib/customers'

const SEGMENTS: { id: 'todos' | Tag; label: string; desc: string }[] = [
  { id: 'sumido', label: 'Sumidos', desc: 'Quem não pede há mais de 30 dias' },
  { id: 'recorrente', label: 'Recorrentes', desc: 'Quem já pediu 2 vezes ou mais' },
  { id: 'vip', label: 'VIP', desc: 'Seus melhores clientes' },
  { id: 'novo', label: 'Novos', desc: 'Quem pediu só uma vez' },
  { id: 'todos', label: 'Todos', desc: 'Toda a sua base' },
]

const TEMPLATES: { id: string; label: string; text: string }[] = [
  { id: 'winback', label: 'Trazer de volta', text: 'Oi {nome}! Sentimos sua falta 😊 Volta pra gente com o cupom {cupom} e ganhe um desconto especial no seu próximo pedido!' },
  { id: 'novidade', label: 'Novidade no cardápio', text: 'Oi {nome}! Temos novidade no cardápio e achamos que você vai amar 😍 Dá uma olhada e use o cupom {cupom}!' },
  { id: 'promo', label: 'Promoção do dia', text: 'Oi {nome}! Hoje tem promoção imperdível 🔥 Use o cupom {cupom} e aproveite. Corre que é só hoje!' },
  { id: 'aniversario', label: 'Aniversário', text: 'Oi {nome}! Um presentinho pra você 🎉 Use o cupom {cupom} e comemore com a gente!' },
]

export default function CampaignsPage() {
  const { business, loading: bizLoading } = useBusiness()
  const proAccess = hasProAccess(business)

  const [customers, setCustomers] = useState<Customer[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)

  const [seg, setSeg] = useState<'todos' | Tag>('sumido')
  const [coupon, setCoupon] = useState('')
  const [message, setMessage] = useState(TEMPLATES[0].text)
  const [sent, setSent] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    if (!business?.id) return
    const supabase = createClient()
    const [cRes, kRes] = await Promise.all([
      supabase.from('customers').select('*').eq('business_id', business.id).order('last_order_at', { ascending: false }),
      supabase.from('coupons').select('*').eq('business_id', business.id).eq('is_active', true),
    ])
    setCustomers((cRes.data as Customer[]) ?? [])
    setCoupons((kRes.data as Coupon[]) ?? [])
    setLoading(false)
  }, [business?.id])

  useEffect(() => { load() }, [load])

  const recipients = useMemo(
    () => customers.filter(c => seg === 'todos' || tagsFor(c).includes(seg)),
    [customers, seg]
  )

  // ao trocar de segmento, zera o controle de enviados
  useEffect(() => { setSent(new Set()) }, [seg])

  if (bizLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
  }

  if (!proAccess) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">Campanhas <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">PRO</span></h1>
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3"><Megaphone className="h-6 w-6" /><h3 className="font-semibold">Recompra automática no WhatsApp</h3></div>
          <p className="text-sm text-orange-100 mb-4">Traga clientes de volta com campanhas segmentadas e cupons, direto no WhatsApp. Recurso do plano Pro (R$ 29,90/mês).</p>
          <Link href="/dashboard/plans" className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Ver plano Pro</Link>
        </div>
      </div>
    )
  }

  const preview = recipients[0]
    ? renderMessage(message, recipients[0], coupon)
    : renderMessage(message, { name: 'Maria' } as Customer, coupon)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campanhas no WhatsApp</h1>
        <p className="text-sm text-gray-500">Traga clientes de volta e venda mais para quem você já conquistou</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* ---- Montar campanha ---- */}
        <div className="space-y-5">
          {/* 1. Segmento */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-orange-500" /> 1. Para quem enviar</h3>
            <div className="grid grid-cols-2 gap-2">
              {SEGMENTS.map(s => {
                const count = customers.filter(c => s.id === 'todos' || tagsFor(c).includes(s.id)).length
                return (
                  <button key={s.id} onClick={() => setSeg(s.id)}
                    className={`rounded-lg border p-3 text-left transition-colors ${seg === s.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{s.label}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${seg === s.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{count}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{s.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Cupom */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Ticket className="h-4 w-4 text-orange-500" /> 2. Cupom (opcional)</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Ex.: VOLTA15"
                className="flex-1 min-w-[140px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
              {coupons.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {coupons.slice(0, 4).map(k => (
                    <button key={k.id} onClick={() => setCoupon(k.code)}
                      className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-orange-300">{k.code}</button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-2">Crie e gerencie cupons na aba <Link href="/dashboard/promotions" className="text-orange-500 underline">Promoções</Link>.</p>
          </div>

          {/* 3. Mensagem */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-orange-500" /> 3. Mensagem</h3>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setMessage(t.text)}
                  className="rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-orange-300">{t.label}</button>
              ))}
            </div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
            <p className="text-[11px] text-gray-400 mt-1">Use <code className="bg-gray-100 px-1 rounded">{'{nome}'}</code> e <code className="bg-gray-100 px-1 rounded">{'{cupom}'}</code> — são trocados pelo nome do cliente e pelo cupom.</p>
          </div>
        </div>

        {/* ---- Preview + envio ---- */}
        <div className="space-y-5">
          {/* Preview */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Prévia da mensagem</h3>
            <div className="rounded-2xl bg-[#e5ddd5] p-4">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#dcf8c6] px-3 py-2 text-sm text-gray-800 shadow-sm whitespace-pre-wrap">
                {preview || 'Escreva sua mensagem...'}
              </div>
            </div>
          </div>

          {/* Lista de envio */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Enviar ({sent.size}/{recipients.length})</h3>
              {recipients.length > 0 && <span className="text-xs text-gray-400">Clique pra abrir no WhatsApp</span>}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10"><div className="h-7 w-7 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
            ) : recipients.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                Nenhum cliente nesse segmento ainda.
              </div>
            ) : (
              <div className="max-h-[360px] overflow-y-auto -mx-1 px-1 space-y-1.5">
                {recipients.map(c => {
                  const done = sent.has(c.id)
                  return (
                    <div key={c.id} className={`flex items-center gap-3 rounded-lg border p-2.5 ${done ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.name || 'Cliente'}</p>
                        <p className="text-[11px] text-gray-400">{c.phone}</p>
                      </div>
                      <a href={waLink(c.phone, renderMessage(message, c, coupon))} target="_blank" rel="noopener noreferrer"
                        onClick={() => setSent(prev => new Set(prev).add(c.id))}
                        className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white ${done ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}>
                        {done ? <><Check className="h-3.5 w-3.5" /> Enviado</> : <><MessageCircle className="h-3.5 w-3.5" /> Enviar</>}
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
