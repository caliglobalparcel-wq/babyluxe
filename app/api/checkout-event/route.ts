import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type CheckoutItem = {
  product_id: string
  slug: string
  name: string
  quantity: number
  price_cents: number
  currency: string
  product_url: string
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 },
    )
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  const body = await req.json()

  const cartCount = Number(body?.cartCount ?? 0)
  const subtotalCents = Number(body?.subtotalCents ?? 0)
  const channel = String(body?.channel ?? "whatsapp")
  const items = (Array.isArray(body?.items) ? body.items : []) as CheckoutItem[]
  const message = typeof body?.message === "string" ? body.message : null

  const { error } = await supabase.from("checkout_events").insert({
    cart_count: Number.isFinite(cartCount) ? cartCount : 0,
    subtotal_cents: Number.isFinite(subtotalCents) ? subtotalCents : 0,
    channel,
    items,   // ✅ store item details
    message, // ✅ optional
  })

  if (error) return NextResponse.json({ ok: false, error }, { status: 500 })
  return NextResponse.json({ ok: true })
}