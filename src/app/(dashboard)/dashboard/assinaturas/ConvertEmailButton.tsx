'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2, Check } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

// Botão por cliente: envia um e-mail individual de conversão (trial -> Pro),
// com copy personalizada pelo que o cliente já montou. Mostra a data do último
// envio quando já houve um.
export function ConvertEmailButton({ businessId, name, sentAt }: { businessId: string; name: string; sentAt?: string | null }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [localSentAt, setLocalSentAt] = useState<string | null>(sentAt ?? null)

  const sentLabel = localSentAt
    ? new Date(localSentAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    : null

  async function run() {
    if (loading) return
    const msg = localSentAt
      ? `Reenviar e-mail de conversão para "${name}"?\n\nJá foi enviado um em ${sentLabel}.`
      : `Enviar e-mail de conversão para "${name}"?\n\nA mensagem é personalizada pelo que o cliente já montou no cardápio e pelos ganhos do Pro (R$ 29,90).`
    if (!confirm(msg)) return
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
      setLocalSentAt(data?.sentAt ?? new Date().toISOString())
      router.refresh()
    } catch {
      toast.error('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <button
        onClick={run}
        disabled={loading}
        title={localSentAt ? `Reenviar (último envio: ${sentLabel})` : 'Enviar e-mail de conversão personalizado'}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
          localSentAt
            ? 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-700'
            : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
        }`}
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        {localSentAt ? 'Reenviar' : 'E-mail'}
      </button>
      {sentLabel && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600">
          <Check className="h-3 w-3" /> enviado {sentLabel}
        </span>
      )}
    </div>
  )
}
