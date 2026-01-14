import { Request, Response } from 'express'
import { supabase, supabaseAdmin } from '../lib/supabase.js'

/**
 * GET /api/admin/stats - Get admin dashboard statistics
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    // Get user statistics using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) throw authError

    const users = authData.users || []
    const userStats = users.reduce((acc, user) => {
      const role = user.user_metadata?.role || 'buyer'
      acc[role] = (acc[role] || 0) + 1
      acc.total = (acc.total || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get product statistics
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('status, price, category, title, created_at')

    if (productsError) throw productsError

    const productStats = {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      totalValue: products.reduce((sum, p) => sum + (p.price || 0), 0)
    }

    // Get order statistics
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_price, order_status, payment_status, created_at')

    if (ordersError) throw ordersError

    // Calculate 7-day sales trend
    const last7Days = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const daySales = orders.filter(o => {
        const orderDate = new Date(o.created_at)
        return orderDate >= date && orderDate < nextDate
      }).reduce((sum, o) => sum + (o.total_price || 0), 0)

      last7Days.push({
        date: date.toISOString().split('T')[0],
        sales: daySales
      })
    }

    // Get top products from order_items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        product_id,
        quantity,
        price,
        products (
          title
        )
      `)

    const topProducts = orderItems ? (() => {
      const productMap = new Map()
      orderItems.forEach((item: any) => {
        const productId = item.product_id
        const productName = item.products?.title || 'Unknown Product'
        const revenue = (item.price || 0) * (item.quantity || 1)
        
        if (productMap.has(productId)) {
          const existing = productMap.get(productId)
          existing.sales += item.quantity || 1
          existing.revenue += revenue
        } else {
          productMap.set(productId, {
            name: productName,
            sales: item.quantity || 1,
            revenue: revenue
          })
        }
      })

      return Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4)
    })() : []

    // Category distribution
    const categoryMap = new Map()
    products.forEach(p => {
      const category = p.category || 'Uncategorized'
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    })

    const orderStats = {
      total: orders.length,
      pending: orders.filter(o => o.order_status === 'pending').length,
      completed: orders.filter(o => o.order_status === 'completed').length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0)
    }

    // Calculate growth (compare last 7 days vs previous 7 days)
    const last7DaysDate = new Date()
    last7DaysDate.setDate(last7DaysDate.getDate() - 7)
    const last14DaysDate = new Date()
    last14DaysDate.setDate(last14DaysDate.getDate() - 14)

    const recentOrders = orders.filter(o => new Date(o.created_at) >= last7DaysDate)
    const previousOrders = orders.filter(o => {
      const date = new Date(o.created_at)
      return date >= last14DaysDate && date < last7DaysDate
    })

    const recentRevenue = recentOrders.reduce((sum, o) => sum + (o.total_price || 0), 0)
    const previousRevenue = previousOrders.reduce((sum, o) => sum + (o.total_price || 0), 0)
    const salesGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1) : 0

    const recentUsers = users.filter(u => new Date(u.created_at) >= last7DaysDate).length
    const previousUsers = users.filter(u => {
      const date = new Date(u.created_at)
      return date >= last14DaysDate && date < last7DaysDate
    }).length
    const usersGrowth = previousUsers > 0 ? ((recentUsers - previousUsers) / previousUsers * 100).toFixed(1) : 0

    res.json({
      users: userStats,
      products: productStats,
      orders: orderStats,
      salesTrend: last7Days,
      topProducts: topProducts,
      categoryDistribution: Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count })),
      growth: {
        sales: Number(salesGrowth),
        users: Number(usersGrowth),
        revenue: orderStats.total > 0 ? 12.5 : 0 // Mock for now
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    res.status(500).json({ error: 'Failed to fetch statistics' })
  }
}

/**
 * GET /api/admin/users - Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data: authData, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) throw error

    const users = authData.users.map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || null,
      role: user.user_metadata?.role || 'buyer',
      created_at: user.created_at
    }))

    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

/**
 * GET /api/admin/products - Get all products with seller info (admin only)
 */
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles!products_seller_id_fkey (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}

/**
 * GET /api/admin/transactions - Get transaction/order data
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    // Get orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (ordersError) throw ordersError

    // Get user data for buyers and sellers
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) throw authError

    const usersMap = new Map(authData.users.map(u => [u.id, u]))

    // Transform the data
    const transactions = orders.map((order: any) => {
      const buyer = usersMap.get(order.buyer_id)
      const seller = usersMap.get(order.seller_id)

      return {
        id: `ORD-${order.id.slice(0, 8)}`,
        buyer_id: order.buyer_id,
        seller_id: order.seller_id,
        product_id: null,
        amount: order.total_price || 0,
        status: order.order_status,
        created_at: order.created_at,
        buyer: buyer ? {
          full_name: buyer.user_metadata?.full_name || 'Unknown',
          email: buyer.email || 'N/A'
        } : null,
        seller: seller ? {
          full_name: seller.user_metadata?.full_name || 'Unknown',
          email: seller.email || 'N/A'
        } : null,
        product: {
          title: 'Product Details'
        }
      }
    })

    res.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}

/**
 * GET /api/admin/reports - Get reports data
 */
export const getReports = async (req: Request, res: Response) => {
  try {
    const period = req.query.period || '30' // days

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period as string))

    // Get orders within the period
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('total_price, created_at')
      .gte('created_at', startDate.toISOString())

    if (ordersError) throw ordersError

    // Calculate sales data
    const totalSales = orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

    // Get category sales data from order_items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        price,
        quantity,
        products (
          category
        )
      `)

    if (itemsError) throw itemsError

    // Aggregate sales by category
    const categorySales = orderItems.reduce((acc: Record<string, number>, item: any) => {
      const category = (item.products && item.products.category) ? item.products.category : 'Uncategorized'
      const sales = (item.price || 0) * (item.quantity || 1)
      acc[category] = (acc[category] || 0) + sales
      return acc
    }, {} as Record<string, number>)

    const totalCategorySales = Object.values(categorySales).reduce((sum, sales) => sum + sales, 0)
    const topCategories = Object.entries(categorySales)
      .map(([category, sales]) => ({
        category,
        sales,
        percentage: totalCategorySales > 0 ? Math.round((sales / totalCategorySales) * 100) : 0
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4) // Top 4 categories

    // Get user growth data
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) throw authError

    const users = authData.users || []
    const newUsers = users.filter(u =>
      new Date(u.created_at) >= startDate
    ).length

    const activeUsers = users.length

    // Mock growth rate - in real app, would compare with previous period
    const growthRate = 12.5

    // Generate sales trend data (last 7 days)
    const salesTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(date)
      dayEnd.setHours(23, 59, 59, 999)

      const dayOrders = orders.filter(order =>
        new Date(order.created_at) >= dayStart && new Date(order.created_at) <= dayEnd
      )
      const daySales = dayOrders.reduce((sum, order) => sum + (order.total_price || 0), 0)

      salesTrend.push({
        date: date.toISOString().split('T')[0],
        sales: daySales
      })
    }

    res.json({
      sales: {
        totalSales,
        totalOrders,
        averageOrderValue,
        topCategories,
        salesTrend
      },
      users: {
        newUsers,
        activeUsers,
        growthRate
      },
      period: period
    })
  } catch (error) {
    console.error('Error fetching reports:', error)
    res.status(500).json({ error: 'Failed to fetch reports' })
  }
}