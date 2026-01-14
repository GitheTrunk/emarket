<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Reports</h1>
    <div class="bg-white rounded-xl shadow-sm border p-4">
      <div class="flex items-center justify-between mb-4">
        <select v-model="selectedPeriod" @change="fetchReports" class="border rounded px-3 py-2">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last quarter</option>
        </select>
        <button @click="exportReports" class="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">Export</button>
      </div>

      <div v-if="loading" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div class="border rounded-lg p-4 animate-pulse">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-20 bg-gray-100 rounded"></div>
          </div>
          <div class="border rounded-lg p-4 animate-pulse">
            <div class="h-4 bg-gray-200 rounded mb-2"></div>
            <div class="h-20 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-red-600 py-4">
        {{ error }}
        <button @click="fetchReports" class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Retry
        </button>
      </div>

      <div v-else class="grid md:grid-cols-2 gap-4">
        <!-- Sales Report -->
        <div class="border rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">Sales Report</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Total Sales:</span>
              <span class="font-semibold">{{ formatCurrency(reports.sales.totalSales) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Total Orders:</span>
              <span class="font-semibold">{{ reports.sales.totalOrders }}</span>
            </div>
            <div class="flex justify-between">
              <span>Average Order Value:</span>
              <span class="font-semibold">{{ formatCurrency(reports.sales.averageOrderValue) }}</span>
            </div>
          </div>
        </div>

        <!-- Users Report -->
        <div class="border rounded-lg p-4">
          <h3 class="text-lg font-semibold mb-4">Users Report</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Total Users:</span>
              <span class="font-semibold">{{ reports.users.activeUsers }}</span>
            </div>
            <div class="flex justify-between">
              <span>New Users:</span>
              <span class="font-semibold text-green-600">{{ reports.users.newUsers }}</span>
            </div>
            <div class="flex justify-between">
              <span>Growth Rate:</span>
              <span class="font-semibold">{{ reports.users.growthRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Categories -->
      <div v-if="!loading && !error" class="mt-6">
        <h3 class="text-lg font-semibold mb-4">Top Categories</h3>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-gray-500 text-sm border-b">
                <th class="py-2">Category</th>
                <th class="py-2">Sales</th>
                <th class="py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in reports.sales.topCategories" :key="category.category" class="border-b">
                <td class="py-3">{{ category.category }}</td>
                <td class="py-3 font-medium">{{ formatCurrency(category.sales) }}</td>
                <td class="py-3">
                  <div class="flex items-center">
                    <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div class="bg-blue-600 h-2 rounded-full" :style="{ width: category.percentage + '%' }"></div>
                    </div>
                    {{ category.percentage }}%
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '../../services/api'

interface ReportsData {
  sales: {
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    topCategories: Array<{
      category: string
      sales: number
      percentage: number
    }>
    salesTrend: Array<{
      date: string
      sales: number
    }>
  }
  users: {
    newUsers: number
    activeUsers: number
    growthRate: number
  }
  period: string
}

const selectedPeriod = ref('30')
const reports = ref<ReportsData>({
  sales: {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topCategories: [],
    salesTrend: []
  },
  users: {
    newUsers: 0,
    activeUsers: 0,
    growthRate: 0
  },
  period: '30'
})
const loading = ref(false)
const error = ref('')

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const fetchReports = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await api.get(`/admin/reports?period=${selectedPeriod.value}`)
    reports.value = data
  } catch (err: any) {
    console.error('Error fetching reports:', err)
    error.value = err.message || 'Failed to load reports'
  } finally {
    loading.value = false
  }
}

const exportReports = () => {
  // TODO: Implement export functionality
  alert('Export functionality will be implemented soon')
}

onMounted(() => {
  fetchReports()
})
</script>
