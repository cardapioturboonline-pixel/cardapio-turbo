'use client'

import { useSearchParams } from 'next/navigation'
import { Mail, RefreshCw } from 'lucide-react'
import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/sonner'
import Link from 'next/link'

function VerifyEmailContent() {
  const params = useSearchParams()
  const email = params.get('email') ?? ''
  const [resending, setResending] = useState(false)

  async function handleResend() {
    if (!email) return
    setResending(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    })
    setResending(false)
    if (error) toast.error('Erro ao reenviar: ' + error.message)
    else toast.success('Email reenviado!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Cardápio Turbo</h1>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
            <Mail className="h-10 w-10 text-orange-500" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verifique seu email</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Enviamos um link de confirmação para:
            </p>
            {email && (
              <p className="font-semibold text-gray-900 mt-1">{email}</p>
            )}
          </div>

          <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 text-left space-y-2">
            <p className="text-sm font-semibold text-gray-800">O que fazer agora:</p>
            <ol className="text-sm text-gray-600 space-y-1 list-none">
              <li>📧 Abra seu email</li>
              <li>🔍 Procure um email do Cardápio Turbo</li>
              <li>✅ Clique em <strong>"Confirmar email"</strong></li>
              <li>🚀 Você será redirecionado para configurar sua loja</li>
            </ol>
          </div>

          <p className="text-xs text-gray-400">
            Não recebeu? Verifique a pasta de spam ou
          </p>

          <button
            onClick={handleResend}
            disabled={resending || !email}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${resending ? 'animate-spin' : ''}`} />
            {resending ? 'Reenviando...' : 'Reenviar email de confirmação'}
          </button>

          <Link href="/login" className="block text-sm text-orange-500 hover:text-orange-600 font-medium">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
