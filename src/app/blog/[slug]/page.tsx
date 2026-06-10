import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Zap, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FAQ_BY_SLUG } from '@/lib/blog-faqs'

export const revalidate = 3600

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  cover_emoji: string
  cover_image: string | null
  read_minutes: number
  seo_title: string | null
  seo_description: string | null
  keywords: string | null
  published_at: string
  updated_at: string
}

async function getPost(slug: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()
  return (data as Post) ?? null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Artigo não encontrado — Cardápio Turbo' }

  const url = `https://cardapioturbo.com.br/blog/${post.slug}`
  return {
    title: post.seo_title || `${post.title} — Cardápio Turbo`,
    description: post.seo_description || post.excerpt,
    keywords: post.keywords || undefined,
    alternates: { canonical: url },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      url,
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      ...(post.cover_image ? { images: [{ url: post.cover_image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  // Related posts
  const supabase = await createClient()
  const { data: related } = await supabase
    .from('blog_posts')
    .select('slug, title, category, cover_emoji, read_minutes')
    .eq('published', true)
    .neq('slug', post.slug)
    .limit(3)

  // Increment views (fire and forget)
  supabase.rpc('increment_post_views', { p_slug: post.slug }).then(() => {}, () => {})

  const postUrl = `https://cardapioturbo.com.br/blog/${post.slug}`
  const faqs = FAQ_BY_SLUG[post.slug] ?? []
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...(faqs.length ? [{
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }] : []),
      {
        '@type': 'Article',
        headline: post.title,
        description: post.seo_description || post.excerpt,
        image: post.cover_image ? [post.cover_image] : undefined,
        articleSection: post.category,
        keywords: post.keywords || undefined,
        inLanguage: 'pt-BR',
        author: { '@type': 'Organization', name: post.author, url: 'https://cardapioturbo.com.br' },
        publisher: {
          '@type': 'Organization',
          name: 'Cardápio Turbo',
          logo: { '@type': 'ImageObject', url: 'https://cardapioturbo.com.br/icon.png' },
        },
        datePublished: post.published_at,
        dateModified: post.updated_at,
        mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://cardapioturbo.com.br' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://cardapioturbo.com.br/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
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

      <article className="max-w-3xl mx-auto px-4 py-10">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-orange-500">Início</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/blog" className="hover:text-orange-500">Blog</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-gray-600 font-medium truncate max-w-[60vw]" aria-current="page">{post.title}</li>
          </ol>
        </nav>
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar ao blog
        </Link>

        <header className="mb-8">
          <span className="text-sm font-semibold text-orange-500">{post.category}</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mt-2 mb-4">{post.title}</h1>
          <p className="text-lg text-gray-500 leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-4 mt-5 text-sm text-gray-400 border-b border-gray-100 pb-6">
            <span>{post.author}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.read_minutes} min de leitura</span>
          </div>
        </header>

        {/* Cover */}
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-56 sm:h-80 w-full rounded-2xl object-cover mb-10" />
        ) : (
          <div className="h-56 sm:h-72 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-7xl mb-10">
            {post.cover_emoji}
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Perguntas frequentes</h2>
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
              {faqs.map((f, i) => (
                <details key={i} className="group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-gray-900">
                    {f.q}
                    <span className="text-orange-500 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Inline CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Crie seu cardápio digital grátis</h2>
          <p className="text-orange-100 mb-5">QR Code + pedidos no WhatsApp em menos de 5 minutos.</p>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 font-bold text-orange-600 hover:bg-orange-50">
            Começar agora <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </article>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-16">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Continue lendo</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r: { slug: string; title: string; category: string; cover_emoji: string; read_minutes: number }) => (
              <Link key={r.slug} href={`/blog/${r.slug}`}
                className="group rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-orange-200 transition-all">
                <div className="text-3xl mb-2">{r.cover_emoji}</div>
                <span className="text-xs font-semibold text-orange-500">{r.category}</span>
                <h3 className="text-sm font-bold text-gray-900 leading-snug mt-1 group-hover:text-orange-600">{r.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <span>© 2026 Agência LD Marketing</span>
          <div className="flex gap-5 flex-wrap justify-center">
            <Link href="/sobre" className="hover:text-white">Sobre</Link>
            <Link href="/contato" className="hover:text-white">Contato</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <a href="https://instagram.com/cardapioturboonline" target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
            <Link href="/termos" className="hover:text-white">Termos</Link>
            <Link href="/privacidade" className="hover:text-white">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
