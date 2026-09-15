'use client'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  QrCode, Smartphone, Star, CheckCircle2, Check, ArrowRight, MessageCircle,
  BarChart3, MapPin, Palette, Bell, Bike, Gift, Pizza, ListPlus, Ticket,
  Menu as MenuIcon, X as XIcon, Users, Wallet, TrendingUp,
} from "lucide-react"

/* ----------------------------- DADOS (preservados) ----------------------------- */

const resources = [
  { icon: MessageCircle, title: "Pedido via WhatsApp", pro: false, desc: "O cliente monta o pedido e ele chega prontinho no seu WhatsApp." },
  { icon: Pizza, title: "Modo Pizzaria", pro: true, desc: "Pizza meio a meio com o preço calculado automaticamente." },
  { icon: ListPlus, title: "Adicionais e Opções", pro: false, desc: "Açaí montável, ponto da carne, marmita e muito mais." },
  { icon: Bell, title: "Painel de Pedidos", pro: true, desc: "Receba e gerencie os pedidos em tempo real, com aviso sonoro." },
  { icon: Bike, title: "Frete por Bairro", pro: true, desc: "Cadastre as taxas e o cliente vê a entrega calculada sozinha." },
  { icon: Ticket, title: "Cupons de Desconto", pro: true, desc: "Crie promoções e atraia mais pedidos." },
  { icon: Gift, title: "Programa de Fidelidade", pro: true, desc: "A cada X pedidos, seu cliente ganha um brinde e volta mais." },
  { icon: QrCode, title: "QR Code Profissional", pro: false, desc: "Gere e baixe QR Codes com a logo da sua marca." },
  { icon: BarChart3, title: "Relatórios de Vendas", pro: true, desc: "Acompanhe faturamento, ticket médio e os mais vendidos." },
  { icon: Star, title: "Avaliações", pro: true, desc: "Estrelas e comentários que atraem novos clientes." },
  { icon: Palette, title: "Personalização", pro: false, desc: "Cores, fontes, tema e layout com a cara da sua marca." },
  { icon: Smartphone, title: "100% Mobile First", pro: false, desc: "Otimizado para o celular, onde seus clientes estão." },
]

const featureTabs = [
  { key: "Pedidos", pro: false, title: "Pedidos via WhatsApp", desc: "Seu cliente monta o pedido. O Cardápio Turbo organiza tudo e envia direto para o seu WhatsApp, já formatado.", img: "/funcionalidades/cardapio.png" },
  { key: "Cardápio", pro: false, title: "Cardápio digital", desc: "Produtos com foto, descrição e preço, organizados por categoria, com a identidade da sua marca.", img: "/funcionalidades/personalizar.png" },
  { key: "Pizzaria", pro: true, title: "Modo Pizzaria", desc: "Pizza meio a meio com o preço calculado automaticamente pela média dos sabores.", img: "/funcionalidades/pizza.png" },
  { key: "Adicionais", pro: false, title: "Adicionais e opções", desc: "Açaí montável, ponto da carne, marmita: o cliente monta do jeito dele e o preço soma sozinho.", img: "/funcionalidades/adicionais.png" },
  { key: "Delivery", pro: true, title: "Frete por bairro", desc: "Cadastre as taxas por bairro e o cliente vê o valor da entrega calculado no carrinho.", img: "/funcionalidades/frete.png" },
  { key: "Fidelidade", pro: true, title: "Programa de fidelidade", desc: "A cada X pedidos o cliente ganha um brinde e cria o hábito de pedir de você.", img: "/funcionalidades/fidelidade.png" },
  { key: "Cupons", pro: true, title: "Cupons de desconto", desc: "Crie promoções com códigos e atraia mais pedidos, com pedido mínimo se quiser.", img: "/funcionalidades/cupom.png" },
  { key: "Relatórios", pro: true, title: "Relatórios de vendas", desc: "Acompanhe faturamento, ticket médio e os produtos mais vendidos.", img: "/funcionalidades/relatorios.png" },
  { key: "QR Code", pro: false, title: "QR Code profissional", desc: "Gere e baixe QR Codes com a logo da sua marca para colar na mesa e no balcão.", img: "/funcionalidades/qrcode.png" },
]

