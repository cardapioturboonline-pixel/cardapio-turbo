import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, Additional, PizzaSelection } from '@/types'

// Identidade da linha do carrinho: pizzas usam lineId (nunca agrupam),
// produtos normais usam o id do produto (agrupam quantidade).
const lineKey = (i: CartItem) => i.lineId ?? i.product.id

interface CartStore {
  items: CartItem[]
  businessSlug: string | null
  couponCode: string | null
  couponDiscount: number
  addItem: (product: Product, additionals?: Additional[], observations?: string) => void
  addConfiguredItem: (product: Product, additionals: Additional[], observations: string | undefined, quantity: number) => void
  addPizzaItem: (product: Product, pizza: PizzaSelection, observations?: string) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  setBusinessSlug: (slug: string) => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  getSubtotal: () => number
  getTotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      businessSlug: null,
      couponCode: null,
      couponDiscount: 0,

      addItem: (product, additionals = [], observations) => {
        set((state) => {
          const existing = state.items.find(i => i.product.id === product.id && !i.lineId)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              )
            }
          }
          return {
            items: [...state.items, { product, quantity: 1, additionals, observations }]
          }
        })
      },

      addConfiguredItem: (product, additionals, observations, quantity) => {
        const lineId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        set((state) => ({
          items: [...state.items, { product, quantity: Math.max(1, quantity), additionals, observations, lineId }]
        }))
      },

      addPizzaItem: (product, pizza, observations) => {
        const lineId = `pizza-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        set((state) => ({
          items: [...state.items, { product, quantity: 1, additionals: [], observations, lineId, pizza }]
        }))
      },

      removeItem: (key) => {
        set((state) => ({
          items: state.items.filter(i => lineKey(i) !== key)
        }))
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key)
          return
        }
        set((state) => ({
          items: state.items.map(i =>
            lineKey(i) === key ? { ...i, quantity } : i
          )
        }))
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),

      setBusinessSlug: (slug) => set({ businessSlug: slug }),

      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),

      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      getSubtotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const additionalsTotal = item.additionals.reduce((a, add) => a + add.price, 0)
          const price = item.pizza ? item.pizza.unitPrice : (item.product.promotional_price ?? item.product.price)
          return total + (price + additionalsTotal) * item.quantity
        }, 0)
      },

      getTotal: () => {
        const { couponDiscount } = get()
        const subtotal = get().getSubtotal()
        return Math.max(0, subtotal - couponDiscount)
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    { name: 'cardapio-turbo-cart' }
  )
)
