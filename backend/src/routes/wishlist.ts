import { Router } from 'express'
import * as wishlistController from '../controllers/wishlistController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

// All wishlist routes require authentication
router.use(authenticateToken)

router.get('/', wishlistController.getWishlist)
router.post('/', wishlistController.addToWishlist)
router.delete('/:wishlistItemId', wishlistController.removeFromWishlist)
router.delete('/', wishlistController.clearWishlist)
router.get('/check/:productId', wishlistController.checkWishlist)

export default router
