import { Request, Response } from 'express'
import { supabase, supabaseAdmin } from '../lib/supabase.js'

/**
 * GET /api/admin/stats - Get admin dashboard statistics
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    // Get time range from query params (default: 7d)
    const timeRange = (req.query.timeRange as string) || '7d'
    const daysCount = timeRange === '90d' ? 90 : timeRange === '30d' ? 30 : 7

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

    // Get product statistics (admin client to bypass RLS)
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('status, price, category, title, created_at')

    if (productsError) throw productsError

    const productStats = {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      totalValue: products.reduce((sum, p) => sum + (p.price || 0), 0)
    }

    // Get order statistics (admin client to bypass RLS)
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('total_price, order_status, payment_status, created_at')

    if (ordersError) throw ordersError

    // Try to get transactions for sales trend (more accurate)
    const { data: transactions } = await supabaseAdmin
      .from('transactions')
      .select('amount, created_at, status')
      .gte('created_at', new Date(Date.now() - daysCount * 24 * 60 * 60 * 1000).toISOString())

    // Calculate sales trend based on selected time range
    const salesTrend = []
    const now = new Date()
    
    // For longer periods, group by week instead of day
    const groupByWeek = daysCount > 30
    const periods = groupByWeek ? Math.ceil(daysCount / 7) : daysCount
    
    for (let i = periods - 1; i >= 0; i--) {
      const date = new Date(now)
      if (groupByWeek) {
        date.setDate(date.getDate() - (i * 7))
        date.setHours(0, 0, 0, 0)
      } else {
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
      }
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + (groupByWeek ? 7 : 1))

      // Calculate sales from transactions if available, fallback to orders
      let periodSales = 0
      
      if (transactions && transactions.length > 0) {
        periodSales = transactions
          .filter(t => t.status === 'completed')
          .filter(t => {
            const txDate = new Date(t.created_at)
            return txDate >= date && txDate < nextDate
          })
          .reduce((sum, t) => sum + (t.amount || 0), 0)
      } else {
        // Count confirmed and completed orders as sales
        periodSales = orders
          .filter(o => o.order_status === 'confirmed' || o.order_status === 'completed')
          .filter(o => {
            const orderDate = new Date(o.created_at)
            return orderDate >= date && orderDate < nextDate
          })
          .reduce((sum, o) => sum + (o.total_price || 0), 0)
      }

      salesTrend.push({
        date: date.toISOString().split('T')[0],
        sales: periodSales
      })
    }

    // Get top products from order_items
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select(`
        product_id,
        quantity,
        price,
        products (
          title
        )
      `)

    let topProducts: any[] = []
    
    if (!itemsError && orderItems) {
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

      topProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4)
    } else {
      // Fallback: Get top products by stock or price
      const { data: products } = await supabase
        .from('products')
        .select('id, title, price, stock')
        .order('price', { ascending: false })
        .limit(4)
      
      if (products) {
        topProducts = products.map(p => ({
          name: p.title,
          sales: p.stock || 0,
          revenue: p.price || 0
        }))
      }
    }

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
      confirmed: orders.filter(o => o.order_status === 'confirmed').length,
      totalRevenue: orders
        .filter(o => o.order_status === 'confirmed' || o.order_status === 'completed')
        .reduce((sum, o) => sum + (o.total_price || 0), 0)
    }

    // Calculate growth (compare last 7 days vs previous 7 days)
    const last7DaysDate = new Date()
    last7DaysDate.setDate(last7DaysDate.getDate() - 7)
    const last14DaysDate = new Date()
    last14DaysDate.setDate(last14DaysDate.getDate() - 14)

    const recentOrders = orders
      .filter(o => o.order_status === 'confirmed' || o.order_status === 'completed')
      .filter(o => new Date(o.created_at) >= last7DaysDate)
    const previousOrders = orders
      .filter(o => o.order_status === 'confirmed' || o.order_status === 'completed')
      .filter(o => {
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
      salesTrend: salesTrend,
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
    // Use admin client to bypass RLS for admin endpoints
    const { data, error } = await supabaseAdmin
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
 * GET /api/admin/transactions - Get transaction data
 */
export const getTransactions = async (req: Request, res: Response) => {
  try {
    // Check if transactions table exists, otherwise fallback to orders
    const { data: transactions, error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (transactionsError) {
      // Fallback to orders table if transactions doesn't exist
      const { data: orders, error: ordersError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Get user data for buyers and sellers
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
      if (authError) throw authError

      const usersMap = new Map(authData.users.map(u => [u.id, u]))

      // Transform orders to transaction format
      const transformedTransactions = orders.map((order: any) => {
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

      res.json(transformedTransactions)
      return
    }

    // Use transactions table directly - it already has the right structure
    // Get user data for buyers and sellers
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) throw authError

    const usersMap = new Map(authData.users.map(u => [u.id, u]))

    // Enrich transactions with user data
    const enrichedTransactions = transactions.map((txn: any) => {
      const buyer = usersMap.get(txn.buyer_id)
      const seller = usersMap.get(txn.seller_id)

      return {
        ...txn,
        buyer: buyer ? {
          full_name: buyer.user_metadata?.full_name || 'Unknown',
          email: buyer.email || 'N/A'
        } : null,
        seller: seller ? {
          full_name: seller.user_metadata?.full_name || 'Unknown',
          email: seller.email || 'N/A'
        } : null,
        product: {
          title: txn.product_id || 'Product Details'
        }
      }
    })

    res.json(enrichedTransactions)
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

    // If order_items doesn't exist or error, fallback to products for categories
    let categorySales: Record<string, number> = {}
    
    if (itemsError || !orderItems) {
      // Fallback: Get category data from products table
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('category, price')
      
      if (!productsError && products) {
        categorySales = products.reduce((acc: Record<string, number>, product: any) => {
          const category = product.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + (product.price || 0)
          return acc
        }, {} as Record<string, number>)
      }
    } else {
      // Aggregate sales by category from order_items
      categorySales = orderItems.reduce((acc: Record<string, number>, item: any) => {
        const category = (item.products && item.products.category) ? item.products.category : 'Uncategorized'
        const sales = (item.price || 0) * (item.quantity || 1)
        acc[category] = (acc[category] || 0) + sales
        return acc
      }, {} as Record<string, number>)
    }

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