'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/sonner'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSent(true)
    toast.success('Email de recuperação enviado!')
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Mail className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Email enviado!</h1>
        <p className="mt-2 text-sm text-gray-500">
          Verifique sua caixa de entrada em <strong>{email}</strong> e siga as instruções para redefinir sua senha.
        </p>
        <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm text-orange-500 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Voltar para o login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Recuperar senha</h1>
      <p className="mt-1 text-sm text-gray-500">Digite seu email e enviaremos as instruções para redefinir sua senha.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input id="email" type="email" placeholder="seu@email.com" className="pl-9" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors">
          {loading ? 'Enviando...' : 'Enviar instruções'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Lembrou a senha?{' '}
        <Link href="/login" className="font-medium text-orange-500 hover:underline">Voltar ao login</Link>
      </p>
    </div>
  )
}
