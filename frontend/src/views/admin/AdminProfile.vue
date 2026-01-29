<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p class="text-gray-500 mt-1">Manage your admin account information</p>
      </div>
    </div>

    <!-- Main Profile Card -->
    <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Left Column - Avatar & Stats -->
        <div class="col-span-1 flex flex-col items-center gap-6">
          <!-- Avatar -->
          <div class="relative">
            <div class="w-40 h-40 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-pink-100 border-4 border-white shadow-xl">
              <img v-if="profile.avatarUrl" :src="profile.avatarUrl" class="w-full h-full object-cover" alt="Admin Avatar" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <button @click="openAvatar" class="absolute bottom-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <!-- Admin Info Card -->
          <div class="w-full bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-100">
            <div class="text-center mb-3">
              <p class="text-xs text-gray-500 uppercase tracking-wide font-semibold">Administrator</p>
              <p class="font-bold text-xl text-gray-900 mt-1">{{ profile.fullName || 'Admin User' }}</p>
            </div>
            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-orange-200">
              <div class="text-center">
                <p class="text-xs text-gray-500">Total Users</p>
                <p class="font-bold text-lg text-gray-900">{{ stats.totalUsers }}</p>
              </div>
              <div class="text-center">
                <p class="text-xs text-gray-500">Total Orders</p>
                <p class="font-bold text-lg text-gray-900">{{ stats.totalOrders }}</p>
              </div>
            </div>
          </div>

          <!-- Upload Input -->
          <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
        </div>

        <!-- Right Column - Form -->
        <div class="col-span-2">
          <form @submit.prevent="saveProfile" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input 
                  v-model="profile.fullName" 
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input 
                  v-model="profile.email" 
                  type="email" 
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-gray-50" 
                  placeholder="admin@example.com"
                  disabled
                />
                <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input 
                  v-model="profile.phone" 
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <input 
                  v-model="profile.department" 
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
                  placeholder="Operations"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Bio / Description</label>
              <textarea 
                v-model="profile.bio" 
                rows="4" 
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input 
                v-model="profile.address" 
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
                placeholder="City, Country"
              />
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 justify-end pt-4 border-t-2 border-gray-100">
              <button 
                type="button" 
                @click="loadProfile" 
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                :disabled="loading"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold disabled:opacity-50"
                :disabled="loading"
              >
                {{ loading ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import supabase from '@/lib/supabase'
import { uploadAvatarImage } from '@/services/storageService'

const avatarInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const successMessage = ref('')

const profile = reactive({
  id: '',
  email: '',
  fullName: '',
  phone: '',
  department: '',
  bio: '',
  address: '',
  avatarUrl: ''
})

const stats = reactive({
  totalUsers: 0,
  totalOrders: 0
})

function openAvatar() {
  avatarInput.value?.click()
}

async function onAvatarChange(e: Event) {
  const t = e.target as HTMLInputElement
  if (!t.files || !t.files[0]) return
  try {
    loading.value = true
    const url = await uploadAvatarImage(t.files[0])
    profile.avatarUrl = url

    await supabase.auth.updateUser({ data: { ...getUserMetadata(), avatar_url: url } })
    showSuccess('Avatar uploaded successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to upload avatar')
  } finally {
    loading.value = false
  }
}

function getUserMetadata() {
  return {
    fullName: profile.fullName,
    phone: profile.phone,
    department: profile.department,
    bio: profile.bio,
    address: profile.address,
    avatar_url: profile.avatarUrl,
    role: 'admin'
  }
}

async function loadProfile() {
  try {
    loading.value = true
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    profile.id = user.id
    profile.email = user.email || ''
    const md = (user.user_metadata || {}) as any
    const meta = (md.user_metadata || md) as any
    profile.fullName = meta.fullName || meta.full_name || ''
    profile.phone = meta.phone || ''
    profile.department = meta.department || ''
    profile.bio = meta.bio || ''
    profile.address = meta.address || ''
    profile.avatarUrl = meta.avatar_url || ''

    // Load stats
    await loadStats()
  } catch (err) {
    console.error('Load profile failed', err)
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    // Count total users
    const { count: usersCount } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
    
    stats.totalUsers = usersCount || 0

    // Count total orders
    const { count: ordersCount } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
    
    stats.totalOrders = ordersCount || 0
  } catch (err) {
    console.error('Failed to load stats', err)
  }
}

async function saveProfile() {
  try {
    loading.value = true
    const metadata = getUserMetadata()
    
    const { error } = await supabase.auth.updateUser({ data: metadata })
    if (error) throw error

    // Also persist into profiles table
    try {
      await supabase.from('profiles').upsert({
        id: profile.id,
        full_name: metadata.fullName,
        phone: metadata.phone,
        bio: metadata.bio,
        address: metadata.address,
        avatar_url: metadata.avatar_url,
        role: 'admin'
      })
    } catch (dbErr: any) {
      console.error('Failed to upsert profile row:', dbErr)
      alert('Profile updated, but failed to save to profile table: ' + (dbErr?.message || String(dbErr)))
      return
    }

    await loadProfile()
    showSuccess('Profile updated successfully!')
    
    // Notify other components that profile was updated
    window.dispatchEvent(new Event('profile-updated'))
  } catch (err: any) {
    console.error('Save failed', err)
    const msg = err?.message || (err && JSON.stringify(err)) || 'Unknown error'
    alert('Failed to save profile: ' + msg)
  } finally {
    loading.value = false
  }
}

function showSuccess(message: string) {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

onMounted(loadProfile)
</script>
