'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, MessageCircle, Link as LinkIcon, Mail, Send } from 'lucide-react'

const WHATSAPP = '5567992741982'

export default function ContatoPage() {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  function sendWhatsApp() {
    const text = `Olá! Meu nome é ${name || '...'}.%0A%0A*Assunto:* ${subject || '...'}%0A%0A${message || ''}`
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Cardápio Turbo</span>
          </Link>
          <Link href="/register" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Criar grátis</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block rounded-full bg-orange-100 text-orange-600 px-4 py-1 text-sm font-semibold mb-4">Fale conosco</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Estamos aqui para ajudar</h1>
          <p className="text-lg text-gray-500">Dúvidas, sugestões ou precisa de suporte? Fale com a gente pelo canal que preferir.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8">
        {/* Canais */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Canais de atendimento</h2>

          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:border-green-300 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">WhatsApp</p>
              <p className="text-sm text-gray-500">(67) 99274-1982 · resposta rápida</p>
            </div>
          </a>

          <a href="https://instagram.com/cardapioturboonline" target="_blank" rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:border-pink-300 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center shrink-0">
              <LinkIcon className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Instagram</p>
              <p className="text-sm text-gray-500">@cardapioturboonline</p>
            </div>
          </a>

          <a href="mailto:contato@cardapioturbo.com.br"
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-5 hover:border-orange-300 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">E-mail</p>
              <p className="text-sm text-gray-500">contato@cardapioturbo.com.br</p>
            </div>
          </a>
        </div>

        {/* Formulário */}
        <div className="rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Envie uma mensagem</h2>
          <p className="text-sm text-gray-500">Preencha abaixo e envie direto pelo nosso WhatsApp.</p>
          <div className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome"
              className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Assunto"
              className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Sua mensagem" rows={4}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            <button onClick={sendWhatsApp}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3 text-sm font-semibold text-white hover:bg-green-600">
              <Send className="h-4 w-4" /> Enviar pelo WhatsApp
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <span>© 2026 Agência LD Marketing</span>
          <div className="flex gap-5">
            <Link href="/sobre" className="hover:text-white">Sobre</Link>
            <Link href="/contato" className="hover:text-white">Contato</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <a href="https://instagram.com/cardapioturboonline" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <Link href="/termos" className="hover:text-white">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
