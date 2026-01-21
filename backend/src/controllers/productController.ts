import { Request, Response } from 'express'
import * as productService from '../services/productService.js'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * GET /api/products - Get all products
 */
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const offset = parseInt(req.query.offset as string) || 0
    const category = req.query.category as string | undefined
    const sellerId = req.query.sellerId as string | undefined

    const products = await productService.getProducts({
      limit,
      offset,
      category,
      sellerId
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

/**
 * GET /api/products/:id - Get single product
 */
export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await productService.getProductById(req.params.id)
    res.json(product)
  } catch (error) {
    res.status(404).json({ error: 'Product not found' })
  }
}

/**
 * POST /api/products - Create new product (seller only)
 */
export const createProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    if (req.user.role !== 'seller') {
      res.status(403).json({ error: 'Only sellers can create products' })
      return
    }

    const { title, description, price, category, stock, images, location_lat, location_lng } = req.body

    // Basic validation
    if (!title || !description || !price || !category || stock === undefined) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    const product = await productService.createProduct(req.user.id, {
      title,
      description,
      price,
      category,
      stock,
      images: images || [],
      location_lat,
      location_lng
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' })
  }
}

/**
 * PUT /api/products/:id - Update product (seller only)
 */
export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const product = await productService.getProductById(req.params.id)

    if (product.seller_id !== req.user.id) {
      res.status(403).json({ error: 'Can only update your own products' })
      return
    }

    const updated = await productService.updateProduct(req.params.id, req.body)

    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' })
  }
}

/**
 * DELETE /api/products/:id - Delete product (seller only)
 */
export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const product = await productService.getProductById(req.params.id)

    if (product.seller_id !== req.user.id) {
      res.status(403).json({ error: 'Can only delete your own products' })
      return
    }

    await productService.deleteProduct(req.params.id)

    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
