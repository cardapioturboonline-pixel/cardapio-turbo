import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Cardápio Turbo — Cardápio Digital para Lanchonetes'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '40px',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
          }}>
            ⚡
          </div>
          <span style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: 'white',
          }}>
            Cardápio Turbo
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: '32px',
          color: 'rgba(255,255,255,0.9)',
          textAlign: 'center',
          margin: '0 80px',
          lineHeight: 1.4,
        }}>
          Cardápio digital profissional em menos de 5 minutos
        </p>

        {/* Features */}
        <div style={{
          display: 'flex',
          gap: '32px',
          marginTop: '48px',
        }}>
          {['QR Code', 'Pedido via WhatsApp', 'Grátis para começar'].map((f) => (
            <div key={f} style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50px',
              padding: '12px 28px',
              color: 'white',
              fontSize: '22px',
              fontWeight: '600',
            }}>
              ✓ {f}
            </div>
          ))}
        </div>

        {/* URL */}
        <p style={{
          fontSize: '24px',
          color: 'rgba(255,255,255,0.7)',
          marginTop: '48px',
        }}>
          cardapioturbo.com.br
        </p>
      </div>
    ),
    { ...size }
  )
}
