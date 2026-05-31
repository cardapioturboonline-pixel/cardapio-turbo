'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/sonner'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleDemo() {
    setForm({ email: 'demo@cardapioturbo.com', password: 'demo1234' })
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    toast.success('🎉 Bem-vindo à conta demo! Explore à vontade.')
    router.push('/dashboard')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    toast.success('Login realizado com sucesso!')
    router.push('/dashboard')
  }

  async function handleGoogle() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setLoading(false)
    toast.success('Login com Google realizado!')
    router.push('/dashboard')
  }

  return (
    <div>
      {/* Demo Banner */}
      <div className="mb-5 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-orange-500 mb-1">🚀 Modo demonstração</p>
        <p className="text-xs text-gray-600 mb-3">
          Explore todas as funcionalidades sem criar conta.
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-white rounded-lg px-3 py-2 border border-orange-200 font-mono">
          <span>demo@cardapioturbo.com</span>
          <span className="text-gray-300">|</span>
          <span>demo1234</span>
        </div>
        <button
          type="button"
          onClick={handleDemo}
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors shadow-md shadow-orange-200"
        >
          {loading ? 'Entrando...' : '⚡ Entrar com conta demo'}
        </button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400">
          <span className="bg-white px-2">ou entre com sua conta</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
      <p className="mt-1 text-sm text-gray-500">Entre na sua conta para gerenciar seu cardápio</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-9"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link href="/reset-password" className="text-xs text-orange-500 hover:underline">
              Esqueci a senha
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-9 pr-9"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs text-gray-400">
          <span className="bg-white px-2">ou continue com</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Entrar com Google
      </button>

      <p className="mt-6 text-center text-sm text-gray-500">
        Não tem conta?{' '}
        <Link href="/register" className="font-medium text-orange-500 hover:underline">
          Cadastre-se grátis
        </Link>
      </p>
    </div>
  )
}
