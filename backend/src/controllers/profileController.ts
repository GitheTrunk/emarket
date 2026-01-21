import { Request, Response } from 'express'
import { supabase, supabaseAdmin } from '../lib/supabase.js'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * GET /api/profile - Get user profile
 */
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)

    if (error) {
      console.error('Error fetching profile:', error)
      res.status(500).json({ error: 'Failed to fetch profile' })
      return
    }

    if (!data || data.length === 0) {
      // Return empty profile with email
      res.json({
        id: req.user.id,
        full_name: '',
        email: req.user.email,
        phone: '',
        date_of_birth: null,
        avatar_url: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return
    }

    res.json(data[0])
  } catch (error) {
    console.error('Error in getProfile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /api/profile - Update user profile
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { full_name, phone, date_of_birth, avatar_url } = req.body

    console.log('[updateProfile] User:', req.user.id, 'Data:', { full_name, phone, date_of_birth, avatar_url: avatar_url ? 'present' : 'empty' })

    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', req.user.id)

    if (checkError) {
      console.error('[updateProfile] Error checking profile:', checkError)
      res.status(500).json({ error: 'Failed to check profile' })
      return
    }

    if (!existingProfile || existingProfile.length === 0) {
      // Create new profile
      console.log('[updateProfile] Creating new profile for user:', req.user.id)
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: req.user.id,
          full_name: full_name || '',
          phone: phone || '',
          date_of_birth: date_of_birth || null,
          avatar_url: avatar_url || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('[updateProfile] Error creating profile:', error)
        res.status(500).json({ error: 'Failed to create profile' })
        return
      }

      console.log('[updateProfile] Profile created successfully:', data[0])
      res.status(201).json(data[0])
      return
    }

    // Update existing profile - only update fields that are provided
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (full_name !== undefined) updateData.full_name = full_name
    if (phone !== undefined) updateData.phone = phone
    if (date_of_birth !== undefined) updateData.date_of_birth = date_of_birth
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url

    console.log('[updateProfile] Updating profile:', updateData)

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', req.user.id)
      .select()

    if (error) {
      console.error('[updateProfile] Error updating profile:', error)
      res.status(500).json({ error: 'Failed to update profile' })
      return
    }

    console.log('[updateProfile] Profile updated successfully:', data[0])
    res.json(data[0])
  } catch (error) {
    console.error('Error in updateProfile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/profile/avatar - Upload avatar
 */
export const uploadAvatar = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { avatar_url } = req.body

    if (!avatar_url) {
      res.status(400).json({ error: 'Avatar URL required' })
      return
    }

    // Update profile with avatar
    const { data, error } = await supabase
      .from('profiles')
      .update({
        avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select()

    if (error) {
      console.error('Error uploading avatar:', error)
      res.status(500).json({ error: 'Failed to upload avatar' })
      return
    }

    res.json({ success: true, data: data[0] })
  } catch (error) {
    console.error('Error in uploadAvatar:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/profile/stats - Get profile statistics for the authenticated user
 * Returns: { ordersPlaced, totalSpent, wishlistItems }
 */
export const getProfileStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const userId = req.user.id

    // Get orders for this user
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('total_price, order_status, payment_status, buyer_id')
      .eq('buyer_id', userId)

    if (ordersError) {
      console.error('[getProfileStats] Error fetching orders:', ordersError)
      res.status(500).json({ error: 'Failed to fetch orders' })
      return
    }

    const ordersPlaced = orders ? orders.length : 0
    // Sum total price; optionally only completed/paid orders
    const totalSpent = (orders || []).reduce((sum, o: any) => {
      const price = Number(o.total_price) || 0
      return sum + price
    }, 0)

    // Get wishlist items count
    const { data: wishlist, error: wishlistError } = await supabaseAdmin
      .from('wishlist')
      .select('id')
      .eq('buyer_id', userId)

    if (wishlistError) {
      console.error('[getProfileStats] Error fetching wishlist:', wishlistError)
      res.status(500).json({ error: 'Failed to fetch wishlist' })
      return
    }

    const wishlistItems = wishlist ? wishlist.length : 0

    res.json({ ordersPlaced, totalSpent, wishlistItems })
  } catch (error) {
    console.error('Error in getProfileStats:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
