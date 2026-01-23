<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Welcome back, Seller!</h1>
      <p class="text-sm text-gray-500">Here's what's happening with your store today.</p>
    </div>

    <!-- Top metric cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between min-h-[88px]">
        <div class="flex flex-col">
          <p class="text-sm text-gray-400">Total Revenue</p>
          <p class="text-3xl font-bold mt-1">{{ formatCurrency(totalRevenue) }}</p>
        </div>
        <div class="text-xs font-medium px-3 py-1 rounded-full" :class="revenueChange >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">{{ revenueChange >= 0 ? '+' : '' }}{{ revenueChange.toFixed(1) }}%</div>
      </div>

      <div class="p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between min-h-[88px]">
        <div class="flex flex-col">
          <p class="text-sm text-gray-400">Total Orders</p>
          <p class="text-3xl font-bold mt-1">{{ totalOrders }}</p>
        </div>
        <div class="text-xs font-medium px-3 py-1 rounded-full" :class="ordersChange >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">{{ ordersChange >= 0 ? '+' : '' }}{{ ordersChange.toFixed(1) }}%</div>
      </div>

      <div class="p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between min-h-[88px]">
        <div class="flex flex-col">
          <p class="text-sm text-gray-400">Products Sold</p>
          <p class="text-3xl font-bold mt-1">{{ productsSold }}</p>
        </div>
        <div class="text-xs font-medium px-3 py-1 rounded-full" :class="productsSoldChange >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">{{ productsSoldChange >= 0 ? '+' : '' }}{{ productsSoldChange.toFixed(1) }}%</div>
      </div>

      <div class="p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between min-h-[88px]">
        <div class="flex flex-col">
          <p class="text-sm text-gray-400">New Customers</p>
          <p class="text-3xl font-bold mt-1">{{ newCustomers }}</p>
        </div>
        <div class="text-xs font-medium px-3 py-1 rounded-full" :class="customersChange >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'">{{ customersChange >= 0 ? '+' : '' }}{{ customersChange.toFixed(1) }}%</div>
      </div>
    </div>

    <!-- Sales overview and Top products -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div class="col-span-2 bg-white rounded shadow border border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold">Sales Overview</h3>
          <div class="flex items-center gap-2">
            <select v-model="range" class="border rounded px-3 py-1 text-sm">
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>

            <div class="relative">
              <button @click="showCalendar = !showCalendar" class="border rounded px-3 py-1 text-sm bg-white">📅</button>
              <div v-if="showCalendar" class="absolute right-0 mt-2 bg-white border rounded shadow p-3 w-64 z-10"> 
                <div class="text-xs text-gray-600 mb-2">Custom range</div>
                <div class="flex items-center gap-2">
                  <input v-model="startDate" type="date" class="border rounded px-2 py-1 text-sm w-1/2" />
                  <input v-model="endDate" type="date" class="border rounded px-2 py-1 text-sm w-1/2" />
                </div>
                <div class="flex justify-end gap-2 mt-3">
                  <button @click="clearDateRange" class="text-sm text-gray-600">Cancel</button>
                  <button @click="applyDateRange" class="bg-orange-600 text-white px-3 py-1 rounded text-sm">Apply</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-56 rounded border border-dashed border-gray-200 p-2">
          <canvas ref="salesChart" class="w-full h-full"></canvas>
        </div>
      </div>

      <div class="bg-white rounded shadow border border-gray-200 p-4">
        <h3 class="font-semibold mb-4">Top Products</h3>
        <div class="space-y-3">
          <div v-for="p in topProducts" :key="p.id" class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white"> 
                <i class="pi pi-box"></i>
              </div>
              <div>
                <div class="font-medium">{{ p.title }}</div>
                <div class="text-xs text-gray-500">{{ p.sold }} sold</div>
              </div>
            </div>
            <div class="font-semibold">{{ formatCurrency(p.revenue) }}</div>
          </div>
          <div v-if="!topProducts.length" class="text-sm text-gray-500">No product sales yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import supabase from '@/lib/supabase'
import {
  Chart,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from 'chart.js'

Chart.register(LineController, LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip)

const totalRevenue = ref(0)
const totalOrders = ref(0)
const productsSold = ref(0)
const newCustomers = ref(0)
const topProducts = ref<any[]>([])

// Trend percentages
const revenueChange = ref(0)
const ordersChange = ref(0)
const productsSoldChange = ref(0)
const customersChange = ref(0)
const range = ref('7')
const showCalendar = ref(false)
const startDate = ref('')
const endDate = ref('')
const salesChart = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function applyDateRange() {
  showCalendar.value = false
  // keep range as 'custom' logically; fetchDashboard will honor start/end dates
  fetchDashboard()
}

function clearDateRange() {
  startDate.value = ''
  endDate.value = ''
  showCalendar.value = false
  fetchDashboard()
}

const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)

const getOrderAmount = (o: any) => Number(o?.total_price ?? o?.amount ?? 0)

