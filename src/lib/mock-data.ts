import type { Business, Category, Product, Analytics, DashboardStats, InsightRecommendation, Coupon } from '@/types'

export const mockBusiness: Business = {
  id: 'biz-001',
  user_id: 'user-001',
  name: 'Burger House',
  slug: 'burger-house',
  logo_url: 'https://placehold.co/200x200/f97316/white?text=BH',
  banner_url: 'https://placehold.co/1200x400/1a1a2e/white?text=Burger+House',
  description: 'Os melhores hambúrgueres artesanais da cidade!',
  whatsapp: '11999999999',
  address: 'Rua das Flores, 123',
  city: 'São Paulo',
  state: 'SP',
  zip_code: '01310-100',
  opening_hours: {
    monday: { open: '11:00', close: '23:00', closed: false },
    tuesday: { open: '11:00', close: '23:00', closed: false },
    wednesday: { open: '11:00', close: '23:00', closed: false },
    thursday: { open: '11:00', close: '23:00', closed: false },
    friday: { open: '11:00', close: '00:00', closed: false },
    saturday: { open: '11:00', close: '00:00', closed: false },
    sunday: { open: '12:00', close: '22:00', closed: false },
  },
  instagram: '@burgerhouse',
  facebook: 'burgerhouse',
  tiktok: '@burgerhouse',
  primary_color: '#f97316',
  secondary_color: '#1a1a2e',
  font: 'Inter',
  theme: 'classic',
  layout: 'premium',
  plan: 'pro',
  trial_ends_at: undefined,
  is_active: true,
  show_watermark: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
}

