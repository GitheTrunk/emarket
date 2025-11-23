<template>
  <aside class="w-64 bg-gray-900 text-white h-screen sticky top-0">
    <div class="p-6 font-bold text-xl border-b border-gray-700">Admin Panel</div>

    <nav class="p-4 space-y-2">
      <router-link to="/admin/dashboard" class="block p-2 rounded hover:bg-gray-700">Dashboard</router-link>
      <router-link to="/admin/users" class="block p-2 rounded hover:bg-gray-700">Users</router-link>
      <router-link to="/admin/transactions" class="block p-2 rounded hover:bg-gray-700">Transactions</router-link>
      <router-link to="/admin/reports" class="block p-2 rounded hover:bg-gray-700">Reports</router-link>

      <button @click="logout" class="block p-2 rounded bg-red-500 mt-4 w-full">
        Logout
      </button>
    </nav>
  </aside>
</template>

<script setup>
const logout = () => alert("Admin logged out");
</script>
