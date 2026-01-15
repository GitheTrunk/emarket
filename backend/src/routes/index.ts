import { Router } from 'express'
import productsRouter from './products.js'
import cartRouter from './cart.js'
import wishlistRouter from './wishlist.js'
import adminRouter from './admin.js'

const router = Router()

// Mount routes
router.use('/products', productsRouter)
router.use('/cart', cartRouter)
router.use('/wishlist', wishlistRouter)
router.use('/admin', adminRouter)

export default router
