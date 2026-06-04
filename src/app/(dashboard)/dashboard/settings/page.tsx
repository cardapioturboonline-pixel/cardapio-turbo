'use client'

import { useState, useEffect } from 'react'
import { User, Store, Share2, CreditCard, AlertTriangle, Clock } from 'lucide-react'
import type { OpeningHours, DayHours } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBusiness } from '@/lib/hooks/useBusiness'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/sonner'
import { useRouter } from 'next/navigation'

type Tab = 'profile' | 'store' | 'social' | 'hours' | 'payment' | 'danger'

const DAYS = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const

const DEFAULT_HOURS: OpeningHours = {
  monday: { open: '08:00', close: '22:00', closed: false },
  tuesday: { open: '08:00', close: '22:00', closed: false },
  wednesday: { open: '08:00', close: '22:00', closed: false },
  thursday: { open: '08:00', close: '22:00', closed: false },
  friday: { open: '08:00', close: '22:00', closed: false },
  saturday: { open: '08:00', close: '22:00', closed: false },
  sunday: { open: '08:00', close: '22:00', closed: true },
}

const tabs: Array<{ id: Tab; label: string; icon: React.ElementType }> = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'store', label: 'Loja', icon: Store },
  { id: 'social', label: 'Redes Sociais', icon: Share2 },
  { id: 'hours', label: 'Horários', icon: Clock },
  { id: 'payment', label: 'Pagamentos', icon: CreditCard },
  { id: 'danger', label: 'Zona de Perigo', icon: AlertTriangle },
]

const paymentMethods = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Vale Refeição', 'Vale Alimentação', 'Boleto']

