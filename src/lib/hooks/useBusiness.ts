'use client'

import { useState, useCallback } from 'react'
import type { Business } from '@/types'
import { mockBusiness } from '@/lib/mock-data'

export function useBusiness() {
  const [business, setBusiness] = useState<Business>(mockBusiness)
  const [loading, setLoading] = useState(false)

  const updateBusiness = useCallback(async (data: Partial<Business>) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    setBusiness(prev => ({ ...prev, ...data }))
    setLoading(false)
    return true
  }, [])

  return { business, loading, updateBusiness }
}
