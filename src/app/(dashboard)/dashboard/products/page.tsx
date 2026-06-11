'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Copy, Star, Package } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useProducts } from '@/lib/hooks/useProducts'
import { useCategories } from '@/lib/hooks/useCategories'
import { formatCurrency } from '@/lib/utils/format'
import { toast } from '@/components/ui/sonner'

export default function ProductsPage() {
  const { products, atProductLimit, deleteProduct, duplicateProduct, toggleAvailability } = useProducts()
  const { categories } = useCategories()
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || p.category_id === filterCat
    return matchSearch && matchCat
  })

  async function handleDelete(id: string) {
    if (!confirm('Excluir este produto?')) return
    await deleteProduct(id)
    toast.success('Produto excluído!')
  }

  async function handleDuplicate(id: string) {
    await duplicateProduct(id)
    toast.success('Produto duplicado!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500">{products.length} produtos cadastrados</p>
        </div>
        {atProductLimit ? (
          <Link href="/dashboard/plans" className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-orange-500 hover:text-white transition-colors">
            🔒 Limite de 15 produtos · Fazer upgrade
          </Link>
        ) : (
          <Link href="/dashboard/products/new" className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
            <Plus className="h-4 w-4" /> Novo produto
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Buscar produto..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <Package className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="font-medium text-gray-900">Nenhum produto encontrado</h3>
          <p className="text-sm text-gray-500 mt-1">Crie seu primeiro produto para começar</p>
          <Link href="/dashboard/products/new" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            <Plus className="h-4 w-4" /> Criar produto
          </Link>
        </div>
      )}

      {/* Products list */}
      <div className="space-y-2">
        {filtered.map(product => {
          const category = categories.find(c => c.id === product.category_id)
          return (
            <div key={product.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow">
              {/* Thumb */}
              <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-orange-50">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl">🍔</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  {product.is_featured && <Badge variant="default"><Star className="h-3 w-3 mr-1" />Destaque</Badge>}
                  {product.is_combo && <Badge variant="secondary">Combo</Badge>}
                  {!product.is_available && <Badge variant="destructive">Indisponível</Badge>}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                  {category && <span className="text-xs text-gray-500">{category.name}</span>}
                  <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {product.promotional_price ? (
                      <>
                        <span className="text-orange-500">{formatCurrency(product.promotional_price)}</span>
                        <span className="text-gray-400 line-through ml-1 text-xs">{formatCurrency(product.price)}</span>
                      </>
                    ) : formatCurrency(product.price)}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{product.views} views</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={product.is_available} onCheckedChange={() => toggleAvailability(product.id)} />
                <Link href={`/dashboard/products/${product.id}/edit`} className="rounded-md p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                  <Edit className="h-4 w-4" />
                </Link>
                <button onClick={() => handleDuplicate(product.id)} className="rounded-md p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="rounded-md p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
