'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Coupon } from '@/types'
import { createClient } from '@/lib/supabase/client'

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [businessId, setBusinessId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: biz } = await supabase.from('businesses').select('id').eq('user_id', user.id).single()
      if (!biz) { setLoading(false); return }
      setBusinessId(biz.id)
      const { data } = await supabase.from('coupons').select('*').eq('business_id', biz.id).order('created_at', { ascending: false })
      setCoupons(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const createCoupon = useCallback(async (data: Omit<Coupon, 'id' | 'uses'>) => {
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
    const { data: newCoupon, error } = await supabase
      .from('coupons')
      .insert({ ...data, business_id: bizId, uses: 0 })
      .select()
      .single()
    if (error) { console.error('[createCoupon]', error); return null }
    if (newCoupon) setCoupons(prev => [newCoupon, ...prev])
    return newCoupon
  }, [businessId])

  const updateCoupon = useCallback(async (id: string, data: Partial<Coupon>) => {
    const supabase = createClient()
    const { error } = await supabase.from('coupons').update(data).eq('id', id)
    if (!error) setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    return !error
  }, [])

  const deleteCoupon = useCallback(async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('coupons').delete().eq('id', id)
    if (!error) setCoupons(prev => prev.filter(c => c.id !== id))
    return !error
  }, [])

  return { coupons, loading, createCoupon, updateCoupon, deleteCoupon }
}
