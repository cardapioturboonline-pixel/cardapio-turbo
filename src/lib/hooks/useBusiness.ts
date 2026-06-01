'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Business } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { mockBusiness } from '@/lib/mock-data'

export function useBusiness() {
  const [business, setBusiness] = useState<Business>(mockBusiness)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single()
      if (data) setBusiness(data)
      setLoading(false)
    }
    load()
  }, [])

  const updateBusiness = useCallback(async (data: Partial<Business>) => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return false }
    const { error } = await supabase
      .from('businesses')
      .update(data)
      .eq('user_id', user.id)
    if (!error) setBusiness(prev => ({ ...prev, ...data }))
    setLoading(false)
    return !error
  }, [])

  return { business, loading, updateBusiness }
}