export default function SettingsPage() {
  const router = useRouter()
  const { business, updateBusiness } = useBusiness()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [saving, setSaving] = useState(false)
  const [selectedPayments, setSelectedPayments] = useState<string[]>(['Dinheiro', 'Pix', 'Cartão de Crédito'])
  const [pixKey, setPixKey] = useState('')
  const [openingHours, setOpeningHours] = useState<OpeningHours>(DEFAULT_HOURS)

  // User profile state
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  // Store state
  const [storeName, setStoreName] = useState('')
  const [storeWhatsapp, setStoreWhatsapp] = useState('')
  const [storeCity, setStoreCity] = useState('')

  // Social state
  const [instagram, setInstagram] = useState('')
  const [facebook, setFacebook] = useState('')
  const [tiktok, setTiktok] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name || '')
        setUserEmail(data.user.email || '')
      }
    })
  }, [])

  useEffect(() => {
    if (business) {
      setStoreName(business.name || '')
      setStoreWhatsapp(business.whatsapp || '')
      setStoreCity(business.city || '')
      setInstagram(business.instagram || '')
      setFacebook(business.facebook || '')
      setTiktok(business.tiktok || '')
      if (business.payment_methods?.length) setSelectedPayments(business.payment_methods)
      if (business.pix_key) setPixKey(business.pix_key)
      if (business.opening_hours && Object.keys(business.opening_hours).length > 0) {
        setOpeningHours({ ...DEFAULT_HOURS, ...business.opening_hours })
      }
    }
  }, [business])

  async function handleSaveProfile() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ data: { full_name: userName } })
    setSaving(false)
    if (error) toast.error('Erro ao salvar perfil')
    else toast.success('Perfil salvo!')
  }

  async function handleSaveStore() {
    setSaving(true)
    const ok = await updateBusiness({ name: storeName, whatsapp: storeWhatsapp, city: storeCity })
    setSaving(false)
    if (!ok) { toast.error('Erro ao salvar dados da loja'); return }
    toast.success('Dados da loja salvos!')
  }

  async function handleSaveSocial() {
    setSaving(true)
    const ok = await updateBusiness({ instagram, facebook, tiktok })
    setSaving(false)
    if (!ok) { toast.error('Erro ao salvar redes sociais'); return }
    toast.success('Redes sociais salvas!')
  }

  function togglePayment(method: string) {
    setSelectedPayments(prev => prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method])
  }

  const initials = userName?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || 'U'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Gerencie as configurações da sua conta e loja</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible lg:w-48 shrink-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'} ${tab.id === 'danger' ? '!text-red-500 hover:!bg-red-50' : ''}`}>
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Informações do perfil</h2>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-2xl font-bold">{initials}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input value={userName} onChange={e => setUserName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={userEmail} disabled className="bg-gray-50 text-gray-500" />
                </div>
              </div>
              <button onClick={handleSaveProfile} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Dados da loja</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nome da loja</Label>
                  <Input value={storeName} onChange={e => setStoreName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug (URL)</Label>
                  <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                    <span className="px-3 text-xs text-gray-400 border-r border-gray-200 h-9 flex items-center whitespace-nowrap">/menu/</span>
                    <input value={business?.slug ?? ''} readOnly className="flex-1 px-3 py-2 text-sm focus:outline-none bg-gray-50 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp</Label>
                  <Input value={storeWhatsapp} onChange={e => setStoreWhatsapp(e.target.value)} placeholder="11999999999" />
                </div>
                <div className="space-y-1.5">
                  <Label>Cidade</Label>
                  <Input value={storeCity} onChange={e => setStoreCity(e.target.value)} placeholder="São Paulo - SP" />
                </div>
              </div>
              <button onClick={handleSaveStore} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Redes sociais</h2>
              <div className="space-y-3">
                {[
                  { label: 'Instagram', icon: '📷', placeholder: '@suaconta', value: instagram, set: setInstagram },
                  { label: 'Facebook', icon: '📘', placeholder: 'facebook.com/suapagina', value: facebook, set: setFacebook },
                  { label: 'TikTok', icon: '🎵', placeholder: '@suaconta', value: tiktok, set: setTiktok },
                ].map(social => (
                  <div key={social.label} className="flex items-center gap-3">
                    <span className="text-xl">{social.icon}</span>
                    <div className="flex-1 space-y-1">
                      <Label>{social.label}</Label>
                      <Input placeholder={social.placeholder} value={social.value} onChange={e => social.set(e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveSocial} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          )}

          {activeTab === 'hours' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900">Horários de funcionamento</h2>
              <p className="text-sm text-gray-500">Configure os dias e horários que sua loja está aberta</p>
              <div className="space-y-2">
                {DAYS.map(({ key, label }) => {
                  const day = openingHours[key] as DayHours ?? { open: '08:00', close: '22:00', closed: false }
                  return (
                    <div key={key} className={`flex items-center gap-4 rounded-lg border p-3 ${day.closed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
                      <div className="w-36 shrink-0">
                        <p className={`text-sm font-medium ${day.closed ? 'text-gray-400' : 'text-gray-900'}`}>{label}</p>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer shrink-0">
                        <input type="checkbox" checked={!day.closed}
                          onChange={e => setOpeningHours(prev => ({ ...prev, [key]: { ...day, closed: !e.target.checked } }))}
                          className="rounded border-gray-300 text-orange-500" />
                        <span className="text-xs text-gray-500">{day.closed ? 'Fechado' : 'Aberto'}</span>
                      </label>
                      {!day.closed && (
                        <div className="flex items-center gap-2 flex-1">
                          <input type="time" value={day.open}
                            onChange={e => setOpeningHours(prev => ({ ...prev, [key]: { ...day, open: e.target.value } }))}
                            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                          <span className="text-gray-400 text-sm">até</span>
                          <input type="time" value={day.close}
                            onChange={e => setOpeningHours(prev => ({ ...prev, [key]: { ...day, close: e.target.value } }))}
                            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <button onClick={async () => {
                setSaving(true)
                const ok = await updateBusiness({ opening_hours: openingHours })
                setSaving(false)
                if (!ok) { toast.error('Erro ao salvar horários'); return }
                toast.success('Horários salvos!')
              }} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar horários'}
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
              {/* Pix key */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  🔑 Chave Pix do estabelecimento
                </label>
                <input
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                  className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-400">Quando o cliente selecionar Pix no cardápio, sua chave aparecerá para ele copiar.</p>
              </div>

              <button onClick={async () => {
                setSaving(true)
                const ok = await updateBusiness({ payment_methods: selectedPayments, pix_key: pixKey })
                setSaving(false)
                if (!ok) { toast.error('Erro ao salvar formas de pagamento'); return }
                toast.success('Formas de pagamento salvas!')
              }} disabled={saving} className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
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
                      onClick={async () => {
                        if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return
                        const supabase = createClient()
                        await supabase.auth.signOut()
                        router.push('/login')
                        toast.error('Conta encerrada.')
                      }}
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
