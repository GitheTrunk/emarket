<template>
  <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-0 overflow-hidden">
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h3 class="font-bold text-lg text-gray-900 tracking-wide">ORDER</h3>
          <p class="text-xs text-gray-400 mt-1">
            ORD-{{ String(selectedOrder?.id || '').slice(0, 8) }}
          </p>
        </div>
        <button
          @click="closeModal"
          class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <i class="pi pi-times"></i>
        </button>
      </div>
      <div v-if="modalLoading" class="py-10 text-center text-gray-400">
        <i class="pi pi-spin pi-spinner"></i> Processing
      </div>
      <div v-else class="px-6 py-6">
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
            <span class="text-xs text-gray-400 font-semibold">BUYER</span>
            <span class="text-base font-bold text-gray-900">{{
              selectedOrder?.buyer?.full_name || 'Unknown'
            }}</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 items-end">
            <span class="text-xs text-gray-400 font-semibold">STATUS</span>
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold',
                statusColor(selectedOrder?.order_status),
              ]"
              >{{ selectedOrder?.order_status }}</span
            >
          </div>
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 col-span-2">
            <span class="text-xs text-gray-400 font-semibold">PRODUCT</span>
            <span class="text-base font-bold text-gray-900">{{
              selectedOrder?.product?.title || 'Unknown'
            }}</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1">
            <span class="text-xs text-gray-400 font-semibold">QUANTITY</span>
            <span class="text-base font-bold text-gray-900">{{ selectedOrder?.quantity }}</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 items-end">
            <span class="text-xs text-gray-400 font-semibold">TOTAL</span>
            <span class="text-base font-bold text-purple-700">{{
              formatCurrency(Number(selectedOrder?.total_price || 0))
            }}</span>
          </div>
          <div class="bg-gray-50 rounded-lg p-4 flex flex-col gap-1 col-span-2">
            <span class="text-xs text-gray-400 font-semibold">CREATED AT</span>
            <span class="text-base font-bold text-gray-900">{{
              formatDate(selectedOrder?.created_at)
            }}</span>
          </div>
        </div>
        <Teleport to="body">
          <div class="fixed inset-0 bg-black/40 z-40" @click="closeModal"></div>
        </Teleport>
        <div class="mb-6">
          <p class="text-sm font-bold text-gray-900 mb-4">Order Progress</p>
          <div class="h-1.5 bg-gray-200 rounded-full mb-5 overflow-hidden">
            <div
              class="h-full bg-orange-500 rounded-full transition-all duration-700"
              :style="{ width: progressWidth }"
            ></div>
          </div>
          <div class="flex justify-between">
            <div
              v-for="step in steps"
              :key="step.key"
              class="flex flex-col items-center gap-1.5 flex-1"
            >
              <div class="w-8 h-8">
                <div
                  v-if="stepDone(step.key)"
                  class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <i class="pi pi-check-circle text-white text-sm"></i>
                </div>
                <div
                  v-else
                  class="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center"
                >
                  <i class="pi pi-box text-gray-400 text-xl"></i>
                </div>
              </div>
              <p
                class="text-xs font-semibold"
                :class="stepDone(step.key) ? 'text-gray-700' : 'text-gray-400'"
              >
                {{ step.label }}
              </p>
            </div>
          </div>
        </div>
        <!-- Timeline -->
        <ul class="timeline text-xs">
          <li v-if="selectedOrder.ordered_at" class="flex justify-between items-center py-1">
            <span class="font-bold text-gray-900">Ordered</span>
            <span class="text-gray-500">{{ formatDate(selectedOrder.ordered_at) }}</span>
          </li>
          <li v-if="selectedOrder.confirmed_at" class="flex justify-between items-center py-1">
            <span class="font-bold text-gray-900">Confirmed</span>
            <span class="text-gray-500">{{ formatDate(selectedOrder.confirmed_at) }}</span>
          </li>
          <li v-if="selectedOrder.processed_at" class="flex justify-between items-center py-1">
            <span class="font-bold text-gray-900">Processed</span>
            <span class="text-gray-500">{{ formatDate(selectedOrder.processed_at) }}</span>
          </li>
          <li v-if="selectedOrder.shipped_at" class="flex justify-between items-center py-1">
            <span class="font-bold text-gray-900">Shipped</span>
            <span class="text-gray-500">{{ formatDate(selectedOrder.shipped_at) }}</span>
          </li>
          <li v-if="selectedOrder.delivered_at" class="flex justify-between items-center py-1">
            <span class="font-bold text-gray-900">Delivered</span>
            <span class="text-gray-500">{{ formatDate(selectedOrder.delivered_at) }}</span>
          </li>
          <li v-if="selectedOrder.completed_at" class="flex justify-between items-center py-1">
            <span class="font-bold text-gray-900">Completed</span>
            <span class="text-gray-500">{{ formatDate(selectedOrder.completed_at) }}</span>
          </li>
          <li v-if="selectedOrder.cancelled_at" class="flex justify-between items-center py-1">
            <span class="font-bold text-gray-900">Cancelled</span>
            <span class="text-gray-500">{{ formatDate(selectedOrder.cancelled_at) }}</span>
          </li>
        </ul>
        <div
          class="flex gap-3 mt-2"
          v-if="selectedOrder && !['completed', 'cancelled'].includes(selectedOrder.order_status)"
        >
          <button
            v-if="selectedOrder.order_status === 'pending'"
            @click="handleUpdateStatus(selectedOrder.id, 'confirmed')"
            class="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700"
          >
            Confirm Order
          </button>
          <button
            v-if="selectedOrder.order_status === 'confirmed'"
            @click="handleUpdateStatus(selectedOrder.id, 'processed')"
            class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700"
          >
            Mark as Processed
          </button>
          <button
            v-if="selectedOrder.order_status === 'processed'"
            @click="handleUpdateStatus(selectedOrder.id, 'shipped')"
            class="flex-1 bg-yellow-600 text-white py-2 rounded-lg font-bold hover:bg-yellow-700"
          >
            Mark as Shipped
          </button>
          <button
            v-if="selectedOrder.order_status === 'shipped'"
            @click="handleUpdateStatus(selectedOrder.id, 'delivered')"
            class="flex-1 bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700"
          >
            Mark as Delivered
          </button>
          <button
            v-if="selectedOrder.order_status === 'delivered'"
            @click="handleUpdateStatus(selectedOrder.id, 'completed')"
            class="flex-1 bg-gray-600 text-white py-2 rounded-lg font-bold hover:bg-gray-700"
          >
            Mark as Completed
          </button>
          <button
            v-if="!['completed', 'cancelled'].includes(selectedOrder.order_status)"
            @click="handleUpdateStatus(selectedOrder.id, 'cancelled')"
            class="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700"
          >
            Cancel Order
          </button>
        </div>
        <div v-else class="text-sm text-gray-500 text-right mt-4">
          This order is {{ selectedOrder?.order_status }}.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  selectedOrder: any
  showModal: boolean
  modalLoading: boolean
}>()

const steps = [
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processed', label: 'Processed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
]
const statusOrder = ['confirmed', 'processed', 'shipped', 'delivered', 'completed']
const emit = defineEmits(['close', 'updateStatus'])

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v)

const formatDate = (v: string) => new Date(v).toLocaleString()

// Progress
const currentStepIndex = computed(() =>
  statusOrder.indexOf(props.selectedOrder?.order_status ?? 'confirmed'),
)

const progressWidth = computed(() => {
  const pct = (currentStepIndex.value / (steps.length - 1)) * 100
  return `${Math.max(0, pct)}%`
})

function stepDone(key: string) {
  return statusOrder.indexOf(key) <= currentStepIndex.value
}

const statusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processed: 'bg-cyan-100 text-cyan-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-indigo-100 text-indigo-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

function closeModal() {
  emit('close')
}

function handleUpdateStatus(orderId: string, status: string) {
  emit('updateStatus', orderId, status)
}
</script>
