import { Request, Response } from 'express'
import * as wishlistService from '../services/wishlistService.js'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * GET /api/wishlist - Get user's wishlist
 */
export const getWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const wishlist = await wishlistService.getWishlist(req.user.id)
    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wishlist' })
  }
}

/**
 * POST /api/wishlist - Add item to wishlist
 */
export const addToWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { productId } = req.body

    if (!productId) {
      res.status(400).json({ error: 'Missing productId' })
      return
    }

    const item = await wishlistService.addToWishlist(req.user.id, productId)
    res.status(201).json(item)
  } catch (error: any) {
    console.error('Error adding to wishlist:', error)
    if (error.message === 'Product already in wishlist') {
      res.status(409).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Failed to add to wishlist' })
    }
  }
}

/**
 * DELETE /api/wishlist/:wishlistItemId - Remove item from wishlist
 */
export const removeFromWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    await wishlistService.removeFromWishlist(req.params.wishlistItemId)
    res.json({ message: 'Item removed from wishlist' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' })
  }
}

/**
 * DELETE /api/wishlist - Clear entire wishlist
 */
export const clearWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    await wishlistService.clearWishlist(req.user.id)
    res.json({ message: 'Wishlist cleared' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear wishlist' })
  }
}

/**
 * GET /api/wishlist/check/:productId - Check if product is in wishlist
 */
export const checkWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const isInWishlist = await wishlistService.isInWishlist(
      req.user.id,
      req.params.productId
    )
    res.json({ isInWishlist })
  } catch (error) {
    res.status(500).json({ error: 'Failed to check wishlist' })
  }
}
