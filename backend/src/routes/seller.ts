
import { Router } from 'express'
import * as sellerController from '../controllers/sellerController.js'
import { authenticateToken, authorize } from '../middleware/auth.js'

const router = Router()

// Seller stats (requires authenticated seller)
router.get('/', authenticateToken, authorize('seller'), sellerController.getSellerStats)

export default router
