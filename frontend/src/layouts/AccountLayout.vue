<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with gradient -->
    <div class="bg-gradient-to-r from-orange-600 to-indigo-700 text-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">Account Settings</h1>
            <p class="mt-2 text-orange-100">Manage your personal information and preferences</p>
          </div>
          <button
            @click="$router.push('/buyer/dashboard')"
            class="inline-flex items-center px-4 py-2 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors">
            <i class="pi pi-arrow-left mr-2"></i>
            Back  
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar Navigation -->
        <aside class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
            <!-- User Profile Summary -->
            <!-- <div class="p-6 border-b border-gray-200 bg-gradient-to-br from-orange-50 to-indigo-50">
              <div class="flex items-center space-x-3">
                <div class="h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {{ getUserInitials() }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ userEmail }}</p>
                  <p class="text-xs text-gray-600">Buyer Account</p>
                </div>
              </div>
            </div> -->

            <!-- Navigation Menu -->
            <nav class="space-y-1 p-2">
                <router-link
                    v-for="item in menuItems"
                    :key="item.path"
                    :to="item.path"
                    class="group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all"
                    :class="isActive(item.path)
                    ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'"
                >
                    <!-- Prime Icon -->
                    <i
                    :class="[
                        item.icon,
                        'mr-3 text-lg transition-colors',
                        isActive(item.path)
                        ? 'text-orange-600'
                        : 'text-gray-400 group-hover:text-gray-500'
                    ]"
                    ></i>

                    <span class="flex-1">{{ item.name }}</span>

                    <!-- Active Arrow -->
                    <i
                    v-if="isActive(item.path)"
                    class="pi pi-angle-right ml-auto text-orange-600"
                    ></i>
                </router-link>
            </nav>
            <!-- Help Section -->
            <div class="p-4 m-2 bg-gray-50 rounded-lg border border-gray-200">
              <div class="flex items-start space-x-3">
                <svg class="h-5 w-5 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="flex-1">
                  <h4 class="text-sm font-medium text-gray-900">Need Help?</h4>
                  <p class="mt-1 text-xs text-gray-600">Contact our support team for assistance</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </div>

    <!-- Toast Notification -->
    <transition name="slide-up">
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 max-w-sm bg-white rounded-lg shadow-xl border-l-4 p-4 z-50"
        :class="toastType === 'success' ? 'border-green-500' : toastType === 'error' ? 'border-red-500' : 'border-orange-500'"
      >
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg v-if="toastType === 'success'" class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toastType === 'error'" class="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ toastMessage }}</p>
          </div>
          <button @click="showToast = false" class="flex-shrink-0 text-gray-400 hover:text-gray-500">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import supabase from '@/lib/supabase'
import 'primeicons/primeicons.css'

const route = useRoute()
const router = useRouter()

const userEmail = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')

// Menu items configuration
const menuItems = ref([
  {
    name: 'Profile',
    path: '/account/profile',
    icon: 'pi pi-user'
},
  {
    name: 'Addresses',
    path: '/account/addresses',
    icon: 'pi pi-map-marker'
},
  {
    name: 'Security',
    path: '/account/security',
    icon: 'pi pi-shield'
},
  {
    name: 'Preferences',
    path: '/account/preferences',
    icon: 'pi pi-cog'
}
])

// Check if current route matches menu item
const isActive = (path: string) => {
  return route.path === path
}

// Get user initials from email
const getUserInitials = () => {
  if (!userEmail.value) return 'U'
  const emailPart = userEmail.value.split('@')[0]
  if (!emailPart) return 'U'
  const parts = emailPart.split('.')
  if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return emailPart[0]?.toUpperCase() || 'U'
}

// Show notification
const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// Fetch user data on mount
onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      userEmail.value = user.email || ''
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
})

// Provide notification function to child components
import { provide } from 'vue'
provide('notify', notify)
</script>

<style scoped>
/* Fade transition for route changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition for toast */
.slide-up-enter-active {
  animation: slideUp 0.3s ease-out;
}

.slide-up-leave-active {
  animation: slideUp 0.3s ease-out reverse;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}


</style>
