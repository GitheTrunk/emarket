import { Router } from 'express'
import productsRouter from './products.js'
import cartRouter from './cart.js'
import wishlistRouter from './wishlist.js'
import adminRouter from './admin.js'
import profileRouter from './profile.js'
import addressesRouter from './addresses.js'
import preferencesRouter from './preferences.js'

const router = Router()

// Mount routes
router.use('/products', productsRouter)
router.use('/cart', cartRouter)
router.use('/wishlist', wishlistRouter)
router.use('/admin', adminRouter)
router.use('/profile', profileRouter)
router.use('/addresses', addressesRouter)
router.use('/preferences', preferencesRouter)

export default router
