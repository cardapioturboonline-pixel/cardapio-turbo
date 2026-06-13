'use client'

import { Check, X, Zap, Sparkles } from 'lucide-react'
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
      { text: '7 dias grátis para testar tudo', included: true },
      { text: 'Até 15 produtos', included: true },
      { text: 'Até 3 categorias', included: true },
      { text: '1 cardápio digital', included: true },
      { text: 'QR Code básico', included: true },
      { text: 'Pedido por WhatsApp', included: true },
      { text: 'Personalização básica', included: true },
      { text: 'Cupons de desconto', included: false },
      { text: 'Painel de pedidos em tempo real', included: false },
      { text: 'Frete automático por bairro', included: false },
      { text: 'Programa de fidelidade', included: false },
      { text: 'Avaliações dos clientes', included: false },
      { text: 'Relatórios avançados', included: false },
      { text: 'Temas premium e QR com logo', included: false },
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
      { text: 'Tudo do plano Free', included: true },
      { text: 'Produtos e categorias ilimitados', included: true },
      { text: 'Modo pizzaria (meio a meio)', included: true },
      { text: 'Painel de pedidos em tempo real', included: true },
      { text: 'Frete automático por bairro', included: true },
      { text: 'Programa de fidelidade', included: true },
      { text: 'Avaliações dos clientes', included: true },
      { text: 'Cupons de desconto', included: true },
      { text: 'Relatórios avançados', included: true },
      { text: 'Temas premium e QR com logo', included: true },
      { text: 'Sem marca d\'água', included: true },
    ],
  },
]

export default function PlansPage() {
  const { business } = useBusiness()
  const currentPlan = business?.plan ?? 'free'

  const checkoutLinks: Record<string, string> = {
    pro: 'https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=cda0003141c949a8976b7fc106bd85ed',
  }

  function handleUpgrade(planId: string) {
    if (planId === currentPlan) return
    if (checkoutLinks[planId]) {
      window.open(checkoutLinks[planId], '_blank')
    }
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

              {isCurrent || !checkoutLinks[plan.id] ? (
                <button
                  disabled={isCurrent}
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors mb-6 ${isCurrent ? 'bg-gray-100 text-gray-400 cursor-default' : plan.btnClass}`}
                >
                  {isCurrent ? 'Plano atual' : 'Usar grátis'}
                </button>
              ) : (
                <a
                  href={checkoutLinks[plan.id]}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors mb-6 flex items-center justify-center ${plan.btnClass}`}
                >
                  Assinar agora
                </a>
              )}

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
                      {feature.text.includes('Modo pizzaria') && (
                        <span className="ml-1.5 rounded-full bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-orange-600 align-middle">NOVO</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="text-center text-xs text-gray-400">
        Pagamentos processados com segurança via Mercado Pago. Cancele quando quiser.
      </p>

      {/* Cancel info */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 max-w-2xl mx-auto">
        <h3 className="font-semibold text-gray-700 mb-2">Como cancelar sua assinatura</h3>
        <ol className="text-sm text-gray-500 space-y-1.5 list-decimal pl-4">
          <li>Acesse <a href="https://www.mercadopago.com.br" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">mercadopago.com.br</a> com o e-mail usado na compra</li>
          <li>Vá em <strong>Minha conta → Assinaturas</strong></li>
          <li>Encontre <strong>"Cardápio Turbo - Plano Pro"</strong> e clique em <strong>Cancelar</strong></li>
        </ol>
        <p className="text-sm text-gray-400 mt-3">
          Prefere ajuda? Entre em contato via{' '}
          <a href="https://wa.me/5567992741982" target="_blank" rel="noreferrer" className="text-green-500 hover:underline font-medium">
            WhatsApp (67) 99274-1982
          </a>{' '}
          que cancelamos para você.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Após o cancelamento, você continua com acesso por mais 30 dias. Seus dados são preservados.
        </p>
      </div>
    </div>
  )
}
