import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import * as preferencesController from '../controllers/preferencesController.js'

const router = Router()

// All preference routes require authentication
router.use(authenticateToken)

/**
 * GET /api/preferences - Get user preferences
 */
router.get('/', preferencesController.getPreferences)

/**
 * PUT /api/preferences - Update user preferences
 */
router.put('/', preferencesController.updatePreferences)

export default router
