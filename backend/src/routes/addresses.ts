import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.js'
import * as addressController from '../controllers/addressController.js'

const router = Router()

// All address routes require authentication
router.use(authenticateToken)

/**
 * GET /api/addresses - Get all user addresses
 */
router.get('/', addressController.getAddresses)

/**
 * POST /api/addresses - Create new address
 */
router.post('/', addressController.createAddress)

/**
 * PUT /api/addresses/:id - Update address
 */
router.put('/:id', addressController.updateAddress)

/**
 * DELETE /api/addresses/:id - Delete address
 */
router.delete('/:id', addressController.deleteAddress)

/**
 * PUT /api/addresses/:id/default - Set as default address
 */
router.put('/:id/default', addressController.setDefaultAddress)

export default router
