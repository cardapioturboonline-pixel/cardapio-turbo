import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Target, Heart, Rocket, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre o Cardápio Turbo — Nossa História e Missão',
  description: 'Conheça o Cardápio Turbo: a plataforma que ajuda lanchonetes e restaurantes a venderem mais com cardápio digital, QR Code e pedidos pelo WhatsApp.',
  alternates: { canonical: 'https://cardapioturbo.com.br/sobre' },
}

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Cardápio Turbo</span>
          </Link>
          <Link href="/register" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Criar grátis</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block rounded-full bg-orange-100 text-orange-600 px-4 py-1 text-sm font-semibold mb-4">Sobre nós</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Tecnologia que faz o pequeno negócio vender mais</h1>
          <p className="text-lg text-gray-500">
            O Cardápio Turbo nasceu para resolver um problema simples: ajudar lanchonetes, hamburguerias e restaurantes a profissionalizarem o atendimento sem gastar uma fortuna nem perder tempo com sistemas complicados.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        {/* História */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nossa história</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Vimos donos de lanchonete mandando foto de cardápio de papel no grupo do WhatsApp, anotando pedido no caderninho e perdendo vendas por falta de organização. Sabíamos que dava para fazer melhor — e mais barato que os sistemas caros do mercado.
            </p>
            <p>
              Foi assim que criamos o <strong>Cardápio Turbo</strong>: uma plataforma onde qualquer pessoa monta um cardápio digital profissional em menos de 5 minutos, com link próprio, QR Code e pedidos que chegam direto no WhatsApp. Tudo simples, rápido e acessível.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">No que acreditamos</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Target, title: 'Simplicidade', desc: 'Tecnologia que qualquer pessoa usa, sem precisar de manual.' },
              { icon: Heart, title: 'Acessível', desc: 'Recursos de sistema caro, por um preço que cabe no bolso.' },
              { icon: Rocket, title: 'Resultado', desc: 'Cada recurso existe para fazer você vender mais.' },
            ].map((v, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 p-5">
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                  <v.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quem faz */}
        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quem está por trás</h2>
          <p className="text-gray-600 leading-relaxed">
            O Cardápio Turbo é desenvolvido e mantido pela <strong>Agência LD Marketing</strong>, especializada em soluções digitais para pequenos e médios negócios. Nosso compromisso é simples: oferecer uma ferramenta que realmente funciona e um suporte humano e próximo, sempre que você precisar.
          </p>
        </section>
      </main>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Faça parte dessa história</h2>
          <p className="text-orange-100 mb-6">Crie seu cardápio digital grátis e comece a vender mais hoje mesmo.</p>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-orange-600 hover:bg-orange-50">
            Criar meu cardápio grátis <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <span>© 2026 Agência LD Marketing</span>
          <div className="flex gap-5">
            <Link href="/sobre" className="hover:text-white">Sobre</Link>
            <Link href="/contato" className="hover:text-white">Contato</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <a href="https://instagram.com/cardapioturboonline" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <Link href="/termos" className="hover:text-white">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
