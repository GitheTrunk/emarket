import { supabaseAdmin } from '../lib/supabase.js'

/**
 * Get wishlist items for a user
 */
export const getWishlist = async (buyerId: string) => {
  const { data, error } = await supabaseAdmin
    .from('wishlist')
    .select(
      `
      *,
      product:products (*)
    `
    )
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Add item to wishlist
 */
export const addToWishlist = async (
  buyerId: string,
  productId: string
) => {
  // Check if item exists
  const { data: existing } = await supabaseAdmin
    .from('wishlist')
    .select('id')
    .eq('buyer_id', buyerId)
    .eq('product_id', productId)
    .single()

  if (existing) {
    throw new Error('Product already in wishlist')
  }

  // Create new wishlist item
  const { data, error } = await supabaseAdmin
    .from('wishlist')
    .insert({
      buyer_id: buyerId,
      product_id: productId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Remove item from wishlist
 */
export const removeFromWishlist = async (wishlistItemId: string) => {
  const { error } = await supabaseAdmin
    .from('wishlist')
    .delete()
    .eq('id', wishlistItemId)

  if (error) throw error
}

/**
 * Clear entire wishlist for user
 */
export const clearWishlist = async (buyerId: string) => {
  const { error } = await supabaseAdmin
    .from('wishlist')
    .delete()
    .eq('buyer_id', buyerId)

  if (error) throw error
}

/**
 * Check if product is in wishlist
 */
export const isInWishlist = async (
  buyerId: string,
  productId: string
): Promise<boolean> => {
  const { data } = await supabaseAdmin
    .from('wishlist')
    .select('id')
    .eq('buyer_id', buyerId)
    .eq('product_id', productId)
    .single()

  return !!data
}
