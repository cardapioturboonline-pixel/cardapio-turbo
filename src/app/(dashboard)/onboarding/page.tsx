'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChefHat, Store, Palette, Package, Check, ArrowRight, ArrowLeft,
  Plus, Trash2, Phone, MapPin, Tag, Sparkles, Eye, Copy, ExternalLink
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/sonner'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

/* ─── types ─── */
interface ProductDraft { name: string; price: string; category: string }

/* ─── constants ─── */
const BUSINESS_TYPES = ['Hamburgueria', 'Pizzaria', 'Lanchonete', 'Restaurante', 'Cafeteria', 'Sorveteria', 'Bar', 'Outro']
const COLOR_OPTIONS   = ['#f97316','#ef4444','#8b5cf6','#3b82f6','#10b981','#f59e0b','#ec4899','#06b6d4','#84cc16','#64748b']
const BASE_CATEGORIES = ['Destaque','Lanches','Pizzas','Bebidas','Sobremesas','Porções','Combos','Promoções']

const STEPS = [
  { id: 0, title: 'Sua loja',      desc: 'Nome, contato e tipo de negócio', icon: Store },
  { id: 1, title: 'Visual',        desc: 'Cor e logo da sua marca',          icon: Palette },
  { id: 2, title: 'Cardápio',      desc: 'Categorias do seu menu',           icon: Tag },
  { id: 3, title: 'Produtos',      desc: 'Adicione seus primeiros itens',    icon: Package },
  { id: 4, title: 'Tudo pronto!',  desc: 'Seu cardápio está no ar',          icon: Sparkles },
]

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ─── phone mask ─── */
function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2)  return `(${d}`
  if (d.length <= 6)  return `(${d.slice(0,2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`
}

