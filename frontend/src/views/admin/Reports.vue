<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold">Reports</h1>
    <div class="bg-white rounded-xl shadow-sm border p-4">
      <div class="flex items-center justify-between mb-4">
        <select class="border rounded px-3 py-2">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last quarter</option>
        </select>
        <button class="px-4 py-2 bg-gray-900 text-white rounded">Export</button>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="border rounded-lg p-4">
          <p class="text-gray-500 text-sm">Sales report</p>
          <div class="h-40 bg-gray-100 rounded" />
        </div>
        <div class="border rounded-lg p-4">
          <p class="text-gray-500 text-sm">Users report</p>
          <div class="h-40 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
