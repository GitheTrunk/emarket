import { Router } from 'express'
import * as productController from '../controllers/productController.js'
import { authenticateToken, authorize } from '../middleware/auth.js'

const router = Router()

// Public routes
router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProduct)

// Protected routes (seller only)
router.post('/', authenticateToken, authorize('seller'), productController.createProduct)
router.put('/:id', authenticateToken, authorize('seller'), productController.updateProduct)
router.delete('/:id', authenticateToken, authorize('seller'), productController.deleteProduct)

export default router
