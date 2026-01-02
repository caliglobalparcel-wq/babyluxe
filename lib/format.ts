// /lib/format.ts
export function formatPrice(price: number, currency?: string) {
  const safeNumber = Number.isFinite(price) ? price : 0

  // Prefer passed currency, otherwise fall back to env, otherwise USD
  const resolvedCurrency = (currency || process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "USD").toUpperCase()

  // If your DB stores cents (price_cents), convert to dollars here.
  // If you already pass dollars, remove "/ 100".
  const amount = safeNumber / 100

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: resolvedCurrency,
    }).format(amount)
  } catch {
    // Fallback if an invalid currency code is provided
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }
}