/* ══════════════════════════════════════════════ */
export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [bizId, setBizId]     = useState<string | null>(null)
  const [menuUrl, setMenuUrl] = useState('')
  const [copied, setCopied]   = useState(false)

  /* step 0 */
  const [info, setInfo] = useState({ name: '', whatsapp: '', city: '', type: '' })
  /* step 1 */
  const [color, setColor]   = useState('#f97316')
  const [logoUrl, setLogoUrl] = useState('')
  /* step 2 */
  const [cats, setCats] = useState<string[]>(['Destaque', 'Bebidas'])
  const [newCat, setNewCat] = useState('')
  /* step 3 */
  const [products, setProducts] = useState<ProductDraft[]>([
    { name: '', price: '', category: 'Destaque' },
  ])

  /* ── check if already has business ── */
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', data.user.id).single()
      if (biz) router.replace('/dashboard')
    })
  }, [router])

  /* ── helpers ── */
  function addProduct() {
    setProducts(p => [...p, { name: '', price: '', category: cats[0] ?? 'Destaque' }])
  }
  function removeProduct(i: number) {
    setProducts(p => p.filter((_, idx) => idx !== i))
  }
  function updateProduct(i: number, field: keyof ProductDraft, val: string) {
    setProducts(p => p.map((pr, idx) => idx === i ? { ...pr, [field]: val } : pr))
  }
  function toggleCat(cat: string) {
    setCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }
  function addCustomCat() {
    const v = newCat.trim()
    if (!v || cats.includes(v)) return
    setCats(p => [...p, v])
    setNewCat('')
  }

  /* ── validation per step ── */
  function validate() {
    if (step === 0) {
      if (!info.name.trim())     { toast.error('Digite o nome da loja'); return false }
      if (!info.whatsapp.trim()) { toast.error('Digite o WhatsApp'); return false }
      if (!info.type)            { toast.error('Selecione o tipo de estabelecimento'); return false }
    }
    if (step === 2) {
      if (cats.length === 0) { toast.error('Adicione ao menos 1 categoria'); return false }
    }
    if (step === 3) {
      const filled = products.filter(p => p.name.trim() && p.price)
      if (filled.length === 0) { toast.error('Adicione ao menos 1 produto com nome e preço'); return false }
    }
    return true
  }

  /* ── save to Supabase ── */
  async function saveAll() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { toast.error('Sessão expirada'); router.push('/login'); return }

      const slug = `${slugify(info.name)}-${Math.random().toString(36).slice(2, 6)}`

      const { data: biz, error: bizErr } = await supabase.from('businesses').insert({
        user_id:       user.id,
        name:          info.name.trim(),
        slug,
        whatsapp:      info.whatsapp.replace(/\D/g, ''),
        city:          info.city.trim(),
        primary_color: color,
        logo_url:      logoUrl || null,
        plan:          'free',
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active:     true,
        show_watermark: true,
        description:   '',
        font:          'Inter',
        theme:         'classic',
        layout:        'premium',
      }).select().single()

      if (bizErr) throw bizErr
      setBizId(biz.id)

      /* categories */
      const catRecords = await Promise.all(
        cats.map((name, i) =>
          supabase.from('categories').insert({ business_id: biz.id, name, sort_order: i + 1, is_active: true }).select().single()
        )
      )
      const catMap: Record<string, string> = {}
      catRecords.forEach(({ data: c }) => { if (c) catMap[c.name] = c.id })

      /* products */
      const validProducts = products.filter(p => p.name.trim() && p.price)
      await Promise.all(
        validProducts.map((p, i) =>
          supabase.from('products').insert({
            business_id:  biz.id,
            category_id:  catMap[p.category] ?? null,
            name:         p.name.trim(),
            price:        parseFloat(p.price),
            is_available: true,
            is_featured:  i === 0,
            is_combo:     false,
            views:        0,
            orders:       0,
            sort_order:   i + 1,
          })
        )
      )

      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      setMenuUrl(`${origin}/menu/${slug}`)
      setStep(4)
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + (err?.message || 'tente novamente'))
    } finally {
      setLoading(false)
    }
  }

  function next() {
    if (!validate()) return
    if (step === 3) { saveAll(); return }
    setStep(s => s + 1)
  }
  function back() { setStep(s => s - 1) }

  function copyLink() {
    navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copiado!')
  }

  const progress = step >= 4 ? 100 : ((step + 1) / (STEPS.length - 1)) * 100

  /* ══════════ RENDER ══════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">

        {/* ── Logo ── */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 shadow-lg shadow-orange-200">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Cardápio Turbo</span>
          </div>
        </div>

        {/* ── Step indicator (hidden on step 4) ── */}
        {step < 4 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              {STEPS.slice(0, 4).map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                    i < step  ? 'bg-green-500 text-white shadow-sm' :
                    i === step ? 'bg-orange-500 text-white shadow-md shadow-orange-200 scale-110' :
                                 'bg-gray-200 text-gray-400'
                  }`}>
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:block ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* ── Card ── */}
        <div className="rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">

          {/* Card header */}
          {step < 4 && (
            <div className="px-8 pt-8 pb-4 border-b border-gray-100">
              {(() => { const S = STEPS[step]; const Icon = S.icon; return (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 border border-orange-100">
                    <Icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">{S.title}</h2>
                    <p className="text-sm text-gray-500">{S.desc}</p>
                  </div>
                </div>
              )})()}
            </div>
          )}

          <div className="px-8 py-6">

            {/* ════ STEP 0 — Informações ════ */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Nome da loja *</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="Ex: Burger House, La Pizza..."
                      value={info.name}
                      onChange={e => setInfo(p => ({ ...p, name: e.target.value }))}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>WhatsApp para receber pedidos *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="(11) 99999-9999"
                      value={info.whatsapp}
                      onChange={e => setInfo(p => ({ ...p, whatsapp: maskPhone(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Cidade</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-9"
                      placeholder="São Paulo - SP"
                      value={info.city}
                      onChange={e => setInfo(p => ({ ...p, city: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Tipo de estabelecimento *</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {BUSINESS_TYPES.map(t => (
                      <button key={t} type="button"
                        onClick={() => setInfo(p => ({ ...p, type: t }))}
                        className={`rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                          info.type === t
                            ? 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm'
                            : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50'
                        }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════ STEP 1 — Visual ════ */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Cor principal da marca</Label>
                  <div className="flex flex-wrap gap-3">
                    {COLOR_OPTIONS.map(c => (
                      <button key={c} type="button"
                        onClick={() => setColor(c)}
                        className="h-9 w-9 rounded-full border-[3px] transition-all hover:scale-110 focus:outline-none"
                        style={{ backgroundColor: c, borderColor: color === c ? '#111' : 'transparent' }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 border border-gray-100">
                    <div className="h-8 w-8 rounded-full shadow-sm" style={{ backgroundColor: color }} />
                    <div>
                      <p className="text-xs text-gray-500">Cor selecionada</p>
                      <p className="text-sm font-semibold text-gray-900">{color}</p>
                    </div>
                    <div className="ml-auto text-xs text-gray-400">Será usada em botões e destaques</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Logo da loja <span className="text-gray-400 font-normal text-xs">(opcional)</span></Label>
                  <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all group">
                    <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        if (file.size > 2 * 1024 * 1024) { toast.error('Máximo 2MB'); return }
                        setLogoUrl(URL.createObjectURL(file))
                      }}
                    />
                    {logoUrl ? (
                      <div className="flex flex-col items-center gap-3">
                        <img src={logoUrl} alt="Logo" className="h-24 w-24 rounded-2xl object-cover shadow-md" />
                        <span className="text-xs text-orange-500 font-medium group-hover:underline">Trocar logo</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 group-hover:bg-orange-200 transition-colors">
                          <Package className="h-6 w-6 text-orange-500" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">Clique para fazer upload</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP — até 2MB</p>
                      </div>
                    )}
                  </label>
                  {!logoUrl && (
                    <p className="text-xs text-gray-400 text-center">Você pode adicionar a logo depois no painel</p>
                  )}
                </div>
              </div>
            )}

            {/* ════ STEP 2 — Categorias ════ */}
            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Selecione as categorias do seu cardápio. Você pode adicionar mais depois.</p>

                <div className="grid grid-cols-2 gap-2">
                  {BASE_CATEGORIES.map(cat => (
                    <button key={cat} type="button"
                      onClick={() => toggleCat(cat)}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                        cats.includes(cat)
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-200 text-gray-600 hover:border-orange-300'
                      }`}>
                      <div className={`h-4 w-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        cats.includes(cat) ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                        {cats.includes(cat) && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <Label className="text-xs text-gray-500 mb-2 block">Adicionar categoria personalizada</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Frutos do Mar, Massas..."
                      value={newCat}
                      onChange={e => setNewCat(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomCat())}
                    />
                    <button type="button" onClick={addCustomCat}
                      className="shrink-0 rounded-lg border border-orange-500 text-orange-500 px-3 hover:bg-orange-50 transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {cats.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {cats.map(cat => (
                      <span key={cat} className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        {cat}
                        <button type="button" onClick={() => setCats(p => p.filter(c => c !== cat))}>
                          <Trash2 className="h-3 w-3 hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ════ STEP 3 — Produtos ════ */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Adicione seus primeiros produtos. Você pode completar depois.</p>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {products.map((p, i) => (
                    <div key={i} className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">PRODUTO {i + 1}</span>
                        {products.length > 1 && (
                          <button type="button" onClick={() => removeProduct(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs">Nome *</Label>
                          <Input
                            placeholder="Ex: X-Burguer Clássico"
                            value={p.name}
                            onChange={e => updateProduct(i, 'name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Preço (R$) *</Label>
                          <Input
                            type="number"
                            placeholder="29.90"
                            step="0.01"
                            min="0"
                            value={p.price}
                            onChange={e => updateProduct(i, 'price', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Categoria</Label>
                          <select
                            value={p.category}
                            onChange={e => updateProduct(i, 'category', e.target.value)}
                            className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            {cats.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addProduct}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all">
                  <Plus className="h-4 w-4" /> Adicionar mais um produto
                </button>

                <p className="text-xs text-center text-gray-400">
                  💡 Adicione fotos e mais detalhes depois, no painel de produtos
                </p>
              </div>
            )}

            {/* ════ STEP 4 — Sucesso ════ */}
            {step === 4 && (
              <div className="py-4 text-center space-y-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 shadow-lg shadow-green-200">
                    <Check className="h-12 w-12 text-white" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Cardápio no ar! 🎉</h2>
                  <p className="mt-2 text-gray-500">Seu cardápio digital está pronto para receber pedidos.</p>
                </div>

                <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 text-left space-y-3">
                  <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Seu link do cardápio</p>
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-orange-200 px-3 py-2">
                    <span className="flex-1 text-sm text-gray-700 truncate">{menuUrl}</span>
                    <button onClick={copyLink} className="shrink-0 text-orange-500 hover:text-orange-700">
                      <Copy className="h-4 w-4" />
                    </button>
                    <a href={menuUrl} target="_blank" rel="noreferrer" className="shrink-0 text-orange-500 hover:text-orange-700">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  {copied && <p className="text-xs text-green-600 font-medium">✓ Link copiado!</p>}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { icon: '📱', label: 'Compartilhe no WhatsApp' },
                    { icon: '📌', label: 'Imprima o QR Code' },
                    { icon: '🛒', label: 'Receba pedidos' },
                  ].map((item, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <p className="text-xs text-gray-600 font-medium leading-tight">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors shadow-md shadow-orange-200"
                  >
                    Ir para o painel →
                  </button>
                  <a href={menuUrl} target="_blank" rel="noreferrer"
                    className="w-full rounded-xl border border-orange-500 px-6 py-3 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors text-center flex items-center justify-center gap-2">
                    <Eye className="h-4 w-4" /> Ver meu cardápio
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ── Footer actions ── */}
          {step < 4 && (
            <div className="px-8 pb-8 flex items-center justify-between">
              <button type="button"
                onClick={step === 0 ? () => router.push('/login') : back}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {step === 0 ? 'Cancelar' : 'Voltar'}
              </button>

              <button type="button" onClick={next} disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-all shadow-md shadow-orange-200 hover:shadow-orange-300">
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    {step === 3 ? 'Finalizar' : 'Próximo'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── bottom hint ── */}
        {step < 4 && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Passo {step + 1} de 4 • Você pode editar tudo depois no painel
          </p>
        )}
      </div>
    </div>
  )
}
