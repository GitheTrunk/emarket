<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p class="text-gray-600 mt-1">{{ cartItems.length }} {{ cartItems.length === 1 ? 'item' : 'items' }} in your cart</p>
      </div>
    </div>

    <!-- Cart Content -->
    <div class="max-w-7xl mx-auto px-4 pb-12">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p class="mt-4 text-gray-600">Loading cart...</p>
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartItems.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
        <p class="text-gray-600 mb-6">Add some products to get started</p>
        <router-link
          to="/buyer/dashboard"
          class="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Continue Shopping
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Cart Items List -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="bg-white rounded-lg shadow-md p-4 flex gap-4"
          >
            <!-- Product Image -->
            <div class="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img
                :src="item.product.images[0] || '/placeholder-product.png'"
                :alt="item.product.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Product Details -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ item.product.title }}</h3>
                    <span class="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                      {{ item.product.category }}
                    </span>
                  </div>
                  <button
                    @click="removeFromCart(String(item.id))"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Remove from cart"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p class="text-sm text-gray-600 line-clamp-2 mb-2">{{ item.product.description }}</p>
                
                <!-- Stock Status -->
                <div v-if="item.product.stock < item.quantity" class="text-sm text-red-600 font-medium mb-2">
                  Only {{ item.product.stock }} available in stock
                </div>
                <div v-else-if="item.product.stock === 0" class="text-sm text-red-600 font-medium mb-2">
                  Out of stock
                </div>
              </div>

              <div class="flex justify-between items-center">
                <!-- Quantity Controls -->
                <div class="flex items-center gap-2">
                  <button
                    @click="updateQuantity(String(item.id), item.quantity - 1)"
                    :disabled="item.quantity <= 1"
                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span class="w-12 text-center font-medium">{{ item.quantity }}</span>
                  <button
                    @click="updateQuantity(String(item.id), item.quantity + 1)"
                    :disabled="item.quantity >= item.product.stock"
                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <!-- Price -->
                <div class="text-right">
                  <p class="text-xl font-bold text-orange-500">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
                  <p class="text-sm text-gray-500">${{ item.product.price.toFixed(2) }} each</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div class="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ totalItems }} items)</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span v-if="subtotal >= 50">Free</span>
                <span v-else>${{ shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
            </div>

            <div class="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span class="text-orange-500">${{ total.toFixed(2) }}</span>
            </div>

            <div v-if="subtotal >= 50" class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-green-700 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                You get free shipping!
              </p>
            </div>
            <div v-else class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p class="text-sm text-blue-700">
                Add ${{ (50 - subtotal).toFixed(2) }} more for free shipping
              </p>
            </div>

            <button
              @click="proceedToCheckout"
              :disabled="hasOutOfStock"
              class="w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-3"
            >
              {{ hasOutOfStock ? 'Some items unavailable' : 'Proceed to Checkout' }}
            </button>

            <router-link
              to="/buyer/dashboard"
              class="block w-full text-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </router-link>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCart, removeFromCart as removeCartItem, updateCartItem } from '@/services/cartService'
import type { CartItem } from '@/types/database'

const router = useRouter()
const cartItems = ref<CartItem[]>([])
const loading = ref(true)
const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

onMounted(async () => {
  await loadCart()
})

const loadCart = async () => {
  try {
    loading.value = true
    cartItems.value = await getCart()
  } catch (error) {
    showToast('Failed to load cart', 'error')
    console.error('Error loading cart:', error)
  } finally {
    loading.value = false
  }
}

const updateQuantity = async (cartItemId: string, newQuantity: number) => {
  if (newQuantity < 1) return

  try {
    await updateCartItem(cartItemId, newQuantity)
    const item = cartItems.value.find(i => i.id === Number(cartItemId))
    if (item) {
      item.quantity = newQuantity
    }
    showToast('Quantity updated', 'success')
  } catch (error) {
    showToast('Failed to update quantity', 'error')
    console.error('Error updating quantity:', error)
  }
}

const removeFromCart = async (cartItemId: string) => {
  try {
    await removeCartItem(cartItemId)
    cartItems.value = cartItems.value.filter(item => item.id !== Number(cartItemId))
    showToast('Item removed from cart', 'success')
  } catch (error) {
    showToast('Failed to remove item', 'error')
    console.error('Error removing from cart:', error)
  }
}

const proceedToCheckout = () => {
  // TODO: Implement checkout flow
  showToast('Proceeding to checkout...', 'success')
  // router.push('/buyer/checkout')
}

const totalItems = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
})

const shipping = computed(() => {
  return subtotal.value >= 50 ? 0 : 10
})

const tax = computed(() => {
  return subtotal.value * 0.1
})

const total = computed(() => {
  return subtotal.value + shipping.value + tax.value
})

const hasOutOfStock = computed(() => {
  return cartItems.value.some(item => item.product.stock === 0 || item.quantity > item.product.stock)
})

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
  -line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
