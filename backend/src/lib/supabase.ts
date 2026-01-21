import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

const supabaseUrl = config.supabase.url
const supabaseAnonKey = config.supabase.anonKey
const supabaseServiceKey = config.supabase.serviceKey

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client for authenticated requests (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service client for admin operations (service key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
)
