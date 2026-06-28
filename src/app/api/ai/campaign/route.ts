import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const SEGMENT_HINT: Record<string, string> = {
  sumido: 'clientes que nao pedem ha mais de 30 dias (objetivo: reativar, trazer de volta)',
  recorrente: 'clientes que ja compraram varias vezes (objetivo: valorizar e aumentar frequencia)',
  vip: 'os melhores clientes, que mais gastam (objetivo: tratamento especial, exclusividade)',
  novo: 'clientes que compraram so uma vez (objetivo: fazer voltar a segunda vez)',
  todos: 'toda a base de clientes',
}

// Gera o texto de uma campanha de WhatsApp com a Claude (Haiku).
export async function POST(req: Request) {
  // exige usuario logado
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'IA nao configurada' }, { status: 503 })

  let body: { segment?: string; objective?: string; businessName?: string; hasCoupon?: boolean } = {}
  try { body = await req.json() } catch { /* ignore */ }
  const segment = body.segment || 'todos'
  const businessName = (body.businessName || 'nosso delivery').slice(0, 80)
  const objective = (body.objective || '').slice(0, 200)
  const hasCoupon = !!body.hasCoupon

  const prompt = `Voce e copywriter de marketing para restaurantes e delivery no Brasil.
Escreva UMA mensagem curta de WhatsApp para enviar a ${SEGMENT_HINT[segment] || 'clientes'}.
Negocio: "${businessName}".
${objective ? `Objetivo especifico do dono: ${objective}.` : ''}

Regras:
- Tom caloroso, brasileiro, informal e direto. Pode usar 1 ou 2 emojis.
- No maximo 320 caracteres.
- Comece chamando o cliente por "{nome}" (essa variavel sera trocada pelo nome real).
${hasCoupon ? '- Inclua o cupom usando a variavel "{cupom}" (sera trocada pelo codigo real).' : '- Nao mencione cupom.'}
- Crie urgencia leve e um convite claro para pedir.
- Responda APENAS com o texto da mensagem, sem aspas, sem explicacao.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) {
      const t = await res.text()
      console.error('[ai/campaign] anthropic error:', res.status, t)
      return NextResponse.json({ error: 'falha na IA' }, { status: 502 })
    }
    const data = await res.json()
    const text = (data?.content?.[0]?.text || '').trim()
    if (!text) return NextResponse.json({ error: 'resposta vazia' }, { status: 502 })
    return NextResponse.json({ message: text })
  } catch (e) {
    console.error('[ai/campaign] error:', e)
    return NextResponse.json({ error: 'erro inesperado' }, { status: 500 })
  }
}
