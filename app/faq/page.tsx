import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const metadata = {
  title: "Frequently Asked Questions | BabyLuxe",
  description: "Find answers to common questions about our luxury silicone babies, shipping, and care.",
}

const faqs = [
  {
    category: "Product & Craftsmanship",
    questions: [
      {
        id: "q1",
        question: "What makes BabyLuxe silicone babies different?",
        answer:
          "Each BabyLuxe creation is handcrafted using medical-grade platinum silicone, poured in one piece for a seamless feel. Our artists spend over 60 hours on each doll, meticulously mapping out skin tones, veins, and hand-rooting premium mohair to ensure the most realistic experience possible.",
      },
      {
        id: "q2",
        question: "Are these dolls suitable for children?",
        answer:
          "BabyLuxe silicone babies are high-end collector items and are not intended as toys for young children. They are delicate works of art that require gentle handling, similar to how one would handle a real newborn.",
      },
      {
        id: "q3",
        question: "Do the babies have an anatomically correct body?",
        answer:
          "Yes, many of our models are anatomically correct. Please check the individual product description for specific details on the body sculpt of your chosen baby.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    questions: [
      {
        id: "q4",
        question: "How long does shipping take?",
        answer:
          "For in-stock ready-to-ship babies, processing takes 2-3 business days. International shipping typically takes 7-14 business days via tracked luxury courier services. Custom 'made-to-order' babies require a 4-8 week crafting period before shipment.",
      },
      {
        id: "q5",
        question: "Do you ship worldwide?",
        answer:
          "Yes, we offer insured worldwide shipping. Every baby is securely nestled in a luxury presentation box and double-boxed for maximum protection during its journey home.",
      },
    ],
  },
  {
    category: "Care & Maintenance",
    questions: [
      {
        id: "q6",
        question: "How do I care for my silicone baby?",
        answer:
          "Silicone attracts lint, so we recommend keeping your baby away from dark fuzzy fabrics. To clean, use a soft lint-free cloth or a gentle bath with mild baby soap. Always apply a light dusting of specialized matting powder (provided in your care kit) after cleaning to maintain the soft, skin-like texture.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 mb-16 items-start">
          <div className="md:w-1/3 sticky top-32">
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter mb-4">FAQ</h1>
            <p className="text-muted-foreground leading-relaxed">
              Everything you need to know about your future family member and our handcrafted process.
            </p>
          </div>

          <div className="md:w-2/3 space-y-12">
            {faqs.map((group, groupIdx) => (
              <section key={groupIdx}>
                <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-6">{group.category}</h2>
                <Accordion type="single" collapsible className="w-full border-t border-border">
                  {group.questions.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border-b border-border py-2">
                      <AccordionTrigger className="text-left font-serif text-xl hover:no-underline hover:text-accent transition-colors py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-lg pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-20 p-12 bg-secondary/50 rounded-2xl text-center">
          <h3 className="text-2xl font-serif mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-8">
            We are here to help you choose the perfect addition to your collection.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-accent transition-colors font-medium"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}
