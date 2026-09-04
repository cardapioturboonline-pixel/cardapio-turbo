'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, ArrowDown, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export function PlanActions({ businessId, plan }: { businessId: string; plan: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isPro = plan && plan !== 'free'
  const target = isPro ? 'free' : 'pro'

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
  )
}
