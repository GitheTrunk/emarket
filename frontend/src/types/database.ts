export type Product = {
  id: number
  seller_id: string
  title: string
  description: string
  price: number
  category: string
  stock: number
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
