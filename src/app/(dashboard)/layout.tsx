'use client'

import { useState, useEffect } from 'react'
import { Menu, AlertTriangle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/client'

const GRACE_PERIOD_DAYS = 30

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [banner, setBanner] = useState<{ type: 'warning' | 'danger'; message: string; daysLeft?: number } | null>(null)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkBusiness() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: biz } = await supabase
        .from('businesses')
        .select('id, plan, trial_ends_at')
        .eq('user_id', user.id)
        .maybeSingle()
      if (!biz) { router.replace('/onboarding'); return }

      // Check trial/grace period
      if (biz.plan === 'free' && biz.trial_ends_at) {
        const trialEnd = new Date(biz.trial_ends_at).getTime()
        const now = Date.now()
        const graceEnd = trialEnd + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
        const daysUntilGraceEnd = Math.ceil((graceEnd - now) / (1000 * 60 * 60 * 24))
        const trialExpired = now > trialEnd

        if (trialExpired && now < graceEnd) {
          // Trial expired, inside grace period — warn but allow access
          setBanner({
            type: daysUntilGraceEnd <= 7 ? 'danger' : 'warning',
            message: `Seu período gratuito expirou. Você tem mais ${daysUntilGraceEnd} dia${daysUntilGraceEnd !== 1 ? 's' : ''} de acesso antes de perder os dados.`,
            daysLeft: daysUntilGraceEnd,
          })
        } else if (now >= graceEnd) {
          // Grace period also expired — show hard warning (still don't block)
          setBanner({
            type: 'danger',
            message: 'Seu período de graça expirou. Assine o plano Pro para continuar usando todos os recursos.',
          })
        }
      }
    }
    checkBusiness()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64 min-w-0">
        {/* Mobile topbar */}
        <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="rounded-md p-1 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-900">Cardápio Turbo</span>
        </div>

        {/* Grace period banner */}
        {banner && !bannerDismissed && (
          <div className={`flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium ${
            banner.type === 'danger'
              ? 'bg-red-500 text-white'
              : 'bg-amber-400 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{banner.message}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/dashboard/plans"
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  banner.type === 'danger'
                    ? 'bg-white text-red-600 hover:bg-red-50'
                    : 'bg-amber-900 text-white hover:bg-amber-800'
                }`}>
                Assinar Pro
              </Link>
              <button onClick={() => setBannerDismissed(true)} className="opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
