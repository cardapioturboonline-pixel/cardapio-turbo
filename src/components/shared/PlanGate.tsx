import type { Plan } from '@/types'
import { Lock } from 'lucide-react'
import Link from 'next/link'

const planOrder: Record<Plan, number> = { free: 0, pro: 1, business: 2 }

interface PlanGateProps {
  requiredPlan: Plan
  currentPlan: Plan
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PlanGate({ requiredPlan, currentPlan, children, fallback }: PlanGateProps) {
  if (planOrder[currentPlan] >= planOrder[requiredPlan]) {
    return <>{children}</>
  }

  if (fallback) return <>{fallback}</>

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-60">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white border border-orange-200 rounded-xl shadow-lg p-6 text-center max-w-xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
            <Lock className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Recurso {requiredPlan === 'pro' ? 'Pro' : 'Business'}</h3>
          <p className="mt-1 text-sm text-gray-500">
            Faça upgrade para o plano {requiredPlan === 'pro' ? 'Pro' : 'Business'} para acessar este recurso.
          </p>
          <Link
            href="/dashboard/plans"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
          >
            Ver planos
          </Link>
        </div>
      </div>
    </div>
  )
}
