'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/sonner'
import type { Review } from '@/types'

interface ReviewsProps {
  businessId: string
  initialReviews: Review[]
}

function Stars({ value, size = 'h-4 w-4' }: { value: number; size?: string }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`${size} ${i <= Math.round(value) ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'}`} />
      ))}
    </div>
  )
}

export function Reviews({ businessId, initialReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0

  async function submit() {
    setSending(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('reviews')
      .insert({ business_id: businessId, customer_name: name || 'Anônimo', rating, comment: comment || null })
      .select()
      .single()
    setSending(false)
    if (error) { toast.error('Erro ao enviar avaliação'); return }
    if (data) setReviews(prev => [data as Review, ...prev])
    setShowForm(false); setRating(5); setName(''); setComment('')
    toast.success('Avaliação enviada. Obrigado! ⭐')
  }

  return (
    <section className="max-w-2xl mx-auto px-4 mt-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-gray-900">Avaliações</h2>
            {reviews.length > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <Stars value={avg} />
                <span className="text-sm font-semibold text-gray-900">{avg.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({reviews.length})</span>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-1">Seja o primeiro a avaliar!</p>
            )}
          </div>
          <button onClick={() => setShowForm(true)} className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            Avaliar
          </button>
        </div>

        {reviews.length > 0 && (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {reviews.slice(0, 20).map(r => (
              <div key={r.id} className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{r.customer_name || 'Anônimo'}</span>
                  <Stars value={r.rating} size="h-3.5 w-3.5" />
                </div>
                {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                <p className="text-xs text-gray-300 mt-1">{new Date(r.created_at).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Avaliar</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>

            <div className="flex justify-center gap-1.5 py-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} onClick={() => setRating(i)}>
                  <Star className={`h-9 w-9 ${i <= (hover || rating) ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'}`} />
                </button>
              ))}
            </div>

            <input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome (opcional)"
              className="w-full h-10 rounded-xl border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Conte como foi sua experiência (opcional)" rows={3}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />

            <button onClick={submit} disabled={sending}
              className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
              {sending ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
