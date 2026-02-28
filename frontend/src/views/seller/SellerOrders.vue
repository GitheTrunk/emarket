<template>
  <div class="p-6">
    <div class="bg-white border border-gray-200 rounded shadow-sm p-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Orders</h1>
        <button @click="fetchOrders" class="px-3 py-2 rounded border bg-white">Refresh</button>
      </div>

      <div v-if="loading" class="text-center py-6"><i class="pi pi-spin pi-spinner"></i> Loading orders</div>
      <div v-else>
        <table class="min-w-full text-sm">
          <thead>
          <tr class="text-left text-xs text-gray-500 uppercase">
            <th class="py-2">Order</th>
            <th class="py-2">Buyer</th>
            <th class="py-2">Product</th>
            <th class="py-2">Quantity</th>
            <th class="py-2">Total</th>
            <th class="py-2">Status</th>
            <th class="py-2">Actions</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="o in orders" :key="o.id" class="border-t">
            <td class="py-3">ORD-{{ String(o.id).slice(0,8) }}</td>
            <td class="py-3">{{ o.buyer?.full_name || 'Unknown' }}</td>
            <td class="py-3">{{ o.product?.title || 'Unknown' }}</td>
            <td class="py-3">{{ o.quantity }}</td>
            <td class="py-3">{{ formatCurrency(Number(o.total_price)) }}</td>
            <td class="py-3 capitalize">{{ o.order_status }}</td>
            <td class="py-3">
              <button
                  @click="viewOrder(o)"
                  class="px-3 py-1 rounded bg-orange-500 text-white text-xs"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="!orders.length">
            <td colspan="7" class="py-6 text-center text-gray-500">No orders yet.</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order details modal -->
    <OrderDetails
      v-if="showModal"
      :selectedOrder="selectedOrder"
      :showModal="showModal"
      :modalLoading="modalLoading"
      @close="closeModal" 
      @updateStatus="updateStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import supabase from '@/lib/supabase'
import OrderDetails from '@/components/seller/OrderDetails.vue'
import 'primeicons/primeicons.css'

const loading = ref(true)
const orders = ref<any[]>([])

const showModal = ref(false)
const modalLoading = ref(false)
const selectedOrder = ref<any | null>(null)

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)
const formatDate = (v: string) => new Date(v).toLocaleString('km-KH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

// =====================
// FETCH SELLER ORDERS
// =====================
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
        .select(`
        id,
        quantity,
        total_price,
        order_status,
        created_at,
        buyer:profiles!orders_buyer_id_fkey(full_name),
        product:products(title)
      `)
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

function viewOrder(order: any) {
  selectedOrder.value = order
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedOrder.value = null
}

async function updateStatus(orderId: string, newStatus: string) {
  try {
    const { error } = await supabase
        .from('orders')
        .update({ order_status: newStatus })
        .eq('id', orderId)

    if (error) throw error

    // Fetch updated order and update selectedOrder
    const { data: updatedOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`*, buyer:profiles!orders_buyer_id_fkey(full_name), product:products(title)`)
      .eq('id', orderId)
      .single()
    if (fetchError) throw fetchError
    selectedOrder.value = updatedOrder

    await fetchOrders()
  } catch (err) {
    console.error('Failed to update order status', err)
    alert('Failed to update order: ' + (err as any).message)
  }
}

onMounted(fetchOrders)
</script>
