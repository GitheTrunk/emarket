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
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg">Order Details</h3>
          <button @click="closeModal" class="text-gray-500">Close</button>
        </div>

        <div v-if="modalLoading" class="py-6 text-center">Processing…</div>

        <div v-else>
          <div class="space-y-2 text-sm text-gray-700 mb-4">
            <p><b>Order:</b> ORD-{{ String(selectedOrder?.id || '').slice(0,8) }}</p>
            <p><b>Buyer:</b> {{ selectedOrder?.buyer?.full_name || 'Unknown' }}</p>
            <p><b>Product:</b> {{ selectedOrder?.product?.title || 'Unknown' }}</p>
            <p><b>Quantity:</b> {{ selectedOrder?.quantity }}</p>
            <p><b>Total:</b> {{ formatCurrency(Number(selectedOrder?.total_price || 0)) }}</p>
            <p><b>Status:</b> {{ selectedOrder?.order_status }}</p>
            <p><b>Created At:</b> {{ formatDate(selectedOrder?.created_at) }}</p>
            <template v-if="selectedOrder">
              <p v-if="selectedOrder.ordered_at"><b>Ordered At:</b> {{ formatDate(selectedOrder.ordered_at) }}</p>
              <p v-if="selectedOrder.confirmed_at"><b>Confirmed At:</b> {{ formatDate(selectedOrder.confirmed_at) }}</p>
              <p v-if="selectedOrder.processed_at"><b>Processed At:</b> {{ formatDate(selectedOrder.processed_at) }}</p>
              <p v-if="selectedOrder.shipped_at"><b>Shipped At:</b> {{ formatDate(selectedOrder.shipped_at) }}</p>
              <p v-if="selectedOrder.delivered_at"><b>Delivered At:</b> {{ formatDate(selectedOrder.delivered_at) }}</p>
              <p v-if="selectedOrder.completed_at"><b>Completed At:</b> {{ formatDate(selectedOrder.completed_at) }}</p>
              <p v-if="selectedOrder.cancelled_at"><b>Cancelled At:</b> {{ formatDate(selectedOrder.cancelled_at) }}</p>
            </template>
          </div>

          <div class="flex gap-3 mt-4" v-if="selectedOrder && !['completed','cancelled'].includes(selectedOrder.order_status)">
            <button
              v-if="selectedOrder.order_status === 'pending'"
              @click="updateStatus(selectedOrder.id, 'confirmed')"
              class="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >Confirm Order</button>
            <button
              v-if="selectedOrder.order_status === 'confirmed'"
              @click="updateStatus(selectedOrder.id, 'processed')"
              class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >Mark as Processed</button>
            <button
              v-if="selectedOrder.order_status === 'processed'"
              @click="updateStatus(selectedOrder.id, 'shipped')"
              class="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700"
            >Mark as Shipped</button>
            <button
              v-if="selectedOrder.order_status === 'shipped'"
              @click="updateStatus(selectedOrder.id, 'delivered')"
              class="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >Mark as Delivered</button>
            <button
              v-if="selectedOrder.order_status === 'delivered'"
              @click="updateStatus(selectedOrder.id, 'completed')"
              class="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >Mark as Completed</button>
            <button
              v-if="!['completed','cancelled'].includes(selectedOrder.order_status)"
              @click="updateStatus(selectedOrder.id, 'cancelled')"
              class="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >Cancel Order</button>
          </div>
          <div v-else class="text-sm text-gray-500 text-right mt-4">
            This order is {{ selectedOrder?.order_status }}.
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

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)

const formatDate = (v: string) => new Date(v).toLocaleString()

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

// =====================
// VIEW ORDER MODAL
// =====================
function viewOrder(order: any) {
  selectedOrder.value = order
  showModal.value = true
}

// =====================
// CLOSE MODAL
// =====================
function closeModal() {
  showModal.value = false
  selectedOrder.value = null
}

// =====================
// UPDATE ORDER STATUS
// =====================

const statusToTimestampField: Record<string, string> = {
  confirmed: 'confirmed_at',
  processed: 'processed_at',
  shipped: 'shipped_at',
  delivered: 'delivered_at',
  completed: 'completed_at',
  cancelled: 'cancelled_at',
};

async function updateStatus(orderId: string, status: 'confirmed' | 'cancelled' | 'processed' | 'shipped' | 'delivered' | 'completed') {
  try {
    modalLoading.value = true;
    const updateData: Record<string, any> = { order_status: status };
    const timestampField = statusToTimestampField[status];
    if (timestampField) {
      updateData[timestampField] = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);
    // Ensure only the seller can update their order
    //.eq('seller_id', currentUserId)

    if (error) throw error;

    // Update local UI
    const idx = orders.value.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders.value[idx].order_status = status;
      if (timestampField) orders.value[idx][timestampField] = updateData[timestampField];
    }
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value.order_status = status;
      if (timestampField) selectedOrder.value[timestampField] = updateData[timestampField];
    }

    closeModal();
  } catch (err) {
    console.error('Failed to update order status', err);
    alert('Failed to update order: ' + (err as any).message);
  } finally {
    modalLoading.value = false;
  }
}


onMounted(fetchOrders)
</script>
