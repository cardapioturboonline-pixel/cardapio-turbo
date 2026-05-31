import type { ReactNode } from 'react'
import { ChefHat } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
              <ChefHat className="h-8 w-8 text-orange-500" />
            </div>
            <span className="text-2xl font-bold text-white">Cardápio Turbo</span>
          </Link>
        </div>
        <div className="rounded-2xl bg-white shadow-2xl p-8">
          {children}
        </div>
        <p className="mt-6 text-center text-sm text-orange-100">
          © 2024 Cardápio Turbo. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
