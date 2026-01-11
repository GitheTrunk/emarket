<template>
  <aside class="w-72 bg-white border-r border-gray-200 min-h-screen sticky top-0 flex flex-col">
    <div class="p-5 flex items-center gap-3 border-b border-gray-200">
      <img src="@/assets/logo/img.png" alt="E-Market" class="w-10 h-10 object-contain" />
      <div>
        <p class="text-xs text-gray-500">Hi</p>
        <p class="text-sm font-semibold text-gray-800 flex items-center gap-1">
          {{ profileName }}
          <i class="pi pi-verified text-green-600"></i>
        </p>
      </div>
    </div>

    <nav class="p-4 space-y-1 flex-1">
      <RouterLink
        v-for="link in links"
        :key="link.name"
        :to="link.to"
        class="flex items-center gap-3 rounded px-3 py-2 text-sm font-medium text-gray-700 hover:bg-orange-50"
        :class="isActive(link.to) ? 'bg-orange-50 border border-orange-200 text-orange-700' : 'border border-transparent'"
      >
        <span class="text-lg" :class="link.icon"></span>
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-gray-200">
      <button
        class="w-full rounded bg-gray-300 py-2 text-sm font-semibold text-gray-700 hover:bg-red-500 hover:text-white"
        @click="onLogout"
      >
        Log out
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import supabase from '@/lib/supabase'
import 'primeicons/primeicons.css'

type NavLink = { name: string; label: string; to: string; icon: string }

const router = useRouter()
const route = useRoute()
const profileName = ref('Seller')

const links: NavLink[] = [
  { name: 'SellerDashboard', label: 'Dashboard', to: '/seller/dashboard', icon: 'pi pi-bars' },
  { name: 'SellerProducts', label: 'Product', to: '/seller/products', icon: 'pi pi-box' },
  { name: 'SellerOrders', label: 'Order', to: '/seller/orders', icon: 'pi pi-shopping-bag' },
  { name: 'SellerAnalytics', label: 'Analytics', to: '/seller/analytics', icon: 'pi pi-chart-line' },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}

async function loadProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user && user.user_metadata?.fullName) {
      profileName.value = user.user_metadata.fullName.toUpperCase()
    }
  } catch (err) {
    console.error('Failed to load profile', err)
  }
}

async function onLogout() {
  try {
    await supabase.auth.signOut()
    router.push('/')
  } catch (err) {
    console.error('Error logging out:', err)
  }
}

onMounted(() => loadProfile())
</script>