async function calculateTrends(allOrders: any[], filteredOrders: any[]) {
  try {
    const n = Number(range.value) || 7
    const now = new Date()
    
    // Determine period boundaries
    let currentStart: Date
    let previousStart: Date
    let previousEnd: Date
    
    if (startDate.value && endDate.value) {
      // Custom date range
      currentStart = new Date(startDate.value)
      previousEnd = new Date(currentStart)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousStart = new Date(previousEnd)
      const days = Math.floor((new Date(endDate.value).getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24))
      previousStart.setDate(previousStart.getDate() - days)
    } else {
      // Preset ranges: compare to previous equal period
      currentStart = new Date(now)
      currentStart.setDate(currentStart.getDate() - (n - 1))
      previousEnd = new Date(currentStart)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousStart = new Date(previousEnd)
      previousStart.setDate(previousStart.getDate() - (n - 1))
    }
    
    const previousOrders = allOrders.filter((o: any) => {
      const d = new Date(o.created_at)
      return d >= previousStart && d <= previousEnd
    })
    
    // Revenue trend
    const prevRevenue = previousOrders.reduce((s: number, o: any) => s + getOrderAmount(o), 0)
    const currentRevenue = totalRevenue.value
    revenueChange.value = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : (currentRevenue > 0 ? 100 : 0)
    
    // Orders trend
    ordersChange.value = previousOrders.length > 0 ? ((filteredOrders.length - previousOrders.length) / previousOrders.length) * 100 : (filteredOrders.length > 0 ? 100 : 0)
    
    // Products sold trend
    const prevProductsSold = previousOrders.reduce((s: number, o: any) => s + (Number(o.quantity) || 0), 0)
    productsSoldChange.value = prevProductsSold > 0 ? ((productsSold.value - prevProductsSold) / prevProductsSold) * 100 : (productsSold.value > 0 ? 100 : 0)
    
    // New customers trend
    const firstPurchaseMap = new Map<string, Date>()
    for (const o of allOrders) {
      const buyerId = String(o.buyer_id)
      const orderDate = new Date(o.created_at)
      if (!firstPurchaseMap.has(buyerId) || orderDate < firstPurchaseMap.get(buyerId)!) {
        firstPurchaseMap.set(buyerId, orderDate)
      }
    }
    
    const prevNewCustomers = Array.from(firstPurchaseMap.entries()).filter(
      ([_, date]) => date >= previousStart && date <= previousEnd
    ).length
    
    customersChange.value = prevNewCustomers > 0 ? ((newCustomers.value - prevNewCustomers) / prevNewCustomers) * 100 : (newCustomers.value > 0 ? 100 : 0)
  } catch (err) {
    console.error('Trend calculation error', err)
  }
}

async function fetchDashboard() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('No user authenticated')
      return
    }

    console.log('Fetching orders for seller:', user.id)

    // fetch orders for this seller
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('id, total_price, product_id, quantity, buyer_id, created_at, order_status, payment_status')
      .eq('seller_id', user.id)

    console.log('Orders response:', { ordersErr, ordersLength: orders?.length })

    if (!ordersErr && orders) {
      // apply optional date filters from calendar
      let filteredOrders = orders
      if (startDate.value) {
        const sd = new Date(startDate.value)
        filteredOrders = filteredOrders.filter((o: any) => new Date(o.created_at) >= sd)
      }
      if (endDate.value) {
        const ed = new Date(endDate.value)
        ed.setHours(23, 59, 59, 999)
        filteredOrders = filteredOrders.filter((o: any) => new Date(o.created_at) <= ed)
      }

      totalOrders.value = filteredOrders.length
      totalRevenue.value = filteredOrders.reduce((s: number, o: any) => s + (Number(o.total_price) || 0), 0)
      productsSold.value = filteredOrders.reduce((s: number, o: any) => s + (Number(o.quantity) || 0), 0)

      // Calculate trends by comparing to previous period
      await calculateTrends(orders, filteredOrders)

      // Get first-time customers: find users whose first order is in the current filtered period
      const firstPurchaseMap = new Map<string, Date>()
      for (const o of orders) {
        const buyerId = String(o.buyer_id)
        const orderDate = new Date(o.created_at)
        if (!firstPurchaseMap.has(buyerId) || orderDate < firstPurchaseMap.get(buyerId)!) {
          firstPurchaseMap.set(buyerId, orderDate)
        }
      }

      // Count new customers in current period
      const currentNewCustomers = new Set<string>()
      for (const [buyerId, firstDate] of firstPurchaseMap.entries()) {
        let isInPeriod = true
        if (startDate.value) {
          isInPeriod = isInPeriod && firstDate >= new Date(startDate.value)
        }
        if (endDate.value) {
          const ed = new Date(endDate.value)
          ed.setHours(23, 59, 59, 999)
          isInPeriod = isInPeriod && firstDate <= ed
        }
        if (isInPeriod) {
          currentNewCustomers.add(buyerId)
        }
      }
      newCustomers.value = currentNewCustomers.size

      // aggregate top products by orders
      const map = new Map<string, { sold: number; revenue: number }>()
      for (const o of filteredOrders) {
        if (!o.product_id) continue
        const prev = map.get(o.product_id) || { sold: 0, revenue: 0 }
        prev.sold += Number(o.quantity) || 0
        prev.revenue += Number(o.total_price) || 0
        map.set(o.product_id, prev)
      }

      // fetch product titles
      const productIds = Array.from(map.keys())
      let productsData: any[] = []
      if (productIds.length) {
        const { data: pd } = await supabase.from('products').select('id,title,price').in('id', productIds)
        productsData = pd || []
      }

      // fetch cart counts to include checkout intent/popularity
      const cartCounts: Record<string, number> = {}
      if (productIds.length) {
        const { data: carts } = await supabase.from('cart').select('product_id,quantity').in('product_id', productIds)
        for (const c of carts || []) {
          const pid = String(c.product_id)
          cartCounts[pid] = (cartCounts[pid] || 0) + (Number(c.quantity) || 0)
        }
      }

      const list = Array.from(map.entries()).map(([id, v]) => {
        const prod = productsData.find(p => String(p.id) === String(id)) || { title: 'Unknown', price: 0 }
        const cartCount = cartCounts[id] || 0
        return { id, title: prod.title || prod.name || 'Unknown', sold: v.sold, revenue: v.revenue, cartCount }
      })

      // sort by combined popularity: sold + cartCount
      topProducts.value = list.sort((a, b) => (b.sold + (b.cartCount || 0)) - (a.sold + (a.cartCount || 0))).slice(0, 4)
      
      // if you have a chart component it can be re-rendered here using filteredOrders
      await nextTick()
      renderSalesChart(filteredOrders)
    } else {
      console.error('Orders fetch error:', ordersErr)
    }
  } catch (err) {
    console.error('Dashboard fetch error:', err)
  }
}

