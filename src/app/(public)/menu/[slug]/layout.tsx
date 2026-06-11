import type { ReactNode } from 'react'

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Fontes selecionáveis na personalização do cardápio */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="min-h-screen">{children}</div>
    </>
  )
}
