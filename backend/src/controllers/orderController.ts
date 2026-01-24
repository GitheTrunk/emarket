import { Request, Response } from 'express'
import * as orderService from '../services/orderService.js'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * POST /api/orders/checkout - Create orders from the buyer's cart
 */
export const createOrderFromCart = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const orders = await orderService.createOrdersFromCart(req.user.id)
    res.status(201).json({ orders })
  } catch (error: any) {
    if (error instanceof orderService.OrderValidationError) {
      res.status(error.statusCode || 400).json({ error: error.message })
      return
    }

    console.error('Error creating order:', error)
    res.status(500).json({ error: 'Failed to place order' })
  }
}

/**
 * GET /api/orders - Get all orders for the authenticated buyer
 */
export const getOrders = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const orders = await orderService.getBuyerOrders(req.user.id)
    res.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}
