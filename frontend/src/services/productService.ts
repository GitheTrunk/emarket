import { supabase } from '../lib/supabase'
import type { Product } from '../types/database'

type CreateProductInput = {
  title: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  location_lat?: number | null
  location_lng?: number | null
}

export const createProduct = async (
  input: CreateProductInput
): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('products').insert({
    seller_id: user.id,
    ...input
  })

  if (error) throw error
}
