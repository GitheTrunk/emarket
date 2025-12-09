<template>
  <div class="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
    <router-link to="/">
        <img src="@/assets/logo/img.png" alt="E-Market" class="w-16 h-16"/>
    </router-link>

    <div class="flex justify-between items-center gap-12">
      <router-link to="" class="text-xl text-orange-300">Home</router-link>
      <router-link to="" class="text-xl text-orange-300">About Us</router-link>
      <router-link to="" class="text-xl text-orange-300">Contact</router-link>
    </div>

    <div class="flex justify-between items-center gap-8">
        <SearchBar v-model="searchQuery" @search="handleSearch" />
        <router-link to="" class="font-bold hover:text-orange-600">
            <i class="pi pi-heart" style="font-size: 1.5rem; color: orange"></i>
        </router-link>
        <router-link to="/buyer/cart" class="hover:text-orange-600">
            <i class="pi pi-shopping-cart" style="font-size: 1.5rem; color: orange"></i>
        </router-link>
        <router-link to="/buyer/profile" class="hover:text-orange-600">
            <i class="pi pi-user" style="font-size: 1.5rem; color: orange"></i>
        </router-link>
        
    </div>
  </div>
</template>

<script setup>

import "primeicons/primeicons.css";
import SearchBar from "../ui/SearchBar.vue";
import { ref } from "vue";
const searchQuery = ref("");
const handleSearch = (query) => {
  console.log("Searching for:", query);
};
</script>