const steps = [
  { number: "01", title: "Crie sua conta", desc: "Cadastro rápido e sem cartão." },
  { number: "02", title: "Personalize", desc: "Adicione logo, cores e informações." },
  { number: "03", title: "Monte seu cardápio", desc: "Produtos, fotos, preços e categorias." },
  { number: "04", title: "Comece a vender", desc: "Compartilhe seu link ou QR Code." },
]

const plans = [
  {
    name: "Free", price: "R$ 0", period: "por 7 dias", badge: null,
    features: ["7 dias grátis para testar tudo", "Até 15 produtos", "Até 3 categorias", "1 cardápio digital", "QR Code básico", "Pedido por WhatsApp", "Personalização básica"],
    locked: ["Painel de pedidos em tempo real", "Frete automático por bairro", "Programa de fidelidade", "Avaliações dos clientes", "Cupons de desconto"],
    cta: "Começar grátis", href: "/register",
  },
  {
    name: "Pro", price: "R$ 29,90", period: "/mês", badge: "Mais popular",
    features: ["Tudo do plano Free", "Produtos e categorias ilimitados", "Modo pizzaria (meio a meio)", "Painel de pedidos em tempo real", "Frete automático por bairro", "Programa de fidelidade", "Avaliações dos clientes", "Cupons de desconto", "Cozinha e comanda impressa", "Controle de caixa", "Perguntas frequentes no cardápio", "Relatórios avançados", "Temas premium e QR com logo", "Sem marca d'água"],
    cta: "Quero o Pro", href: "/register",
  },
]

const testimonials = [
  { name: "Ana Paula", role: "Hamburgueria Artesanal SP", text: "Em 10 minutos já tínhamos nosso cardápio no ar. As vendas pelo WhatsApp aumentaram muito!", avatar: "A" },
  { name: "Carlos Mendes", role: "Pizzaria Bairro", text: "O QR Code com nossa logo ficou incrível. Colocamos nas mesas e o movimento aumentou bastante.", avatar: "C" },
  { name: "Fernanda Lima", role: "Cafeteria", text: "Os insights me mostraram quais produtos precisavam de foto. Depois que adicionei, as vendas dobraram!", avatar: "F" },
]

const homeFaqs = [
  { q: 'O que é o Cardápio Turbo?', a: 'O Cardápio Turbo é uma plataforma para criar um cardápio digital profissional para lanchonetes, pizzarias, hamburguerias e outros negócios de alimentação. O cliente acessa por link ou QR Code e envia o pedido direto para o seu WhatsApp, sem comissão por venda.' },
  { q: 'Quanto custa o Cardápio Turbo?', a: 'Você testa todos os recursos gratuitamente por 7 dias, sem cartão de crédito. Após o período de teste há um plano Pro mensal, que pode ser cancelado quando quiser.' },
  { q: 'Como os pedidos chegam para mim?', a: 'Os pedidos chegam no seu WhatsApp já formatados, com os itens, observações, forma de pagamento, endereço e valor total. Você só confirma e prepara.' },
  { q: 'Preciso saber programar para usar?', a: 'Não. O cardápio é montado em cerca de 10 minutos por um painel simples, direto do celular ou computador, sem precisar de programador nem designer.' },
  { q: 'Quais recursos o Cardápio Turbo oferece?', a: 'Cardápio digital com foto e preço, pedidos no WhatsApp, painel de pedidos ao vivo, frete automático por bairro, cupons de desconto, programa de fidelidade, avaliações de clientes, QR Code personalizado e relatórios de vendas.' },
]

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': 'https://cardapioturbo.com.br/#organization', name: 'Cardápio Turbo', url: 'https://cardapioturbo.com.br', logo: 'https://cardapioturbo.com.br/icon.png', description: 'Plataforma de cardápio digital com pedidos pelo WhatsApp para negócios de alimentação.', sameAs: ['https://instagram.com/cardapioturboonline'] },
    { '@type': 'SoftwareApplication', '@id': 'https://cardapioturbo.com.br/#software', name: 'Cardápio Turbo', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: 'https://cardapioturbo.com.br', description: 'Crie um cardápio digital profissional em minutos e receba pedidos direto no WhatsApp. Inclui painel de pedidos ao vivo, frete por bairro, cupons, programa de fidelidade, QR Code e relatórios.', featureList: ['Cardápio digital com foto e preço', 'Modo pizzaria com meio a meio (preço proporcional)', 'Pedidos direto no WhatsApp', 'Painel de pedidos ao vivo', 'Frete automático por bairro', 'Cupons de desconto', 'Programa de fidelidade', 'Avaliações de clientes', 'QR Code personalizado', 'Relatórios de vendas'], offers: [{ '@type': 'Offer', name: 'Teste grátis', category: 'free trial', price: '0', priceCurrency: 'BRL', description: '7 dias grátis para testar todos os recursos, sem cartão de crédito.' }, { '@type': 'Offer', name: 'Plano Pro', price: '29.90', priceCurrency: 'BRL', description: 'Plano Pro mensal: produtos ilimitados, painel de pedidos ao vivo, cupons, fidelidade, relatórios, QR com logo e sem marca d’água.', url: 'https://cardapioturbo.com.br/#plans', availability: 'https://schema.org/InStock' }], publisher: { '@id': 'https://cardapioturbo.com.br/#organization' } },
    { '@type': 'FAQPage', mainEntity: homeFaqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ],
}

