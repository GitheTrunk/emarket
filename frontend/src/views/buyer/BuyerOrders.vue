<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
        <router-link to="/buyer/dashboard" class="text-orange-600 hover:text-orange-700 font-medium flex items-center">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Shopping
        </router-link>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="i in 3" :key="i" class="h-32 bg-white animate-pulse rounded-xl border border-gray-200"></div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900">No orders yet</h3>
        <p class="text-gray-500 mt-2">When you buy something, it will appear here.</p>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
            <div class="flex gap-6">
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Order Placed</p>
                <p class="text-sm text-gray-900">{{ formatDate(order.created_at) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase font-semibold tracking-wider">Total Amount</p>
                <p class="text-sm font-bold text-gray-900">${{ order.total_price }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span :class="statusClass(order.payment_status)" class="px-3 py-1 rounded-full text-xs font-medium uppercase">
                {{ order.payment_status }}
              </span>
              <span :class="orderStatusClass(order.order_status)" class="px-3 py-1 rounded-full text-xs font-medium uppercase border">
                {{ order.order_status }}
              </span>
            </div>
          </div>

          <div class="p-6 flex items-center gap-6">
            <div class="bg-orange-50 p-4 rounded-lg">
              <svg class="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
            <div class="flex-1">
              <h4 class="text-gray-900 font-semibold text-lg">Order #{{ order.id.slice(0, 8) }}</h4>
              <p class="text-gray-500 text-sm mt-1">
                Sold by: {{ order.seller?.full_name || 'Unknown seller' }}
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import supabase from '@/lib/supabase'

const orders = ref<any[]>([])
const loading = ref(true)

let channel: any = null

// ---------- Fetch buyer orders ----------
const fetchOrders = async () => {
  try {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
        .from('orders')
        .select(`
        *,
        seller:profiles!orders_seller_id_fkey(full_name, store_name)
      `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })

    if (error) throw error
    orders.value = data || []
  } catch (err) {
    console.error('Error fetching orders:', err)
  } finally {
    loading.value = false
  }
}

// ---------- Realtime listener ----------
const subscribeToOrders = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  channel = supabase
      .channel('buyer-orders')
      .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'orders',
            filter: `buyer_id=eq.${user.id}`
          },
          payload => {
            const updated = payload.new
            const idx = orders.value.findIndex(o => o.id === updated.id)
            if (idx !== -1) orders.value[idx] = updated
          }
      )
      .subscribe()
}

// ---------- Helpers ----------
const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })

const statusClass = (status: string) => {
  switch (status) {
    case 'paid': return 'bg-green-100 text-green-700'
    case 'pending': return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const orderStatusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'border-green-200 text-green-600'
    case 'pending': return 'border-orange-200 text-orange-600'
    case 'cancelled': return 'border-red-200 text-red-600'
    default: return 'border-gray-200 text-gray-600'
  }
}

// ---------- Lifecycle ----------
onMounted(async () => {
  await fetchOrders()
  await subscribeToOrders()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
})
</script>
