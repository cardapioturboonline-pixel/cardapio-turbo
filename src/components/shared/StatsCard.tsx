import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: number
  className?: string
}

export function StatsCard({ title, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-full bg-orange-50 p-2 shrink-0">
          <Icon className="h-4 w-4 text-orange-500" />
        </div>
      </div>
      <p className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
      {trend !== undefined && (
        <p className={cn('mt-1 text-xs font-medium', trend >= 0 ? 'text-green-600' : 'text-red-600')}>
          {trend >= 0 ? '+' : ''}{trend}% em relação à semana passada
        </p>
      )}
    </div>
  )
}
