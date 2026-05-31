import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, Additional } from '@/types'

interface CartStore {
  items: CartItem[]
  businessSlug: string | null
  couponCode: string | null
  couponDiscount: number
  addItem: (product: Product, additionals?: Additional[], observations?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
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
          const existing = state.items.find(i => i.product.id === product.id)
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

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(i => i.product.id !== productId)
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map(i =>
            i.product.id === productId ? { ...i, quantity } : i
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
          const price = item.product.promotional_price ?? item.product.price
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
