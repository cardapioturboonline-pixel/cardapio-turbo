'use client'

import { useState } from 'react'
import { Mail, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export function ReactivateButton() {
  const [loading, setLoading] = useState(false)

  async function run() {
    if (loading) return
    setLoading(true)
    try {
      // Primeiro conta quantos alvos (preview) para confirmar
      const prev = await fetch('/api/admin/reactivate-signups')
      const pd = await prev.json()
      const n = pd?.count ?? 0
      if (n === 0) { toast.error('Nenhum cadastro incompleto encontrado.'); setLoading(false); return }
      if (!confirm(`Enviar o lembrete de reativação para ${n} cadastro(s) incompleto(s)?`)) { setLoading(false); return }
      const res = await fetch('/api/admin/reactivate-signups', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) { toast.error('Falha ao enviar os lembretes.'); setLoading(false); return }
      toast.success(`Lembrete enviado para ${data.sent} de ${data.targets} cadastro(s).`)
    } catch {
      toast.error('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={run} disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
      Lembrar cadastros incompletos
    </button>
  )
}
