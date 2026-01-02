import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, ShieldCheck, Sparkles, Users } from "lucide-react"

export const metadata = {
  title: "About Us | BabyLuxe",
  description: "Learn about the artistry and care behind BabyLuxe silicone babies.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-100 flex items-center justify-center overflow-hidden">
        <Image
          src="/artist-painting-doll.jpg"
          alt="Artisan painting a silicone baby"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="container relative z-10 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            The Art of New Beginnings
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            At BabyLuxe, we believe every creation is a masterpiece, crafted with soul and destined for connection.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 container px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-primary">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded with a passion for hyper-realistic artistry, BabyLuxe has grown into a world-renowned studio
              specializing in premium silicone babies. What began as a small artistic endeavor has evolved into a
              trusted brand for collectors, therapists, and families worldwide.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Each BabyLuxe creation is more than just a doll; it's a testament to human craftsmanship. Our artists
              spend hundreds of hours meticulously painting skin layers, rooting hair, and weighting each piece to
              ensure an unparalleled lifelike experience.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/luxury-silicone-baby-in-basket.jpg" alt="Luxury silicone baby" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-3xl font-serif text-center mb-16">The BabyLuxe Standard</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-xl bg-background shadow-sm text-center space-y-4 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium">Unrivaled Realism</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Using medical-grade platinum silicone and proprietary painting techniques for a skin-like feel.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-background shadow-sm text-center space-y-4 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium">Emotional Connection</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Designed to provide comfort, therapeutic benefits, and joy to collectors of all ages.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-background shadow-sm text-center space-y-4 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium">Lifetime Support</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every BabyLuxe comes with a certificate of authenticity and lifelong care guidance.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-background shadow-sm text-center space-y-4 border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium">Global Community</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join thousands of passionate enthusiasts in our exclusive collector's circle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl font-serif">Ready to meet your newest companion?</h2>
          <p className="text-lg text-muted-foreground">
            Explore our curated collection of hyper-realistic silicone babies and find the one that speaks to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/products">View Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 bg-transparent">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
