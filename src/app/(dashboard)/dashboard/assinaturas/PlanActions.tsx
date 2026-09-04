'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, ArrowDown, Loader2, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export function PlanActions({ businessId, plan, name }: { businessId: string; plan: string; name: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const isPro = plan && plan !== 'free'
  const target = isPro ? 'free' : 'pro'

  async function remove() {
    if (deleting) return
    const typed = window.prompt(
      `⚠️ REMOVER DEFINITIVAMENTE este negócio?\n\nIsso apaga o restaurante e todos os dados dele (irreversível).\n\nPara confirmar, digite o nome exato:\n"${name}"`
    )
    if (typed === null) return
    if (typed.trim() !== (name || '').trim()) {
      toast.error('Nome não confere. Nada foi removido.')
      return
    }
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/delete-business', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ businessId, confirmName: typed.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error === 'forbidden' ? 'Sem permissão.' : (data?.error || 'Não consegui remover.'))
        setDeleting(false)
        return
      }
      toast.success('Negócio removido.')
      router.refresh()
    } catch {
      toast.error('Erro de conexão.')
      setDeleting(false)
    }
  }

  async function apply() {
    if (loading) return
    const label = target === 'pro' ? 'liberar o Pro para' : 'rebaixar para Free'
    if (!confirm(`Confirmar: ${label} este negócio?`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/set-plan', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ businessId, plan: target }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error === 'forbidden' ? 'Sem permissão.' : 'Não consegui alterar o plano.')
        setLoading(false)
        return
      }
      toast.success(target === 'pro' ? '✅ Pro liberado!' : 'Rebaixado para Free.')
      router.refresh()
    } catch {
      toast.error('Erro de conexão.')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={apply}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
          isPro
            ? 'border border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
            : 'bg-amber-500 text-white hover:bg-amber-600'
        }`}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isPro ? <ArrowDown className="h-3.5 w-3.5" /> : <Crown className="h-3.5 w-3.5" />}
        {isPro ? 'Rebaixar' : 'Tornar Pro'}
      </button>
      <button
        onClick={remove}
        disabled={deleting}
        title="Remover conta de teste (irreversível)"
        className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-60"
      >
        {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}
