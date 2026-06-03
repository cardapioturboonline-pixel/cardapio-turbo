'use client'

import { useState, useEffect } from 'react'
import { Palette, Check, Lock } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { toast } from '@/components/ui/sonner'

const colorOptions = ['#f97316', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#64748b']

const themes = [
  { id: 'classic', name: 'Clássico', desc: 'Design limpo e tradicional', free: true },
  { id: 'modern', name: 'Moderno', desc: 'Layout contemporâneo', free: true },
  { id: 'dark', name: 'Escuro', desc: 'Tema dark premium', free: false },
]

const fonts = [
  { id: 'Inter', name: 'Inter', desc: 'Moderna e legível' },
  { id: 'Playfair Display', name: 'Playfair', desc: 'Elegante e sofisticada' },
  { id: 'Nunito', name: 'Nunito', desc: 'Amigável e arredondada' },
]

export default function CustomizePage() {
  const { business, updateBusiness } = useBusiness()
  const isPro = business !== null && business?.plan !== 'free'
  const [color, setColor] = useState('#f97316')
  const [theme, setTheme] = useState('classic')
  const [font, setFont] = useState('Inter')
  const [layout, setLayout] = useState<'compact' | 'premium'>('premium')
  const [showWatermark, setShowWatermark] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (business) {
      setColor(business.primary_color ?? '#f97316')
      setTheme(business.theme ?? 'classic')
      setFont(business.font ?? 'Inter')
      setLayout((business.layout as 'compact' | 'premium') ?? 'premium')
      setShowWatermark(business.show_watermark ?? true)
    }
  }, [business])

  async function handleSave() {
    setSaving(true)
    const ok = await updateBusiness({ primary_color: color, theme, font, layout, show_watermark: showWatermark })
    setSaving(false)
    if (!ok) { toast.error('Erro ao salvar. Tente novamente.'); return }
    toast.success('Personalização salva!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Personalizar cardápio</h1>
        <p className="text-sm text-gray-500">Customize a aparência do seu cardápio digital</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Color */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-gray-900">Cor principal</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)}
                className="relative h-10 w-10 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                style={{ backgroundColor: c }}
              >
                {color === c && <Check className="absolute inset-0 m-auto h-5 w-5 text-white" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: color }} />
            <div>
              <p className="text-sm font-medium text-gray-900">Cor selecionada</p>
              <p className="text-xs text-gray-500">{color}</p>
            </div>
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Tema</h2>
          <div className="space-y-2">
            {themes.map(t => (
              <button key={t.id} type="button"
                onClick={() => { if (t.free || isPro) setTheme(t.id) }}
                className={`w-full flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${theme === t.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'} ${!t.free && !isPro ? 'opacity-60' : ''}`}
              >
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    {t.name}
                    {!t.free && !isPro && <span className="flex items-center gap-1 text-xs font-medium text-orange-500"><Lock className="h-3 w-3" />Pro</span>}
                  </p>
                  <p className="text-xs text-gray-500">{t.desc}</p>
                </div>
                {theme === t.id && <Check className="h-5 w-5 text-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Tipografia</h2>
          <div className="space-y-2">
            {fonts.map(f => (
              <button key={f.id} type="button" onClick={() => setFont(f.id)}
                className={`w-full flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${font === f.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div>
                  <p className="font-medium text-gray-900">{f.name}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
                {font === f.id && <Check className="h-5 w-5 text-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Layout do cardápio</h2>
          <div className="space-y-3">
            {[
              { id: 'compact', name: 'Compacto', desc: 'Lista de produtos sem imagens (carrega rápido)', free: true },
              { id: 'premium', name: 'Premium', desc: 'Grid com fotos grandes e destaque visual', free: false },
            ].map(l => (
              <button key={l.id} type="button"
                onClick={() => { if (l.free || isPro) setLayout(l.id as 'compact' | 'premium') }}
                className={`w-full flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${layout === l.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'} ${!l.free && !isPro ? 'opacity-60' : ''}`}
              >
                <div>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    {l.name}
                    {!l.free && !isPro && <span className="flex items-center gap-1 text-xs font-medium text-orange-500"><Lock className="h-3 w-3" />Pro</span>}
                  </p>
                  <p className="text-xs text-gray-500">{l.desc}</p>
                </div>
                {layout === l.id && <Check className="h-5 w-5 text-orange-500" />}
              </button>
            ))}
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  Marca d&apos;água
                  {!isPro && <span className="flex items-center gap-1 text-xs font-medium text-orange-500"><Lock className="h-3 w-3" />Pro</span>}
                </p>
                <p className="text-xs text-gray-500">Exibir &quot;Powered by Cardápio Turbo&quot;</p>
              </div>
              <Switch checked={!showWatermark} onCheckedChange={v => isPro && setShowWatermark(!v)} disabled={!isPro} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
          {saving ? 'Salvando...' : 'Salvar personalização'}
        </button>
      </div>
    </div>
  )
}
