"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-utils"
import { formatPrice } from "@/lib/format"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Product } from "@/lib/types"

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()

  const [cartProducts, setCartProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchCartProducts() {
      try {
        if (items.length === 0) {
          if (!cancelled) {
            setCartProducts([])
            setLoading(false)
          }
          return
        }

        setLoading(true)

        const supabase = getSupabaseBrowserClient()
        const productIds = Array.from(new Set(items.map((item) => item.productId)))

        const { data, error } = await supabase.from("products").select("*").in("id", productIds)

        if (cancelled) return

        if (error) {
          console.error("[CartPage] Failed to fetch products:", error)
          setCartProducts([])
          setLoading(false)
          return
        }

        setCartProducts((data as Product[]) || [])
        setLoading(false)
      } catch (err) {
        if (cancelled) return
        console.error("[CartPage] Unexpected error:", err)
        setCartProducts([])
        setLoading(false)
      }
    }

    fetchCartProducts()

    return () => {
      cancelled = true
    }
  }, [items])

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = cartProducts.find((p) => p.id === item.productId)
      return total + (product?.price_cents ?? 0) * item.quantity
    }, 0)
  }, [items, cartProducts])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-100 rounded w-48 mx-auto" />
          <div className="h-64 bg-slate-50 rounded" />
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-serif font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          It looks like you haven't added any silicone babies to your collection yet.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <h1 className="text-4xl font-serif font-bold mb-12">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => {
            const product = cartProducts.find((p) => p.id === item.productId)
            if (!product) return null

            const images = Array.isArray(product.images) ? product.images : []
            const imageSrc = images[0] || "/placeholder.svg?height=300&width=300&query=baby+doll"

            return (
              <div key={item.productId} className="flex gap-6 py-6 border-b last:border-0 group">
                <div className="relative h-32 w-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                  <Image src={imageSrc} alt={product.name} fill className="object-cover" />
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-bold text-lg hover:text-primary transition-colors"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-1 border rounded-full px-2 py-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(product.id, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => updateQuantity(product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="font-serif font-bold text-primary">
                      {formatPrice(product.price_cents * item.quantity, product.currency)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-secondary/30 rounded-3xl p-8 sticky top-28 space-y-8">
            <h2 className="text-2xl font-serif font-bold">Order Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium italic">Complimentary</span>
              </div>

              <div className="pt-4 border-t flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-serif font-bold text-primary">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <Button asChild size="lg" className="w-full rounded-full h-14 font-bold text-lg group">
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <div className="pt-4 space-y-4">
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                Secure Checkout
              </p>
              <div className="flex justify-center gap-4 grayscale opacity-50">
                <div className="h-6 w-10 bg-slate-300 rounded" />
                <div className="h-6 w-10 bg-slate-300 rounded" />
                <div className="h-6 w-10 bg-slate-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}