'use client'

import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export function WinbackButton({ count }: { count: number }) {
  const [loading, setLoading] = useState(false)

  async function handleSend() {
    if (count === 0) { toast.error('Nenhum trial expirado para enviar.'); return }
    if (!confirm(`Enviar e-mail de reativação para ${count} negócio(s) com trial expirado?`)) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/winback', { method: 'POST' })
      const json = await res.json()
      if (!res.ok) { toast.error(json.error || 'Erro ao enviar'); return }
      const parts = [`E-mails enviados: ${json.sent}`]
      if (json.skipped) parts.push(`${json.skipped} em cooldown (enviado há menos de ${json.cooldownDays} dias)`)
      if (json.failed) parts.push(`${json.failed} falharam`)
      toast.success(parts.join(' · '))
    } catch {
      toast.error('Erro ao enviar os e-mails. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSend}
      disabled={loading || count === 0}
      className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
      {loading ? 'Enviando...' : 'Enviar e-mail de reativação'}
    </button>
  )
}
