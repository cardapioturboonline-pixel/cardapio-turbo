'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChefHat, Store, Palette, Package, Check, ArrowRight, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/sonner'

const steps = [
  { title: 'Sua loja', description: 'Informações básicas do seu negócio', icon: Store },
  { title: 'Visual', description: 'Identidade visual da sua marca', icon: Palette },
  { title: 'Primeiro produto', description: 'Cadastre seu produto inicial', icon: Package },
]

const businessTypes = ['Hamburgueria', 'Pizzaria', 'Lanchonete', 'Restaurante', 'Cafeteria', 'Sorveteria', 'Bar', 'Outro']
const colorOptions = ['#f97316', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16', '#64748b']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const [info, setInfo] = useState({ name: '', whatsapp: '', city: '', type: '' })
  const [visual, setVisual] = useState({ primaryColor: '#f97316', logoUrl: '' })
  const [product, setProduct] = useState({ name: '', price: '', category: 'Destaque' })

  async function handleFinish() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success('Loja configurada com sucesso!')
    router.push('/dashboard')
  }

  function nextStep() {
    if (step < 2) setStep(s => s + 1)
    else handleFinish()
  }

  const progress = ((step + 1) / 3) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Cardápio Turbo</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vamos configurar sua loja</h1>
          <p className="mt-1 text-sm text-gray-500">Apenas 3 passos rápidos e você estará pronto para vender!</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-gray-900' : 'text-gray-400'}`}>{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            {(() => { const S = steps[step]; return <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50"><S.icon className="h-5 w-5 text-orange-500" /></div> })()}
            <div>
              <h2 className="font-semibold text-gray-900">{steps[step].title}</h2>
              <p className="text-sm text-gray-500">{steps[step].description}</p>
            </div>
          </div>

          {/* Step 1 */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome da loja *</Label>
                <Input placeholder="Ex: Burger House" value={info.name} onChange={e => setInfo(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp *</Label>
                <Input placeholder="(11) 99999-9999" value={info.whatsapp} onChange={e => setInfo(p => ({ ...p, whatsapp: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Cidade</Label>
                <Input placeholder="São Paulo - SP" value={info.city} onChange={e => setInfo(p => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tipo de estabelecimento</Label>
                <div className="grid grid-cols-2 gap-2">
                  {businessTypes.map(t => (
                    <button key={t} type="button" onClick={() => setInfo(p => ({ ...p, type: t }))}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${info.type === t ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-3">
                <Label>Cor principal da marca</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button key={color} type="button" onClick={() => setVisual(p => ({ ...p, primaryColor: color }))}
                      className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${visual.primaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: visual.primaryColor }} />
                  <span className="text-sm text-gray-600">Cor selecionada: <strong>{visual.primaryColor}</strong></span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Logo da loja</Label>
                <label className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-8 cursor-pointer hover:border-orange-300 transition-colors">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error('Imagem muito grande. Máximo 2MB.')
                        return
                      }
                      const url = URL.createObjectURL(file)
                      setVisual(p => ({ ...p, logoUrl: url }))
                    }}
                  />
                  {visual.logoUrl ? (
                    <img src={visual.logoUrl} alt="Logo" className="h-20 w-20 rounded-lg object-cover" />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50">
                        <Package className="h-5 w-5 text-orange-500" />
                      </div>
                      <p className="text-sm text-gray-500">Clique para fazer upload da logo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG até 2MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nome do produto *</Label>
                <Input placeholder="Ex: X-Burguer Clássico" value={product.name} onChange={e => setProduct(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Preço (R$) *</Label>
                <Input type="number" placeholder="29.90" step="0.01" min="0" value={product.price} onChange={e => setProduct(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {['Destaque', 'Lanches', 'Pizzas', 'Bebidas', 'Sobremesas', 'Porções', 'Combos', 'Promoções'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProduct(p => ({ ...p, category: cat }))}
                      className={`rounded-full px-3 py-1 text-sm border transition-colors ${product.category === cat ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <Input placeholder="Ou digite outra categoria..." value={['Destaque','Lanches','Pizzas','Bebidas','Sobremesas','Porções','Combos','Promoções'].includes(product.category) ? '' : product.category} onChange={e => setProduct(p => ({ ...p, category: e.target.value }))} />
              </div>
              <div className="rounded-lg bg-orange-50 p-4 text-sm text-orange-700">
                💡 Você poderá adicionar mais produtos, fotos e detalhes no dashboard!
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => step > 0 ? setStep(s => s - 1) : router.push('/login')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
              {step === 0 ? 'Cancelar' : 'Voltar'}
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Salvando...' : step === 2 ? 'Finalizar' : 'Próximo'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
