<template>
    <div class="space-y-6">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-semibold">Dashboard</h1>
            <select v-model="timeRange" class="border rounded px-3 py-2">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
            </select>
        </div>

        <!-- KPI Cards -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div v-for="n in 4" :key="n" class="bg-white border rounded-xl p-4 shadow-sm animate-pulse">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-8 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded"></div>
            </div>
        </div>
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4">
            <p class="text-red-600">{{ error }}</p>
            <button @click="fetchDashboardData" class="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Retry
            </button>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Total Sales</p>
                        <p class="text-2xl font-semibold mt-1">{{ formatCurrency(stats.totalSales) }}</p>
                        <p class="text-xs text-green-600 mt-1 flex items-center">
                            <span class="mr-1">↑</span> {{ stats.salesGrowth }}% vs last week
                        </p>
                    </div>
                    <div class="bg-blue-100 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Active Users</p>
                        <p class="text-2xl font-semibold mt-1">{{ stats.activeUsers.toLocaleString() }}</p>
                        <p class="text-xs text-green-600 mt-1 flex items-center">
                            <span class="mr-1">↑</span> {{ stats.usersGrowth }}% vs yesterday
                        </p>
                    </div>
                    <div class="bg-green-100 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Total Orders</p>
                        <p class="text-2xl font-semibold mt-1">{{ stats.totalOrders }}</p>
                        <p class="text-xs text-yellow-600 mt-1">{{ stats.pendingOrders }} pending</p>
                    </div>
                    <div class="bg-yellow-100 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-500">Revenue Growth</p>
                        <p class="text-2xl font-semibold mt-1">{{ stats.revenueGrowth }}%</p>
                        <p class="text-xs text-green-600 mt-1">This month</p>
                    </div>
                    <div class="bg-purple-100 p-3 rounded-lg">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Sales Trend Chart -->
            <div class="lg:col-span-2 bg-white border rounded-xl p-6 shadow-sm">
                <h3 class="font-semibold text-lg mb-4">Sales Trend</h3>
                <canvas ref="salesChartRef" height="100"></canvas>
            </div>

            <!-- Category Distribution -->
            <div class="bg-white border rounded-xl p-6 shadow-sm">
                <h3 class="font-semibold text-lg mb-4">Sales by Category</h3>
                <canvas ref="categoryChartRef"></canvas>
            </div>
        </div>

        <!-- Recent Orders & Top Products -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <!-- Recent Orders -->
            <div class="bg-white border rounded-xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-lg">Recent Orders</h3>
                    <button class="text-sm text-blue-600 hover:underline">View all</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-gray-500 text-sm border-b">
                                <th class="py-2">Order ID</th>
                                <th class="py-2">Customer</th>
                                <th class="py-2">Amount</th>
                                <th class="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in recentOrders" :key="order.id" class="border-b hover:bg-gray-50">
                                <td class="py-3 text-sm">{{ order.id }}</td>
                                <td class="py-3 text-sm">{{ order.customer }}</td>
                                <td class="py-3 text-sm font-medium">{{ formatCurrency(order.amount) }}</td>
                                <td class="py-3">
                                    <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
                                        {{ order.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Top Products -->
            <div class="bg-white border rounded-xl p-6 shadow-sm">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-semibold text-lg">Top Products</h3>
                    <button class="text-sm text-blue-600 hover:underline">View all</button>
                </div>
                <div class="space-y-3">
                    <div v-for="product in topProducts" :key="product.name" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-100 p-2 rounded">
                                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-medium text-sm">{{ product.name }}</p>
                                <p class="text-xs text-gray-500">{{ product.sales }} sales</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-semibold text-sm">{{ formatCurrency(product.revenue) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { api } from '../../services/api'

Chart.register(...registerables);

const timeRange = ref('7');
const salesChartRef = ref<HTMLCanvasElement | null>(null);
const categoryChartRef = ref<HTMLCanvasElement | null>(null);

let salesChart: Chart | null = null;
let categoryChart: Chart | null = null;

// Reactive data from database
const stats = ref({
    totalSales: 0,
    salesGrowth: 0,
    activeUsers: 0,
    usersGrowth: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenueGrowth: 0
});

interface OrderData {
  id: string
  customer: string
  amount: number
  status: string
}

interface ProductData {
  name: string
  sales: number
  revenue: number
}

const recentOrders = ref<OrderData[]>([]);
const topProducts = ref<ProductData[]>([]);
const loading = ref(true);
const error = ref('');

// Sales trend data
const salesData = ref({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Sales',
            data: [0, 0, 0, 0, 0, 0, 0],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
        }
    ]
});

