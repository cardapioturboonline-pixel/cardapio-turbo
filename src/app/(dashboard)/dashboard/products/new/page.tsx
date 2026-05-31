'use client'

import { ProductForm } from '@/components/dashboard/ProductForm'
import { useProducts } from '@/lib/hooks/useProducts'
import { useCategories } from '@/lib/hooks/useCategories'
import type { Product } from '@/types'

export default function NewProductPage() {
  const { createProduct } = useProducts()
  const { categories } = useCategories()

  return (
    <ProductForm
      categories={categories}
      mode="create"
      onSave={(data) => createProduct(data as Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views' | 'orders'>)}
    />
  )
}
