import { ImageResponse } from 'next/og'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
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
          <span style={{ fontSize: '56px', fontWeight: 'bold', color: 'white', display: 'flex' }}>
            Cardápio Turbo
          </span>
        </div>

        <div style={{ display: 'flex', fontSize: '32px', color: 'rgba(255,255,255,0.9)', textAlign: 'center', margin: '0 80px' }}>
          Cardápio digital profissional em menos de 5 minutos
        </div>

        <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px', padding: '12px 28px', color: 'white', fontSize: '22px', fontWeight: '600', display: 'flex' }}>
            ✓ QR Code
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px', padding: '12px 28px', color: 'white', fontSize: '22px', fontWeight: '600', display: 'flex' }}>
            ✓ Pedido via WhatsApp
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px', padding: '12px 28px', color: 'white', fontSize: '22px', fontWeight: '600', display: 'flex' }}>
            ✓ Grátis para começar
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '24px', color: 'rgba(255,255,255,0.7)', marginTop: '48px' }}>
          cardapioturbo.com.br
        </div>
      </div>
    ),
    { ...size }
  )
}
