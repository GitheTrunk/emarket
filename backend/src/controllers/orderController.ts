// src/controllers/orderController.ts
import supabase from '@/lib/supabase'
import type { Request, Response } from 'express' // or your backend framework
import type { OrderItem } from '@/types/database'

interface CreateOrderBody {
    items: { product_id: string; quantity: number }[]
    buyer_id: string
    address: string
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        const { items, buyer_id, address }: CreateOrderBody = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items to order.' })
        }

        // Fetch products to check stock
        const productIds = items.map(i => i.product_id)
        const { data: products, error: productError } = await supabase
            .from('products')
            .select('*')
            .in('id', productIds)

        if (productError) throw productError
        if (!products) throw new Error('Products not found.')

        // Check stock for each item
        for (const item of items) {
            const product = products.find(p => p.id === item.product_id)
            if (!product) return res.status(400).json({ message: `Product ${item.product_id} not found` })
            if (item.quantity > product.stock) {
                return res.status(400).json({
                    message: `Cannot order ${item.quantity} of ${product.title}, only ${product.stock} in stock`,
                })
            }
        }

        // Create order in "orders" table
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{ buyer_id, address, status: 'pending' }])
            .select('*')
            .single()

        if (orderError) throw orderError

        // Insert order items
        const orderItems: OrderItem[] = items.map(i => ({
            order_id: order.id,
            product_id: i.product_id,
            quantity: i.quantity,
        }))

        const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
        if (itemsError) throw itemsError

        // Update product stock
        for (const item of items) {
            await supabase
                .from('products')
                .update({ stock: supabase.raw('stock - ?', [item.quantity]) })
                .eq('id', item.product_id)
        }

        return res.status(201).json({ message: 'Order created successfully', order_id: order.id })
    } catch (err) {
        console.error('Error creating order:', err)
        return res.status(500).json({ message: err instanceof Error ? err.message : 'Server error' })
    }
}
