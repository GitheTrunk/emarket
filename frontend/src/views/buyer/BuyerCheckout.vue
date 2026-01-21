<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
        <div class="flex items-center mt-2 text-sm text-gray-500">
          <router-link to="/cart" class="hover:text-orange-500 transition-colors">Cart</router-link>
          <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="font-semibold text-gray-900">Shipping & Payment</span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 pb-12">
      <div v-if="loading" class="text-center py-16">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p class="mt-4 text-gray-600">Processing order...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">1</span>
              Shipping Address
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input v-model="form.fullName" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input v-model="form.address" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input v-model="form.city" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input v-model="form.zip" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all">
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">2</span>
              Payment Details
            </h2>
            <div class="space-y-4">
              <div class="p-4 border-2 border-orange-500 bg-orange-50 rounded-lg flex items-center">
                <input type="radio" checked class="w-4 h-4 text-orange-500">
                <label class="ml-3 font-medium text-gray-900">Credit / Debit Card</label>
                <div class="ml-auto flex gap-2">
                  <span class="text-xs bg-white px-2 py-1 border rounded">VISA</span>
                  <span class="text-xs bg-white px-2 py-1 border rounded">MC</span>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input v-model="form.cardNumber" placeholder="0000 0000 0000 0000" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input v-model="form.expiry" placeholder="MM/YY" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                  <input v-model="form.cvc" placeholder="123" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Review Order</h2>

            <div class="max-h-60 overflow-y-auto mb-4 space-y-3 pr-2">
              <div v-for="item in cartItems" :key="item.id" class="flex gap-3">
                <img :src="item.product.images[0]" class="w-12 h-12 rounded object-cover bg-gray-100">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ item.product.title }}</p>
                  <p class="text-xs text-gray-500">Qty: {{ item.quantity }}</p>
                </div>
                <p class="text-sm font-semibold text-gray-900">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>

            <div class="space-y-3 mb-4 pb-4 border-b border-t border-gray-100 pt-4">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${{ subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{{ shipping === 0 ? 'Free' : '$' + shipping.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${{ tax.toFixed(2) }}</span>
              </div>
            </div>

            <div class="flex justify-between text-lg font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span class="text-orange-500">${{ total.toFixed(2) }}</span>
            </div>

            <button
                @click="submitOrder"
                :disabled="loading"
                class="w-full px-6 py-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:bg-gray-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Place Order - ${{ total.toFixed(2) }}
            </button>

            <p class="mt-4 text-center text-xs text-gray-500">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toast.show" class="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
      <span :class="toast.type === 'success' ? 'text-green-400' : 'text-red-400'">●</span>
      <span>{{ toast.message }}</span>
    </div>
  </div>

</template>



<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCart } from '@/services/cartService'
import type { CartItem } from '@/types/database'
import supabase from '@/lib/supabase'

const router = useRouter()
const cartItems = ref<CartItem[]>([])
const loading = ref(false)


const form = ref({
  fullName: '',
  address: '',
  city: '',
  zip: '',
  cardNumber: '',
  expiry: '',
  cvc: ''
})

const toast = ref({ show: false, message: '', type: 'success' })

onMounted(async () => {
  try {
    loading.value = true
    cartItems.value = await getCart()
    if (cartItems.value.length === 0) {
      router.push('/cart')
    }
  } catch (error) {
    showToast('Error loading checkout details', 'error')
  } finally {
    loading.value = false
  }
})

// Calculations (Matching Cart Logic)
const subtotal = computed(() => cartItems.value.reduce((sum, i) => sum + (i.product.price * i.quantity), 0))
const shipping = computed(() => subtotal.value >= 50 ? 0 : 10)
const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + shipping.value + tax.value)

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => toast.value.show = false, 3000)
}

//checkout submit

const submitOrder = async () => {
  try {
    loading.value = true;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not logged in");

    // 1. Capture items for the Success UI before deleting from DB
    // We deep-clone to ensure the data persists after the cart is cleared
    const purchasedItems = JSON.parse(JSON.stringify(cartItems.value));

    // 2. Create the Order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: cartItems.value[0].product.seller_id,
          total_price: total.value,
          payment_status: 'paid',
          order_status: 'pending'
        })
        .select().single();

    if (orderError) throw orderError;

    // 3. Create the Transaction
    const { error: transError } = await supabase
        .from('transactions')
        .insert({
          order_id: order.id,
          amount: total.value,
          method: 'stripe',
          status: 'success'
        });

    if (transError) throw transError;

    // 4. THE FIX: Clear the 'cart' table (Matching your schema)
    const { error: deleteError } = await supabase
        .from('cart')
        .delete()
        .eq('buyer_id', user.id); // Matches your buyer_id column

    if (deleteError) throw deleteError;

    // 5. Clear local state and Redirect with data
    cartItems.value = [];
    router.push({
      path: '/buyer/dashboard',
      query: { ordered: 'true' },
      state: { items: purchasedItems } // This passes the products to the next page
    });

  } catch (error: any) {
    console.error("Checkout failed:", error);
    showToast(error.message, 'error');
  } finally {
    loading.value = false;
  }
};



</script>