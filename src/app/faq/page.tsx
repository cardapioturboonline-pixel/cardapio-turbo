import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Perguntas Frequentes — Cardápio Turbo | Tudo sobre as funcionalidades',
  description: 'Tire suas dúvidas sobre o Cardápio Turbo: cardápio digital, pedidos no WhatsApp, painel de pedidos ao vivo, cupons, fidelidade, frete por bairro, QR Code, relatórios e mais.',
  keywords: 'cardápio turbo, dúvidas cardápio digital, funcionalidades cardápio turbo, pedido whatsapp, qr code cardápio, cupom desconto, programa de fidelidade',
  alternates: { canonical: 'https://cardapioturbo.com.br/faq' },
  openGraph: {
    title: 'Perguntas Frequentes — Cardápio Turbo',
    description: 'Tudo o que o Cardápio Turbo oferece, explicado de forma simples.',
    url: 'https://cardapioturbo.com.br/faq',
    type: 'website',
  },
}

interface FaqGroup { title: string; items: { q: string; a: string }[] }

const GROUPS: FaqGroup[] = [
  {
    title: 'Começando',
    items: [
      { q: 'O que é o Cardápio Turbo?', a: 'O Cardápio Turbo é uma plataforma para criar um cardápio digital profissional para o seu negócio de alimentação. O cliente acessa por link ou QR Code, monta o pedido e envia tudo direto para o seu WhatsApp, sem comissão por venda.' },
      { q: 'Quanto custa e como funciona o teste grátis?', a: 'Você cria a conta e testa todos os recursos gratuitamente por 7 dias, sem precisar de cartão de crédito. Após o período, há um plano Pro mensal que pode ser cancelado quando quiser.' },
      { q: 'Quanto tempo leva para colocar meu cardápio no ar?', a: 'Cerca de 10 minutos. Você cria a conta, cadastra categorias e produtos com foto e preço, personaliza com a sua marca e já gera o link e o QR Code para divulgar.' },
      { q: 'Preciso saber programar?', a: 'Não. Tudo é feito por um painel simples, direto do celular ou computador. Não precisa de programador nem de designer.' },
    ],
  },
  {
    title: 'Pedidos e WhatsApp',
    items: [
      { q: 'Como os pedidos chegam para mim?', a: 'Quando o cliente finaliza o pedido no cardápio, ele chega no seu WhatsApp já formatado, com os itens, observações, forma de pagamento, endereço de entrega e valor total. Você só confirma e prepara.' },
      { q: 'O que é o painel de pedidos ao vivo?', a: 'É um painel onde você acompanha os pedidos em tempo real, organizando por status (recebido, em preparo, saiu para entrega, concluído). Ideal para a correria do dia a dia.' },
      { q: 'Consigo definir frete por bairro?', a: 'Sim. Você cadastra os bairros que atende e o valor do frete de cada um. O sistema calcula automaticamente o frete conforme a região do cliente, incluindo a opção de retirada no local.' },
      { q: 'Dá para receber pedidos para retirada e para entrega?', a: 'Sim. O cliente escolhe entre entrega (com cálculo de frete) ou retirada no local na hora de finalizar o pedido.' },
    ],
  },
  {
    title: 'Vender mais',
    items: [
      { q: 'Como funcionam os cupons de desconto?', a: 'Você cria cupons com desconto em percentual ou valor fixo, define um pedido mínimo e divulga o código. O cliente aplica o cupom ao fechar o pedido. Ótimo para campanhas e para trazer o cliente de volta.' },
      { q: 'O que é o programa de fidelidade?', a: 'É uma forma de recompensar clientes recorrentes — por exemplo, a cada 10 pedidos o cliente ganha um item grátis. Isso transforma clientes ocasionais em clientes fiéis.' },
      { q: 'Posso montar combos?', a: 'Sim. Você cria combos agrupando itens (como lanche + porção + bebida), o que aumenta o ticket médio sem o cliente sentir que gastou mais.' },
      { q: 'Os clientes podem avaliar meu negócio?', a: 'Sim. O Cardápio Turbo tem avaliações de clientes, que aumentam a credibilidade e ajudam novos clientes a decidirem pela compra.' },
    ],
  },
  {
    title: 'Personalização e divulgação',
    items: [
      { q: 'Consigo deixar o cardápio com a cara da minha marca?', a: 'Sim. Você personaliza cores, logo e tema, deixando o cardápio com a identidade visual do seu negócio. No plano Pro, o cardápio fica sem marca d’água.' },
      { q: 'Como funciona o QR Code?', a: 'O sistema gera um QR Code do seu cardápio para você imprimir e colocar na mesa, no balcão, na vitrine e na embalagem dos pedidos. O cliente escaneia e acessa o cardápio na hora.' },
      { q: 'Tenho relatórios de vendas?', a: 'Sim. Você acompanha relatórios com os produtos mais vendidos, visualizações e desempenho do cardápio, ajudando a tomar decisões melhores.' },
      { q: 'Posso cadastrar quantos produtos eu quiser?', a: 'No plano Pro, os produtos e categorias são ilimitados. O plano de teste permite experimentar a estrutura completa antes de assinar.' },
    ],
  },
]

export default function FaqPage() {
  const allItems = GROUPS.flatMap(g => g.items)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: allItems.map(i => ({
          '@type': 'Question',
          name: i.q,
          acceptedAnswer: { '@type': 'Answer', text: i.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://cardapioturbo.com.br' },
          { '@type': 'ListItem', position: 2, name: 'Perguntas Frequentes', item: 'https://cardapioturbo.com.br/faq' },
        ],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">Cardápio Turbo</span>
          </Link>
          <Link href="/register" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            Criar grátis
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-orange-500">Início</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-gray-600 font-medium" aria-current="page">Perguntas Frequentes</li>
          </ol>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Perguntas Frequentes</h1>
        <p className="text-lg text-gray-500 mb-10">Tudo o que o Cardápio Turbo oferece, explicado de forma simples. Não achou sua dúvida? <Link href="/contato" className="text-orange-500 hover:underline">Fale com a gente</Link>.</p>

        <div className="space-y-10">
          {GROUPS.map(group => (
            <section key={group.title}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-orange-500 mb-3">{group.title}</h2>
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
                {group.items.map((item, i) => (
                  <details key={i} className="group px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                      {item.q}
                      <span className="text-orange-500 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                    </summary>
                    <p className="mt-3 text-gray-600 leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Crie seu cardápio digital grátis</h2>
          <p className="text-orange-100 mb-5">7 dias grátis, sem cartão de crédito. Setup em 5 minutos.</p>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 font-bold text-orange-600 hover:bg-orange-50">
            Começar agora
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© 2026 Agência LD Marketing. Todos os direitos reservados.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Link href="/sobre" className="hover:text-orange-500 transition-colors">Sobre</Link>
            <Link href="/contato" className="hover:text-orange-500 transition-colors">Contato</Link>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
            <a href="https://instagram.com/cardapioturboonline" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
