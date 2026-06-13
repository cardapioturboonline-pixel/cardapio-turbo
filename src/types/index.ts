export type Plan = 'free' | 'pro' | 'business'

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface DeliveryArea {
  name: string
  fee: number
}

export interface Review {
  id: string
  business_id: string
  customer_name?: string
  rating: number
  comment?: string
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'

export interface OrderItemSnapshot {
  name: string
  quantity: number
  price: number
  observations?: string | null
}

export interface Order {
  id: string
  business_id: string
  customer_name?: string
  customer_phone?: string
  order_type?: 'delivery' | 'pickup'
  delivery_address?: string
  neighborhood?: string
  payment_method?: string
  status: OrderStatus
  items?: OrderItemSnapshot[]
  subtotal: number
  discount: number
  delivery_fee?: number
  total: number
  coupon_code?: string
  schedule?: string
  observations?: string
  created_at: string
}

export interface Business {
  id: string
  user_id: string
  name: string
  slug: string
  logo_url?: string
  banner_url?: string
  description?: string
  whatsapp: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  opening_hours?: OpeningHours
  instagram?: string
  facebook?: string
  tiktok?: string
  primary_color: string
  secondary_color: string
  font: string
  theme: string
  layout: 'compact' | 'premium'
  plan: Plan
  trial_ends_at?: string
  is_active: boolean
  show_watermark: boolean
  payment_methods?: string[]
  pix_key?: string
  delivery_areas?: DeliveryArea[]
  loyalty_enabled?: boolean
  loyalty_goal?: number
  loyalty_reward?: string
  custom_domain?: string
  created_at: string
  updated_at: string
}

export interface OpeningHours {
  monday?: DayHours
  tuesday?: DayHours
  wednesday?: DayHours
  thursday?: DayHours
  friday?: DayHours
  saturday?: DayHours
  sunday?: DayHours
}

export interface DayHours {
  open: string
  close: string
  closed: boolean
}

export interface Category {
  id: string
  business_id: string
  name: string
  description?: string
  icon?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  business_id: string
  category_id: string | null
  name: string
  description?: string
  price: number
  promotional_price?: number
  image_url?: string
  is_available: boolean
  is_featured: boolean
  is_combo: boolean
  sort_order: number
  views: number
  orders: number
  additionals?: Additional[]
  pizza?: PizzaConfig | null
  created_at: string
  updated_at: string
}

// Configuração de pizza (modo pizzaria, Pro). Cada sabor (produto) guarda
// seus tamanhos com preço. maxFlavors define quantos sabores cabem (2 = meio a meio).
export interface PizzaSize {
  name: string
  price: number
}
export interface PizzaConfig {
  sizes: PizzaSize[]
  maxFlavors: number
}
// Seleção feita pelo cliente ao montar a pizza no cardápio.
export interface PizzaSelection {
  sizeName: string
  flavors: { id: string; name: string }[]
  unitPrice: number
}

export interface Additional {
  id: string
  product_id: string
  name: string
  price: number
  is_required: boolean
  max_qty: number
}

export interface CartItem {
  product: Product
  quantity: number
  additionals: Additional[]
  observations?: string
  lineId?: string            // id único da linha (pizzas não se agrupam)
  pizza?: PizzaSelection     // presente quando o item é uma pizza montada
}

export interface Coupon {
  id: string
  business_id: string
  code: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  min_order_value?: number
  max_uses?: number
  uses: number
  expires_at?: string
  is_active: boolean
}

export interface Analytics {
  id: string
  business_id: string
  product_id?: string
  event_type: 'view' | 'product_view' | 'cart_add' | 'whatsapp_click'
  created_at: string
  metadata?: Record<string, unknown>
}

export interface Subscription {
  id: string
  user_id: string
  business_id: string
  plan: Plan
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  current_period_end: string
  provider: 'stripe' | 'mercado_pago'
  provider_subscription_id: string
}

export interface DashboardStats {
  total_views: number
  total_whatsapp_clicks: number
  total_products: number
  total_categories: number
  most_viewed_products: Product[]
  views_by_day: { date: string; count: number }[]
  conversion_rate: number
}

export interface InsightRecommendation {
  type: 'no_photo' | 'low_price' | 'low_views' | 'combo_suggestion' | 'promotion'
  title: string
  description: string
  action: string
  product_id?: string
}
