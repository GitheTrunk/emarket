<template>
  <!-- Backdrop -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/40 backdrop-blur-sm"
        @click.self="$emit('update:modelValue', false)"
      >
        <Transition name="slide-up">
          <div
            v-if="modelValue"
            class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 class="text-lg font-bold text-gray-900">Order Details</h2>
                <p class="text-xs text-gray-400 mt-0.5">Order #{{ order?.id?.slice(0, 8) }}</p>
              </div>
              <button
                @click="$emit('update:modelValue', false)"
                class="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <i class="pi pi-times"></i>
              </button>
            </div>

            <!-- Scrollable body -->
            <div class="overflow-y-auto flex-1">

              <!-- Loading -->
              <div v-if="loading" class="flex flex-col items-center gap-3 py-16 text-gray-400">
                <div class="w-7 h-7 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
                <p class="text-sm">Loading order details…</p>
              </div>

              <!-- Error -->
              <div v-else-if="error" class="flex flex-col items-center gap-2 py-16 text-red-400">
                <span class="text-2xl">⚠</span>
                <p class="text-sm">{{ error }}</p>
              </div>

              <template v-else-if="detail">
                <!-- Summary bar -->
                <div class="flex flex-wrap gap-6 px-6 py-4 bg-gray-50 border-b border-gray-100">
                  <div>
                    <p class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-0.5">Placed</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ formatDate(detail.ordered_at || detail.created_at) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-0.5">Total</p>
                    <p class="text-sm font-bold text-gray-800">${{ detail.total_price }}</p>
                  </div>
                  <div class="ml-auto flex items-center gap-2">
                    <span :class="paymentClass(detail.payment_status)" class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
                      {{ detail.payment_status }}
                    </span>
                    <span :class="orderStatusClass(detail.order_status)" class="px-2.5 py-1 rounded-full text-xs font-semibold uppercase border">
                      {{ detail.order_status }}
                    </span>
                  </div>
                </div>

                <!-- Delivery Progress -->
                <div class="px-6 py-5 border-b border-gray-100">
                  <p class="text-sm font-bold text-gray-900 mb-4">Delivery Progress</p>

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
                        <div v-if="stepDone(step.key)" class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <i class="pi pi-check-circle text-white text-sm"></i>
                        </div>
                        <div v-else class="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                          <i class="pi pi-box text-gray-400 text-xl"></i>
                        </div>
                      </div>
                      <p class="text-xs font-semibold" :class="stepDone(step.key) ? 'text-gray-700' : 'text-gray-400'">
                        {{ step.label }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Timeline (based on status timestamps) -->
                <div class="px-6 py-5 border-b border-gray-100">
                  <p class="text-sm font-bold text-gray-900 mb-5">Order Timeline</p>
                  <div class="flex flex-col">
                    <div v-for="(step, i) in steps" :key="step.key" class="grid gap-x-3.5" style="grid-template-columns: 32px 1fr; grid-template-rows: auto 1fr">
                      <div class="row-start-1 col-start-1 w-8 h-8">
                        <div v-if="stepDone(step.key)" class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <i class="pi pi-check-circle text-white text-sm"></i>
                        </div>
                        <div v-else class="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center"><i class="pi pi-box text-gray-400"></i></div>
                      </div>
                      <div v-if="i < steps.length - 1" class="row-start-2 col-start-1 w-0.5 bg-green-200 mx-auto min-h-5 my-1 rounded-full"></div>
                      <div class="row-start-1 row-end-3 col-start-2 pb-4">
                        <div class="flex items-center gap-2 mb-0.5">
                          <span class="text-sm font-bold text-gray-900">{{ step.label }}</span>
                          <span v-if="detail.order_status === step.key" class="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full">Current</span>
                        </div>
                        <p class="text-xs text-gray-500 mb-0.5">Order {{ step.label.toLowerCase() }}</p>
                        <p class="text-[11px] text-gray-400">{{ stepDate(step.key) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import supabase from '@/lib/supabase'
import 'primeicons/primeicons.css'

// Props / Emits
const props = defineProps<{
  modelValue: boolean   
  order: any           
}>()
const emit = defineEmits(['update:modelValue'])

// State
const detail  = ref<any>(null)
const loading = ref(false)
const error   = ref<string | null>(null)

// Steps config
const steps = [
  { key: 'ordered',   label: 'Ordered'   },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped',   label: 'Shipped'   },
  { key: 'delivered', label: 'Delivered' },
  { key: 'completed', label: 'Completed' },
]
const statusOrder = ['ordered', 'confirmed', 'shipped', 'delivered', 'completed']

// Fetch full order detail when modal opens
watch(() => props.modelValue, async (open) => {
  if (!open || !props.order?.id) return
  await fetchDetail(props.order.id)
})

async function fetchDetail(orderId: string) {
  loading.value = true
  error.value   = null
  detail.value  = null

  const { data, error: err } = await supabase
    .from('orders')
    .select(`*`)
    .eq('id', orderId)
    .single()

  if (err) {
    error.value = err.message
  } else {
    detail.value = data
  }

  loading.value = false
}

// Progress
const currentStepIndex = computed(() =>
  statusOrder.indexOf(detail.value?.order_status ?? 'ordered')
)

const progressWidth = computed(() => {
  const pct = (currentStepIndex.value / (steps.length - 1)) * 100
  return `${Math.max(0, pct)}%`
})

function stepDone(key: string) {
  return statusOrder.indexOf(key) <= currentStepIndex.value
}

function stepDate(key: string) {
  if (!detail.value) return ''
  const map: Record<string, string> = {
    ordered:   detail.value.ordered_at,
    confirmed: detail.value.confirmed_at,
    shipped:   detail.value.shipped_at,
    delivered: detail.value.delivered_at,
    completed: detail.value.completed_at,
  }
  return map[key] ? shortDate(map[key]) : ''
}

// Timeline is now based on status steps and timestamps only

// Badge helpers (keep consistent with BuyerOrders)
const paymentClass = (status: string) => {
  switch (status) {
    case 'paid':    return 'bg-green-100 text-green-700'
    case 'pending': return 'bg-yellow-100 text-yellow-700'
    default:        return 'bg-gray-100 text-gray-700'
  }
}
const orderStatusClass = (status: string) => {
  switch (status) {
    case 'completed': return 'border-green-200 text-green-600'
    case 'pending':   return 'border-orange-200 text-orange-600'
    case 'cancelled': return 'border-red-200 text-red-600'
    default:          return 'border-gray-200 text-gray-600'
  }
}

// Date utils 
const formatDate     = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const shortDate      = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })

const timelineSteps = [
  { key: 'ordered', label: 'Order Placed', time: detail.value?.ordered_at },
  { key: 'confirmed', label: 'Order Confirmed', time: detail.value?.confirmed_at },
  { key: 'processed', label: 'Order Processed', time: detail.value?.processed_at },
  { key: 'shipped', label: 'Shipped', time: detail.value?.shipped_at },
  { key: 'delivered', label: 'Delivered', time: detail.value?.delivered_at },
  { key: 'completed', label: 'Completed', time: detail.value?.completed_at },
  { key: 'cancelled', label: 'Cancelled', time: detail.value?.cancelled_at },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active { transition: opacity .25s ease, transform .25s ease; }
.slide-up-leave-active { transition: opacity .2s ease, transform .2s ease; }
.slide-up-enter-from { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to  { opacity: 0; transform: translateY(8px); }
</style>