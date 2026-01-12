import { Request, Response } from 'express'
import * as cartService from '../services/cartService.js'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * GET /api/cart - Get user's cart
 */
export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const cart = await cartService.getCart(req.user.id)
    res.json(cart)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
}

/**
 * POST /api/cart - Add item to cart
 */
export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { productId, quantity } = req.body

    if (!productId || quantity === undefined) {
      res.status(400).json({ error: 'Missing productId or quantity' })
      return
    }

    const item = await cartService.addToCart(
      req.user.id,
      productId,
      quantity || 1
    )

    res.status(201).json(item)
  } catch (error) {
    console.error('Error adding to cart:', error)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
}

/**
 * PUT /api/cart/:cartItemId - Update cart item quantity
 */
export const updateCartItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { quantity } = req.body

    if (quantity === undefined) {
      res.status(400).json({ error: 'Missing quantity' })
      return
    }

    const item = await cartService.updateCartItem(req.params.cartItemId, quantity)
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' })
  }
}

/**
 * DELETE /api/cart/:cartItemId - Remove item from cart
 */
export const removeFromCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    await cartService.removeFromCart(req.params.cartItemId)
    res.json({ message: 'Item removed from cart' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' })
  }
}

/**
 * DELETE /api/cart - Clear entire cart
 */
export const clearCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    await cartService.clearCart(req.user.id)
    res.json({ message: 'Cart cleared' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' })
  }
}
