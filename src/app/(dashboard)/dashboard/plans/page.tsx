'use client'

import { Check, X, Zap, Crown, Sparkles } from 'lucide-react'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { toast } from '@/components/ui/sonner'

const plans = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 'R$ 0',
    period: '',
    icon: Sparkles,
    color: 'border-gray-200',
    btnClass: 'border border-gray-200 text-gray-700 hover:bg-gray-50',
    features: [
      { text: 'Até 15 produtos', included: true },
      { text: 'Até 3 categorias', included: true },
      { text: '1 cardápio digital', included: true },
      { text: 'QR Code básico', included: true },
      { text: 'Pedido por WhatsApp', included: true },
      { text: 'Personalização básica', included: true },
      { text: 'Cupons de desconto', included: false },
      { text: 'Relatórios avançados', included: false },
      { text: 'Temas premium', included: false },
      { text: 'QR Code com logo', included: false },
      { text: 'Domínio personalizado', included: false },
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 'R$ 29,90',
    period: '/mês',
    badge: 'Mais popular',
    icon: Zap,
    color: 'border-orange-500 ring-2 ring-orange-500',
    btnClass: 'bg-orange-500 text-white hover:bg-orange-600',
    features: [
      { text: 'Produtos ilimitados', included: true },
      { text: 'Categorias ilimitadas', included: true },
      { text: '1 cardápio digital', included: true },
      { text: 'QR Code com logo', included: true },
      { text: 'Pedido por WhatsApp', included: true },
      { text: 'Personalização completa', included: true },
      { text: 'Cupons de desconto', included: true },
      { text: 'Relatórios avançados', included: true },
      { text: 'Temas premium', included: true },
      { text: 'Analytics de horário', included: true },
      { text: 'Domínio personalizado', included: false },
    ],
  },
  {
    id: 'business' as const,
    name: 'Business',
    price: 'R$ 79,90',
    period: '/mês',
    icon: Crown,
    color: 'border-purple-500',
    btnClass: 'bg-purple-600 text-white hover:bg-purple-700',
    features: [
      { text: 'Produtos ilimitados', included: true },
      { text: 'Categorias ilimitadas', included: true },
      { text: '3 cardápios digitais', included: true },
      { text: 'QR Code com logo', included: true },
      { text: 'Pedido por WhatsApp', included: true },
      { text: 'Personalização completa', included: true },
      { text: 'Cupons de desconto', included: true },
      { text: 'Relatórios avançados', included: true },
      { text: 'Temas premium', included: true },
      { text: 'Analytics de horário', included: true },
      { text: 'Domínio personalizado', included: true },
    ],
  },
]

export default function PlansPage() {
  const { business } = useBusiness()
  const currentPlan = business?.plan ?? 'free'

  function handleUpgrade(planId: string) {
    if (planId === currentPlan) return
    toast.success(`Redirecionando para checkout do plano ${planId}...`)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Escolha seu plano</h1>
        <p className="text-sm text-gray-500 mt-1">Cancele a qualquer momento. Sem fidelidade.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map(plan => {
          const Icon = plan.icon
          const isCurrent = plan.id === currentPlan
          return (
            <div key={plan.id} className={`relative rounded-2xl border-2 bg-white p-8 ${plan.color}`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                  Plano atual
                </span>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                  <Icon className="h-5 w-5 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent}
                className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors mb-6 ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-default' : plan.btnClass}`}
              >
                {isCurrent ? 'Plano atual' : plan.id === 'free' ? 'Usar grátis' : 'Assinar agora'}
              </button>

              <ul className="space-y-2.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    {feature.included ? (
                      <Check className="h-4 w-4 shrink-0 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-gray-300" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400">
        Pagamentos processados com segurança via Mercado Pago ou Stripe. Cancele quando quiser.
      </p>
    </div>
  )
}
