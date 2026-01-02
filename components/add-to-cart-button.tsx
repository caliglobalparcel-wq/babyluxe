"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-utils"
import type { Product } from "@/lib/types"

export function AddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      size="lg"
      onClick={handleAddToCart}
      className="w-full sm:w-auto px-12 rounded-full h-14 text-lg font-bold transition-all"
      disabled={added}
    >
      {added ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added to Cart
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  )
}
