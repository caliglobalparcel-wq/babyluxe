import { getSupabaseServerClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import Image from "next/image"
import { notFound } from "next/navigation"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ShieldCheck, Truck, Heart, Undo2 } from "lucide-react"
import type { Product } from "@/lib/types"

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active") // only show active products
    .single()

  if (error || !data) {
    // Leave this log in until everything works, then you can remove it.
    console.error("[getProductBySlug] error or no data:", { slug, error })
    return null
  }

  return data as Product
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const images = Array.isArray(product.images) ? product.images : []
  const mainImage = images[0] || "/placeholder.svg?height=800&width=800"

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 shadow-xl">
            <Image src={mainImage} alt={product.name} fill className="object-cover" priority />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(1, 5).map((image, i) => (
                <div
                  key={`${product.id}-thumb-${i}`}
                  className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <Image
                    src={image || "/placeholder.svg?height=200&width=200"}
                    alt={`${product.name} view ${i + 2}`}
                    fill
                    className="object-cover hover:opacity-80 transition-opacity"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="space-y-2">
              {product.featured && (
                <span className="text-primary font-bold uppercase tracking-widest text-xs">
                  Featured Creation
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">{product.name}</h1>
            </div>

            <p className="text-3xl font-serif font-bold text-primary">
              {formatPrice(product.price_cents, product.currency)}
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-sm font-medium">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                In Stock &amp; Ready to Ship
              </div>
            </div>
          </div>

          <AddToCartButton product={product} />

          <div className="grid grid-cols-2 gap-6 pt-10 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Truck className="h-5 w-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Shipping</span>
              </div>
              <p className="text-xs text-muted-foreground">Complimentary global shipping on all luxury silicone dolls.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-5 w-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Authenticity</span>
              </div>
              <p className="text-xs text-muted-foreground">Each baby comes with a signed Certificate of Authenticity.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Heart className="h-5 w-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Care</span>
              </div>
              <p className="text-xs text-muted-foreground">Expert care instructions and starter kit included.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Undo2 className="h-5 w-5" />
                <span className="font-bold text-sm uppercase tracking-wider">Returns</span>
              </div>
              <p className="text-xs text-muted-foreground">Hassle-free 14-day return policy for unused items.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}