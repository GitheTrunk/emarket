<template>
  <nav class="bg-white shadow-md border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-14 h-14 rounded bg-white flex items-center justify-center overflow-hidden">
            <img src="@/assets/logo/img.png" alt="E-Market" class="w-14 h-14 object-contain" />
          </div>
          <span class="text-xl font-bold text-gray-900">E-Market</span>
        </router-link>

        <!-- Center Navigation Links -->
        <div class="hidden md:flex items-center gap-8 flex-1 justify-center">
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-orange-500 font-medium transition-colors duration-200"
          >
            Home
          </router-link>
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-orange-500 font-medium transition-colors duration-200"
          >
            About Us
          </router-link>
          <router-link 
            to="/" 
            class="text-gray-600 hover:text-orange-500 font-medium transition-colors duration-200"
          >
            Contact
          </router-link>
        </div>

        <!-- Right Side Icons -->
        <div class="flex items-center gap-6">
          
          <!-- Wishlist -->
          <router-link 
            to="/buyer/wishlist" 
            class="relative text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </router-link>

          <!-- Shopping Cart -->
          <router-link 
            to="/buyer/cart" 
            class="relative text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </router-link>

          <!-- User Profile Dropdown -->
          <div class="relative group">
            <button class="text-gray-600 hover:text-orange-500 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <div class="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <router-link 
                to="/buyer/profile" 
                class="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-t-lg transition-colors"
              >
                My Profile
              </router-link>
              <router-link 
                to="/buyer/orders" 
                class="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                My Orders
              </router-link>
              <router-link 
                to="/buyer/settings" 
                class="block px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                Settings
              </router-link>
              <button 
                @click="logout"
                class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-lg transition-colors border-t border-gray-100"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button class="md:hidden text-gray-600 hover:text-orange-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const logout = async () => {
  // TODO: Implement logout logic
  alert("Logout functionality coming soon");
  // router.push('/');
};
</script>

<style scoped>
/* Smooth transitions */
svg {
  transition: all 0.3s ease;
}
</style>
