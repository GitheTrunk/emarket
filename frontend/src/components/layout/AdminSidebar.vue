<template>
  <aside class="w-64 bg-gradient-to-b from-orange-500 via-orange-600 to-orange-700 text-white h-screen sticky top-0 flex flex-col shadow-2xl">
    <!-- Logo Section -->
    <div class="p-6 border-b border-orange-700/50">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-1">
          <img src="@/assets/logo/img.png" alt="E-Market Logo" class="w-full h-full object-contain" />
        </div>
        <div>
          <h1 class="font-bold text-lg">E-MARKET</h1>
          <p class="text-xs text-orange-100">Admin Panel</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <router-link 
        to="/admin/dashboard" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 group"
        active-class="bg-white/20 shadow-lg backdrop-blur-sm"
      >
        <svg class="w-5 h-5 opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="font-medium">Dashboard</span>
      </router-link>

      <router-link 
        to="/admin/users" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 group"
        active-class="bg-white/20 shadow-lg backdrop-blur-sm"
      >
        <svg class="w-5 h-5 opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <span class="font-medium">Users</span>
      </router-link>

      <router-link 
        to="/admin/transactions" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 group"
        active-class="bg-white/20 shadow-lg backdrop-blur-sm"
      >
        <svg class="w-5 h-5 opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="font-medium">Transactions</span>
      </router-link>

      <router-link 
        to="/admin/reports" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/10 group"
        active-class="bg-white/20 shadow-lg backdrop-blur-sm"
      >
        <svg class="w-5 h-5 opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span class="font-medium">Reports</span>
      </router-link>
    </nav>

    <!-- Logout Button -->
    <div class="p-4 border-t border-orange-700/50">
      <button 
        @click="logout" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 w-full transition-all duration-200 group border border-white/20 hover:border-white/40"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="font-medium">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import supabase from "@/lib/supabase";

const router = useRouter();

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    alert(error.message);
    return;
  }

  router.push("/admin/login");
};
</script>
