export type Product = {
  id: string
  seller_id: string
  title: string
  description: string
  price: number
  category: string
  stock: number
  status: 'active' | 'draft' | 'paused' | 'out_of_stock'
  images: string[]
  location_lat: number | null
  location_lng: number | null
  created_at: string
}
export type User = {
  id: string
  email: string
  role: 'buyer' | 'seller' | 'admin'
  created_at: string
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'buyer' | 'seller' | 'admin'
  created_at: string
}

export type WishlistItem = {
  id: number
  buyer_id: string
  product_id: string
  created_at: string
  product: Product
}

export type CartItem = {
  id: number
  buyer_id: string
  product_id: string
  quantity: number
  created_at: string
  product: Product
}

export type CreateProductInput = {
  title: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  location_lat?: number | null
  location_lng?: number | null
}