function getLabelsBetween(start: Date, end: Date) {
  const msPerDay = 1000 * 60 * 60 * 24
  const days = Math.floor((+end - +start) / msPerDay) + 1
  const labels: string[] = []
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    // use short weekday for small ranges, otherwise month/day
    if (days <= 14) labels.push(d.toLocaleDateString(undefined, { weekday: 'short' }))
    else labels.push(d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
  }
  return { labels, days }
}

function aggregateDailyAmount(orders: any[], opts: { n?: number; start?: string; end?: string }) {
  const msPerDay = 1000 * 60 * 60 * 24
  let labels: string[] = []
  let counts: number[] = []

  if (opts.start && opts.end) {
    const start = new Date(opts.start)
    const end = new Date(opts.end)
    const info = getLabelsBetween(start, end)
    labels = info.labels
    counts = new Array(info.days).fill(0)

    for (const o of orders) {
      const created = new Date(o.created_at)
      if (created < start || created > end) continue
      const idx = Math.floor((+created - +start) / msPerDay)
      if (idx >= 0 && idx < counts.length) counts[idx] += getOrderAmount(o)
    }
  } else {
    const n = opts.n || 7
    const today = new Date()
    const start = new Date(today)
    start.setDate(start.getDate() - (n - 1))
    const info = getLabelsBetween(start, today)
    labels = info.labels
    counts = new Array(info.days).fill(0)

    for (const o of orders) {
      const created = new Date(o.created_at)
      const diff = Math.floor((+today - +created) / msPerDay)
      if (diff >= 0 && diff < n) {
        if (counts && counts[n - 1 - diff] !== undefined) {
          counts[n - 1 - diff] += getOrderAmount(o)
        }
      }
    }
  }

  return { labels, counts }
}

function renderSalesChart(orders: any[]) {
  let labels: string[] = []
  let counts: number[] = []
  if (startDate.value && endDate.value) {
    const { labels: l, counts: c } = aggregateDailyAmount(orders, { start: startDate.value, end: endDate.value })
    labels = l
    counts = c
  } else {
    const n = Number(range.value) || 7
    const { labels: l, counts: c } = aggregateDailyAmount(orders, { n })
    labels = l
    counts = c
  }
  if (!salesChart.value) return
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  chartInstance = new Chart(salesChart.value.getContext('2d') as CanvasRenderingContext2D, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: counts,
          fill: true,
          backgroundColor: 'rgba(59,130,246,0.08)',
          borderColor: 'rgba(59,130,246,0.9)',
          tension: 0.35,
          pointRadius: 0,
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { tooltip: { enabled: false } },
      scales: {
        y: { display: false, beginAtZero: true },
        x: { grid: { display: false }, ticks: { color: '#9CA3AF', padding: 8 } }
      },
      layout: { padding: { left: 8, right: 8, top: 8, bottom: 6 } }
    }
  })
}

onUnmounted(async () => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

watch(range, (val) => {
  // when selecting a preset range, clear any custom date range
  if (['7', '30', '90'].includes(String(val))) {
    startDate.value = ''
    endDate.value = ''
  }
  fetchDashboard()
})

onMounted(() => {
  fetchDashboard()
})
</script>
