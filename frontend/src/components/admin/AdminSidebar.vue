<template>
  <aside class="w-64 bg-orange-400 text-white h-screen sticky top-0">
    <div class="p-6 font-bold text-xl border-b border-black">Admin Panel</div>

    <nav class="p-4 space-y-2">
      <router-link to="/admin/dashboard" class="block p-2 rounded hover:bg-orange-700">Dashboard</router-link>
      <router-link to="/admin/users" class="block p-2 rounded hover:bg-orange-700">Users</router-link>
      <router-link to="/admin/transactions" class="block p-2 rounded hover:bg-orange-700">Transactions</router-link>
      <router-link to="/admin/reports" class="block p-2 rounded hover:bg-orange-700">Reports</router-link>

      <button @click="logout" class="block p-2 rounded bg-orange-500 mt-4 w-full">
        Logout
      </button>
    </nav>
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
