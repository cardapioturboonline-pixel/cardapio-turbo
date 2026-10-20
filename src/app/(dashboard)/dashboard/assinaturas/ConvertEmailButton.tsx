'use client'

import { useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

// Botão por cliente: envia um e-mail individual de conversão (trial -> Pro),
// com copy personalizada pelo que o cliente já montou.
export function ConvertEmailButton({ businessId, name }: { businessId: string; name: string }) {
  const [loading, setLoading] = useState(false)

  async function run() {
    if (loading) return
    if (!confirm(`Enviar e-mail de conversão para "${name}"?\n\nA mensagem é personalizada pelo que o cliente já montou no cardápio e pelos ganhos do Pro (R$ 29,90).`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/convert-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ businessId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data?.error === 'forbidden' ? 'Sem permissão.' : (data?.error || 'Não consegui enviar.'))
        setLoading(false)
        return
      }
      toast.success('E-mail de conversão enviado! 🚀')
    } catch {
      toast.error('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={run}
      disabled={loading}
      title="Enviar e-mail de conversão personalizado"
      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60 transition-colors"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
      E-mail
    </button>
  )
}
