import { Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * GET /api/addresses - Get all user addresses
 */
export const getAddresses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('buyer_id', req.user.id)
      .order('is_default', { ascending: false })

    if (error) {
      console.error('Error fetching addresses:', error)
      res.status(500).json({ error: 'Failed to fetch addresses' })
      return
    }

    res.json(data || [])
  } catch (error) {
    console.error('Error in getAddresses:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/addresses - Create new address
 */
export const createAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const {
      label,
      street,
      city,
      state,
      postal_code,
      country,
      phone,
      is_default
    } = req.body

    // Validate required fields
    if (!label || !street || !city || !state || !postal_code || !country) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('buyer_id', req.user.id)
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        buyer_id: req.user.id,
        label,
        street,
        city,
        state,
        postal_code,
        country,
        phone: phone || '',
        is_default: is_default || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (error) {
      console.error('Error creating address:', error)
      res.status(500).json({ error: 'Failed to create address' })
      return
    }

    res.status(201).json(data[0])
  } catch (error) {
    console.error('Error in createAddress:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /api/addresses/:id - Update address
 */
export const updateAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const addressId = req.params.id
    const { label, street, city, state, postal_code, country, phone, is_default } = req.body

    // Check if address belongs to user
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('id')
      .eq('id', addressId)
      .eq('buyer_id', req.user.id)

    if (!existingAddress || existingAddress.length === 0) {
      res.status(404).json({ error: 'Address not found' })
      return
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('buyer_id', req.user.id)
        .neq('id', addressId)
    }

    const { data, error } = await supabase
      .from('addresses')
      .update({
        label,
        street,
        city,
        state,
        postal_code,
        country,
        phone,
        is_default,
        updated_at: new Date().toISOString()
      })
      .eq('id', addressId)
      .select()

    if (error) {
      console.error('Error updating address:', error)
      res.status(500).json({ error: 'Failed to update address' })
      return
    }

    res.json(data[0])
  } catch (error) {
    console.error('Error in updateAddress:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * DELETE /api/addresses/:id - Delete address
 */
export const deleteAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const addressId = req.params.id

    // Check if address belongs to user
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('is_default')
      .eq('id', addressId)
      .eq('buyer_id', req.user.id)

    if (!existingAddress || existingAddress.length === 0) {
      res.status(404).json({ error: 'Address not found' })
      return
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)

    if (error) {
      console.error('Error deleting address:', error)
      res.status(500).json({ error: 'Failed to delete address' })
      return
    }

    res.json({ success: true, message: 'Address deleted' })
  } catch (error) {
    console.error('Error in deleteAddress:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /api/addresses/:id/default - Set address as default
 */
export const setDefaultAddress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const addressId = req.params.id

    // Check if address belongs to user
    const { data: existingAddress } = await supabase
      .from('addresses')
      .select('id')
      .eq('id', addressId)
      .eq('buyer_id', req.user.id)

    if (!existingAddress || existingAddress.length === 0) {
      res.status(404).json({ error: 'Address not found' })
      return
    }

    // Unset all other defaults
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('buyer_id', req.user.id)

    // Set this one as default
    const { data, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .select()

    if (error) {
      console.error('Error setting default address:', error)
      res.status(500).json({ error: 'Failed to set default address' })
      return
    }

    res.json(data[0])
  } catch (error) {
    console.error('Error in setDefaultAddress:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
