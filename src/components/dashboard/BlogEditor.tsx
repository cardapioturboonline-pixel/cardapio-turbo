'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Save, ArrowLeft, ImagePlus, X as XIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/sonner'
import { RichTextEditor } from './RichTextEditor'

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
  cover_image: string
  read_minutes: number
  seo_title: string
  seo_description: string
  keywords: string
  published: boolean
}

const EMPTY: BlogPost = {
  title: '', slug: '', excerpt: '', content: '', category: 'Dicas',
  cover_emoji: '📝', cover_image: '', read_minutes: 5, seo_title: '', seo_description: '', keywords: '', published: true,
}

export function BlogEditor({ initial }: { initial?: Partial<BlogPost> }) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [form, setForm] = useState<BlogPost>({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/blog/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (!res.ok) { toast.error(data.error || 'Erro ao enviar imagem'); return }
    set('cover_image', data.url)
    toast.success('Imagem enviada!')
  }

  function set<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setForm(f => ({ ...f, [key]: value }))
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
          {form.cover_image ? (
            <img src={form.cover_image} alt="" className="h-64 w-full rounded-xl object-cover mb-8" />
          ) : (
            <div className="h-48 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-6xl mb-8">{form.cover_emoji}</div>
          )}
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

          {/* Cover image upload */}
          <div className="space-y-1.5">
            <Label>Imagem de capa (opcional)</Label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
            {form.cover_image ? (
              <div className="relative inline-block">
                <img src={form.cover_image} alt="" className="h-40 w-full max-w-md rounded-xl object-cover border border-gray-200" />
                <button type="button" onClick={() => set('cover_image', '')}
                  className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow-md text-gray-600 hover:text-red-500" title="Remover imagem">
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex flex-col items-center justify-center gap-2 w-full max-w-md h-40 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 transition-colors disabled:opacity-60">
                {uploading ? <Loader2 className="h-7 w-7 animate-spin" /> : <ImagePlus className="h-7 w-7" />}
                <span className="text-sm font-medium">{uploading ? 'Enviando...' : 'Clique para enviar uma foto'}</span>
                <span className="text-xs">PNG, JPG até 5MB</span>
              </button>
            )}
            <p className="text-xs text-gray-400">Se não enviar imagem, será usado o emoji de capa abaixo.</p>
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

          {/* Content — visual editor */}
          <div className="space-y-1.5">
            <Label>Conteúdo do artigo</Label>
            <RichTextEditor value={form.content} onChange={html => set('content', html)} placeholder="Escreva o conteúdo do artigo aqui. Selecione um texto e use os botões para formatar." />
            <p className="text-xs text-gray-400">Dica: selecione um trecho e clique nos botões (Título, Negrito, Lista…) para formatar — igual ao Word.</p>
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
