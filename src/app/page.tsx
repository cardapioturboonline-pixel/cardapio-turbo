import Link from "next/link";
import {
  QrCode, Smartphone, Zap, TrendingUp, Star, CheckCircle2,
  ArrowRight, MessageCircle, ShoppingCart, BarChart3, Sparkles,
  Clock, MapPin, CreditCard, Palette, Package, Users, Bell, Bike, Gift, X as XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  { icon: QrCode, title: "QR Code Profissional", desc: "Gere e baixe QR Codes personalizados com a logo da sua marca" },
  { icon: MessageCircle, title: "Pedido via WhatsApp", desc: "Carrinho inteligente que monta o pedido e envia direto pro seu WhatsApp" },
  { icon: Bell, title: "Painel de Pedidos ao Vivo", desc: "Receba e gerencie os pedidos em tempo real, com aviso sonoro a cada novo pedido" },
  { icon: Bike, title: "Frete por Bairro", desc: "Cadastre as taxas e o cliente vê o valor da entrega automaticamente no carrinho" },
  { icon: Gift, title: "Programa de Fidelidade", desc: "Cartão fidelidade digital: a cada X pedidos, seu cliente ganha um brinde e volta mais" },
  { icon: Star, title: "Avaliações dos Clientes", desc: "Receba estrelas e comentários — prova social que atrai novos clientes" },
  { icon: Palette, title: "Personalização Total", desc: "Cores, fontes, temas e layout da sua marca em minutos" },
  { icon: TrendingUp, title: "Cupons e Relatórios", desc: "Crie cupons de desconto e acompanhe vendas, faturamento e ticket médio" },
  { icon: Smartphone, title: "100% Mobile First", desc: "Design responsivo otimizado para celular, onde seus clientes estão" },
];

const steps = [
  { number: "01", title: "Crie sua conta grátis", desc: "Cadastro em 30 segundos, sem cartão de crédito" },
  { number: "02", title: "Configure sua loja", desc: "Adicione logo, cores e informações do seu negócio" },
  { number: "03", title: "Cadastre seu cardápio", desc: "Produtos, fotos, preços e categorias facilmente" },
  { number: "04", title: "Compartilhe e venda mais", desc: "Gere o QR Code e compartilhe o link com seus clientes" },
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "",
    badge: null,
    color: "border-gray-200",
    btnVariant: "outline" as const,
    features: [
      "7 dias grátis para testar tudo",
      "Até 15 produtos",
      "Até 3 categorias",
      "1 cardápio digital",
      "QR Code básico",
      "Pedido por WhatsApp",
      "Personalização básica",
    ],
    locked: [
      "Painel de pedidos em tempo real",
      "Frete automático por bairro",
      "Programa de fidelidade",
      "Avaliações dos clientes",
      "Cupons de desconto",
    ],
    cta: "Começar grátis",
    href: "/register",
  },
  {
    name: "Pro",
    price: "R$ 29,90",
    period: "/mês",
    badge: "Mais popular",
    color: "border-orange-500 ring-2 ring-orange-500",
    btnVariant: "default" as const,
    features: [
      "Tudo do plano Free",
      "Produtos e categorias ilimitados",
      "Painel de pedidos em tempo real",
      "Frete automático por bairro",
      "Programa de fidelidade",
      "Avaliações dos clientes",
      "Cupons de desconto",
      "Relatórios avançados",
      "Temas premium e QR com logo",
      "Sem marca d'água",
    ],
    cta: "Assinar Pro",
    href: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=cda0003141c949a8976b7fc106bd85ed",
  },
];

