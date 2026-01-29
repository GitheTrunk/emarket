<template>
  <div class="min-h-screen flex bg-gradient-to-br from-gray-50 via-gray-100 to-slate-100">

    <!-- Sidebar -->
    <AdminSidebar />

    <div class="flex-1 flex flex-col">

      <!-- Admin Topbar -->
      <AdminNavbar />

      <main class="p-8">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import AdminSidebar from "@/components/layout/AdminSidebar.vue";
import AdminNavbar from "@/components/layout/AdminNavbar.vue";

</script>