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
        <div class="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">+0.0%</div>
      </div>

      <div class="p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between min-h-[88px]">
        <div class="flex flex-col">
          <p class="text-sm text-gray-400">Total Orders</p>
          <p class="text-3xl font-bold mt-1">{{ totalOrders }}</p>
        </div>
        <div class="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">+0.0%</div>
      </div>

      <div class="p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between min-h-[88px]">
        <div class="flex flex-col">
          <p class="text-sm text-gray-400">Products Sold</p>
          <p class="text-3xl font-bold mt-1">{{ productsSold }}</p>
        </div>
        <div class="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">-0.0%</div>
      </div>

      <div class="p-6 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-between min-h-[88px]">
        <div class="flex flex-col">
          <p class="text-sm text-gray-400">New Customers</p>
          <p class="text-3xl font-bold mt-1">{{ newCustomers }}</p>
        </div>
        <div class="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">+0.0%</div>
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
import { ref, reactive, onMounted, computed, onUnmounted, watch, nextTick } from 'vue'
import supabase from '@/lib/supabase'
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
} from 'chart.js'

Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip)

const totalRevenue = ref(0)
const totalOrders = ref(0)
const productsSold = ref(0)
const newCustomers = ref(0)
const topProducts = ref<any[]>([])
const range = ref('7')
const showCalendar = ref(false)
const startDate = ref('')
const endDate = ref('')
const salesChart = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null
const ordersCache = ref<any[]>([])
let ordersChannel: any = null

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

async function fetchDashboard() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // fetch orders for this seller
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('id, amount, product_id, quantity, buyer_id, created_at, status')
      .eq('seller_id', user.id)

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
      totalRevenue.value = filteredOrders.reduce((s: number, o: any) => s + (Number(o.amount) || 0), 0)
      productsSold.value = filteredOrders.reduce((s: number, o: any) => s + (Number(o.quantity) || 0), 0)

      // new customers in last 30 days
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - 30)
      const recentBuyers = filteredOrders.filter((o: any) => new Date(o.created_at) >= cutoff).map((o: any) => o.buyer_id)
      newCustomers.value = Array.from(new Set(recentBuyers)).length

      // aggregate top products by orders
      const map = new Map<string, { sold: number; revenue: number }>()
      for (const o of filteredOrders) {
        if (!o.product_id) continue
        const prev = map.get(o.product_id) || { sold: 0, revenue: 0 }
        prev.sold += Number(o.quantity) || 0
        prev.revenue += Number(o.amount) || 0
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
      ordersCache.value = filteredOrders
      await nextTick()
      renderSalesChart(filteredOrders)
    }
  } catch (err) {
    console.error('Dashboard fetch error', err)
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
      if (idx >= 0 && idx < counts.length) counts[idx] += Number(o.amount) || Number(o.total_price) || 0
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
        counts[n - 1 - diff] += Number(o.amount) || Number(o.total_price) || 0
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
        x: { grid: { display: false, drawBorder: false }, ticks: { color: '#9CA3AF', padding: 8 } }
      },
      layout: { padding: { left: 8, right: 8, top: 8, bottom: 6 } }
    }
  })
}

// setup realtime subscription to orders for this seller
async function setupRealtime() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    // remove existing channel if present
    if (ordersChannel) {
      try { await supabase.removeChannel(ordersChannel) } catch {}
      ordersChannel = null
    }

    ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `seller_id=eq.${user.id}` }, (payload) => {
        // simple approach: refetch dashboard on any change
        fetchDashboard()
      })
      .subscribe()
  } catch (err) {
    console.warn('Realtime setup failed', err)
  }
}

onUnmounted(async () => {
  if (ordersChannel) {
    try { await supabase.removeChannel(ordersChannel) } catch (e) { /* ignore */ }
    ordersChannel = null
  }
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
  setupRealtime()
})

onMounted(fetchDashboard)
</script>
