<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      <div class="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
        <div class="absolute -bottom-12 left-8">
          <div class="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
            <img v-if="shop.logo" :src="shop.logo" class="w-full h-full object-cover" />
            <span v-else class="text-3xl font-bold text-indigo-600">{{ shop.name?.charAt(0) }}</span>
          </div>
        </div>
      </div>

      <div class="pt-16 p-8">
        <div class="flex justify-between items-start mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ shop.name || 'Untitled Shop' }}</h1>
            <p class="text-gray-500 text-sm">Seller ID: {{ sellerId }}</p>
          </div>
          <button
              @click="isEditing = !isEditing"
              class="px-5 py-2 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 transition"
          >
            {{ isEditing ? 'Cancel' : 'Edit Shop Profile' }}
          </button>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-10">
          <div class="bg-gray-50 p-4 rounded-xl text-center">
            <p class="text-xl font-bold text-gray-900">4.9</p>
            <p class="text-xs text-gray-500 uppercase">Rating</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl text-center">
            <p class="text-xl font-bold text-gray-900">124</p>
            <p class="text-xs text-gray-500 uppercase">Products</p>
          </div>
          <div class="bg-gray-50 p-4 rounded-xl text-center">
            <p class="text-xl font-bold text-gray-900">2 yrs</p>
            <p class="text-xs text-gray-500 uppercase">On Market</p>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Shop Name</label>
              <input
                  v-model="shop.name"
                  :disabled="!isEditing"
                  type="text"
                  class="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-50 disabled:text-gray-500 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1">Business Email</label>
              <input
                  v-model="shop.email"
                  :disabled="!isEditing"
                  type="email"
                  class="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Shop Description</label>
            <textarea
                v-model="shop.description"
                :disabled="!isEditing"
                rows="4"
                class="w-full border border-gray-300 rounded-lg p-3 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Tell customers what you specialize in..."
            ></textarea>
          </div>

          <div v-if="isEditing" class="flex justify-end pt-4">
            <button
                type="submit"
                :disabled="loading"
                class="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import supabase from '@/lib/supabase'

const isEditing = ref(false)
const loading = ref(false)
const sellerId = ref('')

const shop = reactive({
  name: '',
  description: '',
  email: '',
  logo: null
})

async function fetchShopProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    sellerId.value = user.id
    // Assuming you have a 'profiles' or 'shops' table
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (data && !error) {
      shop.name = data.full_name || ''
      shop.description = data.description || ''
      shop.email = user.email || ''
    }
  }
}

async function saveProfile() {
  loading.value = true
  try {
    const { error } = await supabase
        .from('profiles')
        .update({
          full_name: shop.name,
          description: shop.description
        })
        .eq('id', sellerId.value)

    if (error) throw error
    alert('Profile updated!')
    isEditing.value = false
  } catch (err: any) {
    alert(err.message)
  } finally {
    loading.value = false
  }
}

onMounted(fetchShopProfile)
</script>