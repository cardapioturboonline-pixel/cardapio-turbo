'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Package, Tag, Megaphone, Palette,
  QrCode, BarChart3, CreditCard, Settings, LogOut,
  ChefHat, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useBusiness } from '@/lib/hooks/useBusiness'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/products', icon: Package, label: 'Produtos' },
  { href: '/dashboard/categories', icon: Tag, label: 'Categorias' },
  { href: '/dashboard/promotions', icon: Megaphone, label: 'Promoções' },
  { href: '/dashboard/customize', icon: Palette, label: 'Personalizar' },
  { href: '/dashboard/qrcode', icon: QrCode, label: 'QR Code' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Relatórios' },
  { href: '/dashboard/plans', icon: CreditCard, label: 'Assinatura' },
  { href: '/dashboard/settings', icon: Settings, label: 'Configurações' },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const { business } = useBusiness()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Usuário',
          email: data.user.email || '',
        })
      }
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const isPro = business?.plan !== 'free'
  const planLabel = isPro ? business!.plan.charAt(0).toUpperCase() + business!.plan.slice(1) : 'Free'
  const planColor = isPro ? 'default' : 'secondary' as 'default' | 'secondary'

  const trialDaysLeft = (() => {
    if (!business?.trial_ends_at || isPro) return null
    const diff = new Date(business.trial_ends_at).getTime() - Date.now()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  })()

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <ChefHat className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-gray-900">Cardápio Turbo</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="rounded-md p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map(item => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={planColor}>Plano {planLabel}</Badge>
          {trialDaysLeft !== null && (
            <span className={`text-xs font-medium ${trialDaysLeft <= 2 ? 'text-red-500' : 'text-orange-500'}`}>
              {trialDaysLeft === 0 ? 'Trial expirado' : `${trialDaysLeft} dia${trialDaysLeft !== 1 ? 's' : ''} de trial`}
            </span>
          )}
        </div>
        {trialDaysLeft !== null && trialDaysLeft <= 3 && (
          <Link href="/dashboard/plans" onClick={onClose}
            className="block w-full rounded-lg bg-orange-500 px-3 py-2 text-center text-xs font-semibold text-white hover:bg-orange-600 transition-colors">
            {trialDaysLeft === 0 ? '🔒 Assinar para continuar' : '⚡ Fazer upgrade Pro'}
          </Link>
        )}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || '...'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
