'use client'

import { useState, useCallback } from 'react'
import type { Category } from '@/types'
import { mockCategories } from '@/lib/mock-data'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [loading, setLoading] = useState(false)

  const createCategory = useCallback(async (data: Omit<Category, 'id' | 'created_at'>) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    const newCat: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    setCategories(prev => [...prev, newCat])
    setLoading(false)
    return newCat
  }, [])

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    setLoading(false)
    return true
  }, [])

  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    setCategories(prev => prev.filter(c => c.id !== id))
    setLoading(false)
    return true
  }, [])

  const reorderCategory = useCallback((id: string, direction: 'up' | 'down') => {
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
