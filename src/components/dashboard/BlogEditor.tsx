'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bold, Heading2, Heading3, List, Link2, Eye, Save, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/sonner'

const EMOJIS = ['📝', '📱', '🍔', '📲', '🍕', '🥤', '🔥', '💡', '🚀', '⭐', '📊', '💬', '🎯', '🍟', '🥗']
const CATEGORIES = ['Dicas', 'Guias', 'Receitas', 'Marketing', 'Gestão', 'Novidades']

interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  cover_emoji: string
  read_minutes: number
  seo_title: string
  seo_description: string
  keywords: string
  published: boolean
}

const EMPTY: BlogPost = {
  title: '', slug: '', excerpt: '', content: '', category: 'Dicas',
  cover_emoji: '📝', read_minutes: 5, seo_title: '', seo_description: '', keywords: '', published: true,
}

export function BlogEditor({ initial }: { initial?: Partial<BlogPost> }) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [form, setForm] = useState<BlogPost>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  function set<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function wrapSelection(before: string, after: string) {
    const ta = contentRef.current
    if (!ta) return
    const start = ta.selectionStart, end = ta.selectionEnd
    const selected = form.content.slice(start, end) || 'texto'
    const next = form.content.slice(0, start) + before + selected + after + form.content.slice(end)
    set('content', next)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + selected.length) }, 0)
  }

  async function handleSave() {
    if (!form.title.trim()) { toast.error('Informe o título'); return }
    if (!form.content.trim()) { toast.error('Escreva o conteúdo'); return }
    setSaving(true)
    const method = isEdit ? 'PATCH' : 'POST'
    const res = await fetch('/api/admin/blog', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEdit ? { ...form, id: initial!.id } : form),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { toast.error(data.error || 'Erro ao salvar'); return }
    toast.success(isEdit ? 'Artigo atualizado!' : 'Artigo publicado!')
    router.push('/dashboard/blog')
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/dashboard/blog')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        <div className="flex gap-2">
          <button onClick={() => setShowPreview(p => !p)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Eye className="h-4 w-4" /> {showPreview ? 'Editar' : 'Pré-visualizar'}
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Publicar')}
          </button>
        </div>
      </div>

      {showPreview ? (
        <article className="rounded-xl border border-gray-200 bg-white p-8">
          <span className="text-sm font-semibold text-orange-500">{form.category}</span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">{form.title || 'Título do artigo'}</h1>
          <p className="text-lg text-gray-500 mb-6">{form.excerpt}</p>
          <div className="h-48 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-6xl mb-8">{form.cover_emoji}</div>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: form.content }} />
        </article>
      ) : (
        <div className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Como criar um cardápio digital" />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label>URL (slug) — deixe vazio para gerar automático</Label>
            <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
              <span className="px-3 text-xs text-gray-400 bg-gray-50 h-10 flex items-center border-r border-gray-200 whitespace-nowrap">/blog/</span>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="gerado-do-titulo" className="flex-1 px-3 text-sm focus:outline-none h-10" />
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="h-10 w-full rounded-lg border border-gray-200 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Tempo (min)</Label>
              <Input type="number" min={1} value={form.read_minutes} onChange={e => set('read_minutes', parseInt(e.target.value) || 5)} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label>Emoji de capa</Label>
              <div className="flex flex-wrap gap-1">
                {EMOJIS.map(em => (
                  <button key={em} type="button" onClick={() => set('cover_emoji', em)}
                    className={`h-9 w-9 rounded-lg text-lg ${form.cover_emoji === em ? 'bg-orange-100 ring-2 ring-orange-500' : 'hover:bg-gray-100'}`}>{em}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-1.5">
            <Label>Resumo (aparece na listagem e no Google)</Label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={2}
              placeholder="Resumo curto e atrativo do artigo..." className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
          </div>

          {/* Content with toolbar */}
          <div className="space-y-1.5">
            <Label>Conteúdo do artigo</Label>
            <div className="flex gap-1 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 p-1.5">
              <button type="button" onClick={() => wrapSelection('<h2>', '</h2>')} title="Título" className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white"><Heading2 className="h-4 w-4" /></button>
              <button type="button" onClick={() => wrapSelection('<h3>', '</h3>')} title="Subtítulo" className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white"><Heading3 className="h-4 w-4" /></button>
              <button type="button" onClick={() => wrapSelection('<strong>', '</strong>')} title="Negrito" className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white"><Bold className="h-4 w-4" /></button>
              <button type="button" onClick={() => wrapSelection('<ul>\n<li>', '</li>\n</ul>')} title="Lista" className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white"><List className="h-4 w-4" /></button>
              <button type="button" onClick={() => wrapSelection('<a href="/register">', '</a>')} title="Link" className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white"><Link2 className="h-4 w-4" /></button>
              <button type="button" onClick={() => wrapSelection('<p>', '</p>')} title="Parágrafo" className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-white">¶ Parágrafo</button>
            </div>
            <textarea ref={contentRef} value={form.content} onChange={e => set('content', e.target.value)} rows={16}
              placeholder="<p>Escreva o conteúdo do artigo aqui. Use os botões acima para formatar.</p>"
              className="w-full rounded-b-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y" />
            <p className="text-xs text-gray-400">Dica: selecione um texto e clique nos botões para formatar. O conteúdo usa HTML simples.</p>
          </div>

          {/* SEO */}
          <details className="rounded-lg border border-gray-200 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-gray-700">⚙️ Configurações de SEO (avançado)</summary>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5">
                <Label>Título SEO (aparece na aba e no Google)</Label>
                <Input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} placeholder="Deixe vazio para usar o título do artigo" />
              </div>
              <div className="space-y-1.5">
                <Label>Meta descrição</Label>
                <textarea value={form.seo_description} onChange={e => set('seo_description', e.target.value)} rows={2}
                  placeholder="Deixe vazio para usar o resumo" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
              </div>
              <div className="space-y-1.5">
                <Label>Palavras-chave (separadas por vírgula)</Label>
                <Input value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="cardápio digital, lanchonete, qr code" />
              </div>
            </div>
          </details>

          {/* Published toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="rounded border-gray-300 text-orange-500" />
            <span className="text-sm text-gray-700">Publicar imediatamente (desmarque para salvar como rascunho)</span>
          </label>
        </div>
      )}
    </div>
  )
}
