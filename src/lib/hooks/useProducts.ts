'use client'

import { useState, useCallback } from 'react'
import type { Product } from '@/types'
import { mockProducts } from '@/lib/mock-data'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(false)

  const createProduct = useCallback(async (data: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views' | 'orders'>) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      views: 0,
      orders: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setProducts(prev => [...prev, newProduct])
    setLoading(false)
    return newProduct
  }, [])

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p))
    setLoading(false)
    return true
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setProducts(prev => prev.filter(p => p.id !== id))
    setLoading(false)
    return true
  }, [])

  const toggleAvailability = useCallback(async (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_available: !p.is_available } : p))
    return true
  }, [])

  const duplicateProduct = useCallback(async (id: string) => {
    const product = products.find(p => p.id === id)
    if (!product) return null
    return createProduct({
      ...product,
      name: `${product.name} (cópia)`,
    })
  }, [products, createProduct])

  return { products, loading, createProduct, updateProduct, deleteProduct, toggleAvailability, duplicateProduct }
}