const categorias = [
  { emoji: "🍔", label: "Hamburguerias" },
  { emoji: "🍕", label: "Pizzarias" },
  { emoji: "🥤", label: "Lanchonetes" },
  { emoji: "🍰", label: "Cafeterias" },
  { emoji: "🥗", label: "Restaurantes" },
  { emoji: "🍱", label: "Marmitarias" },
]

/* --------------------------------- COMPONENTE --------------------------------- */

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [rev, setRev] = useState(5000)
  const [tax, setTax] = useState(10)
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const revealRoot = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 16)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    const els = revealRoot.current?.querySelectorAll('[data-reveal]')
    if (!els) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal-in'); io.unobserve(e.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const economia = Math.max(0, Math.round((rev * tax) / 100))
  const nav = [
    { label: "Produto", href: "#beneficios" },
    { label: "Funcionalidades", href: "#features" },
    { label: "Como funciona", href: "#how" },
    { label: "Preços", href: "#plans" },
    { label: "FAQ", href: "#faq" },
  ]

  return (
    <div ref={revealRoot} className="min-h-screen bg-[#FAFAF8] text-[#111111] antialiased">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <style>{`
        [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}
        [data-reveal].reveal-in{opacity:1;transform:none}
        @keyframes ctFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        .ct-float{animation:ctFloat 4.5s ease-in-out infinite}
        .ct-float2{animation:ctFloat 5.5s ease-in-out infinite}
        @media (prefers-reduced-motion: reduce){[data-reveal]{transition:none;opacity:1;transform:none}.ct-float,.ct-float2{animation:none}}
        .no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {/* ============================== HEADER ============================== */}
      <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-black/5 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/brand/icon.png" alt="Cardápio Turbo" width={36} height={36} className="w-9 h-9 object-contain" />
            <span className="font-bold text-lg tracking-tight">Cardápio Turbo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-[#666666]">
            {nav.map(n => <a key={n.href} href={n.href} className="hover:text-[#111111] transition-colors">{n.label}</a>)}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-[#666666] hover:text-[#111111] px-3 py-2">Entrar</Link>
            <Link href="/register" className="text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl px-4 py-2.5 shadow-sm shadow-green-600/20 transition-colors">
              Criar grátis
            </Link>
          </div>

          <button className="md:hidden p-2 -mr-2 text-[#111111]" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
            {menuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-b border-black/5 px-4 py-4 space-y-1">
            {nav.map(n => <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="block px-2 py-2.5 rounded-lg text-[#111111] hover:bg-black/5">{n.label}</a>)}
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="flex-1 text-center rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium">Entrar</Link>
              <Link href="/register" className="flex-1 text-center rounded-xl bg-green-600 text-white px-4 py-2.5 text-sm font-semibold">Criar grátis</Link>
            </div>
          </div>
        )}
      </header>

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-orange-100/50 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-32 w-[420px] h-[420px] rounded-full bg-green-100/40 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative">
          <div data-reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-100 px-3 py-1 text-xs font-semibold text-green-700 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Sem comissão por pedido
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Seu restaurante.<br />Seu cardápio.<br />
              <span className="text-green-600">Suas vendas.</span>
            </h1>
            <p className="mt-6 text-lg text-[#666666] max-w-xl">
              Crie um cardápio digital profissional, receba pedidos pelo WhatsApp e venda sem pagar comissão para aplicativos.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-7 py-4 text-base font-semibold shadow-lg shadow-green-600/20 transition-colors">
                Criar meu cardápio grátis <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-black/10 hover:border-black/20 px-7 py-4 text-base font-semibold transition-colors">
                Ver como funciona
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#666666]">
              {["7 dias grátis", "Sem cartão de crédito", "Setup em 5 minutos"].map(t => (
                <span key={t} className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> {t}</span>
              ))}
            </div>
          </div>

          {/* Mockup */}
          <div className="relative flex justify-center lg:justify-end" data-reveal>
            <div className="relative w-[290px] sm:w-[320px]">
              <div className="rounded-[2.75rem] bg-[#111111] p-3 shadow-2xl shadow-black/20">
                <div className="rounded-[2.25rem] bg-white overflow-hidden">
                  <div className="h-8 bg-white flex items-center justify-center"><div className="h-5 w-24 bg-[#111111] rounded-full" /></div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-5 pt-3 pb-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow mb-2">🍔</div>
                    <h3 className="text-white font-bold text-lg">Burger House</h3>
                    <p className="text-orange-50 text-xs">Aberto agora • WhatsApp disponível</p>
                  </div>
                  <div className="p-4 space-y-2.5">
                    {[["X-Burguer Clássico", "R$ 24,90", "🍔"], ["Combo Duplo", "R$ 39,90", "🍟"], ["Batata Frita", "R$ 14,90", "🍟"]].map(([n, p, e]) => (
                      <div key={n} className="flex items-center gap-3 rounded-xl border border-black/5 p-2.5">
                        <div className="h-11 w-11 rounded-lg bg-orange-50 flex items-center justify-center text-lg">{e}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#111111] truncate">{n}</p>
                          <p className="text-sm font-bold text-orange-500">{p}</p>
                        </div>
                        <div className="h-7 w-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm">+</div>
                      </div>
                    ))}
                    <div className="mt-1 rounded-xl bg-green-600 text-white text-sm font-semibold py-3 flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Pedir pelo WhatsApp
                    </div>
                  </div>
                </div>
              </div>
              {/* elementos flutuantes */}
              <div className="ct-float absolute -left-6 top-24 hidden sm:flex items-center gap-2 rounded-2xl bg-white shadow-xl border border-black/5 px-3 py-2">
                <span className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center"><Bell className="w-4 h-4" /></span>
                <div><p className="text-[11px] font-bold leading-tight">Novo pedido</p><p className="text-[10px] text-[#666666]">agora mesmo</p></div>
              </div>
              <div className="ct-float2 absolute -right-4 top-8 hidden sm:flex items-center gap-2 rounded-2xl bg-white shadow-xl border border-black/5 px-3 py-2">
                <span className="text-green-600 font-extrabold">+ R$ 84,70</span>
              </div>
              <div className="ct-float absolute -right-6 bottom-28 hidden sm:flex items-center gap-2 rounded-2xl bg-white shadow-xl border border-black/5 px-3 py-2">
                <MessageCircle className="w-4 h-4 text-green-600" /><span className="text-[11px] font-semibold">Pedido via WhatsApp</span>
              </div>
              <div className="ct-float2 absolute -left-4 bottom-10 hidden sm:flex items-center gap-1.5 rounded-2xl bg-white shadow-xl border border-black/5 px-3 py-2">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" /><span className="text-[11px] font-bold">4,9</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== PROVA / CATEGORIAS ============================== */}
      <section className="border-y border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" data-reveal>
          <p className="text-center text-sm font-semibold text-[#666666] mb-6">Feito para quem vende todos os dias</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categorias.map(c => (
              <span key={c.label} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#FAFAF8] px-4 py-2 text-sm font-medium text-[#111111]">
                <span className="text-base">{c.emoji}</span> {c.label}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center">
            <a href="https://www.correiodoestado.com.br" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs text-[#666666] hover:text-[#111111]">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" /> Como visto no <span className="font-semibold text-[#111111]">Correio do Estado</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================== BENEFÍCIOS ============================== */}
      <section id="beneficios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl" data-reveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Pare de pagar comissão para vender o que é seu.
          </h2>
          <p className="mt-4 text-lg text-[#666666]">Seu cliente, seu pedido, seu WhatsApp e sua margem.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: MessageCircle, color: "bg-green-50 text-green-600", title: "Venda direto", desc: "Pedidos chegam no seu WhatsApp já organizados, com itens, endereço e total." },
            { icon: Wallet, color: "bg-orange-50 text-orange-500", title: "Zero comissão", desc: "Você paga uma mensalidade. Não uma porcentagem de cada venda." },
            { icon: Users, color: "bg-green-50 text-green-600", title: "Cliente é seu", desc: "Construa sua própria base de clientes e incentive a recompra." },
          ].map((c, i) => (
            <div key={i} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="rounded-3xl bg-white border border-black/5 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${c.color} mb-6`}><c.icon className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-2">{c.title}</h3>
              <p className="text-[#666666] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== FUNCIONALIDADES (TABS) ============================== */}
      <section id="features" className="bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mb-12" data-reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Tudo que você precisa para vender mais.</h2>
            <p className="mt-4 text-lg text-[#666666]">Um sistema completo, simples de usar, feito para o dia a dia do seu negócio.</p>
          </div>
          <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
            {/* lista / tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0" data-reveal>
              {featureTabs.map((f, i) => (
                <button key={f.key} onClick={() => setTab(i)}
                  className={`shrink-0 lg:w-full text-left rounded-2xl border px-4 py-3 transition-all ${tab === i ? 'border-green-600 bg-green-50/60 shadow-sm' : 'border-black/10 bg-white hover:border-black/20'}`}>
                  <span className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap lg:whitespace-normal">
                    {f.key}
                    {f.pro && <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-600">PRO</span>}
                  </span>
                  <span className="hidden lg:block text-xs text-[#666666] mt-0.5 leading-snug">{f.title}</span>
                </button>
              ))}
            </div>
            {/* mockup */}
            <div className="rounded-3xl bg-[#FAFAF8] border border-black/5 p-6 sm:p-10 grid sm:grid-cols-2 gap-8 items-center min-h-[420px]" data-reveal>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-2xl font-bold">{featureTabs[tab].title}</h3>
                  {featureTabs[tab].pro && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">PRO</span>}
                </div>
                <p className="text-[#666666] leading-relaxed">{featureTabs[tab].desc}</p>
                <Link href="/register" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-green-700 hover:text-green-800">
                  Experimentar grátis <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex justify-center">
                <img key={featureTabs[tab].img} src={featureTabs[tab].img} alt={`Tela: ${featureTabs[tab].title}`} loading="lazy"
                  className="w-44 sm:w-52 rounded-[2rem] drop-shadow-2xl transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== CARDÁPIO NO CELULAR ============================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center mb-14" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Seu cardápio cabe no bolso.</h2>
          <p className="mt-4 text-lg text-[#666666]">Seu cliente não precisa baixar aplicativo. É só abrir o link ou apontar a câmera para o QR Code.</p>
        </div>
        <div className="flex flex-wrap justify-center items-end gap-6 sm:gap-10">
          {[
            { img: "/funcionalidades/cardapio.png", label: "O cardápio da sua marca" },
            { img: "/funcionalidades/adicionais.png", label: "Cliente monta o pedido" },
            { img: "/funcionalidades/frete.png", label: "Carrinho e entrega" },
          ].map((p, i) => (
            <div key={i} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className={`text-center ${i === 1 ? 'sm:-mb-6' : ''}`}>
              <img src={p.img} alt={p.label} loading="lazy" className="w-40 sm:w-52 rounded-[2rem] drop-shadow-2xl mx-auto" />
              <p className="mt-4 text-sm text-[#666666]">{p.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center" data-reveal>
          <Link href="/menu/dogao-do-denis-ikir" className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold hover:border-black/20 transition-colors">
            Ver cardápio de exemplo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ============================== WHATSAPP (verde escuro) ============================== */}
      <section className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div data-reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Do pedido para o WhatsApp.<br /><span className="text-green-300">Sem intermediários.</span>
            </h2>
            <div className="mt-8 space-y-3 max-w-xs">
              {[["Cliente", "🧑"], ["Cardápio Turbo", "⚡"], ["WhatsApp", "💬"], ["Restaurante", "🏪"]].map(([t, e], i) => (
                <div key={t}>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur-sm">
                    <span className="text-xl">{e}</span><span className="font-semibold">{t}</span>
                  </div>
                  {i < 3 && <div className="flex justify-center py-1 text-green-300">↓</div>}
                </div>
              ))}
            </div>
          </div>
          {/* demo pedido */}
          <div data-reveal className="justify-self-center w-full max-w-sm">
            <div className="rounded-3xl bg-white text-[#111111] shadow-2xl overflow-hidden">
              <div className="bg-green-600 text-white px-5 py-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /><span className="font-bold">Novo pedido #1048</span>
              </div>
              <div className="p-5 space-y-2 text-sm">
                {[["2x", "X-Burguer"], ["1x", "Batata Grande"], ["2x", "Coca-Cola"]].map(([q, n]) => (
                  <div key={n} className="flex justify-between"><span><b>{q}</b> {n}</span></div>
                ))}
                <div className="border-t border-black/5 my-2" />
                <div className="flex justify-between text-[#666666]"><span>Subtotal</span><span>R$ 84,70</span></div>
                <div className="flex justify-between text-[#666666]"><span>Entrega</span><span>R$ 7,00</span></div>
                <div className="flex justify-between text-lg font-extrabold"><span>Total</span><span>R$ 91,70</span></div>
                <button className="mt-3 w-full rounded-xl bg-green-600 text-white font-semibold py-3">Confirmar pedido</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== RECURSOS (grid) ============================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl mb-12" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Recursos que fazem a diferença.</h2>
          <p className="mt-4 text-lg text-[#666666]">Do cardápio à recompra do cliente, tudo num lugar só.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r, i) => (
            <div key={i} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }} className="group rounded-2xl bg-white border border-black/5 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#FAFAF8] border border-black/5 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <r.icon className="w-5 h-5" />
                </div>
                {r.pro && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">PRO</span>}
              </div>
              <h3 className="font-bold mb-1">{r.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== COMO FUNCIONA (timeline) ============================== */}
      <section id="how" className="bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl mb-14" data-reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Do zero ao primeiro pedido em minutos.</h2>
          </div>
          <div className="relative grid md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-green-200 via-orange-200 to-green-200" />
            {steps.map((s, i) => (
              <div key={i} data-reveal style={{ transitionDelay: `${i * 90}ms` }} className="relative">
                <div className="w-14 h-14 rounded-2xl bg-green-600 text-white flex items-center justify-center font-extrabold text-lg shadow-lg shadow-green-600/20 relative z-10">{s.number}</div>
                <h3 className="mt-5 font-bold text-lg">{s.title}</h3>
                <p className="mt-1 text-[#666666]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== RESULTADOS ============================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl mb-12" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Você cuida do restaurante.<br />O Turbo cuida do resto.</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Bell, title: "Pedidos organizados", desc: "Tudo formatado e no lugar, sem erro de anotação." },
            { icon: Users, title: "Clientes recorrentes", desc: "Fidelidade e cupons para o cliente voltar." },
            { icon: TrendingUp, title: "Ticket médio", desc: "Combos e adicionais que aumentam o valor do pedido." },
            { icon: Wallet, title: "0% de comissão", desc: "Nenhuma porcentagem sai do seu bolso por venda." },
          ].map((c, i) => (
            <div key={i} data-reveal style={{ transitionDelay: `${i * 70}ms` }} className="rounded-2xl bg-white border border-black/5 p-6 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4"><c.icon className="w-5 h-5" /></div>
              <h3 className="font-bold mb-1">{c.title}</h3>
              <p className="text-sm text-[#666666] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================== PREÇOS ============================== */}
      <section id="plans" className="bg-white border-y border-black/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14" data-reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Comece grátis. Cresça quando quiser.</h2>
            <p className="mt-4 text-lg text-[#666666]">Teste todos os recursos por 7 dias. Sem cartão de crédito.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {plans.map((plan, i) => {
              const pro = plan.name === "Pro"
              return (
                <div key={i} data-reveal className={`relative rounded-3xl p-8 ${pro ? 'bg-[#111111] text-white shadow-2xl md:-mt-4' : 'bg-white border border-black/10'}`}>
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 text-white px-4 py-1 text-xs font-bold shadow">{plan.badge.toUpperCase()}</span>
                  )}
                  <h3 className={`font-bold text-lg ${pro ? 'text-white' : 'text-[#111111]'}`}>{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className={pro ? 'text-white/60' : 'text-[#666666]'}>{plan.period}</span>
                  </div>
                  <Link href={plan.href} className={`mt-6 block w-full text-center rounded-xl py-3 text-sm font-semibold transition-colors ${pro ? 'bg-green-500 hover:bg-green-400 text-[#062e18]' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                    {plan.cta}
                  </Link>
                  <ul className="mt-7 space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${pro ? 'text-green-400' : 'text-green-600'}`} />
                        <span className={pro ? 'text-white/90' : 'text-[#111111]'}>{f}</span>
                      </li>
                    ))}
                    {plan.locked?.map((f, j) => (
                      <li key={`l${j}`} className="flex items-start gap-2.5 text-sm">
                        <XIcon className="w-4 h-4 mt-0.5 shrink-0 text-black/20" />
                        <span className="text-[#999999]">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <p className="text-center text-xs text-[#999999] mt-8" data-reveal>Pagamento processado com segurança. Cancele quando quiser.</p>
        </div>
      </section>

      {/* ============================== CALCULADORA ============================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="rounded-3xl bg-[#111111] text-white p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center" data-reveal>
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Quanto você deixa nas plataformas?</h2>
            <p className="mt-4 text-white/70">Faça uma simulação rápida e veja o quanto a comissão pode estar custando por mês.</p>
            <div className="mt-8 space-y-6">
              <div>
                <label className="text-sm text-white/70">Quanto você vende por mês?</label>
                <div className="mt-2 flex items-center gap-4">
                  <input type="range" min={500} max={50000} step={500} value={rev} onChange={e => setRev(Number(e.target.value))}
                    className="flex-1 accent-green-500" />
                  <span className="w-28 text-right font-bold text-lg">{brl(rev)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm text-white/70">Taxa média do aplicativo</label>
                <div className="mt-2 flex items-center gap-4">
                  <input type="range" min={0} max={30} step={1} value={tax} onChange={e => setTax(Number(e.target.value))}
                    className="flex-1 accent-orange-500" />
                  <span className="w-28 text-right font-bold text-lg">{tax}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-8 text-center">
            <p className="text-white/70 text-sm">Você pode estar pagando aproximadamente</p>
            <p className="my-3 text-5xl font-extrabold text-orange-400">{brl(economia)}<span className="text-lg text-white/60 font-semibold">/mês</span></p>
            <p className="text-white/80">Com o Cardápio Turbo, você <b className="text-green-400">não paga comissão</b> por pedido.</p>
            <Link href="/register" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 text-[#062e18] px-6 py-3 font-semibold w-full">
              Quero vender sem comissão <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="mt-4 text-[11px] text-white/40">Simulação ilustrativa. Não representa dados oficiais de plataformas específicas.</p>
          </div>
        </div>
      </section>

      {/* ============================== DEPOIMENTOS ============================== */}
      <section className="bg-white border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-12" data-reveal>Quem vende, entende.</h2>
          <div className="flex gap-5 overflow-x-auto no-scrollbar snap-x pb-2 md:grid md:grid-cols-3 md:overflow-visible">
            {testimonials.map((t, i) => (
              <div key={i} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="snap-center shrink-0 w-[85%] sm:w-[70%] md:w-auto rounded-3xl bg-[#FAFAF8] border border-black/5 p-7">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-orange-400 text-orange-400" />)}</div>
                <p className="text-[#111111] leading-relaxed mb-6">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">{t.avatar}</div>
                  <div><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-[#666666]">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== FAQ ============================== */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-16">
          <div data-reveal>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Tire suas dúvidas.</h2>
            <p className="mt-4 text-[#666666]">Não achou o que procurava? <Link href="/faq" className="text-green-700 font-semibold hover:underline">Ver todas as perguntas</Link> ou fale com a gente pelo <Link href="/contato" className="text-green-700 font-semibold hover:underline">contato</Link>.</p>
          </div>
          <div className="space-y-3" data-reveal>
            {homeFaqs.map((f, i) => (
              <div key={i} className="rounded-2xl border border-black/10 bg-white overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold">
                  {f.q}
                  <span className={`text-green-600 text-xl leading-none transition-transform ${faqOpen === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {faqOpen === i && <p className="px-5 pb-5 -mt-1 text-[#666666] leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA FINAL ============================== */}
      <section className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-[1fr_auto] gap-12 items-center">
          <div data-reveal>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">Seu próximo pedido pode começar aqui.</h2>
            <p className="mt-4 text-lg text-white/70 max-w-xl">Crie seu cardápio digital hoje e comece a vender direto pelo WhatsApp.</p>
            <Link href="/register" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-green-500 hover:bg-green-400 text-[#062e18] px-8 py-4 text-base font-bold shadow-lg transition-colors">
              Criar meu cardápio grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
              {["7 dias grátis", "Sem cartão de crédito", "Setup em 5 minutos"].map(t => (
                <span key={t} className="inline-flex items-center gap-1.5"><Check className="w-4 h-4 text-green-300" /> {t}</span>
              ))}
            </div>
          </div>
          <div className="hidden lg:block" data-reveal>
            <div className="w-[200px] rounded-[2rem] bg-black/40 p-2.5 shadow-2xl">
              <div className="rounded-[1.6rem] bg-white overflow-hidden">
                <div className="bg-orange-500 px-4 py-3"><p className="text-white font-bold text-sm">Burger House</p></div>
                <div className="p-3 space-y-2">
                  {["X-Burguer", "Combo Duplo"].map(n => <div key={n} className="h-9 rounded-lg bg-[#FAFAF8] border border-black/5 flex items-center px-2 text-[10px] font-medium">{n}</div>)}
                  <div className="rounded-lg bg-green-600 text-white text-[10px] font-semibold py-2 text-center">Pedir pelo WhatsApp</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="bg-[#111111] text-[#999999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="mb-4">
                <img src="/brand/logo.png" alt="Cardápio Turbo" width={200} height={67} className="h-10 w-auto object-contain" />
              </div>
              <p className="text-sm max-w-xs">Seu cardápio digital. Seu cliente. Suas vendas.</p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Produto</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#plans" className="hover:text-white">Preços</a></li>
                <li><a href="#faq" className="hover:text-white">FAQ</a></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Empresa</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
                <li><a href="https://instagram.com/cardapioturboonline" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-white">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 text-sm">© 2026 Cardápio Turbo. Todos os direitos reservados.</div>
        </div>
      </footer>
    </div>
  )
}
