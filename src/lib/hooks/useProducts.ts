'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Product } from '@/types'
import { createClient } from '@/lib/supabase/client'

const FREE_PRODUCT_LIMIT = 15

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [plan, setPlan] = useState<string>('free')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: biz } = await supabase
        .from('businesses')
        .select('id, plan')
        .eq('user_id', user.id)
        .single()
      if (!biz) { setLoading(false); return }
      setBusinessId(biz.id)
      setPlan(biz.plan ?? 'free')
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', biz.id)
        .order('sort_order', { ascending: true })
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const createProduct = useCallback(async (data: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'views' | 'orders'>) => {
    const supabase = createClient()
    let bizId = businessId
    if (!bizId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { console.error('[createProduct] user not authenticated'); return null }
      const { data: biz, error: bizError } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
      if (!biz) { console.error('[createProduct] business not found for user', user.id, bizError); return null }
      bizId = biz.id
      setBusinessId(bizId)
    }
    // Enforce Free plan limit
    const currentPlan = (await supabase.from('businesses').select('plan').eq('id', bizId).single()).data?.plan ?? 'free'
    if (currentPlan === 'free' && products.length >= FREE_PRODUCT_LIMIT) {
      return { limitReached: true }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { additionals: _additionals, ...insertData } = data as typeof data & { additionals?: unknown }
    const { data: newProduct, error } = await supabase
      .from('products')
      .insert({ ...insertData, business_id: bizId, views: 0, orders: 0 })
      .select()
      .single()
    if (error) console.error('[createProduct] insert error:', error)
    if (!error && newProduct) setProducts(prev => [...prev, newProduct])
    return newProduct
  }, [businessId])

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { additionals: _additionals, ...updateData } = data as typeof data & { additionals?: unknown }
    const { error } = await supabase.from('products').update(updateData).eq('id', id)
    if (!error) setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
    return !error
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) setProducts(prev => prev.filter(p => p.id !== id))
    return !error
  }, [])

  const toggleAvailability = useCallback(async (id: string) => {
    const product = products.find(p => p.id === id)
    if (!product) return false
    return updateProduct(id, { is_available: !product.is_available })
  }, [products, updateProduct])

  const duplicateProduct = useCallback(async (id: string) => {
    const product = products.find(p => p.id === id)
    if (!product) return null
    const { id: _, created_at, updated_at, views, orders, ...rest } = product
    return createProduct({ ...rest, name: `${product.name} (cópia)` })
  }, [products, createProduct])

  const atProductLimit = plan === 'free' && products.length >= FREE_PRODUCT_LIMIT

  return { products, loading, plan, atProductLimit, createProduct, updateProduct, deleteProduct, toggleAvailability, duplicateProduct }
}
