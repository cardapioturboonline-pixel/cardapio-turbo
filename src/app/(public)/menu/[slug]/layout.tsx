import type { ReactNode } from 'react'

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
