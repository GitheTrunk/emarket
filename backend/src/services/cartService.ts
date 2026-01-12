import { supabaseAdmin } from '../lib/supabase.js'

/**
 * Get cart items for a user
 */
export const getCart = async (buyerId: string) => {
  const { data, error } = await supabaseAdmin
    .from('cart')
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
 * Add item to cart
 */
export const addToCart = async (
  buyerId: string,
  productId: string,
  quantity: number
) => {
  // Check if item exists
  const { data: existing } = await supabaseAdmin
    .from('cart')
    .select('id, quantity')
    .eq('buyer_id', buyerId)
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Update quantity
    const { data, error } = await supabaseAdmin
      .from('cart')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Create new cart item
  const { data, error } = await supabaseAdmin
    .from('cart')
    .insert({
      buyer_id: buyerId,
      product_id: productId,
      quantity
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
  cartItemId: string,
  quantity: number
) => {
  const { data, error } = await supabaseAdmin
    .from('cart')
    .update({ quantity })
    .eq('id', cartItemId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Remove item from cart
 */
export const removeFromCart = async (cartItemId: string) => {
  const { error } = await supabaseAdmin
    .from('cart')
    .delete()
    .eq('id', cartItemId)

  if (error) throw error
}

/**
 * Clear entire cart for user
 */
export const clearCart = async (buyerId: string) => {
  const { error } = await supabaseAdmin
    .from('cart')
    .delete()
    .eq('buyer_id', buyerId)

  if (error) throw error
}
