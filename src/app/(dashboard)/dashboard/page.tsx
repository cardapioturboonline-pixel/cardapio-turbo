'use client'

import { useEffect, useState } from 'react'
import { Eye, MessageCircle, Package, TrendingUp, Copy, ExternalLink, Sparkles, ArrowRight, Bell, DollarSign, Activity } from 'lucide-react'
import Link from 'next/link'
import { StatsCard } from '@/components/shared/StatsCard'
import { UpgradeBanner } from '@/components/shared/UpgradeBanner'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { useProducts } from '@/lib/hooks/useProducts'
import { useCategories } from '@/lib/hooks/useCategories'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from '@/components/ui/sonner'
import { createClient } from '@/lib/supabase/client'
import { hasProAccess } from '@/lib/plan'

const insights = [
  { type: 'no_photo', icon: '📸', title: 'Adicione fotos aos produtos', description: 'Produtos com foto vendem até 3x mais. Acesse Produtos e adicione imagens.', action: 'Adicionar' },
  { type: 'combo_suggestion', icon: '🎁', title: 'Crie combos irresistíveis', description: 'Combine itens e aumente o ticket médio do pedido.', action: 'Criar combo' },
  { type: 'promotion', icon: '🎉', title: 'Crie cupons de desconto', description: 'Cupons aumentam conversão. Experimente um desconto de 10%.', action: 'Criar cupom' },
]

export default function DashboardPage() {
  const { business, loading: bizLoading } = useBusiness()
  const { products } = useProducts()
  const { categories } = useCategories()
  const proAccess = hasProAccess(business)
  const [todayCount, setTodayCount] = useState(0)
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [inProgress, setInProgress] = useState(0)

  useEffect(() => {
    if (!business?.id || !proAccess) return
    const supabase = createClient()
    const since = new Date(); since.setHours(0, 0, 0, 0)
    supabase.from('orders')
      .select('total, status, created_at')
      .eq('business_id', business.id)
      .gte('created_at', since.toISOString())
      .then(({ data }) => {
        const rows = (data ?? []) as { total: number; status: string }[]
        const valid = rows.filter(o => o.status !== 'cancelled')
        setTodayCount(valid.length)
        setTodayRevenue(valid.reduce((a, o) => a + (o.total || 0), 0))
        setInProgress(rows.filter(o => ['pending', 'preparing', 'delivering'].includes(o.status)).length)
      })
  }, [business?.id, proAccess])

  const menuUrl = business
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/menu/${business.slug}`
    : ''

  function copyLink() {
    if (!menuUrl) return
    navigator.clipboard.writeText(menuUrl)
    toast.success('Link copiado!')
  }

  if (bizLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500">Você ainda não configurou sua loja.</p>
        <Link href="/onboarding" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          Configurar agora →
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {business.name}! 👋</h1>
          <p className="text-sm text-gray-500">Aqui está um resumo do seu negócio hoje.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
          <span className="text-xs text-gray-500 truncate max-w-[180px]">{menuUrl}</span>
          <button onClick={copyLink} className="text-orange-500 hover:text-orange-600 shrink-0">
            <Copy className="h-4 w-4" />
          </button>
          <Link href={`/menu/${business.slug}`} target="_blank" className="text-orange-500 hover:text-orange-600 shrink-0">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Resumo de pedidos do dia (Pro) */}
      {proAccess && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Bell className="h-4 w-4 text-orange-500" /> Pedidos de hoje</h2>
            <Link href="/dashboard/orders" className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">Ver painel <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatsCard title="Pedidos hoje" value={todayCount} description="Recebidos pelo cardápio" icon={Bell} />
            <StatsCard title="Faturamento" value={formatCurrency(todayRevenue)} description="Hoje" icon={DollarSign} />
            <StatsCard title="Em andamento" value={inProgress} description="A preparar/entregar" icon={Activity} />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard title="Visualizações" value="0" description="Total do mês" icon={Eye} />
        <StatsCard title="Cliques WhatsApp" value="0" description="Interesse real" icon={MessageCircle} />
        <StatsCard title="Produtos" value={products.length} description={`${categories.length} categorias`} icon={Package} />
        <StatsCard title="Conversão" value="0%" description="Vis → WhatsApp" icon={TrendingUp} />
      </div>

      {/* Chart placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Visualizações — últimos 7 dias</h2>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <p className="text-sm text-gray-400">Nenhum dado ainda. Compartilhe seu cardápio para ver as estatísticas!</p>
          </div>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {[0,0,0,0,0,0,0].map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-orange-100" style={{ height: '4px' }} />
                <span className="text-[10px] text-gray-400">{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][i]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Produtos cadastrados</h2>
            <Link href="/dashboard/products" className="text-xs text-orange-500 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-gray-400 mb-3">Nenhum produto cadastrado ainda.</p>
              <Link href="/dashboard/products/new" className="text-sm font-medium text-orange-500 hover:underline">
                + Adicionar produto
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map((product, i) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-500">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.views || 0} visualizações</p>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(product.promotional_price ?? product.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Dicas para seu negócio</h2>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <span className="text-xl shrink-0">{insight.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade banner */}
      {business.plan === 'free' && <UpgradeBanner />}
    </div>
  )
}
