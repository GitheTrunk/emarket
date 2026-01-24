import { supabaseAdmin } from '../lib/supabase.js'

export class OrderValidationError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'OrderValidationError'
    this.statusCode = statusCode
  }
}

type CartItemWithProduct = {
  id: string
  product_id: string
  quantity: number
  product: {
    id: string
    seller_id: string
    stock: number | null
    price: number | null
    title?: string | null
  } | null
}

type OrderRecord = {
  id: string
  buyer_id: string
  seller_id: string
  total_price: number
  payment_status: string
  order_status: string
  created_at?: string
}

/**
 * Fetch cart items for a buyer along with product information.
 */
const fetchCartWithProducts = async (buyerId: string): Promise<CartItemWithProduct[]> => {
  const { data, error } = await supabaseAdmin
    .from('cart')
    .select(
      `
      id,
      quantity,
      product_id,
      product:products (
        id,
        seller_id,
        stock,
        price,
        title
      )
    `
    )
    .eq('buyer_id', buyerId)

  if (error) throw error
  return (data || []) as unknown as CartItemWithProduct[]
}

/**
 * Reduce stock for each product in a safe way (checks current stock).
 * If any update fails, previously updated products are reverted.
 */
const decrementStockOrThrow = async (
  items: CartItemWithProduct[]
): Promise<{ productId: string; previousStock: number }[]> => {
  const updates: { productId: string; previousStock: number }[] = []

  try {
    for (const item of items) {
      const product = item.product
      if (!product) {
        throw new OrderValidationError('Product not found for a cart item')
      }

      const currentStock = Number(product.stock ?? 0)
      const quantity = Number(item.quantity || 0)

      if (quantity <= 0) {
        throw new OrderValidationError('Quantity must be greater than zero')
      }

      if (currentStock < quantity) {
        throw new OrderValidationError(
          `Insufficient stock for ${product.title || 'product'}`
        )
      }

      const newStock = currentStock - quantity

      const { data, error } = await supabaseAdmin
        .from('products')
        .update({ stock: newStock })
        .eq('id', product.id)
        .eq('stock', product.stock)
        .select('id')
        .single()

      if (error || !data) {
        throw new OrderValidationError(
          `Insufficient stock for ${product.title || 'product'}`
        )
      }

      updates.push({ productId: product.id, previousStock: currentStock })
    }
    return updates
  } catch (err) {
    // Attempt to revert any stock changes if something fails
    if (updates.length) {
      await Promise.all(
        updates.map((u) =>
          supabaseAdmin.from('products').update({ stock: u.previousStock }).eq('id', u.productId)
        )
      )
    }
    throw err
  }
}

/**
 * Create orders grouped by seller for the buyer's cart and attach order_items.
 */
export const createOrdersFromCart = async (buyerId: string): Promise<OrderRecord[]> => {
  const cartItems = await fetchCartWithProducts(buyerId)

  if (!cartItems.length) {
    throw new OrderValidationError('Cart is empty')
  }

  // Validate product presence and stock before mutating anything
  cartItems.forEach((item) => {
    const product = item.product
    if (!product) {
      throw new OrderValidationError('One of the products in cart no longer exists')
    }
    const available = Number(product.stock ?? 0)
    if (item.quantity > available) {
      throw new OrderValidationError(
        `Insufficient stock for ${product.title || 'product'}`
      )
    }
  })

  // Group items by seller to create one order per seller
  const groups = new Map<string, CartItemWithProduct[]>()
  cartItems.forEach((item) => {
    const sellerId = item.product?.seller_id
    if (!sellerId) {
      throw new OrderValidationError('Missing seller for one of the products')
    }
    const list = groups.get(sellerId) || []
    list.push(item)
    groups.set(sellerId, list)
  })

  // Decrement stock atomically before creating orders
  const stockUpdates = await decrementStockOrThrow(cartItems)

  const createdOrders: OrderRecord[] = []

  try {
    for (const [sellerId, items] of groups.entries()) {
      const totalPrice = items.reduce((sum, item) => {
        const price = Number(item.product?.price ?? 0)
        return sum + price * item.quantity
      }, 0)

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          buyer_id: buyerId,
          seller_id: sellerId,
          total_price: totalPrice,
          payment_status: 'paid',
          order_status: 'pending'
        })
        .select()
        .single()

      if (orderError || !order) throw orderError

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: Number(item.product?.price ?? 0)
      }))

      if (orderItems.length) {
        const { error: itemsError } = await supabaseAdmin
          .from('order_items')
          .insert(orderItems)

        if (itemsError) throw itemsError
      }

      createdOrders.push(order as OrderRecord)
    }

    // Clear cart after successful orders
    const { error: clearError } = await supabaseAdmin
      .from('cart')
      .delete()
      .eq('buyer_id', buyerId)

    if (clearError) throw clearError

    return createdOrders
  } catch (error) {
    if (stockUpdates.length) {
      await Promise.all(
        stockUpdates.map((u) =>
          supabaseAdmin.from('products').update({ stock: u.previousStock }).eq('id', u.productId)
        )
      )
    }
    throw error
  }
}

/**
 * Get all orders for a buyer with their order items and product info.
 */
export const getBuyerOrders = async (buyerId: string) => {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(
      `
      *,
      order_items (
        id,
        product_id,
        quantity,
        price,
        products (
          title,
          images
        )
      )
    `
    )
    .eq('buyer_id', buyerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
