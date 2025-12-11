<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
const logout = () => alert('Seller logged out');
</script>
