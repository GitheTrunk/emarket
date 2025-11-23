
<template>
  <div class="min-h-screen flex bg-gray-100">

    <!-- Content Area -->
    <div class="flex-1 flex flex-col">

      <!-- Buyer Navbar -->
      <BuyerNavbar />

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup>
import BuyerNavbar from "@/components/buyer/BuyerNavbar.vue";
</script>
