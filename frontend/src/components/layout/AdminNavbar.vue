<template>
  <div class="w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
    <!-- Page Title -->
    <div>
      <h2 class="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{{ pageTitle }}</h2>
      <p class="text-xs text-gray-500 mt-0.5">{{ currentDate }}</p>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-4">
      <!-- User Menu -->
      <div class="relative" @click="toggleMenu">
        <button class="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors">
          <div class="w-9 h-9 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold shadow-md overflow-hidden">
            <img v-if="userAvatar" :src="userAvatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <div class="hidden lg:block text-left">
            <p class="text-sm font-semibold text-gray-800">{{ userName }}</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div 
          v-if="showMenu" 
          class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
        >
          <router-link to="/admin/profile" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="text-sm text-gray-700">Profile</span>
          </router-link>
          <hr class="my-2 border-gray-200" />
          <a @click="handleLogout" class="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="text-sm">Logout</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import supabase from '@/lib/supabase';

const route = useRoute();
const router = useRouter();
const showMenu = ref(false);
const userName = ref('Admin User');
const userEmail = ref('');
const userAvatar = ref('');

const userInitial = computed(() => {
  return userName.value.charAt(0).toUpperCase();
});

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

const loadUserData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      userEmail.value = user.email || '';
      const metadata = user.user_metadata || {};
      userName.value = metadata.fullName || metadata.full_name || user.email?.split('@')[0] || 'Admin User';
      userAvatar.value = metadata.avatar_url || '';
    }
  } catch (err) {
    console.error('Failed to load user data', err);
  }
};

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    alert(error.message);
    return;
  }

  router.push('/admin/login');
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  loadUserData();
  
  // Listen for storage events (when profile is updated in another tab/component)
  window.addEventListener('storage', loadUserData);
  
  // Listen for custom event when profile is updated
  window.addEventListener('profile-updated', loadUserData);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('storage', loadUserData);
  window.removeEventListener('profile-updated', loadUserData);
});

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/users': 'User Management',
    '/admin/transactions': 'Transactions',
    '/admin/reports': 'Reports'
  };
  return titles[route.path] || 'Admin Panel';
});

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});
</script>
