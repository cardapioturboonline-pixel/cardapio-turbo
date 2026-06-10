import { redirect } from 'next/navigation'
import { Users, Crown, Clock, TrendingDown, Percent, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'

interface BizRow {
  id: string
  user_id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  whatsapp: string | null
  plan: string
  trial_ends_at: string | null
  created_at: string
  updated_at: string | null
}
interface UserRow { id: string; email: string | null; name: string | null }

function daysLeft(iso: string | null): number | null {
  if (!iso) return null
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
}
function fmtDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function localStr(b: BizRow): string {
  const c = b.city?.trim(); const s = b.state?.trim()
  if (c && s) return `${c} / ${s}`
  return c || s || '—'
}

export default async function AssinaturasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!isAdminEmail(user?.email)) redirect('/dashboard')

  const admin = createAdminClient()
  const [{ data: bizData }, { data: userData }] = await Promise.all([
    admin.from('businesses')
      .select('id, user_id, name, slug, city, state, whatsapp, plan, trial_ends_at, created_at, updated_at')
      .order('created_at', { ascending: false }),
    admin.from('users').select('id, email, name'),
  ])

  const businesses = (bizData ?? []) as BizRow[]
  const emailById = new Map<string, string>()
  for (const u of (userData ?? []) as UserRow[]) emailById.set(u.id, u.email || '')
  const emailOf = (b: BizRow) => emailById.get(b.user_id) || '—'

  const now = Date.now()
  const isPro = (b: BizRow) => b.plan && b.plan !== 'free'
  const isTrialActive = (b: BizRow) => !isPro(b) && b.trial_ends_at != null && new Date(b.trial_ends_at).getTime() > now
  const isTrialExpired = (b: BizRow) => !isPro(b) && (!b.trial_ends_at || new Date(b.trial_ends_at).getTime() <= now)

  const pro = businesses.filter(isPro)
  const trialActive = businesses.filter(isTrialActive)
  const trialExpired = businesses.filter(isTrialExpired)
  const total = businesses.length
  const convRate = total > 0 ? Math.round((pro.length / total) * 100) : 0

  // Agregação por estado e cidade (apenas assinantes Pro = quem fechou)
  const byState = new Map<string, number>()
  const byCity = new Map<string, number>()
  for (const b of pro) {
    const s = (b.state?.trim() || 'Não informado').toUpperCase()
    byState.set(s, (byState.get(s) || 0) + 1)
    const c = b.city?.trim() ? `${b.city.trim()} / ${(b.state?.trim() || '').toUpperCase()}` : 'Não informado'
    byCity.set(c, (byCity.get(c) || 0) + 1)
  }
  const topStates = [...byState.entries()].sort((a, b) => b[1] - a[1])
  const topCities = [...byCity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)

  const cards = [
    { label: 'Total de cadastros', value: total, icon: Users, color: 'text-gray-600 bg-gray-100' },
    { label: 'Fecharam o Pro', value: pro.length, icon: Crown, color: 'text-amber-600 bg-amber-100' },
    { label: 'Em trial ativo', value: trialActive.length, icon: Clock, color: 'text-blue-600 bg-blue-100' },
    { label: 'Trial expirado (sem converter)', value: trialExpired.length, icon: TrendingDown, color: 'text-red-600 bg-red-100' },
    { label: 'Taxa de conversão', value: `${convRate}%`, icon: Percent, color: 'text-green-600 bg-green-100' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assinaturas & Conversões</h1>
        <p className="text-sm text-gray-500">Acompanhe quem está em trial e quem converteu para o Pro, por cidade e estado.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg mb-3 ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Geo breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"><MapPin className="h-4 w-4 text-orange-500" /> Pro por estado</h2>
          {topStates.length === 0 ? <p className="text-sm text-gray-400">Nenhuma assinatura ainda.</p> : (
            <div className="space-y-2">
              {topStates.map(([s, n]) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-14 text-sm font-medium text-gray-700">{s}</span>
                  <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${(n / pro.length) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right text-sm font-semibold text-gray-900">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3"><MapPin className="h-4 w-4 text-orange-500" /> Pro por cidade (top 8)</h2>
          {topCities.length === 0 ? <p className="text-sm text-gray-400">Nenhuma assinatura ainda.</p> : (
            <div className="space-y-2">
              {topCities.map(([c, n]) => (
                <div key={c} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{c}</span>
                  <span className="font-semibold text-gray-900">{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabela: Fecharam o Pro */}
      <Section title={`Fecharam o Pro — saíram do trial e assinaram (${pro.length})`} accent="amber">
        <Table
          headers={['Negócio', 'Cidade / Estado', 'E-mail', 'WhatsApp', 'Plano', 'Cadastro', 'Assinou em (aprox.)']}
          rows={pro.map(b => [
            b.name, localStr(b), emailOf(b), b.whatsapp || '—',
            <span key="p" className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700 uppercase">{b.plan}</span>,
            fmtDate(b.created_at),
            fmtDate(b.updated_at),
          ])}
          empty="Ninguém converteu para o Pro ainda."
        />
      </Section>

      {/* Tabela: Em trial ativo */}
      <p className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-2.5 text-xs text-blue-700">
        ℹ️ Observação: quem cancela o Pro recebe 30 dias de carência (volta para Free com acesso temporário) e pode aparecer aqui como &quot;trial ativo&quot; com muitos dias restantes. Para rastreio 100% preciso de conversões e cancelamentos, dá para criar um registro de eventos de assinatura — me avise.
      </p>
      <Section title={`Em trial ativo — ainda testando (${trialActive.length})`} accent="blue">
        <Table
          headers={['Negócio', 'Cidade / Estado', 'E-mail', 'WhatsApp', 'Dias restantes', 'Início']}
          rows={trialActive
            .sort((a, b) => (daysLeft(a.trial_ends_at) ?? 99) - (daysLeft(b.trial_ends_at) ?? 99))
            .map(b => {
              const d = daysLeft(b.trial_ends_at) ?? 0
              return [
                b.name, localStr(b), emailOf(b), b.whatsapp || '—',
                <span key="d" className={`font-semibold ${d <= 2 ? 'text-red-500' : 'text-blue-600'}`}>{d} dia{d !== 1 ? 's' : ''}</span>,
                fmtDate(b.created_at),
              ]
            })}
          empty="Ninguém em trial ativo no momento."
        />
      </Section>

      {/* Tabela: Trial expirado */}
      <Section title={`Trial expirado sem converter — oportunidade de reativação (${trialExpired.length})`} accent="red">
        <Table
          headers={['Negócio', 'Cidade / Estado', 'E-mail', 'WhatsApp', 'Trial terminou em']}
          rows={trialExpired.map(b => [
            b.name, localStr(b), emailOf(b), b.whatsapp || '—', fmtDate(b.trial_ends_at),
          ])}
          empty="Nenhum trial expirado."
        />
      </Section>
    </div>
  )
}

function Section({ title, accent, children }: { title: string; accent: 'amber' | 'blue' | 'red'; children: React.ReactNode }) {
  const bar = accent === 'amber' ? 'bg-amber-500' : accent === 'blue' ? 'bg-blue-500' : 'bg-red-500'
  return (
    <div>
      <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 mb-3">
        <span className={`h-4 w-1 rounded-full ${bar}`} /> {title}
      </h2>
      {children}
    </div>
  )
}

function Table({ headers, rows, empty }: { headers: string[]; rows: React.ReactNode[][]; empty: string }) {
  if (rows.length === 0) return <p className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">{empty}</p>
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {headers.map(h => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
              {r.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 whitespace-nowrap ${j === 0 ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
