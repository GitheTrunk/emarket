<template>
  <div class="w-full bg-purple-700 text-white px-6 py-4 flex justify-between items-center">
    <h2 class="text-lg font-semibold">Seller Dashboard</h2>

    <div class="flex items-center gap-4">
      <router-link to="/seller/products" class="hover:text-purple-200">Products</router-link>
      <router-link to="/seller/orders" class="hover:text-purple-200">Orders</router-link>

      <button 
        @click="logout" 
        class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
const logout = () => alert("Seller logged out");
</script>