export const mockCategories: Category[] = [
  { id: 'cat-001', business_id: 'biz-001', name: 'Hambúrgueres', description: 'Artesanais e deliciosos', icon: '🍔', sort_order: 1, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-002', business_id: 'biz-001', name: 'Bebidas', description: 'Refrescantes e geladas', icon: '🥤', sort_order: 2, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-003', business_id: 'biz-001', name: 'Sobremesas', description: 'Para adoçar o dia', icon: '🍰', sort_order: 3, is_active: true, created_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-004', business_id: 'biz-001', name: 'Combos', description: 'Economize mais', icon: '🎁', sort_order: 4, is_active: true, created_at: '2024-01-01T00:00:00Z' },
]

export const mockProducts: Product[] = [
  {
    id: 'prod-001', business_id: 'biz-001', category_id: 'cat-001',
    name: 'Classic Burger', description: 'Blend de 180g, queijo cheddar, alface, tomate e maionese especial', price: 28.90,
    image_url: 'https://placehold.co/400x300/f97316/white?text=Classic+Burger',
    is_available: true, is_featured: true, is_combo: false, sort_order: 1, views: 342, orders: 87,
    additionals: [
      { id: 'add-001', product_id: 'prod-001', name: 'Bacon Extra', price: 4.00, is_required: false, max_qty: 2 },
      { id: 'add-002', product_id: 'prod-001', name: 'Ovo Frito', price: 3.00, is_required: false, max_qty: 1 },
    ],
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-002', business_id: 'biz-001', category_id: 'cat-001',
    name: 'Double Smash', description: 'Dois blends de 90g smashados, queijo americano duplo e molho secreto', price: 38.90,
    promotional_price: 34.90,
    image_url: 'https://placehold.co/400x300/ea580c/white?text=Double+Smash',
    is_available: true, is_featured: true, is_combo: false, sort_order: 2, views: 289, orders: 62,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-003', business_id: 'biz-001', category_id: 'cat-001',
    name: 'Veggie Burger', description: 'Hambúrguer de grão-de-bico, rúcula, tomate seco e maionese de alho', price: 32.90,
    image_url: 'https://placehold.co/400x300/16a34a/white?text=Veggie+Burger',
    is_available: true, is_featured: false, is_combo: false, sort_order: 3, views: 145, orders: 28,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-004', business_id: 'biz-001', category_id: 'cat-001',
    name: 'Crispy Chicken', description: 'Frango crocante empanado, coleslaw, picles e molho barbecue', price: 33.90,
    image_url: 'https://placehold.co/400x300/d97706/white?text=Crispy+Chicken',
    is_available: true, is_featured: false, is_combo: false, sort_order: 4, views: 201, orders: 45,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-005', business_id: 'biz-001', category_id: 'cat-001',
    name: 'BBQ Monster', description: 'Blend 220g, onion rings, queijo gouda, bacon crocante e molho BBQ', price: 42.90,
    image_url: 'https://placehold.co/400x300/b91c1c/white?text=BBQ+Monster',
    is_available: false, is_featured: false, is_combo: false, sort_order: 5, views: 98, orders: 19,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-006', business_id: 'biz-001', category_id: 'cat-002',
    name: 'Coca-Cola 350ml', description: 'Gelada e refrescante', price: 7.00,
    image_url: 'https://placehold.co/400x300/dc2626/white?text=Coca-Cola',
    is_available: true, is_featured: false, is_combo: false, sort_order: 1, views: 267, orders: 189,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-007', business_id: 'biz-001', category_id: 'cat-002',
    name: 'Milkshake de Chocolate', description: 'Cremoso, feito com sorvete artesanal', price: 18.90,
    image_url: 'https://placehold.co/400x300/7c3aed/white?text=Milkshake',
    is_available: true, is_featured: false, is_combo: false, sort_order: 2, views: 176, orders: 54,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-008', business_id: 'biz-001', category_id: 'cat-002',
    name: 'Suco Natural 500ml', description: 'Laranja, limão ou maracujá. Sem açúcar ou com açúcar.', price: 12.00,
    image_url: 'https://placehold.co/400x300/f59e0b/white?text=Suco',
    is_available: true, is_featured: false, is_combo: false, sort_order: 3, views: 89, orders: 31,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-009', business_id: 'biz-001', category_id: 'cat-003',
    name: 'Brownie com Sorvete', description: 'Brownie quentinho com sorvete de baunilha e calda de chocolate', price: 19.90,
    image_url: 'https://placehold.co/400x300/92400e/white?text=Brownie',
    is_available: true, is_featured: false, is_combo: false, sort_order: 1, views: 134, orders: 42,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-010', business_id: 'biz-001', category_id: 'cat-003',
    name: 'Pudim de Leite', description: 'Receita tradicional com calda de caramelo', price: 14.90,
    image_url: 'https://placehold.co/400x300/fbbf24/white?text=Pudim',
    is_available: true, is_featured: false, is_combo: false, sort_order: 2, views: 67, orders: 18,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-011', business_id: 'biz-001', category_id: 'cat-004',
    name: 'Combo Classic', description: 'Classic Burger + Batata Frita M + Coca-Cola 350ml', price: 49.90,
    promotional_price: 44.90,
    image_url: 'https://placehold.co/400x300/f97316/white?text=Combo+Classic',
    is_available: true, is_featured: true, is_combo: true, sort_order: 1, views: 312, orders: 78,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: 'prod-012', business_id: 'biz-001', category_id: 'cat-004',
    name: 'Combo Família', description: '2 Classic Burgers + 1 Double Smash + 4 Coca-Colas', price: 99.90,
    promotional_price: 89.90,
    image_url: 'https://placehold.co/400x300/ea580c/white?text=Combo+Familia',
    is_available: true, is_featured: false, is_combo: true, sort_order: 2, views: 198, orders: 33,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-06-01T00:00:00Z',
  },
]

export const mockCoupons: Coupon[] = [
  { id: 'coup-001', business_id: 'biz-001', code: 'BEMVINDO10', discount_type: 'percentage', discount_value: 10, min_order_value: 30, max_uses: 100, uses: 23, expires_at: '2025-12-31', is_active: true },
  { id: 'coup-002', business_id: 'biz-001', code: 'FRETE5', discount_type: 'fixed', discount_value: 5, min_order_value: 50, uses: 8, is_active: true },
]

export const mockStats: DashboardStats = {
  total_views: 2847,
  total_whatsapp_clicks: 342,
  total_products: 12,
  total_categories: 4,
  most_viewed_products: mockProducts.sort((a, b) => b.views - a.views).slice(0, 5),
  views_by_day: [
    { date: '2024-06-24', count: 234 },
    { date: '2024-06-25', count: 312 },
    { date: '2024-06-26', count: 289 },
    { date: '2024-06-27', count: 401 },
    { date: '2024-06-28', count: 356 },
    { date: '2024-06-29', count: 478 },
    { date: '2024-06-30', count: 521 },
  ],
  conversion_rate: 12.02,
}

export const mockInsights: InsightRecommendation[] = [
  {
    type: 'promotion',
    title: 'Oportunidade de promoção detectada',
    description: 'Classic Burger e Combo Classic estão em alta. Crie uma promoção relâmpago para turbinar as vendas!',
    action: 'Criar promoção',
  },
  {
    type: 'combo_suggestion',
    title: 'Crie combos para aumentar o ticket médio',
    description: 'Combos aumentam o valor médio dos pedidos em até 40%. Experimente criar novos combos!',
    action: 'Criar combo',
  },
  {
    type: 'no_photo',
    title: '1 produto sem foto',
    description: 'BBQ Monster não tem foto. Produtos com foto vendem 3x mais.',
    action: 'Adicionar foto',
    product_id: 'prod-005',
  },
]
