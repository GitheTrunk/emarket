import { api } from './api'
import type { CartItem } from '../types/database'

export const getCart = async (): Promise<CartItem[]> => {
  return await api.get('/cart')
}

export const addToCart = async (productId: string, quantity: number = 1) => {
  return await api.post('/cart', { productId, quantity })
}

export const updateCartItem = async (cartItemId: string, quantity: number) => {
  return await api.put(`/cart/${cartItemId}`, { quantity })
}

export const removeFromCart = async (cartItemId: string) => {
  return await api.delete(`/cart/${cartItemId}`)
}

export const clearCart = async () => {
  return await api.delete('/cart')
}

export const getCartCount = async (): Promise<number> => {
  const cart = await getCart()
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}