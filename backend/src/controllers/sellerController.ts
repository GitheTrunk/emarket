import { Request, Response } from 'express'
import { supabase } from '../lib/supabase.js'

/**
 * GET /api/seller/stats - Get seller dashboard statistics (top products)
 * Requires authentication; uses `req.user.id` from auth middleware
 */
export const getSellerStats = async (req: Request, res: Response) => {
  try {
    // @ts-ignore - middleware attaches user
    const user = (req as any).user
    if (!user || !user.id) return res.status(401).json({ error: 'Not authenticated' })
    // Parse optional date range from query: ?start=YYYY-MM-DD&end=YYYY-MM-DD or ?days=N
    const startQuery = (req.query.start as string) || ''
    const endQuery = (req.query.end as string) || ''
    const daysQuery = req.query.days ? Number(req.query.days) : undefined

    // Build a base query for orders and optionally apply date filtering
    let ordersQuery = supabase
      .from('orders')
      .select('id, total_price, amount, created_at, buyer_id, order_status')
      .eq('seller_id', user.id)

    // If explicit start/end are provided, use them to filter created_at
    if (startQuery && endQuery) {
      // Use inclusive range: created_at >= start AND created_at <= end
      ordersQuery = ordersQuery.gte('created_at', startQuery).lte('created_at', endQuery)
    } else if (daysQuery && Number.isFinite(daysQuery) && daysQuery > 0) {
      // compute start date from days back (relative to now)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - (daysQuery - 1))
      // use ISO date string without time to compare
      ordersQuery = ordersQuery.gte('created_at', startDate.toISOString())
    }

    const { data: ordersAll, error: ordersAllErr } = await ordersQuery

    if (ordersAllErr) throw ordersAllErr

    const totalOrders = (ordersAll || []).length
    const totalRevenue = (ordersAll || []).reduce((s: number, o: any) => s + (Number(o.total_price || o.amount) || 0), 0)

    // new customers in last 30 days
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    const recentBuyers = (ordersAll || []).filter((o: any) => new Date(o.created_at) >= cutoff).map((o: any) => o.buyer_id)
    const newCustomers = Array.from(new Set(recentBuyers)).length

    // For top products, consider only completed/paid orders in the selected range
    const completedOrderIds = (ordersAll || []).filter((o: any) => {
      const s = (o.order_status || '').toString().toLowerCase()
      return s === 'completed' || s === 'paid'
    }).map((o: any) => o.id).filter(Boolean)

    let topProducts: any[] = []
    let productsSold = 0
    if (completedOrderIds.length) {
      const { data: items, error: itemsErr } = await supabase
        .from('order_items')
        .select('order_id, product_id, quantity, price, products(title)')
        .in('order_id', completedOrderIds)

      if (itemsErr) throw itemsErr

      const productMap = new Map<string, { name: string; sales: number; revenue: number }>()
      ;(items || []).forEach((it: any) => {
        const pid = it.product_id
        if (!pid) return
        const qty = Number(it.quantity || 1)
        const unit = Number(it.price || 0)
        const revenue = qty * unit

        productsSold += qty

        const existing = productMap.get(pid) || { name: it.products?.title || 'Unknown Product', sales: 0, revenue: 0 }
        existing.sales += qty
        existing.revenue += revenue
        productMap.set(pid, existing)
      })

      topProducts = Array.from(productMap.entries()).map(([id, v]) => ({ id, title: v.name, sold: v.sales, revenue: v.revenue }))
        .sort((a, b) => (b.sold - a.sold) || (b.revenue - a.revenue))
        .slice(0, 6)
    }

    res.json({ totalOrders, totalRevenue, productsSold, newCustomers, topProducts })
  } catch (error) {
    console.error('Error fetching seller stats:', error)
    res.status(500).json({ error: 'Failed to fetch seller stats' })
  }
}
