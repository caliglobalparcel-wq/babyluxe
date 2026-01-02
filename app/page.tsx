import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, ShieldCheck, Heart, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import type { Product } from "@/lib/types"
import heroImage from "@/public/hero.jpg"

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .limit(4)

  if (error) {
    console.error("[HomePage] Failed to fetch featured products:", error)
    return []
  }

  return (data as Product[]) || []
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "BabyLuxe"

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={`${brandName} Luxury Nursery`}
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              Artistry in Every <span className="italic">Detail</span>
            </h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-lg">
              Experience the world's most realistic silicone babies. Handcrafted with love and unparalleled precision
              for the discerning collector.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                size="lg"
                asChild
                className="rounded-full px-8 bg-white text-primary hover:bg-white/90 border-none"
              >
                <Link href="/products">Shop the Collection</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full px-8 text-white border-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/about">Our Process</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-primary/10">
          <div className="flex flex-col items-center text-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Safe & Certified</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Hand-Rooted Hair</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Star className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Artist Quality</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-sm font-medium">Global Shipping</span>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 md:px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Featured Creations</h2>
            <p className="text-muted-foreground">Our most beloved masterpieces, ready for their forever homes.</p>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/products" className="flex items-center gap-2">
              View All Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => {
              const images = Array.isArray(product.images) ? product.images : []
              const imageSrc = images[0] || "/placeholder.svg?height=600&width=600"

              // Your Product type you shared does NOT include age_group.
              // Keep the UI, but read it safely from DB if it exists.
              const ageGroup = (product as any).age_group as string | undefined

              return (
                <Link key={product.id} href={`/products/${product.id}`} className="group space-y-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {ageGroup === "Limited Edition" && (
                      <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Limited
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium text-lg">{product.name}</h3>

                    {ageGroup ? (
                      <p className="text-sm text-muted-foreground">{ageGroup}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">&nbsp;</p>
                    )}

                    <p className="font-serif font-bold text-primary">
                      {formatPrice(product.price_cents, product.currency)}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <p className="text-muted-foreground text-lg">
              Featured products will appear here once your database is connected.
            </p>
            <p className="text-sm text-muted-foreground">
              Please ensure your Supabase environment variables are configured correctly.
            </p>
          </div>
        )}
      </section>

      {/* About Section Teaser */}
      <section className="bg-secondary/50 py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl">
              <Image src="/placeholder.svg?key=7ij6o" alt={`The ${brandName} Process`} fill className="object-cover" />
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Crafted with a Mother's Touch</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At {brandName}, we don't just make dolls; we create memories. Each baby is meticulously painted over 80+
                hours to achieve lifelike skin tones, delicate veining, and the softest touch.
              </p>

              <ul className="space-y-4">
                {[
                  "Premium medical-grade silicone",
                  "Hand-rooted premium mohair",
                  "Weighted for a realistic feel",
                  "Custom-tailored designer outfits",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 font-medium">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                <Link href="/about">Learn Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}