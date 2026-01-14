import { api } from './api'
import type { WishlistItem } from '../types/database'

/**
 * Get all wishlist items for the current user
 */
export const getWishlist = async (): Promise<WishlistItem[]> => {
  return await api.get('/wishlist')
}

/**
 * Add a product to the wishlist
 */
export const addToWishlist = async (productId: string): Promise<void> => {
  return await api.post('/wishlist', { productId })
}

/**
 * Remove a product from wishlist by wishlist item ID
 */
export const removeFromWishlist = async (wishlistItemId: string): Promise<void> => {
  return await api.delete(`/wishlist/${wishlistItemId}`)
}

/**
 * Remove a product from wishlist by product ID
 */
export const removeProductFromWishlist = async (productId: string): Promise<void> => {
  // Get wishlist to find the item ID for this product
  const wishlist = await getWishlist()
  const item = wishlist.find((w: WishlistItem) => w.product_id === productId)
  
  if (item) {
    await removeFromWishlist(item.id.toString())
  }
}

/**
 * Check if a product is in the wishlist
 */
export const isInWishlist = async (productId: string): Promise<boolean> => {
  const result = await api.get(`/wishlist/check/${productId}`)
  return result.data?.isInWishlist ?? false
}

/**
 * Clear all items from the wishlist
 */
export const clearWishlist = async (): Promise<void> => {
  return await api.delete('/wishlist')
}

/**
 * Get wishlist count for the current user
 */
export const getWishlistCount = async (): Promise<number> => {
  const wishlist = await getWishlist()
  return wishlist.length
}
