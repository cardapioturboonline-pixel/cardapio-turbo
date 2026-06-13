'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, ImageIcon, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Pizza, Lock } from 'lucide-react'
import type { Product, Category, Additional, PizzaSize } from '@/types'
import { toast } from '@/components/ui/sonner'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { hasProAccess } from '@/lib/plan'

interface ProductFormProps {
  categories: Category[]
  initialData?: Partial<Product>
  onSave: (data: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views' | 'orders'>) => Promise<unknown>
  mode: 'create' | 'edit'
}

export function ProductForm({ categories, initialData, onSave, mode }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    price: initialData?.price?.toString() ?? '',
    promotional_price: initialData?.promotional_price?.toString() ?? '',
    category_id: initialData?.category_id ?? (categories[0]?.id ?? null) as string | null,
    image_url: initialData?.image_url ?? '',
    is_available: initialData?.is_available ?? true,
    is_featured: initialData?.is_featured ?? false,
    is_combo: initialData?.is_combo ?? false,
    sort_order: initialData?.sort_order ?? 0,
    business_id: initialData?.business_id ?? 'biz-001',
  })
  const [additionals, setAdditionals] = useState<Partial<Additional>[]>(initialData?.additionals ?? [])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { business } = useBusiness()
  const isPro = hasProAccess(business)

  // Modo pizza
  const [isPizza, setIsPizza] = useState<boolean>(!!initialData?.pizza)
  const [sizes, setSizes] = useState<PizzaSize[]>(initialData?.pizza?.sizes ?? [{ name: 'Grande', price: 0 }])
  const [maxFlavors, setMaxFlavors] = useState<number>(initialData?.pizza?.maxFlavors ?? 2)
  const addSize = () => setSizes(prev => [...prev, { name: '', price: 0 }])
  const removeSize = (i: number) => setSizes(prev => prev.filter((_, idx) => idx !== i))
  const updateSize = (i: number, field: keyof PizzaSize, value: string) =>
    setSizes(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: field === 'price' ? (parseFloat(value) || 0) : value } : s))

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx. 5MB)')
      return
    }
    setUploading(true)
    try {
      const data = new FormData()
      data.append('file', file)
      const res = await fetch('/api/products/upload', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok || !json.url) {
        toast.error(json.error || 'Erro ao enviar imagem')
        return
      }
      setForm(p => ({ ...p, image_url: json.url }))
      toast.success('Imagem enviada!')
    } catch {
      toast.error('Erro ao enviar imagem. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  function addAdditional() {
    setAdditionals(prev => [...prev, { name: '', price: 0, is_required: false, max_qty: 1 }])
  }
  function removeAdditional(idx: number) {
    setAdditionals(prev => prev.filter((_, i) => i !== idx))
  }
  function updateAdditional(idx: number, field: string, value: unknown) {
    setAdditionals(prev => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) {
      toast.error('Preencha o nome')
      return
    }
    const cleanSizes = sizes.filter(s => s.name.trim() && s.price > 0)
    if (isPizza) {
      if (cleanSizes.length === 0) {
        toast.error('Cadastre ao menos um tamanho com preço para a pizza')
        return
      }
    } else if (!form.price) {
      toast.error('Preencha o preço')
      return
    }
    // Preço base: pizza usa o menor tamanho (exibido como "a partir de")
    const basePrice = isPizza ? Math.min(...cleanSizes.map(s => s.price)) : parseFloat(form.price)
    // Só inclui o campo pizza quando há config ou quando precisa limpar uma config anterior.
    // Produtos normais (sem pizza) não enviam a chave, evitando erro se a coluna não existir.
    const pizzaField = isPizza
      ? { pizza: { sizes: cleanSizes, maxFlavors } }
      : (initialData?.pizza ? { pizza: null } : {})
    setLoading(true)
    const result = await onSave({
      ...form,
      price: basePrice,
      promotional_price: !isPizza && form.promotional_price ? parseFloat(form.promotional_price) : undefined,
      ...pizzaField,
      additionals: isPizza ? [] : additionals.map((a, i) => ({
        id: `add-new-${i}`,
        product_id: initialData?.id ?? '',
        name: a.name ?? '',
        price: Number(a.price) || 0,
        is_required: a.is_required ?? false,
        max_qty: a.max_qty ?? 1,
      })),
    })
    setLoading(false)
    if (!result) {
      toast.error('Erro ao salvar produto. Tente novamente.')
      return
    }
    toast.success(mode === 'create' ? 'Produto criado!' : 'Produto atualizado!')
    router.push('/dashboard/products')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{mode === 'create' ? 'Novo produto' : 'Editar produto'}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Informações básicas</h2>
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: X-Burguer Clássico" required />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Ingredientes, modo de preparo..." rows={3} />
            </div>
            {!isPizza && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Preço (R$) *</Label>
                  <Input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="29.90" />
                </div>
                <div className="space-y-1.5">
                  <Label>Preço promocional</Label>
                  <Input type="number" step="0.01" min="0" value={form.promotional_price} onChange={e => setForm(p => ({ ...p, promotional_price: e.target.value }))} placeholder="24.90" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <select value={form.category_id ?? ''} onChange={e => setForm(p => ({ ...p, category_id: e.target.value || null }))}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Sem categoria</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Modo Pizza (Pro) */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Pizza className="h-5 w-5 text-orange-500" /> Modo pizza
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">PRO</span>
              </h2>
              <Switch
                checked={isPizza}
                disabled={!isPro}
                onCheckedChange={(v) => {
                  if (!isPro) { toast.error('O modo pizza está disponível no plano Pro'); return }
                  setIsPizza(v)
                }}
              />
            </div>
            {!isPro && (
              <p className="flex items-center gap-1.5 text-sm text-gray-400"><Lock className="h-3.5 w-3.5" /> Disponível no plano Pro</p>
            )}
            {isPizza && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Cadastre os <strong>tamanhos com preço</strong> deste sabor. No cardápio, o cliente escolhe o tamanho e pode montar <strong>meio a meio</strong> (o preço é a média dos dois sabores).</p>
                <div className="space-y-2">
                  {sizes.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input placeholder="Tamanho (ex: Grande)" value={s.name} onChange={e => updateSize(i, 'name', e.target.value)} className="flex-1" />
                      <div className="flex items-center gap-1 w-32 shrink-0">
                        <span className="text-sm text-gray-400">R$</span>
                        <Input type="number" step="0.01" min="0" placeholder="0,00" value={s.price || ''} onChange={e => updateSize(i, 'price', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeSize(i)} className="rounded-md p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 shrink-0">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={addSize} className="flex items-center gap-1.5 text-sm font-medium text-orange-500 hover:text-orange-600">
                    <Plus className="h-4 w-4" /> Adicionar tamanho
                  </button>
                </div>
                <div className="space-y-1.5">
                  <Label>Sabores por pizza</Label>
                  <select value={maxFlavors} onChange={e => setMaxFlavors(parseInt(e.target.value))}
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <option value={1}>Apenas inteira (1 sabor)</option>
                    <option value={2}>Permitir meio a meio (2 sabores)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Additionals */}
          {!isPizza && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Adicionais</h2>
              <button type="button" onClick={addAdditional} className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600">
                <Plus className="h-4 w-4" /> Adicionar
              </button>
            </div>
            {additionals.length === 0 && <p className="text-sm text-gray-400">Nenhum adicional cadastrado</p>}
            {additionals.map((add, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input placeholder="Nome" value={add.name ?? ''} onChange={e => updateAdditional(i, 'name', e.target.value)} className="flex-1" />
                <Input type="number" placeholder="R$" step="0.01" value={add.price ?? ''} onChange={e => updateAdditional(i, 'price', e.target.value)} className="w-24" />
                <button type="button" onClick={() => removeAdditional(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Image */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
            <h2 className="font-semibold text-gray-900">Foto do produto</h2>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) handleFileUpload(f)
                e.target.value = ''
              }}
            />

            {form.image_url ? (
              <div className="relative">
                <img src={form.image_url} alt="preview" className="w-full h-40 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setForm(p => ({ ...p, image_url: '' }))}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  title="Remover imagem"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 cursor-pointer hover:border-orange-300 transition-colors disabled:opacity-60"
            >
              <div className="text-center">
                {uploading ? (
                  <>
                    <Loader2 className="h-8 w-8 text-orange-400 mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-gray-500">Enviando...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">{form.image_url ? 'Trocar imagem' : 'Enviar imagem'}</p>
                    <p className="text-xs text-gray-400">PNG, JPG até 5MB</p>
                  </>
                )}
              </div>
            </button>

            <div className="space-y-1">
              <Label className="text-xs">Ou cole a URL da imagem</Label>
              <Input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." className="text-xs" />
            </div>
          </div>

          {/* Toggles */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Configurações</h2>
            {[
              { key: 'is_available', label: 'Disponível', desc: 'Visível no cardápio' },
              { key: 'is_featured', label: 'Destaque', desc: 'Aparece com badge' },
              { key: 'is_combo', label: 'É um combo', desc: 'Marcado como combo' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <Switch checked={form[key as keyof typeof form] as boolean} onCheckedChange={v => setForm(p => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => router.back()} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
