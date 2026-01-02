"use client"

import Link from "next/link"
import { ShoppingCart, Menu, Search, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/products" },
    { name: "Newborns", href: "/products?category=Newborn" },
    { name: "Preemies", href: "/products?category=Preemie" },
  ]

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-75 sm:w-100">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold tracking-tight text-primary">
                {process.env.NEXT_PUBLIC_BRAND_NAME}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="transition-colors hover:text-primary/80">
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
              <Link href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace("+", "")}`} target="_blank">
                <Phone className="h-5 w-5" />
                <span className="sr-only">Contact on WhatsApp</span>
              </Link>
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
