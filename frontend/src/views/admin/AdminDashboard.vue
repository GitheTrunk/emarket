<template>
    <div class="space-y-6">
        <h1 class="text-2xl font-semibold">Dashboard</h1>

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white border rounded-xl p-4 shadow-sm">
                <p class="text-sm text-gray-500">Total Sales</p>
                <p class="text-2xl font-semibold">$23,480</p>
                <p class="text-xs text-green-600 mt-1">+8% vs last week</p>
            </div>
            <div class="bg-white border rounded-xl p-4 shadow-sm">
                <p class="text-sm text-gray-500">Active Users</p>
                <p class="text-2xl font-semibold">1,238</p>
                <p class="text-xs text-green-600 mt-1">+2% vs yesterday</p>
            </div>
            <div class="bg-white border rounded-xl p-4 shadow-sm">
                <p class="text-sm text-gray-500">New Orders</p>
                <p class="text-2xl font-semibold">146</p>
                <p class="text-xs text-yellow-600 mt-1">~ steady</p>
            </div>
            <div class="bg-white border rounded-xl p-4 shadow-sm">
                <p class="text-sm text-gray-500">Refunds</p>
                <p class="text-2xl font-semibold">9</p>
                <p class="text-xs text-red-600 mt-1">+1 today</p>
            </div>
        </div>

        <!-- Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2 bg-white border rounded-xl p-4 shadow-sm">
                <div class="flex items-center justify-between mb-3">
                    <p class="font-medium">Recent Orders</p>
                    <button class="text-sm text-blue-600">View all</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-gray-500 text-sm">
                                <th class="py-2">Order</th>
                                <th class="py-2">Customer</th>
                                <th class="py-2">Amount</th>
                                <th class="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-t">
                                <td class="py-2">#12345</td>
                                <td class="py-2">John Doe</td>
                                <td class="py-2">$240.00</td>
                                <td class="py-2"><span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Completed</span></td>
                            </tr>
                            <tr class="border-t">
                                <td class="py-2">#12346</td>
                                <td class="py-2">Jane Smith</td>
                                <td class="py-2">$85.20</td>
                                <td class="py-2"><span class="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Pending</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bg-white border rounded-xl p-4 shadow-sm">
                <p class="font-medium mb-3">Traffic</p>
                <div class="h-40 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">Chart placeholder</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>
