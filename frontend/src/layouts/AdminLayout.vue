<template>
  <div class="min-h-screen flex bg-gray-100">

    <!-- Sidebar -->
    <AdminSidebar />

    <div class="flex-1 flex flex-col">

      <!-- Admin Topbar -->
      <AdminNavbar />

      <main class="p-6">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import AdminSidebar from "@/components/layout/AdminSidebar.vue";
import AdminNavbar from "@/components/layout/AdminNavbar.vue";

</script>