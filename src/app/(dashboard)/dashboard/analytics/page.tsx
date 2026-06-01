'use client'

import { Eye, TrendingUp, Package, Lock, Clock } from 'lucide-react'
import { StatsCard } from '@/components/shared/StatsCard'
import { PlanGate } from '@/components/shared/PlanGate'
import { mockStats, mockProducts } from '@/lib/mock-data'
import { formatCurrency } from '@/lib/utils/format'
import { useBusiness } from '@/lib/hooks/useBusiness'

const hourlyData = [
  { hour: '08h', visits: 12 }, { hour: '09h', visits: 23 }, { hour: '10h', visits: 45 },
  { hour: '11h', visits: 67 }, { hour: '12h', visits: 134 }, { hour: '13h', visits: 156 },
  { hour: '14h', visits: 98 }, { hour: '15h', visits: 72 }, { hour: '16h', visits: 54 },
  { hour: '17h', visits: 78 }, { hour: '18h', visits: 112 }, { hour: '19h', visits: 189 },
  { hour: '20h', visits: 223 }, { hour: '21h', visits: 198 }, { hour: '22h', visits: 134 },
]
const maxHourly = Math.max(...hourlyData.map(h => h.visits))
const maxViews = Math.max(...mockStats.views_by_day.map(d => d.count))

export default function AnalyticsPage() {
  const { business } = useBusiness()
  const currentPlan = business?.plan ?? 'free'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-sm text-gray-500">Acompanhe o desempenho do seu cardápio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatsCard title="Acessos totais" value={mockStats.total_views.toLocaleString('pt-BR')} icon={Eye} trend={12} />
        <StatsCard title="Taxa de conversão" value={`${mockStats.conversion_rate.toFixed(1)}%`} icon={TrendingUp} trend={3} />
        <StatsCard title="Produtos vistos" value={mockProducts.reduce((a, p) => a + p.views, 0).toLocaleString('pt-BR')} icon={Package} />
      </div>

      {/* Views chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Acessos — últimos 7 dias</h2>
        <div className="flex items-end gap-2 h-40">
          {mockStats.views_by_day.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{day.count}</span>
              <div className="w-full rounded-t bg-orange-500 hover:bg-orange-600 transition-colors"
                style={{ height: `${(day.count / maxViews) * 120}px`, minHeight: '4px' }}
              />
              <span className="text-[10px] text-gray-400">{new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Top 5 produtos mais vistos</h2>
        <div className="space-y-3">
          {mockStats.most_viewed_products.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-500">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">{p.name}</span>
                  <span className="text-sm text-gray-500 shrink-0">{p.views} views</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-gray-100">
                  <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${(p.views / mockStats.most_viewed_products[0].views) * 100}%` }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 shrink-0">{formatCurrency(p.promotional_price ?? p.price)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak hours - Pro only */}
      <PlanGate requiredPlan="pro" currentPlan={currentPlan}>
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Horários de pico</h2>
          </div>
          <div className="flex items-end gap-1 h-24">
            {hourlyData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-sm bg-blue-400 hover:bg-blue-500 transition-colors"
                  style={{ height: `${(h.visits / maxHourly) * 80}px`, minHeight: '2px' }}
                  title={`${h.hour}: ${h.visits} acessos`}
                />
                <span className="text-[8px] text-gray-400">{h.hour.replace('h','')}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500">Pico: 20h com {Math.max(...hourlyData.map(h => h.visits))} acessos</p>
        </div>
      </PlanGate>
    </div>
  )
}
