import { Router } from 'express'
import * as cartController from '../controllers/cartController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// All cart routes require authentication
router.use(authenticateToken)

router.get('/', cartController.getCart)
router.post('/', cartController.addToCart)
router.put('/:cartItemId', cartController.updateCartItem)
router.delete('/:cartItemId', cartController.removeFromCart)
router.delete('/', cartController.clearCart)

export default router
