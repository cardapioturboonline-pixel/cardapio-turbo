import type { Metadata } from 'next'
import Link from 'next/link'
import { Zap, Clock, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Blog Cardápio Turbo — Dicas, Receitas e Guias para seu Negócio',
  description: 'Conteúdo gratuito sobre cardápio digital, receitas, QR Code, gestão de lanchonete e dicas para vender mais. Aprenda a profissionalizar seu negócio de alimentação.',
  keywords: 'blog cardápio digital, dicas lanchonete, receitas, qr code restaurante, gestão de restaurante, vender mais alimentação',
  alternates: { canonical: 'https://cardapioturbo.com.br/blog' },
  openGraph: {
    title: 'Blog Cardápio Turbo',
    description: 'Dicas, receitas e guias para o seu negócio de alimentação vender mais.',
    url: 'https://cardapioturbo.com.br/blog',
    type: 'website',
  },
}

export const revalidate = 3600 // revalida a cada 1h

interface Post {
  slug: string
  title: string
  excerpt: string
  category: string
  cover_emoji: string
  cover_image: string | null
  read_minutes: number
  published_at: string
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, excerpt, category, cover_emoji, cover_image, read_minutes, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const list = (posts ?? []) as Post[]

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
          <Link href="/register" className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            Criar grátis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block rounded-full bg-orange-100 text-orange-600 px-4 py-1 text-sm font-semibold mb-4">Blog</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Conteúdo para o seu negócio crescer</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Dicas, receitas e guias práticos sobre cardápio digital, gestão de lanchonete e como vender mais no seu restaurante.
          </p>
        </div>
      </header>

      {/* Posts grid */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {list.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Em breve, novos conteúdos por aqui!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all">
                {post.cover_image ? (
                  <img src={post.cover_image} alt={post.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-5xl">
                    {post.cover_emoji}
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <span className="text-xs font-semibold text-orange-500 mb-2">{post.category}</span>
                  <h2 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-orange-600 transition-colors">{post.title}</h2>
                  <p className="text-sm text-gray-500 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.read_minutes} min de leitura</span>
                    <span className="flex items-center gap-1 text-orange-500 font-medium">Ler <ArrowRight className="h-3 w-3" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* CTA */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Pronto para criar seu cardápio digital?</h2>
          <p className="text-orange-100 mb-6">Comece grátis e receba pedidos pelo WhatsApp hoje mesmo.</p>
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
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/termos" className="hover:text-white">Termos</Link>
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
