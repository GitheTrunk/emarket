import { supabase } from '../lib/supabase'
import type { CartItem } from '../types/database'

/**
 * Get all cart items for the current user
 */
export const getCart = async (): Promise<CartItem[]> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('cart')
    .select(`
      *,
      product:products (*)
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return data as CartItem[]
}

/**
 * Add a product to the cart
 */
export const addToCart = async (productId: string, quantity: number = 1): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // Check if item already exists in cart
  const { data: existing } = await supabase
    .from('cart')
    .select('id, quantity')
    .eq('buyer_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Update quantity if already in cart
    const { error } = await supabase
      .from('cart')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)

    if (error) throw error
  } else {
    // Insert new cart item
    const { error } = await supabase.from('cart').insert({
      buyer_id: user.id,
      product_id: productId,
      quantity
    })

    if (error) throw error
  }
}

/**
 * Update the quantity of a cart item
 */
export const updateCartItemQuantity = async (cartItemId: number, quantity: number): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  if (quantity < 1) {
    throw new Error('Quantity must be at least 1')
  }

  const { error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('buyer_id', user.id)

  if (error) throw error
}

/**
 * Remove an item from the cart
 */
export const removeFromCart = async (cartItemId: number): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartItemId)
    .eq('buyer_id', user.id)

  if (error) throw error
}

/**
 * Remove a product from cart by product ID
 */
export const removeProductFromCart = async (productId: string): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('buyer_id', user.id)
    .eq('product_id', productId)

  if (error) throw error
}

/**
 * Clear all items from the cart
 */
export const clearCart = async (): Promise<void> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('buyer_id', user.id)

  if (error) throw error
}

/**
 * Get cart count for the current user
 */
export const getCartCount = async (): Promise<number> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return 0
  }

  const { data, error } = await supabase
    .from('cart')
    .select('quantity')
    .eq('buyer_id', user.id)

  if (error) return 0
  
  // Sum up all quantities
  return data.reduce((sum, item) => sum + item.quantity, 0)
}

/**
 * Check if a product is in the cart
 */
export const isInCart = async (productId: string): Promise<boolean> => {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return false
  }

  const { data, error } = await supabase
    .from('cart')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('product_id', productId)
    .single()

  return !error && !!data
}
