import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  productId: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId)
          if (existing) {
            return {
              items: state.items.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)),
            }
          }
          return { items: [...state.items, { productId, quantity: 1 }] }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      getItemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
    }),
    { name: "cart-storage" },
  ),
)
