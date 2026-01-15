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
 * GET /api/preferences - Get user preferences
 */
export const getPreferences = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', req.user.id)

    if (error) {
      console.error('Error fetching preferences:', error)
      res.status(500).json({ error: 'Failed to fetch preferences' })
      return
    }

    if (!data || data.length === 0) {
      // Return default preferences
      res.json({
        user_id: req.user.id,
        email_notifications: true,
        order_updates: true,
        promotions: false,
        language: 'en',
        currency: 'USD',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return
    }

    res.json(data[0])
  } catch (error) {
    console.error('Error in getPreferences:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /api/preferences - Update user preferences
 */
export const updatePreferences = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }

    const {
      email_notifications,
      order_updates,
      promotions,
      language,
      currency
    } = req.body

    // Check if preferences exist
    const { data: existingPrefs } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', req.user.id)

    if (!existingPrefs || existingPrefs.length === 0) {
      // Create new preferences
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: req.user.id,
          email_notifications: email_notifications ?? true,
          order_updates: order_updates ?? true,
          promotions: promotions ?? false,
          language: language || 'en',
          currency: currency || 'USD',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()

      if (error) {
        console.error('Error creating preferences:', error)
        res.status(500).json({ error: 'Failed to create preferences' })
        return
      }

      res.status(201).json(data[0])
      return
    }

    // Update existing preferences
    const { data, error } = await supabase
      .from('user_preferences')
      .update({
        email_notifications: email_notifications ?? undefined,
        order_updates: order_updates ?? undefined,
        promotions: promotions ?? undefined,
        language: language || undefined,
        currency: currency || undefined,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', req.user.id)
      .select()

    if (error) {
      console.error('Error updating preferences:', error)
      res.status(500).json({ error: 'Failed to update preferences' })
      return
    }

    res.json(data[0])
  } catch (error) {
    console.error('Error in updatePreferences:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
