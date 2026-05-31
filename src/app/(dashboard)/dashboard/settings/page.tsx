'use client'

import { useState } from 'react'
import { User, Store, Share2, CreditCard, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockBusiness } from '@/lib/mock-data'
import { toast } from '@/components/ui/sonner'

type Tab = 'profile' | 'store' | 'social' | 'payment' | 'danger'

const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'store', label: 'Loja', icon: Store },
  { id: 'social', label: 'Redes Sociais', icon: Share2 },
  { id: 'payment', label: 'Pagamentos', icon: CreditCard },
  { id: 'danger', label: 'Zona de Perigo', icon: AlertTriangle },
]

const paymentMethods = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Vale Refeição', 'Vale Alimentação', 'Boleto']

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saving, setSaving] = useState(false)
  const [selectedPayments, setSelectedPayments] = useState(['Dinheiro', 'Pix', 'Cartão de Crédito'])

  async function handleSave() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    toast.success('Configurações salvas!')
  }

  function togglePayment(method: string) {
    setSelectedPayments(prev => prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Gerencie as configurações da sua conta e loja</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs sidebar */}
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible lg:w-48 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'} ${tab.id === 'danger' ? 'text-red-500 hover:bg-red-50' : ''}`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Informações do perfil</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold">U</div>
                <button className="text-sm text-orange-500 hover:underline">Alterar foto</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Nome</Label><Input defaultValue="Usuário Demo" /></div>
                <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue="demo@exemplo.com" /></div>
              </div>
              <div className="space-y-1.5"><Label>Senha atual</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="space-y-1.5"><Label>Nova senha</Label><Input type="password" placeholder="••••••••" /></div>
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Dados da loja</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Nome da loja</Label><Input defaultValue={mockBusiness.name} /></div>
                <div className="space-y-1.5">
                  <Label>Slug (URL)</Label>
                  <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                    <span className="px-3 bg-gray-50 text-xs text-gray-400 border-r border-gray-200 h-9 flex items-center">cardapioturbo.com/menu/</span>
                    <input defaultValue={mockBusiness.slug} className="flex-1 px-3 py-2 text-sm focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-1.5"><Label>WhatsApp</Label><Input defaultValue={mockBusiness.whatsapp} /></div>
                <div className="space-y-1.5"><Label>Cidade</Label><Input defaultValue={mockBusiness.city} /></div>
                <div className="sm:col-span-2 space-y-1.5"><Label>Endereço completo</Label><Input defaultValue={mockBusiness.address} /></div>
              </div>
              <h3 className="font-medium text-gray-900 mt-4">Horário de funcionamento</h3>
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-16 text-sm text-gray-600">{day}</span>
                  <Input type="time" defaultValue="11:00" className="w-28" />
                  <span className="text-gray-400">—</span>
                  <Input type="time" defaultValue="23:00" className="w-28" />
                </div>
              ))}
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Redes sociais</h2>
              <div className="space-y-3">
                {[
                  { label: 'Instagram', icon: '📷', placeholder: '@suaconta', defaultValue: mockBusiness.instagram },
                  { label: 'Facebook', icon: '📘', placeholder: 'facebook.com/suapagina', defaultValue: mockBusiness.facebook },
                  { label: 'TikTok', icon: '🎵', placeholder: '@suaconta', defaultValue: mockBusiness.tiktok },
                ].map(social => (
                  <div key={social.label} className="flex items-center gap-3">
                    <span className="text-xl">{social.icon}</span>
                    <div className="flex-1 space-y-1">
                      <Label>{social.label}</Label>
                      <Input placeholder={social.placeholder} defaultValue={social.defaultValue ?? ''} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Formas de pagamento aceitas</h2>
              <p className="text-sm text-gray-500">Selecione as formas de pagamento que você aceita</p>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map(method => (
                  <label key={method} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-orange-300 transition-colors">
                    <input type="checkbox" checked={selectedPayments.includes(method)} onChange={() => togglePayment(method)} className="rounded border-gray-300 text-orange-500" />
                    <span className="text-sm text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
              <button onClick={handleSave} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-red-600">Zona de Perigo</h2>
              <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-medium text-red-900">Excluir conta</h3>
                    <p className="text-sm text-red-700 mt-1">Esta ação é irreversível. Todos os seus dados serão excluídos permanentemente.</p>
                    <button
                      onClick={() => { if (confirm('Tem certeza? Esta ação não pode ser desfeita.')) toast.error('Conta excluída (demo)') }}
                      className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      Excluir minha conta
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
