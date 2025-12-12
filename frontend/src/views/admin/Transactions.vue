<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Transactions</h1>
    <div class="bg-white rounded-xl shadow-sm border p-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="p-4 rounded-lg bg-green-50 border">
          <p class="text-sm text-gray-500">Total Revenue</p>
          <p class="text-xl font-semibold">$12,450</p>
        </div>
        <div class="p-4 rounded-lg bg-blue-50 border">
          <p class="text-sm text-gray-500">Orders</p>
          <p class="text-xl font-semibold">324</p>
        </div>
        <div class="p-4 rounded-lg bg-yellow-50 border">
          <p class="text-sm text-gray-500">Pending</p>
          <p class="text-xl font-semibold">18</p>
        </div>
        <div class="p-4 rounded-lg bg-red-50 border">
          <p class="text-sm text-gray-500">Refunds</p>
          <p class="text-xl font-semibold">5</p>
        </div>
      </div>
      <div class="border rounded-lg p-4">
        <p class="text-gray-500 text-sm">Chart placeholder</p>
        <div class="h-40 bg-gray-100 rounded" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