// Category distribution data
const categoryData = ref({
    labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'],
    datasets: [{
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
        ]
    }]
});

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const getStatusClass = (status: string) => {
    const classes = {
        'Completed': 'bg-green-100 text-green-700',
        'Pending': 'bg-yellow-100 text-yellow-700',
        'Processing': 'bg-blue-100 text-blue-700',
        'Cancelled': 'bg-red-100 text-red-700'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-700';
};

const fetchDashboardData = async () => {
    loading.value = true;
    error.value = '';

    try {
        // Fetch comprehensive stats from backend
        const statsResponse = await api.get('/admin/stats');
        
        // Update KPI stats with real data
        stats.value = {
            totalSales: statsResponse.orders.totalRevenue || 0,
            salesGrowth: statsResponse.growth?.sales || 0,
            activeUsers: statsResponse.users.total || 0,
            usersGrowth: statsResponse.growth?.users || 0,
            totalOrders: statsResponse.orders.total || 0,
            pendingOrders: statsResponse.orders.pending || 0,
            revenueGrowth: statsResponse.growth?.revenue || 0
        };

        // Fetch recent transactions
        const transactionsResponse = await api.get('/admin/transactions');
        recentOrders.value = transactionsResponse.slice(0, 5).map((txn: any) => ({
            id: txn.id,
            customer: txn.buyer?.full_name || 'Unknown',
            amount: txn.amount,
            status: txn.status.charAt(0).toUpperCase() + txn.status.slice(1)
        }));

        // Use real top products from backend
        topProducts.value = statsResponse.topProducts || [];

        // Update chart data with real values
        updateCharts(statsResponse);

    } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        error.value = err.message || 'Failed to load dashboard data';
    } finally {
        loading.value = false;
    }
};

const updateCharts = (statsResponse: any) => {
    // Update sales trend with real data
    if (salesData.value.datasets[0] && statsResponse.salesTrend) {
        const labels = statsResponse.salesTrend.map((d: any) => {
            const date = new Date(d.date)
            return date.toLocaleDateString('en-US', { weekday: 'short' })
        })
        const data = statsResponse.salesTrend.map((d: any) => d.sales)
        
        salesData.value.labels = labels
        salesData.value.datasets[0].data = data
    }

    // Update category distribution with real data
    if (categoryData.value.datasets[0] && statsResponse.categoryDistribution) {
        const categories = statsResponse.categoryDistribution.slice(0, 5)
        categoryData.value.labels = categories.map((c: any) => c.name)
        categoryData.value.datasets[0].data = categories.map((c: any) => c.count)
    }

    initCharts();
};

const initCharts = () => {
    // Destroy existing charts
    if (salesChart) {
        salesChart.destroy();
    }
    if (categoryChart) {
        categoryChart.destroy();
    }

    // Sales Chart
    if (salesChartRef.value) {
        salesChart = new Chart(salesChartRef.value, {
            type: 'line',
            data: salesData.value,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Category Chart
    if (categoryChartRef.value) {
        categoryChart = new Chart(categoryChartRef.value, {
            type: 'doughnut',
            data: categoryData.value,
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
};

onMounted(() => {
    fetchDashboardData();
});

watch(timeRange, () => {
    // TODO: Fetch data based on selected time range
    console.log('Time range changed to:', timeRange.value);
    fetchDashboardData();
});
</script>