const testimonials = [
  { name: "Ana Paula", role: "Hamburgueria Artesanal SP", text: "Em 10 minutos já tínhamos nosso cardápio no ar. As vendas pelo WhatsApp aumentaram muito!", avatar: "A" },
  { name: "Carlos Mendes", role: "Pizzaria Bairro", text: "O QR Code com nossa logo ficou incrível. Colocamos nas mesas e o movimento aumentou bastante.", avatar: "C" },
  { name: "Fernanda Lima", role: "Cafeteria", text: "Os insights me mostraram quais produtos precisavam de foto. Depois que adicionei, as vendas dobraram!", avatar: "F" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Cardápio Turbo</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-orange-500 transition-colors">Funcionalidades</a>
            <a href="#plans" className="hover:text-orange-500 transition-colors">Planos</a>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
            <Link href="/sobre" className="hover:text-orange-500 transition-colors">Sobre</Link>
            <Link href="/contato" className="hover:text-orange-500 transition-colors">Contato</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                Criar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0ibTM2IDM0di00aC0ydi00aC0ydjRoLTJ2NGgydi00aDJ2NEgzNnptMC0zMFYwaDR2MmgydjJoMlYyaDJ2LTJoNFYwaDJ2Mmg0di0yaDJWMGg0djRoLTJ2MmgtMlYyaC00djJoLTJWMmgtNHYyaC0yVjJoLTR2MmgtMlYwSDM2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Badge className="mb-6 bg-orange-100 text-orange-600 hover:bg-orange-100 border-orange-200">
            🚀 Mais de 500 lanchonetes já usam
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Cardápio digital profissional{" "}
            <span className="text-orange-500">em menos de 5 minutos</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Crie seu cardápio online com link próprio e QR Code. Seus clientes fazem pedidos direto pelo WhatsApp — sem aplicativo, sem complicação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-200">
                Criar meu cardápio grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/menu/dogao-do-denis-ikir">
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-xl">
                Ver demonstração
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">Grátis para sempre • Sem cartão de crédito • Setup em 5 minutos</p>

          {/* Hero mockup */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-2xl p-4 shadow-2xl">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-32 flex items-end p-4">
                  <div>
                    <div className="w-16 h-16 bg-white rounded-xl mb-2 flex items-center justify-center shadow-md">
                      <span className="text-2xl">🍔</span>
                    </div>
                    <h3 className="text-white font-bold text-xl">Burger House</h3>
                    <p className="text-orange-100 text-sm">Aberto agora • WhatsApp disponível</p>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { name: "X-Burguer Clássico", price: "R$ 24,90", tag: "🔥 Mais pedido" },
                    { name: "Combo Duplo", price: "R$ 39,90", tag: "⭐ Destaque" },
                    { name: "Batata Frita G", price: "R$ 14,90", tag: null },
                  ].map((item, i) => (
                    <div key={i} className="border border-gray-100 rounded-lg p-3 text-left">
                      <div className="bg-orange-50 rounded-lg h-16 mb-2 flex items-center justify-center">
                        <span className="text-2xl">🍟</span>
                      </div>
                      {item.tag && <span className="text-xs text-orange-500 font-medium">{item.tag}</span>}
                      <p className="text-xs font-medium text-gray-900 mt-1">{item.name}</p>
                      <p className="text-sm font-bold text-orange-500">{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t">
                  <div className="bg-green-500 text-white text-sm rounded-lg p-2 text-center flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Pedir pelo WhatsApp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { value: "5 min", label: "para criar o cardápio" },
            { value: "3x", label: "mais pedidos com foto" },
            { value: "40%", label: "mais ticket com combos" },
            { value: "R$0", label: "plano gratuito para sempre" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-orange-400">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">Funcionalidades</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Tudo que seu negócio precisa
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Da criação do cardápio até a análise de desempenho, o Cardápio Turbo tem tudo em um lugar só.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                  <f.icon className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">Como funciona</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Cardápio no ar em 4 passos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
                  <span className="text-white font-extrabold text-xl">{step.number}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">Planos e Preços</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Comece grátis, cresça quando quiser
            </h2>
            <p className="text-gray-500 text-lg">Comece grátis por 7 dias. Sem cartão de crédito.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl border-2 p-8 ${plan.color}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white hover:bg-orange-500 px-4">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                <h3 className="font-bold text-xl text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {(plan as { locked?: string[] }).locked?.map((f, j) => (
                    <li key={`l${j}`} className="flex items-center gap-2 text-sm text-gray-400">
                      <XIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={(plan as { href?: string }).href ?? '/register'} target={((plan as { href?: string }).href ?? '').startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
                  <Button
                    variant={plan.btnVariant}
                    className={`w-full ${plan.btnVariant === 'default' ? 'bg-orange-500 hover:bg-orange-600 text-white' : ''}`}
                  >
                    {plan.cta}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Quem já usa, aprova</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pronto para vender mais?
          </h2>
          <p className="text-orange-100 text-lg mb-8">
            Crie seu cardápio digital agora e comece a receber pedidos pelo WhatsApp hoje mesmo.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-orange-500 hover:bg-orange-50 px-10 py-6 text-lg rounded-xl font-bold shadow-xl">
              Criar meu cardápio grátis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="mt-4 text-orange-100 text-sm">Sem cartão • Setup em 5 minutos • <a href="https://wa.me/5567992741982" target="_blank" rel="noreferrer" className="underline hover:text-white">Suporte via WhatsApp</a></p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Cardápio Turbo</span>
            </div>
            <div className="flex gap-6 text-sm flex-wrap justify-center">
              <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
              <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <a href="https://instagram.com/cardapioturboonline" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            </div>
            <p className="text-sm">© 2026 Agência LD Marketing. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
