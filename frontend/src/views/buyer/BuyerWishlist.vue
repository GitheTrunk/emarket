<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p class="text-gray-600 mt-1">{{ wishlistItems.length }} items saved</p>
          </div>
          <button
            v-if="wishlistItems.length > 0"
            @click="clearWishlist"
            class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>

    <!-- Wishlist Content -->
    <div class="max-w-7xl mx-auto px-4 pb-12">
      <!-- Empty State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p class="mt-4 text-gray-600">Loading wishlist...</p>
      </div>

      <div v-else-if="wishlistItems.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
        <p class="text-gray-600 mb-6">Save items you love to your wishlist</p>
        <router-link
          to="/buyer/dashboard"
          class="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Browse Products
        </router-link>
      </div>

      <!-- Wishlist Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in wishlistItems"
          :key="item.id"
          class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
        >
          <!-- Product Image -->
          <div class="relative h-64 overflow-hidden bg-gray-100">
            <img
              :src="item.product.images[0] || '/placeholder-product.png'"
              :alt="item.product.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            
            <!-- Remove from Wishlist Button -->
            <button
              @click="removeFromWishlist(item.id)"
              class="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              title="Remove from wishlist"
            >
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>

            <!-- Stock Badge -->
            <div
              v-if="item.product.stock === 0"
              class="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
            >
              Out of Stock
            </div>
            <div
              v-else-if="item.product.stock < 10"
              class="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
            >
              Low Stock
            </div>
          </div>

          <!-- Product Details -->
          <div class="p-4">
            <div class="mb-2">
              <span class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {{ item.product.category }}
              </span>
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {{ item.product.title }}
            </h3>
            
            <p class="text-gray-600 text-sm mb-3 line-clamp-2">
              {{ item.product.description }}
            </p>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-2xl font-bold text-orange-500">
                ${{ item.product.price.toFixed(2) }}
              </span>
              <span class="text-sm text-gray-500">
                Stock: {{ item.product.stock }}
              </span>
            </div>

            <!-- Added Date -->
            <p class="text-xs text-gray-400 mb-3">
              Added {{ formatDate(item.created_at) }}
            </p>

            <!-- Action Buttons -->
            <div class="flex gap-2">
              <button
                @click="addToCart(item.product)"
                :disabled="item.product.stock === 0"
                class="flex-1 px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {{ item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
              </button>
              <button
                @click="viewProduct(item.product.id)"
                class="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
    >
      <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <svg v-else class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWishlist, removeFromWishlist as removeWishlistItem, clearWishlist as clearAllWishlist } from '@/services/wishlistService'
import { addToCart as addProductToCart } from '@/services/cartService'
import type { WishlistItem } from '@/types/database'

const wishlistItems = ref<WishlistItem[]>([])
const loading = ref(true)
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

onMounted(async () => {
  await loadWishlist()
})

const loadWishlist = async () => {
  try {
    loading.value = true
    wishlistItems.value = await getWishlist()
  } catch (error) {
    showToast('Failed to load wishlist', 'error')
    console.error('Error loading wishlist:', error)
  } finally {
    loading.value = false
  }
}

const removeFromWishlist = async (id: number) => {
  try {
    await removeWishlistItem(id.toString())
    wishlistItems.value = wishlistItems.value.filter(item => item.id !== id)
    showToast('Removed from wishlist', 'success')
  } catch (error) {
    showToast('Failed to remove item', 'error')
    console.error('Error removing from wishlist:', error)
  }
}

const clearWishlist = async () => {
  if (!confirm('Are you sure you want to clear your entire wishlist?')) {
    return
  }

  try {
    await clearAllWishlist()
    wishlistItems.value = []
    showToast('Wishlist cleared', 'success')
  } catch (error) {
    showToast('Failed to clear wishlist', 'error')
    console.error('Error clearing wishlist:', error)
  }
}

const addToCart = async (product: any) => {
  try {
    if (product.stock === 0) {
      showToast('This product is out of stock', 'error')
      return
    }
    
    await addProductToCart(product.id, 1)
    showToast(`${product.title} added to cart`, 'success')
  } catch (error) {
    showToast('Failed to add to cart', 'error')
    console.error('Error adding to cart:', error)
  }
}

const viewProduct = (productId: string) => {
  // TODO: Navigate to product detail page
  console.log('View product:', productId)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return date.toLocaleDateString()
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
