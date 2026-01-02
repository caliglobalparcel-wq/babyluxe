import { NextResponse } from "next/server"
import type { Product } from "@/lib/types"

// Replace this with your real data source:
async function getAllProducts(): Promise<Product[]> {
  // e.g. fetch from DB
  return []
}

export async function GET() {
  const products = await getAllProducts()
  return NextResponse.json(products)
}