import { Router } from 'express'
import { authenticateToken, authorize } from '../middleware/auth.js'
import * as adminController from '../controllers/adminController.js'

const router = Router()

// Apply admin authorization to all routes
router.use(authenticateToken)
router.use(authorize('admin'))

// Admin data endpoints
router.get('/stats', adminController.getStats)
router.get('/users', adminController.getAllUsers)
router.get('/products', adminController.getAllProducts)
router.get('/transactions', adminController.getTransactions)
router.get('/reports', adminController.getReports)

export default router