'use client'

import { useState } from 'react'
import { Plus, ChevronUp, ChevronDown, Edit, Trash2, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useCategories } from '@/lib/hooks/useCategories'
import { useProducts } from '@/lib/hooks/useProducts'
import { toast } from '@/components/ui/sonner'

export default function CategoriesPage() {
  const { categories, createCategory, updateCategory, deleteCategory, reorderCategory } = useCategories()
  const { products } = useProducts()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '🍽', business_id: 'biz-001', sort_order: 0, is_active: true })

  function productCount(catId: string) {
    return products.filter(p => p.category_id === catId).length
  }

  function startEdit(id: string) {
    const cat = categories.find(c => c.id === id)
    if (!cat) return
    setForm({ name: cat.name, description: cat.description ?? '', icon: cat.icon ?? '🍽', business_id: cat.business_id, sort_order: cat.sort_order, is_active: cat.is_active })
    setEditId(id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name) { toast.error('Informe o nome da categoria'); return }
    if (editId) {
      await updateCategory(editId, form)
      toast.success('Categoria atualizada!')
    } else {
      await createCategory({ ...form, sort_order: categories.length + 1 })
      toast.success('Categoria criada!')
    }
    setShowForm(false)
    setEditId(null)
    setForm({ name: '', description: '', icon: '🍽', business_id: 'biz-001', sort_order: 0, is_active: true })
  }

  async function handleDelete(id: string) {
    const count = productCount(id)
    if (count > 0 && !confirm(`Esta categoria tem ${count} produto(s). Excluir mesmo assim?`)) return
    await deleteCategory(id)
    toast.success('Categoria excluída!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-sm text-gray-500">{categories.length} categorias cadastradas</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null) }} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus className="h-4 w-4" /> Nova categoria
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">{editId ? 'Editar categoria' : 'Nova categoria'}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Ícone (emoji)</Label>
              <Input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="w-20" />
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label>Nome *</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Hambúrgueres" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Descrição</Label>
            <Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Breve descrição..." />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">Salvar</button>
            <button onClick={() => { setShowForm(false); setEditId(null) }} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
          </div>
        </div>
      )}

      {/* List */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Tag className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="font-medium text-gray-900">Nenhuma categoria</h3>
          <p className="text-sm text-gray-500 mt-1">Crie categorias para organizar seus produtos</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
              <span className="text-2xl">{cat.icon ?? '🍽'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{cat.name}</h3>
                  <Badge variant="secondary">{productCount(cat.id)} produtos</Badge>
                  {!cat.is_active && <Badge variant="destructive">Inativa</Badge>}
                </div>
                {cat.description && <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => reorderCategory(cat.id, 'up')} disabled={idx === 0} className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button onClick={() => reorderCategory(cat.id, 'down')} disabled={idx === categories.length - 1} className="rounded p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30">
                  <ChevronDown className="h-4 w-4" />
                </button>
                <Switch checked={cat.is_active} onCheckedChange={v => updateCategory(cat.id, { is_active: v })} />
                <button onClick={() => startEdit(cat.id)} className="rounded-md p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="rounded-md p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
