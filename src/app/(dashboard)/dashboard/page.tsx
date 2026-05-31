'use client'

import { Eye, MessageCircle, Package, TrendingUp, Copy, ExternalLink, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { StatsCard } from '@/components/shared/StatsCard'
import { UpgradeBanner } from '@/components/shared/UpgradeBanner'
import { mockStats, mockBusiness, mockInsights, mockProducts } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from '@/components/ui/sonner'

const insightIcons: Record<string, string> = {
  no_photo: '📸', low_price: '💰', low_views: '👁', combo_suggestion: '🎁', promotion: '🎉',
}

export default function DashboardPage() {
  const menuUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://cardapioturbo.com'}/menu/${mockBusiness.slug}`
  const maxViews = Math.max(...mockStats.views_by_day.map(d => d.count))

  function copyLink() {
    navigator.clipboard.writeText(menuUrl)
    toast.success('Link copiado!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {mockBusiness.name}! 👋</h1>
          <p className="text-sm text-gray-500">Aqui está um resumo do seu negócio hoje.</p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2">
          <span className="text-xs text-gray-500 truncate max-w-[180px]">{menuUrl}</span>
          <button onClick={copyLink} className="text-orange-500 hover:text-orange-600 shrink-0">
            <Copy className="h-4 w-4" />
          </button>
          <Link href={`/menu/${mockBusiness.slug}`} target="_blank" className="text-orange-500 hover:text-orange-600 shrink-0">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard title="Visualizações" value={mockStats.total_views.toLocaleString('pt-BR')} description="Total do mês" icon={Eye} trend={12} />
        <StatsCard title="Cliques WhatsApp" value={mockStats.total_whatsapp_clicks} description="Interesse real" icon={MessageCircle} trend={8} />
        <StatsCard title="Produtos" value={mockStats.total_products} description={`${mockStats.total_categories} categorias`} icon={Package} />
        <StatsCard title="Conversão" value={`${mockStats.conversion_rate.toFixed(1)}%`} description="Vis → WhatsApp" icon={TrendingUp} trend={3} />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Visualizações — últimos 7 dias</h2>
        <div className="flex items-end gap-2 h-32">
          {mockStats.views_by_day.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-orange-500 hover:bg-orange-600 transition-colors"
                style={{ height: `${(day.count / maxViews) * 100}%`, minHeight: '4px' }}
                title={`${day.count} visualizações`}
              />
              <span className="text-[10px] text-gray-400">{new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Produtos mais vistos</h2>
            <Link href="/dashboard/products" className="text-xs text-orange-500 hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockStats.most_viewed_products.map((product, i) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-500">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.views} visualizações</p>
                </div>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(product.promotional_price ?? product.price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Insights da IA</h2>
          </div>
          <div className="space-y-3">
            {mockInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">
                <span className="text-xl shrink-0">{insightIcons[insight.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{insight.description}</p>
                </div>
                <button className="shrink-0 text-xs font-medium text-orange-500 hover:underline whitespace-nowrap">
                  {insight.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upgrade banner */}
      {mockBusiness.plan === 'free' && <UpgradeBanner />}
    </div>
  )
}
