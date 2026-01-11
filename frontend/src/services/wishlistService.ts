import { supabase } from '../lib/supabase'
import type { WishlistItem } from '../types/database'

/**
 * Get all wishlist items for the current user
 */
export const getWishlist = async (): Promise<WishlistItem[]> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      product:products (*)
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return data as WishlistItem[]
}

/**
 * Add a product to the wishlist
 */
export const addToWishlist = async (productId: string): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if item already exists in wishlist
  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    throw new Error('Item already in wishlist')
  }

  const { error } = await supabase.from('wishlist').insert({
    buyer_id: user.id,
    product_id: productId
  })

  if (error) throw error
}

/**
 * Remove an item from the wishlist
 */
export const removeFromWishlist = async (wishlistItemId: number): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('id', wishlistItemId)
    .eq('buyer_id', user.id)

  if (error) throw error
}

/**
 * Remove a product from wishlist by product ID
 */
export const removeProductFromWishlist = async (productId: string): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('buyer_id', user.id)
    .eq('product_id', productId)

  if (error) throw error
}

/**
 * Check if a product is in the wishlist
 */
export const isInWishlist = async (productId: string): Promise<boolean> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return false
  }

  const { data, error } = await supabase
    .from('wishlist')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('product_id', productId)
    .single()

  return !error && !!data
}

/**
 * Clear all items from the wishlist
 */
export const clearWishlist = async (): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('buyer_id', user.id)

  if (error) throw error
}

/**
 * Get wishlist count for the current user
 */
export const getWishlistCount = async (): Promise<number> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return 0
  }

  const { count, error } = await supabase
    .from('wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('buyer_id', user.id)

  if (error) return 0
  
  return count || 0
}
