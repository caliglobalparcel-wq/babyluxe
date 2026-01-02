"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ChevronLeft } from "lucide-react"

import { useCartStore } from "@/lib/cart-utils"
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
  // phoneE164 must be digits only, with country code (no +, no spaces)
  // example: "15550000000"
  const base = `https://wa.me/${opts.phoneE164}`
  const text = encodeURIComponent(opts.message)
  return `${base}?text=${text}`
}

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

  useEffect(() => {
    if (items.length === 0 && !isSuccess) router.push("/products")
  }, [items, isSuccess, router])

  // Put these in .env.local
  // NEXT_PUBLIC_WHATSAPP_NUMBER="15550000000"  // digits only
  // NEXT_PUBLIC_BRAND_NAME="Your Brand"
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""

  const orderSummary = useMemo(() => {
    // optional: include cart items in the WhatsApp message too
    if (!items?.length) return "Cart is empty."
    return items
      .map((it: any, idx: number) => {
        const name = it?.name ?? "Item"
        const qty = it?.quantity ?? 1
        const price = it?.price != null ? `$${it.price}` : ""
        return `${idx + 1}. ${name} x${qty}${price ? ` (${price})` : ""}`
      })
      .join("\n")
  }, [items])

  const handleChange =
    (key: keyof CheckoutFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!waNumber) {
      // You can replace this with a nicer UI message
      alert("WhatsApp number is not configured. Set NEXT_PUBLIC_WHATSAPP_NUMBER.")
      return
    }

    setIsSubmitting(true)

    const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "Store"

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
      "Cart",
      orderSummary,
    ].join("\n")

    const url = buildWhatsAppUrl({
      phoneE164: waNumber.replace(/[^\d]/g, ""), // safety: strip non-digits
      message,
    })

    // Optional: clear cart only after redirect is triggered
    clearCart()
    setIsSubmitting(false)
    setIsSuccess(true)

    // Redirect to WhatsApp
    // router.push(url) works, but window.location is the most reliable for external redirects
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
                disabled={isSubmitting}
                className="w-full rounded-full h-14 font-bold text-lg"
              >
                {isSubmitting ? "Redirecting..." : "Complete Order on WhatsApp"}
              </Button>
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