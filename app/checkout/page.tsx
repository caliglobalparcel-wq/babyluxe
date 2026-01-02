"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle2, ChevronLeft } from "lucide-react"

import { useCartStore } from "@/lib/cart-utils"
import type { CartItem, Product } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type CheckoutFormState = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  city: string
  zip: string
  notes: string
}

function buildWhatsAppUrl(opts: { phoneE164: string; message: string }) {
  const base = `https://wa.me/${opts.phoneE164}`
  const text = encodeURIComponent(opts.message)
  return `${base}?text=${text}`
}

function getBaseUrl() {
  // .env.local: NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
  return (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "")
}

function productPath(p: Product) {
  // Adjust if your route differs
  return `/products/${encodeURIComponent(p.slug)}`
}

function productUrl(p: Product) {
  const base = getBaseUrl()
  const path = productPath(p)
  return base ? `${base}${path}` : path
}

function formatMoneyFromCents(cents: number, currency: string) {
  const amount = cents / 100
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount)
}

async function fetchProducts(): Promise<Product[]> {
  // Uses the API route described above
  const res = await fetch("/api/products", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to load products")
  return (await res.json()) as Product[]
}

export default function CheckoutPage() {
  const { items: cartLines, clearCart } = useCartStore()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [productsError, setProductsError] = useState<string | null>(null)

  const [form, setForm] = useState<CheckoutFormState>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    notes: "",
  })

  // Load products so we can hydrate cart lines -> full product details
  useEffect(() => {
    let mounted = true
    fetchProducts()
      .then((p) => {
        if (!mounted) return
        setProducts(p)
        setProductsError(null)
      })
      .catch((err) => {
        if (!mounted) return
        setProducts([])
        setProductsError(err instanceof Error ? err.message : "Failed to load products")
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (cartLines.length === 0 && !isSuccess) router.push("/products")
  }, [cartLines.length, isSuccess, router])

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
  const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "Store"

  // ✅ Hydrate cart lines to your shared CartItem type (extends Product)
  const hydratedCart = useMemo<CartItem[]>(() => {
    if (!cartLines.length || !products.length) return []

    const map = new Map(products.map((p) => [p.id, p] as const))

    return cartLines
      .map((line) => {
        const p = map.get(line.productId)
        if (!p) return null
        return { ...p, quantity: line.quantity }
      })
      .filter((x): x is CartItem => Boolean(x))
  }, [cartLines, products])

  const totals = useMemo(() => {
    const subtotalCents = hydratedCart.reduce((sum, it) => sum + it.price_cents * it.quantity, 0)
    // assuming same currency for all items; fallback to USD
    const currency = hydratedCart[0]?.currency || "USD"
    return { subtotalCents, currency }
  }, [hydratedCart])

  const orderSummary = useMemo(() => {
    if (!cartLines.length) return "Cart is empty."

    // If products failed to load, still send something useful
    if (!hydratedCart.length) {
      return cartLines
        .map((l, idx) => `${idx + 1}. Product ID: ${l.productId}\nQty: ${l.quantity}`)
        .join("\n\n")
    }

    return hydratedCart
      .map((it, idx) => {
        const unit = formatMoneyFromCents(it.price_cents, it.currency)
        const lineTotal = formatMoneyFromCents(it.price_cents * it.quantity, it.currency)
        const link = productUrl(it)

        return [
          `${idx + 1}. ${it.name}`,
          `Qty: ${it.quantity} | Unit: ${unit} | Total: ${lineTotal}`,
          `Link: ${link}`,
        ].join("\n")
      })
      .join("\n\n")
  }, [cartLines, hydratedCart])

  const handleChange =
    (key: keyof CheckoutFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!waNumber) {
      alert("WhatsApp number is not configured. Set NEXT_PUBLIC_WHATSAPP_NUMBER.")
      return
    }

    setIsSubmitting(true)

    const subtotalLine =
      hydratedCart.length > 0
        ? `Subtotal: ${formatMoneyFromCents(totals.subtotalCents, totals.currency)}`
        : ""

    const message = [
      `New order request — ${brand}`,
      "",
      "Contact Information",
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      "",
      "Shipping Details",
      `Name: ${form.firstName} ${form.lastName}`,
      `Address: ${form.address}`,
      `City: ${form.city}`,
      `Zip: ${form.zip}`,
      form.notes?.trim() ? `Notes: ${form.notes.trim()}` : "Notes: (none)",
      "",
      productsError ? `Product lookup warning: ${productsError}` : "",
      "Cart",
      orderSummary,
      subtotalLine ? `\n${subtotalLine}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    const url = buildWhatsAppUrl({
      phoneE164: waNumber.replace(/[^\d]/g, ""),
      message,
    })

    setIsSuccess(true)
    setIsSubmitting(false)
    clearCart()

    window.location.href = url
  }

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-8">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-bold">Redirecting to WhatsApp…</h1>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            If WhatsApp didn’t open, please check your popup / redirect settings and try again.
          </p>
        </div>
        <div className="pt-8">
          <Button asChild variant="outline" className="rounded-full px-8 bg-transparent">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center gap-4">
          <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-4xl font-serif font-bold">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">Contact Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    className="rounded-xl h-12"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    required
                    className="rounded-xl h-12"
                    value={form.phone}
                    onChange={handleChange("phone")}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold border-b pb-2">Shipping Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    required
                    className="rounded-xl h-12"
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    required
                    className="rounded-xl h-12"
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Shipping Address</Label>
                <Input
                  id="address"
                  required
                  className="rounded-xl h-12"
                  value={form.address}
                  onChange={handleChange("address")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    className="rounded-xl h-12"
                    value={form.city}
                    onChange={handleChange("city")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip / Postal Code</Label>
                  <Input
                    id="zip"
                    required
                    className="rounded-xl h-12"
                    value={form.zip}
                    onChange={handleChange("zip")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Special delivery instructions..."
                  className="rounded-xl min-h-25"
                  value={form.notes}
                  onChange={handleChange("notes")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-secondary/30 rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-serif font-bold">Payment Method</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                All transactions are secure and encrypted. You will be redirected to WhatsApp to
                complete your purchase.
              </p>

              <div className="p-4 border-2 border-primary bg-white rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <span className="font-bold text-sm">WhatsApp Order</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-4 w-6 bg-slate-200 rounded" />
                  <div className="h-4 w-6 bg-slate-200 rounded" />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || cartLines.length === 0}
                className="w-full rounded-full h-14 font-bold text-lg"
              >
                {isSubmitting ? "Redirecting..." : "Complete Order on WhatsApp"}
              </Button>

              {!products.length && cartLines.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Loading product details… (links/prices will be included once loaded)
                </p>
              )}
            </div>

            <div className="px-4 space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground italic">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                Secured by SSL Encryption
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                By completing your order, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}