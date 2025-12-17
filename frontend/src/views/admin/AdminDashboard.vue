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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

Chart.register(...registerables);

const timeRange = ref('7');
const salesChartRef = ref<HTMLCanvasElement | null>(null);
const categoryChartRef = ref<HTMLCanvasElement | null>(null);

let salesChart: Chart | null = null;
let categoryChart: Chart | null = null;

// Mock data - Replace with actual database queries later
const stats = ref({
    totalSales: 23480,
    salesGrowth: 8,
    activeUsers: 1238,
    usersGrowth: 2,
    totalOrders: 146,
    pendingOrders: 18,
    revenueGrowth: 12.5
});

const recentOrders = ref([
    { id: '#12345', customer: 'John Doe', amount: 240.00, status: 'Completed' },
    { id: '#12346', customer: 'Jane Smith', amount: 85.20, status: 'Pending' },
    { id: '#12347', customer: 'Mike Johnson', amount: 156.80, status: 'Processing' },
    { id: '#12348', customer: 'Sarah Williams', amount: 320.50, status: 'Completed' },
    { id: '#12349', customer: 'Tom Brown', amount: 95.00, status: 'Cancelled' }
]);

const topProducts = ref([
    { name: 'Wireless Headphones', sales: 245, revenue: 12250 },
    { name: 'Smart Watch', sales: 189, revenue: 37800 },
    { name: 'Laptop Stand', sales: 156, revenue: 4680 },
    { name: 'USB-C Cable', sales: 423, revenue: 8460 }
]);

// Sales trend data - Replace with database query
const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Sales',
            data: [3200, 4100, 3800, 5200, 4900, 6100, 5800],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
        }
    ]
};

// Category distribution data - Replace with database query
const categoryData = {
    labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'],
    datasets: [{
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
        ]
    }]
};

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

const initCharts = () => {
    // Sales Chart
    if (salesChartRef.value) {
        salesChart = new Chart(salesChartRef.value, {
            type: 'line',
            data: salesData,
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
            data: categoryData,
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

// TODO: Replace with actual database queries
// const fetchDashboardData = async () => {
//     const { data, error } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(5);
//     
//     if (data) {
//         recentOrders.value = data;
//     }
// };

onMounted(() => {
    initCharts();
    // fetchDashboardData();
});

watch(timeRange, () => {
    // TODO: Fetch data based on selected time range
    console.log('Time range changed to:', timeRange.value);
});
</script>
