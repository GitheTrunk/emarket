import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
)

/**
 * Middleware to authenticate requests using Supabase JWT token
 * Expects token in Authorization header: "Bearer <token>"
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      console.log('[Auth] No token provided for', req.path)
      res.status(401).json({ error: 'No token provided' })
      return
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      console.log('[Auth] Invalid token for', req.path, error?.message)
      res.status(401).json({ error: 'Invalid token' })
      return
    }

    // Attach user to request
    req.user = {
      id: data.user.id,
      email: data.user.email || '',
      role: data.user.user_metadata?.role || 'buyer'
    }

    next()
  } catch (error) {
    console.error('[Auth] Authentication error:', error)
    res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * Middleware to check if user has specific role
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' })
      return
    }

    next()
  }
}
