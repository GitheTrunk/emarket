<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <div class="flex min-h-screen">
      <SellerSidebar />

      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import SellerSidebar from '@/components/layout/SellerSidebar.vue'
</script>