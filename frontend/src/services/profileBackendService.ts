/**
 * Profile Service - Backend API calls for profile management
 * This service is optional as the frontend uses Supabase directly,
 * but provided for reference if you want to use the Express backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

interface ProfileData {
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  avatar_url: string
}

interface Address {
  id?: string
  label: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  phone_number?: string
  is_default?: boolean
}

interface UserPreferences {
  email_notifications: boolean
  order_updates: boolean
  promotions: boolean
  language: string
  currency: string
}

/**
 * Get user profile from backend
 */
export async function getProfile(token: string): Promise<ProfileData> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch profile')
  }

  return response.json()
}

/**
 * Update user profile
 */
export async function updateProfile(
  token: string,
  data: Partial<ProfileData>
): Promise<ProfileData> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Failed to update profile')
  }

  return response.json()
}

/**
 * Upload avatar
 */
export async function uploadAvatar(token: string, avatarUrl: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ avatar_url: avatarUrl })
  })

  if (!response.ok) {
    throw new Error('Failed to upload avatar')
  }

  return response.json()
}

/**
 * Get all user addresses
 */
export async function getAddresses(token: string): Promise<Address[]> {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch addresses')
  }

  return response.json()
}

/**
 * Create new address
 */
export async function createAddress(token: string, address: Address): Promise<Address> {
  const response = await fetch(`${API_BASE_URL}/addresses`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(address)
  })

  if (!response.ok) {
    throw new Error('Failed to create address')
  }

  return response.json()
}

/**
 * Update address
 */
export async function updateAddress(
  token: string,
  addressId: string,
  address: Partial<Address>
): Promise<Address> {
  const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(address)
  })

  if (!response.ok) {
    throw new Error('Failed to update address')
  }

  return response.json()
}

/**
 * Delete address
 */
export async function deleteAddress(token: string, addressId: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to delete address')
  }

  return response.json()
}

/**
 * Set address as default
 */
export async function setDefaultAddress(token: string, addressId: string): Promise<Address> {
  const response = await fetch(`${API_BASE_URL}/addresses/${addressId}/default`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to set default address')
  }

  return response.json()
}

/**
 * Get user preferences
 */
export async function getPreferences(token: string): Promise<UserPreferences> {
  const response = await fetch(`${API_BASE_URL}/preferences`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch preferences')
  }

  return response.json()
}

/**
 * Update user preferences
 */
export async function updatePreferences(
  token: string,
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  const response = await fetch(`${API_BASE_URL}/preferences`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(preferences)
  })

  if (!response.ok) {
    throw new Error('Failed to update preferences')
  }

  return response.json()
}
