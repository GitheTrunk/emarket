<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Transactions</h1>
    <div class="bg-white rounded-xl shadow-sm border p-4">
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div v-for="n in 4" :key="n" class="p-4 rounded-lg bg-gray-50 border animate-pulse">
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div v-else-if="error" class="text-red-600 py-4 mb-4">{{ error }}</div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="p-4 rounded-lg bg-green-50 border">
          <p class="text-sm text-gray-500">Total Revenue</p>
          <p class="text-xl font-semibold">{{ formatCurrency(stats.totalRevenue) }}</p>
        </div>
        <div class="p-4 rounded-lg bg-blue-50 border">
          <p class="text-sm text-gray-500">Orders</p>
          <p class="text-xl font-semibold">{{ stats.totalOrders }}</p>
        </div>
        <div class="p-4 rounded-lg bg-yellow-50 border">
          <p class="text-sm text-gray-500">Pending</p>
          <p class="text-xl font-semibold">{{ stats.pendingOrders }}</p>
        </div>
        <div class="p-4 rounded-lg bg-red-50 border">
          <p class="text-sm text-gray-500">Refunds</p>
          <p class="text-xl font-semibold">{{ stats.totalRefunds }}</p>
        </div>
      </div>

      <div v-if="loading" class="border rounded-lg p-4">
        <div class="h-4 bg-gray-200 rounded mb-4"></div>
        <div class="h-40 bg-gray-100 rounded"></div>
      </div>
      <div v-else-if="error" class="border rounded-lg p-4 text-red-600">
        Failed to load transaction data
      </div>
      <div v-else class="border rounded-lg p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg">Transaction History</h3>
          <div class="flex space-x-2">
            <select v-model="statusFilter" @change="filterTransactions" class="border rounded px-3 py-2 text-sm">
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button @click="exportTransactions" class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
              Export
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-500 text-sm border-b">
                <th class="py-2">Transaction ID</th>
                <th class="py-2">Buyer</th>
                <th class="py-2">Seller</th>
                <th class="py-2">Product</th>
                <th class="py-2">Amount</th>
                <th class="py-2">Status</th>
                <th class="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" class="border-b hover:bg-gray-50">
                <td class="py-3 text-sm font-medium">{{ transaction.id }}</td>
                <td class="py-3 text-sm">{{ transaction.buyer?.full_name || 'Unknown' }}</td>
                <td class="py-3 text-sm">{{ transaction.seller?.full_name || 'Unknown' }}</td>
                <td class="py-3 text-sm">{{ transaction.product?.title || 'Unknown Product' }}</td>
                <td class="py-3 text-sm font-medium">{{ formatCurrency(transaction.amount) }}</td>
                <td class="py-3">
                  <span :class="getStatusClass(transaction.status)" class="px-2 py-1 text-xs rounded-full">
                    {{ transaction.status }}
                  </span>
                </td>
                <td class="py-3 text-sm">{{ formatDate(transaction.created_at) }}</td>
              </tr>
              <tr v-if="filteredTransactions.length === 0" class="border-b">
                <td colspan="7" class="py-4 text-center text-gray-500">No transactions found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '../../services/api'

interface Transaction {
  id: string
  buyer_id: string
  seller_id: string
  product_id: string
  amount: number
  status: string
  created_at: string
  buyer?: {
    full_name: string
    email: string
  }
  seller?: {
    full_name: string
    email: string
  }
  product?: {
    title: string
  }
}

const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')
const statusFilter = ref('')

const stats = ref({
  totalRevenue: 0,
  totalOrders: 0,
  pendingOrders: 0,
  totalRefunds: 0
})

const filteredTransactions = computed(() => {
  if (!statusFilter.value) return transactions.value
  return transactions.value.filter(txn => txn.status === statusFilter.value)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  const classes = {
    'completed': 'bg-green-100 text-green-700',
    'pending': 'bg-yellow-100 text-yellow-700',
    'processing': 'bg-blue-100 text-blue-700',
    'cancelled': 'bg-red-100 text-red-700'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700'
}

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get('/admin/transactions')

    transactions.value = data

    // Calculate stats
    stats.value = {
      totalRevenue: data.reduce((sum: number, txn: Transaction) => sum + txn.amount, 0),
      totalOrders: data.length,
      pendingOrders: data.filter((txn: Transaction) => txn.status === 'pending').length,
      totalRefunds: 0 // Mock - would calculate from actual refund data
    }

  } catch (err: any) {
    console.error('Error fetching transactions:', err)
    error.value = err.message || 'Failed to load transactions'
  } finally {
    loading.value = false
  }
}

const filterTransactions = () => {
  // Filtering is handled by computed property
}

const exportTransactions = () => {
  // TODO: Implement export functionality
  alert('Export functionality will be implemented soon')
}

onMounted(() => {
  fetchTransactions()
})
</script>
