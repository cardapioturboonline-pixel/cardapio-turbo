'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Wallet, Lock, LockOpen, ArrowUpCircle, ArrowDownCircle, Plus, RefreshCw, History } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { hasProAccess } from '@/lib/plan'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from '@/components/ui/sonner'
import type { CashSession, CashMovement, CashMovementType } from '@/types'

const MOVE_META: Record<CashMovementType, { label: string; sign: 1 | -1; cls: string }> = {
  entrada: { label: 'Entrada', sign: 1, cls: 'text-green-600' },
  suprimento: { label: 'Suprimento', sign: 1, cls: 'text-green-600' },
  saida: { label: 'Saída', sign: -1, cls: 'text-red-600' },
  sangria: { label: 'Sangria', sign: -1, cls: 'text-red-600' },
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function CaixaPage() {
  const { business, loading: bizLoading } = useBusiness()
  const proAccess = hasProAccess(business)

  const [session, setSession] = useState<CashSession | null>(null)
  const [movements, setMovements] = useState<CashMovement[]>([])
  const [history, setHistory] = useState<CashSession[]>([])
  const [loading, setLoading] = useState(true)

  const [openingAmount, setOpeningAmount] = useState('')
  const [mvType, setMvType] = useState<CashMovementType>('entrada')
  const [mvAmount, setMvAmount] = useState('')
  const [mvDesc, setMvDesc] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!business?.id) return
    const supabase = createClient()
    const { data: open } = await supabase
      .from('cash_sessions').select('*')
      .eq('business_id', business.id).is('closed_at', null)
      .order('opened_at', { ascending: false }).limit(1).maybeSingle()
    setSession((open as CashSession) ?? null)

    if (open) {
      const { data: mv } = await supabase
        .from('cash_movements').select('*')
        .eq('session_id', (open as CashSession).id)
        .order('created_at', { ascending: false })
      setMovements((mv as CashMovement[]) ?? [])
    } else {
      setMovements([])
    }

    const { data: hist } = await supabase
      .from('cash_sessions').select('*')
      .eq('business_id', business.id).not('closed_at', 'is', null)
      .order('closed_at', { ascending: false }).limit(10)
    setHistory((hist as CashSession[]) ?? [])
    setLoading(false)
  }, [business?.id])

  useEffect(() => { load() }, [load])

  const balance = useMemo(() => {
    if (!session) return 0
    return movements.reduce((acc, m) => acc + MOVE_META[m.type].sign * Number(m.amount), Number(session.opening_amount))
  }, [session, movements])

  const totals = useMemo(() => {
    let inc = 0, out = 0
    for (const m of movements) {
      if (MOVE_META[m.type].sign === 1) inc += Number(m.amount)
      else out += Number(m.amount)
    }
    return { inc, out }
  }, [movements])

  async function openCash() {
    if (busy) return
    const val = parseFloat(openingAmount.replace(',', '.')) || 0
    setBusy(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('cash_sessions')
      .insert({ business_id: business!.id, opening_amount: val }).select('*').single()
    setBusy(false)
    if (error) { toast.error('Erro ao abrir o caixa'); return }
    setSession(data as CashSession); setMovements([]); setOpeningAmount('')
    toast.success('Caixa aberto!')
  }

  async function addMovement() {
    if (busy || !session) return
    const val = parseFloat(mvAmount.replace(',', '.')) || 0
    if (val <= 0) { toast.error('Informe um valor'); return }
    setBusy(true)
    const supabase = createClient()
    const { data, error } = await supabase.from('cash_movements')
      .insert({ session_id: session.id, business_id: business!.id, type: mvType, amount: val, description: mvDesc || null })
      .select('*').single()
    setBusy(false)
    if (error) { toast.error('Erro ao registrar'); return }
    setMovements(prev => [data as CashMovement, ...prev]); setMvAmount(''); setMvDesc('')
    toast.success('Movimentação registrada!')
  }

  async function closeCash() {
    if (busy || !session) return
    if (!confirm(`Fechar o caixa? Saldo apurado: ${formatCurrency(balance)}`)) return
    setBusy(true)
    const supabase = createClient()
    const { error } = await supabase.from('cash_sessions')
      .update({ closed_at: new Date().toISOString(), closing_amount: balance })
      .eq('id', session.id)
    setBusy(false)
    if (error) { toast.error('Erro ao fechar o caixa'); return }
    toast.success('Caixa fechado!')
    setSession(null); setMovements([]); load()
  }

  if (bizLoading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
  }

  if (!proAccess) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">Controle de Caixa <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">PRO</span></h1>
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-3"><Wallet className="h-6 w-6" /><h3 className="font-semibold">Abra e feche o caixa com controle total</h3></div>
          <p className="text-sm text-orange-100 mb-4">Registre entradas, saídas e sangrias, veja o saldo em tempo real e feche o dia com um resumo. Recurso do plano Pro (R$ 29,90/mês).</p>
          <Link href="/dashboard/plans" className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50">Ver plano Pro</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Controle de Caixa</h1>
          <p className="text-sm text-gray-500">Abra o caixa, registre as movimentações e feche o dia com o resumo.</p>
        </div>
        <button onClick={() => { setLoading(true); load() }} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>
      ) : !session ? (
        /* ---- Caixa fechado: abrir ---- */
        <div className="rounded-2xl border border-gray-200 bg-white p-6 max-w-md">
          <div className="flex items-center gap-2 mb-1"><Lock className="h-5 w-5 text-gray-400" /><h2 className="font-semibold text-gray-900">Caixa fechado</h2></div>
          <p className="text-sm text-gray-500 mb-4">Informe o valor inicial (troco) para abrir o caixa.</p>
          <label className="text-sm font-medium text-gray-700">Valor inicial</label>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-gray-400">R$</span>
            <input value={openingAmount} onChange={e => setOpeningAmount(e.target.value)} type="number" step="0.01" min="0" placeholder="0,00"
              className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <button onClick={openCash} disabled={busy}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
            <LockOpen className="h-4 w-4" /> Abrir caixa
          </button>
        </div>
      ) : (
        /* ---- Caixa aberto ---- */
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">Saldo em caixa</p>
              <p className="text-2xl font-bold text-orange-500">{formatCurrency(balance)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">Valor inicial</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(Number(session.opening_amount))}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">Entradas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.inc)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs text-gray-500">Saídas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totals.out)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Nova movimentação */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3 h-fit">
              <h2 className="font-semibold text-gray-900">Nova movimentação</h2>
              <div className="grid grid-cols-2 gap-2">
                {(['entrada', 'saida', 'sangria', 'suprimento'] as CashMovementType[]).map(t => (
                  <button key={t} onClick={() => setMvType(t)}
                    className={`rounded-lg border-2 py-2 text-sm font-medium capitalize transition-colors ${mvType === t ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                    {MOVE_META[t].label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">R$</span>
                <input value={mvAmount} onChange={e => setMvAmount(e.target.value)} type="number" step="0.01" min="0" placeholder="0,00"
                  className="flex-1 h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <input value={mvDesc} onChange={e => setMvDesc(e.target.value)} placeholder="Descrição (opcional)"
                className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <button onClick={addMovement} disabled={busy}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                <Plus className="h-4 w-4" /> Registrar
              </button>
              <button onClick={closeCash} disabled={busy}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-red-200 hover:text-red-600">
                <Lock className="h-4 w-4" /> Fechar caixa
              </button>
              <p className="text-xs text-gray-400">Aberto em {fmtTime(session.opened_at)}</p>
            </div>

            {/* Movimentações */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Movimentações ({movements.length})</h2>
              {movements.length === 0 ? (
                <p className="text-sm text-gray-400 py-8 text-center">Nenhuma movimentação ainda.</p>
              ) : (
                <div className="max-h-[420px] overflow-y-auto -mx-1 px-1 divide-y divide-gray-100">
                  {movements.map(m => {
                    const meta = MOVE_META[m.type]
                    return (
                      <div key={m.id} className="flex items-center gap-3 py-2.5">
                        {meta.sign === 1 ? <ArrowUpCircle className="h-5 w-5 text-green-500 shrink-0" /> : <ArrowDownCircle className="h-5 w-5 text-red-500 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{meta.label}{m.description ? <span className="font-normal text-gray-500"> · {m.description}</span> : ''}</p>
                          <p className="text-[11px] text-gray-400">{fmtTime(m.created_at)}</p>
                        </div>
                        <span className={`text-sm font-semibold ${meta.cls}`}>{meta.sign === 1 ? '+' : '−'} {formatCurrency(Number(m.amount))}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Histórico de caixas fechados */}
      {history.length > 0 && (
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3"><History className="h-4 w-4 text-orange-500" /> Caixas fechados</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Aberto em', 'Fechado em', 'Valor inicial', 'Saldo final'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map(s => (
                  <tr key={s.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-2.5 text-gray-700">{fmtTime(s.opened_at)}</td>
                    <td className="px-4 py-2.5 text-gray-700">{s.closed_at ? fmtTime(s.closed_at) : '—'}</td>
                    <td className="px-4 py-2.5 text-gray-600">{formatCurrency(Number(s.opening_amount))}</td>
                    <td className="px-4 py-2.5 font-semibold text-gray-900">{s.closing_amount != null ? formatCurrency(Number(s.closing_amount)) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
