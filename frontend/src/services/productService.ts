import type { CreateProductInput } from '../types/database'
import { api } from './api'

export const createProduct = async (input: CreateProductInput) => {
  return await api.post('/products', input)
}

export const getProducts = async () => {
  return await api.get('/products')
}

export const getProductById = async (id: string) => {
  return await api.get(`/products/${id}`)
}

export const updateProduct = async (id: string, updates: any) => {
  return await api.put(`/products/${id}`, updates)
}

export const deleteProductById = async (id: string) => {
  return await api.delete(`/products/${id}`)
}