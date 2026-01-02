import { getSupabaseServerClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"

async function getProducts(category?: string): Promise<Product[]> {
  const supabase = await getSupabaseServerClient()
  let query = supabase.from("products").select("*").eq("status", "active").order("sort_order", { ascending: true })

  if (category) {
    query = query.eq("category", category)
  }

  const { data } = await query
  return data || []
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const products = await getProducts(category)

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 space-y-12">
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
          {category ? `${category} Collection` : "The Entire Collection"}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Each silicone baby is a unique work of art, handcrafted with meticulous attention to detail. Discover your
          perfect companion today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100">
              <Image
                src={product.images[0] || "/placeholder.svg?height=600&width=600&query=silicone+baby+doll"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {product.featured && (
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between pt-2">
                <p className="font-serif font-bold text-primary">
                  {formatPrice(product.price_cents, product.currency)}
                </p>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                  Details
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <p className="text-muted-foreground">No products found in this collection.</p>
          <Link href="/products" className="text-primary font-bold hover:underline">
            View all products
          </Link>
        </div>
      )}
    </div>
  )
}
