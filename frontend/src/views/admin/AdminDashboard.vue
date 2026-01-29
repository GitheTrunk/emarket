<template>
    <div class="space-y-8">
        <!-- Header with Time Range Filter -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
                <p class="text-gray-500 mt-1">Here's what's happening with your store today.</p>
            </div>
            <select v-model="timeRange" class="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
            </select>
        </div>

        <!-- KPI Cards -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="n in 4" :key="n" class="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse">
                <div class="h-4 bg-gray-200 rounded mb-3"></div>
                <div class="h-8 bg-gray-200 rounded mb-3"></div>
                <div class="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
        </div>
        <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div class="flex items-center gap-3 mb-3">
                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-700 font-semibold">{{ error }}</p>
            </div>
            <button @click="fetchDashboardData" class="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
                Retry
            </button>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="group bg-gradient-to-br from-blue-500 to-blue-600 border-2 border-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white">
                <div class="flex items-start justify-between mb-4">
                    <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p class="text-blue-100 text-sm font-medium mb-1">Total Sales</p>
                    <p class="text-3xl font-bold mb-2">{{ formatCurrency(stats.totalSales) }}</p>
                    <div class="flex items-center gap-1 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span class="font-semibold">{{ stats.salesGrowth }}%</span>
                        <span class="text-blue-100">vs last week</span>
                    </div>
                </div>
            </div>

            <div class="group bg-gradient-to-br from-emerald-500 to-emerald-600 border-2 border-emerald-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white">
                <div class="flex items-start justify-between mb-4">
                    <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p class="text-emerald-100 text-sm font-medium mb-1">Active Users</p>
                    <p class="text-3xl font-bold mb-2">{{ stats.activeUsers.toLocaleString() }}</p>
                    <div class="flex items-center gap-1 text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span class="font-semibold">{{ stats.usersGrowth }}%</span>
                        <span class="text-emerald-100">vs yesterday</span>
                    </div>
                </div>
            </div>

            <div class="group bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white">
                <div class="flex items-start justify-between mb-4">
                    <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p class="text-orange-100 text-sm font-medium mb-1">Total Orders</p>
                    <p class="text-3xl font-bold mb-2">{{ stats.totalOrders }}</p>
                    <div class="flex items-center gap-1 text-sm">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                        <span class="font-semibold">{{ stats.pendingOrders }}</span>
                        <span class="text-orange-100">pending</span>
                    </div>
                </div>
            </div>

            <div class="group bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white">
                <div class="flex items-start justify-between mb-4">
                    <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                </div>
                <div>
                    <p class="text-purple-100 text-sm font-medium mb-1">Revenue Growth</p>
                    <p class="text-3xl font-bold mb-2">{{ stats.revenueGrowth }}%</p>
                    <div class="flex items-center gap-1 text-sm">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-purple-100">This month</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Sales Trend Chart -->
            <div class="lg:col-span-2 bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-xl text-gray-900">Sales Trend</h3>
                    <div class="flex gap-2">
                        <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">Revenue</span>
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">Orders</span>
                    </div>
                </div>
                <canvas ref="salesChartRef" height="100"></canvas>
            </div>

            <!-- Category Distribution -->
            <div class="bg-white border-2 border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <h3 class="font-bold text-xl text-gray-900 mb-6">Sales by Category</h3>
                <canvas ref="categoryChartRef"></canvas>
            </div>
        </div>

        <!-- Recent Orders & Top Products -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Orders -->
            <div class="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-xl text-gray-900">Recent Orders</h3>
                    <button class="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group">
                        View all
                        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-gray-500 text-sm border-b-2 border-gray-100">
                                <th class="py-3 font-semibold">Order ID</th>
                                <th class="py-3 font-semibold">Customer</th>
                                <th class="py-3 font-semibold">Amount</th>
                                <th class="py-3 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in recentOrders" :key="order.id" class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td class="py-4 text-sm font-medium text-gray-900">{{ order.id }}</td>
                                <td class="py-4 text-sm text-gray-600">{{ order.customer }}</td>
                                <td class="py-4 text-sm font-semibold text-gray-900">{{ formatCurrency(order.amount) }}</td>
                                <td class="py-4">
                                    <span :class="getStatusClass(order.status)" class="px-3 py-1 text-xs font-semibold rounded-full">
                                        {{ order.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Top Products -->
            <div class="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="font-bold text-xl text-gray-900">Top Products</h3>
                    <button class="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group">
                        View all
                        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                <div class="space-y-4">
                    <div v-for="product in topProducts" :key="product.name" class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl hover:shadow-md transition-all hover:scale-[1.02] border border-gray-100">
                        <div class="flex items-center space-x-4">
                            <div class="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-md">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold text-sm text-gray-900">{{ product.name }}</p>
                                <p class="text-xs text-gray-500 mt-0.5">{{ product.sales }} sales</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="font-bold text-base text-gray-900">{{ formatCurrency(product.revenue) }}</p>
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

const timeRange = ref('7d');
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
        // Fetch comprehensive stats from backend with time range parameter
        const statsResponse = await api.get(`/admin/stats?timeRange=${timeRange.value}`);
        
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
            // Format based on time range
            if (timeRange.value === '90d') {
                // For 90 days, show week numbers or short dates
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            } else if (timeRange.value === '30d') {
                // For 30 days, show dates
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            } else {
                // For 7 days, show weekdays
                return date.toLocaleDateString('en-US', { weekday: 'short' })
            }
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
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Sales: ' + formatCurrency(context.parsed.y || 0);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + (value as number).toLocaleString();
                            }
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
    // Refetch dashboard data when time range changes
    fetchDashboardData();
});
</script>
