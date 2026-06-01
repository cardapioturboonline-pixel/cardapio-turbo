'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, ImageIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import type { Product, Category, Additional } from '@/types'
import { toast } from '@/components/ui/sonner'

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
    category_id: initialData?.category_id ?? (categories[0]?.id ?? ''),
    image_url: initialData?.image_url ?? '',
    is_available: initialData?.is_available ?? true,
    is_featured: initialData?.is_featured ?? false,
    is_combo: initialData?.is_combo ?? false,
    sort_order: initialData?.sort_order ?? 0,
    business_id: initialData?.business_id ?? 'biz-001',
  })
  const [additionals, setAdditionals] = useState<Partial<Additional>[]>(initialData?.additionals ?? [])

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
    if (!form.name || !form.price) {
      toast.error('Preencha nome e preço')
      return
    }
    setLoading(true)
    const result = await onSave({
      ...form,
      price: parseFloat(form.price),
      promotional_price: form.promotional_price ? parseFloat(form.promotional_price) : undefined,
      additionals: additionals.map((a, i) => ({
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Preço (R$) *</Label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="29.90" required />
              </div>
              <div className="space-y-1.5">
                <Label>Preço promocional</Label>
                <Input type="number" step="0.01" min="0" value={form.promotional_price} onChange={e => setForm(p => ({ ...p, promotional_price: e.target.value }))} placeholder="24.90" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Additionals */}
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
        </div>

        <div className="space-y-6">
          {/* Image */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
            <h2 className="font-semibold text-gray-900">Foto do produto</h2>
            {form.image_url && (
              <img src={form.image_url} alt="preview" className="w-full h-40 object-cover rounded-lg" />
            )}
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-8 cursor-pointer hover:border-orange-300 transition-colors">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Upload de imagem</p>
                <p className="text-xs text-gray-400">PNG, JPG até 2MB</p>
              </div>
            </div>
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
