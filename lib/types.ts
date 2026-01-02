export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  currency: string;
  status: "active" | "draft";
  featured: boolean;
  sort_order: number;
  images: string[];
  created_at: string;
  updated_at: string;
  age_group: string;
}

export interface CartItem extends Product {
  quantity: number
}
