'use client'

import { useEffect, useState } from 'react'
import { Eye, TrendingUp, Package, Clock } from 'lucide-react'
import { StatsCard } from '@/components/shared/StatsCard'
import { PlanGate } from '@/components/shared/PlanGate'
import { formatCurrency } from '@/lib/utils/format'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { createClient } from '@/lib/supabase/client'

interface DayView { date: string; count: number }
interface TopProduct { id: string; name: string; views: number; price: number; promotional_price?: number }

export default function AnalyticsPage() {
  const { business } = useBusiness()
  const currentPlan = business?.plan ?? 'free'

  const [stats, setStats] = useState({ total_views: 0, whatsapp_clicks: 0, total_products: 0, total_categories: 0 })
  const [viewsByDay, setViewsByDay] = useState<DayView[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!business?.id) return
    async function load() {
      const supabase = createClient()

      // Stats via RPC
      const { data: statsData } = await supabase.rpc('get_dashboard_stats', { p_business_id: business!.id, p_days: 30 })
      if (statsData) setStats(statsData)

      // Views by day (last 7 days)
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { data: analyticsData } = await supabase
        .from('analytics')
        .select('created_at')
        .eq('business_id', business!.id)
        .eq('event_type', 'view')
        .gte('created_at', since)

      // Group by day
      const days: Record<string, number> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        days[d.toISOString().slice(0, 10)] = 0
      }
      analyticsData?.forEach(row => {
        const day = row.created_at.slice(0, 10)
        if (day in days) days[day]++
      })
      setViewsByDay(Object.entries(days).map(([date, count]) => ({ date, count })))

      // Top products by views
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, views, price, promotional_price')
        .eq('business_id', business!.id)
        .order('views', { ascending: false })
        .limit(5)
      setTopProducts(productsData || [])

      setLoading(false)
    }
    load()
  }, [business?.id])

  const maxViews = Math.max(...viewsByDay.map(d => d.count), 1)
  const conversionRate = stats.total_views > 0 ? ((stats.whatsapp_clicks / stats.total_views) * 100).toFixed(1) : '0.0'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500">Acompanhe o desempenho do seu cardápio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatsCard title="Acessos (30 dias)" value={stats.total_views.toLocaleString('pt-BR')} icon={Eye} />
        <StatsCard title="Taxa de conversão" value={`${conversionRate}%`} icon={TrendingUp} />
        <StatsCard title="Produtos ativos" value={stats.total_products.toLocaleString('pt-BR')} icon={Package} />
      </div>

      {/* Views chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Acessos nos últimos 7 dias</h2>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          </div>
        ) : (
          <div className="flex items-end gap-2 h-40">
            {viewsByDay.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{day.count}</span>
                <div className="w-full rounded-t bg-orange-500 hover:bg-orange-600 transition-colors"
                  style={{ height: `${(day.count / maxViews) * 120}px`, minHeight: '4px' }}
                />
                <span className="text-[10px] text-gray-400">
                  {new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top products */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Top 5 produtos mais vistos</h2>
        {loading ? (
          <p className="text-sm text-gray-400 text-center py-4">Carregando...</p>
        ) : topProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Nenhum dado ainda. Compartilhe seu cardápio para começar!</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-500">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{p.name}</span>
                    <span className="text-sm text-gray-500 shrink-0">{p.views} views</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-gray-100">
                    <div className="h-1.5 rounded-full bg-orange-500"
                      style={{ width: `${topProducts[0].views > 0 ? (p.views / topProducts[0].views) * 100 : 0}%` }} />
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 shrink-0">{formatCurrency(p.promotional_price ?? p.price)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Peak hours - Pro only */}
      <PlanGate requiredPlan="pro" currentPlan={currentPlan}>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Horários de pico</h2>
          </div>
          <p className="text-sm text-gray-400 text-center py-6">Em breve: dados insuficientes para análise de pico</p>
        </div>
      </PlanGate>
    </div>
  )
}
