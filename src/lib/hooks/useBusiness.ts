'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Business } from '@/types'
import { createClient } from '@/lib/supabase/client'

export function useBusiness() {
  const [business, setBusiness] = useState<Business | null>(null)
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
    if (!error) setBusiness(prev => prev ? { ...prev, ...data } : prev)
    setLoading(false)
    return !error
  }, [])

  return { business, loading, updateBusiness }
}
