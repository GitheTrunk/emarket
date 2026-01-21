<template>
  <div class="p-6">
    <div class="bg-white border border-gray-200 rounded shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Orders</h1>
        <button @click="fetchOrders" class="px-3 py-2 rounded border bg-white">Refresh</button>
      </div>

      <div v-if="loading" class="text-center py-6">Loading orders…</div>
      <div v-else>
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-gray-500 uppercase">
              <th class="py-2">Order</th>
              <th class="py-2">Buyer</th>
              <th class="py-2">Amount</th>
              <th class="py-2">Status</th>
              <th class="py-2">Created</th>
              <th class="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id" class="border-t">
              <td class="py-3">ORD-{{ String(o.id).slice(0,8) }}</td>
              <td class="py-3">{{ o.buyer_id || 'N/A' }}</td>
              <td class="py-3">{{ formatCurrency(Number(o.total_price || o.amount || 0)) }}</td>
              <td class="py-3">{{ o.order_status || o.status || 'unknown' }}</td>
              <td class="py-3">{{ formatDate(o.created_at) }}</td>
              <td class="py-3">
                <button @click="viewOrder(o)" class="px-3 py-1 rounded bg-orange-500 text-white text-xs">View</button>
              </td>
            </tr>
            <tr v-if="!orders.length">
              <td colspan="6" class="py-6 text-center text-gray-500">No orders yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order details modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold">Order Details</h3>
          <button @click="closeModal" class="text-gray-500">Close</button>
        </div>
        <div v-if="modalLoading" class="py-6 text-center">Loading…</div>
        <div v-else>
          <div class="mb-3 text-sm text-gray-600">Order: ORD-{{ String(selectedOrder?.id || '').slice(0,8) }}</div>
          <div class="mb-3 text-sm text-gray-600">Buyer: {{ selectedOrder?.buyer_id || 'N/A' }}</div>
          <div class="mb-3 text-sm text-gray-600">Total: {{ formatCurrency(Number(selectedOrder?.total_price || selectedOrder?.amount || 0)) }}</div>

          <div class="border-t pt-3">
            <h4 class="font-medium mb-2">Items</h4>
            <ul class="space-y-2">
              <li v-for="it in orderItems" :key="it.id" class="flex justify-between">
                <div>
                  <div class="font-medium">{{ it.products?.title || it.product_title || 'Item' }}</div>
                  <div class="text-xs text-gray-500">Qty: {{ it.quantity }}</div>
                </div>
                <div class="font-medium">{{ formatCurrency(Number(it.price || it.unit_price || 0)) }}</div>
              </li>
              <li v-if="!orderItems.length" class="text-sm text-gray-500">No items found.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import supabase from '@/lib/supabase'

const loading = ref(true)
const orders = ref<any[]>([])

const showModal = ref(false)
const modalLoading = ref(false)
const selectedOrder = ref<any | null>(null)
const orderItems = ref<any[]>([])

const formatCurrency = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
const formatDate = (v: string) => new Date(v).toLocaleString()

async function fetchOrders() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      orders.value = []
      return
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    orders.value = data || []
  } catch (err) {
    console.error('Failed to fetch orders', err)
    orders.value = []
  } finally {
    loading.value = false
  }
}

async function viewOrder(order: any) {
  selectedOrder.value = order
  showModal.value = true
  modalLoading.value = true
  orderItems.value = []
  try {
    // fetch order_items and join product title if available
    const { data, error } = await supabase
      .from('order_items')
      .select('*, products(title)')
      .eq('order_id', order.id)

    if (error) {
      console.warn('Could not fetch order items with product join, trying without join', error)
      const { data: items, error: e2 } = await supabase.from('order_items').select('*').eq('order_id', order.id)
      if (e2) throw e2
      orderItems.value = items || []
    } else {
      orderItems.value = data || []
    }
  } catch (err) {
    console.error('Failed to load order items', err)
    orderItems.value = []
  } finally {
    modalLoading.value = false
  }
}

function closeModal() {
  showModal.value = false
  selectedOrder.value = null
  orderItems.value = []
}

onMounted(fetchOrders)
</script>
