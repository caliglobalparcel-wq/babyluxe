import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/lib/types" // adjust path to your types.ts

export type CartLine = {
  productId: Product["id"]
  quantity: number
}

interface CartState {
  items: CartLine[]
  addItem: (productId: Product["id"]) => void
  removeItem: (productId: Product["id"]) => void
  updateQuantity: (productId: Product["id"], quantity: number) => void
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
              items: state.items.map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
              ),
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