<template>
  <aside class="w-64 bg-purple-700 text-white h-screen sticky top-0">
    <div class="p-6 text-xl font-bold border-b border-purple-500">Seller Panel</div>

    <nav class="p-4 space-y-2">
      <router-link to="/seller/dashboard" class="block p-2 rounded hover:bg-purple-600">Dashboard</router-link>
      <router-link to="/seller/products" class="block p-2 rounded hover:bg-purple-600">Products</router-link>
      <router-link to="/seller/orders" class="block p-2 rounded hover:bg-purple-600">Orders</router-link>
      <router-link to="/seller/analytics" class="block p-2 rounded hover:bg-purple-600">Analytics</router-link>

      <button @click="logout" class="block p-2 rounded bg-red-500 mt-4 w-full">
        Logout
      </button>
    </nav>
  </aside>
</template>

<script setup>
const logout = () => alert("Seller logged out");
</script>
