'use client'

import { useState } from 'react'
import { MessageCircle, X, ChevronDown } from 'lucide-react'
import type { Business } from '@/types'

// Atendente rápido: respostas prontas (FAQ) + botão de WhatsApp com link oficial.
// Não conecta o WhatsApp do dono; usa apenas wa.me (mesma coisa que clicar num link).
export function ChatWidget({ business }: { business: Business }) {
  const [open, setOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = (business.chatbot_faqs ?? []).filter(f => f.q?.trim() && f.a?.trim())
  const greeting = business.chatbot_greeting?.trim() || `Olá! Bem-vindo ao ${business.name}. Como podemos ajudar?`
  const wa = (business.whatsapp || '').replace(/\D/g, '')
  const waLink = wa
    ? `https://wa.me/55${wa}?text=${encodeURIComponent(`Olá! Vim pelo cardápio do ${business.name} e queria tirar uma dúvida.`)}`
    : null

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Atendimento"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105"
        style={{ backgroundColor: 'var(--brand)' }}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Painel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
          <div className="p-4 text-white" style={{ backgroundColor: 'var(--brand)' }}>
            <p className="font-semibold">Atendimento</p>
            <p className="text-sm text-white/90 mt-0.5">{greeting}</p>
          </div>

          <div className="max-h-[50vh] overflow-y-auto p-3 space-y-2">
            {faqs.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">Fale com a gente pelo WhatsApp abaixo. 👇</p>
            ) : (
              faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    {f.q}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <p className="px-3 pb-3 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{f.a}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {waLink && (
            <div className="border-t border-gray-100 p-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </div>
          )}
        </div>
      )}
    </>
  )
}
