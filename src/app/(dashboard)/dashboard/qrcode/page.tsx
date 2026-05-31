'use client'

import { useState } from 'react'
import { QrCode, Copy, Download, ExternalLink, Lock } from 'lucide-react'
import QRCode from 'react-qr-code'
import { mockBusiness } from '@/lib/mock-data'
import { toast } from '@/components/ui/sonner'

export default function QRCodePage() {
  const isPro = mockBusiness.plan !== 'free'
  const menuUrl = `https://cardapioturbo.com/menu/${mockBusiness.slug}`
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText(menuUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copiado!')
  }

  function downloadQR() {
    const svg = document.getElementById('qrcode-svg')
    if (!svg) return
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    canvas.width = 300
    canvas.height = 300
    img.onload = () => {
      ctx?.drawImage(img, 0, 0)
      const a = document.createElement('a')
      a.download = `cardapio-${mockBusiness.slug}-qr.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
    toast.success('QR Code baixado!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">QR Code</h1>
        <p className="text-sm text-gray-500">Gere e baixe o QR Code do seu cardápio</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* QR Code */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 flex flex-col items-center space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-inner border border-gray-100">
            <QRCode
              id="qrcode-svg"
              value={menuUrl}
              size={200}
              fgColor={mockBusiness.primary_color}
            />
          </div>

          <div className="w-full space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-3">
              <span className="flex-1 text-sm text-gray-600 truncate">{menuUrl}</span>
              <button onClick={copyLink} className={`shrink-0 text-sm font-medium transition-colors ${copied ? 'text-green-500' : 'text-orange-500 hover:text-orange-600'}`}>
                <Copy className="h-4 w-4" />
              </button>
              <a href={menuUrl} target="_blank" rel="noreferrer" className="shrink-0 text-gray-400 hover:text-orange-500">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={downloadQR} className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4" /> Baixar PNG
              </button>
              <button onClick={() => toast.success('PDF gerado!')} className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
                <Download className="h-4 w-4" /> Baixar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Info + Pro */}
        <div className="space-y-4">
          {/* Instructions */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Como usar</h2>
            <div className="space-y-3">
              {[
                { n: '1', title: 'Imprima o QR Code', desc: 'Baixe e imprima em papel A4 ou cartão' },
                { n: '2', title: 'Coloque em destaque', desc: 'Mesas, balcão, vitrine e redes sociais' },
                { n: '3', title: 'Cliente escaneia', desc: 'Com a câmera do celular e faz o pedido' },
                { n: '4', title: 'Pedido no WhatsApp', desc: 'Você recebe o pedido formatado direto no app' },
              ].map(step => (
                <div key={step.n} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">{step.n}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro feature */}
          <div className={`rounded-xl border p-6 ${isPro ? 'border-orange-200 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">QR Code com logo</h3>
              {!isPro && <span className="flex items-center gap-1 text-xs font-medium text-orange-500"><Lock className="h-3 w-3" />Pro</span>}
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {isPro ? 'Você tem acesso ao QR Code com sua logo integrada.' : 'No plano Pro você pode gerar QR Codes com a sua logo integrada, deixando mais profissional.'}
            </p>
            {!isPro && (
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                Fazer upgrade para Pro
              </button>
            )}
            {isPro && (
              <button className="rounded-lg border border-orange-500 px-4 py-2 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors">
                Personalizar QR Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
