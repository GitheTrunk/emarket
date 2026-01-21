import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import * as profileController from '../controllers/profileController.js'

const router = Router()

// Apply authentication middleware to all routes
router.use(authenticateToken)

/**
 * GET /api/profile - Get user profile
 */
router.get('/', profileController.getProfile)

/**
 * PUT /api/profile - Update user profile
 */
router.put('/', profileController.updateProfile)

/**
 * POST /api/profile/avatar - Upload avatar
 */
router.post('/avatar', profileController.uploadAvatar)

/**
 * GET /api/profile/stats - Get profile statistics
 */
router.get('/stats', profileController.getProfileStats)

export default router
