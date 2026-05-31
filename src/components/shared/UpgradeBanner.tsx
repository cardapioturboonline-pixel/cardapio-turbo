import Link from 'next/link'
import { Zap } from 'lucide-react'

interface UpgradeBannerProps {
  title?: string
  description?: string
}

export function UpgradeBanner({
  title = 'Desbloqueie todo o potencial do Cardápio Turbo',
  description = 'Faça upgrade para o plano Pro e tenha acesso a relatórios avançados, cupons, temas premium e muito mais.',
}: UpgradeBannerProps) {
  return (
    <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
          <Zap className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-orange-100">{description}</p>
        </div>
        <Link
          href="/dashboard/plans"
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
        >
          Fazer upgrade
        </Link>
      </div>
    </div>
  )
}
