import { Router } from 'express'
import * as orderController from '../controllers/orderController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = Router()

router.use(authenticateToken)

router.get('/', orderController.getOrders)
router.post('/checkout', orderController.createOrderFromCart)

export default router
