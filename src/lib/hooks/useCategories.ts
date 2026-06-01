'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Category } from '@/types'
import { createClient } from '@/lib/supabase/client'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: biz } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', user.id)
        .single()
      if (!biz) { setLoading(false); return }
      setBusinessId(biz.id)
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('business_id', biz.id)
        .order('sort_order', { ascending: true })
      setCategories(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'created_at'>) => {
    const supabase = createClient()
    let bizId = businessId
    if (!bizId) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
      if (!biz) return null
      bizId = biz.id
      setBusinessId(bizId)
    }
    const { data: newCat, error } = await supabase
      .from('categories')
      .insert({ ...data, business_id: bizId })
      .select()
      .single()
    if (!error && newCat) setCategories(prev => [...prev, newCat])
    return newCat
  }, [businessId])

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    const supabase = createClient()
    const { error } = await supabase.from('categories').update(data).eq('id', id)
    if (!error) setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    return !error
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) setCategories(prev => prev.filter(c => c.id !== id))
    return !error
  }, [])

  const reorderCategory = useCallback(async (id: string, direction: 'up' | 'down') => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === id)
      if (idx === -1) return prev
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const arr = [...prev]
      ;[arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]]
      return arr.map((c, i) => ({ ...c, sort_order: i + 1 }))
    })
  }, [])

  return { categories, loading, createCategory, updateCategory, deleteCategory, reorderCategory }
}
