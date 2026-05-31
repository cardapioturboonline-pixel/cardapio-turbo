'use client'

import { use } from 'react'
import { ProductForm } from '@/components/dashboard/ProductForm'
import { useProducts } from '@/lib/hooks/useProducts'
import { useCategories } from '@/lib/hooks/useCategories'
import type { Product } from '@/types'

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { products, updateProduct } = useProducts()
  const { categories } = useCategories()
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Produto não encontrado</p>
      </div>
    )
  }

  return (
    <ProductForm
      categories={categories}
      initialData={product}
      mode="edit"
      onSave={(data) => updateProduct(id, data as Partial<Product>)}
    />
  )
}
