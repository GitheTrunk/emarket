import { supabase } from '../lib/supabase.js'

interface GetProductsParams {
  limit?: number
  offset?: number
  category?: string
  sellerId?: string
}

/**
 * Get all products with optional filters
 */
export const getProducts = async (params: GetProductsParams) => {
  let query = supabase.from('products').select('*')

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.sellerId) {
    query = query.eq('seller_id', params.sellerId)
  }

  if (params.limit) {
    query = query.limit(params.limit)
  }

  if (params.offset) {
    query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get single product by ID
 */
export const getProductById = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new product
 */
export const createProduct = async (
  sellerId: string,
  input: {
    title: string
    description: string
    price: number
    category: string
    stock: number
    images: string[]
    location_lat?: number | null
    location_lng?: number | null
  }
) => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      seller_id: sellerId,
      ...input
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update product
 */
export const updateProduct = async (
  productId: string,
  updates: Partial<{
    title: string
    description: string
    price: number
    category: string
    stock: number
    images: string[]
  }>
) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete product
 */
export const deleteProduct = async (productId: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) throw error
}
