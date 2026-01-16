<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <!-- Profile Header with Cover -->
    <div class="h-32 bg-gradient-to-r from-orange-500 to-orange-600"></div>
    
    <div class="px-6 pb-6">
      <!-- Profile Picture Section - Overlapping cover -->
      <div class="flex items-start justify-between -mt-16 mb-6">
        <div class="flex items-end space-x-5">
          <div class="relative">
            <!-- Show avatar image if available, otherwise show initials -->
            <div
              v-if="profileData.avatar_url"
              class="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200"
            >
              <img :src="profileData.avatar_url" alt="Profile" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg"
            >
              {{ getInitials() }}
            </div>
            <button
              @click="triggerAvatarUpload"
              class="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 transition-colors"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleAvatarUpload"
          />
          <div>
            <h2 class="text-xl font-bold text-gray-900">{{ profileData.full_name || 'User' }}</h2>
            <p class="text-sm text-gray-600">{{ profileData.email }}</p>
          </div>
        </div>
        <button
          @click="isEditing = !isEditing"
          class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          <i class="pi pi-pen-to-square mr-2"></i>
          {{ isEditing ? 'Cancel' : 'Edit' }}
        </button>
      </div>
      
      <!-- Divider -->
      <div class="border-t border-gray-200 my-6"></div>

      <!-- Profile Information Display/Edit -->
      <div v-if="!isEditing">
        <!-- View Mode -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <p class="mt-1 text-lg text-gray-900">{{ profileData.full_name || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <p class="mt-1 text-lg text-gray-900">{{ profileData.email || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <p class="mt-1 text-lg text-gray-900">{{ profileData.phone || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <p class="mt-1 text-lg text-gray-900">{{ formatDate(profileData.date_of_birth) || '-' }}</p>
          </div>
        </div>

        <!-- Account Stats -->
        <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-orange-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-orange-600">{{ stats.ordersPlaced }}</p>
            <p class="text-sm text-gray-600">Orders Placed</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-green-600">{{ formatCurrency(stats.totalSpent) }}</p>
            <p class="text-sm text-gray-600">Total Spent</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4 text-center">
            <p class="text-2xl font-bold text-purple-600">{{ stats.wishlistItems }}</p>
            <p class="text-sm text-gray-600">Wishlist Items</p>
          </div>
        </div>
      </div>

      <!-- Edit Mode -->
      <form v-else @submit.prevent="saveProfile" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="full_name"
              v-model="profileData.full_name"
              type="text"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              v-model="profileData.email"
              type="email"
              disabled
              class="mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 shadow-sm"
            />
            <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              id="phone"
              v-model="profileData.phone"
              type="tel"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div>
            <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              id="date_of_birth"
              v-model="profileData.date_of_birth"
              type="date"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelEdit"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { uploadAvatarImage } from '@/services/storageService'
import 'primeicons/primeicons.css'
const props = defineProps({
  profileData: {
    type: Object,
    required: true
  },
  originalProfileData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['notify', 'update:profileData', 'update:originalProfileData', 'update:isEditing'])

const isEditing = ref(false)
const isSaving = ref(false)

// Profile stats
const stats = ref({ ordersPlaced: 0, totalSpent: 0, wishlistItems: 0 })

const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0)
  } catch {
    return `$${(amount || 0).toFixed(2)}`
  }
}

onMounted(async () => {
  try {
    const result = await api.get('/profile/stats')
    stats.value = {
      ordersPlaced: Number(result.ordersPlaced) || 0,
      totalSpent: Number(result.totalSpent) || 0,
      wishlistItems: Number(result.wishlistItems) || 0
    }
  } catch (error) {
    console.error('Failed to load profile stats:', error)
  }
})

const triggerAvatarUpload = () => {
  const input = document.getElementById('avatar-input') as HTMLInputElement
  input?.click()
}

const getInitials = () => {
  if (!props.profileData.full_name) return 'U'
  const names = props.profileData.full_name.split(' ')
  if (names.length >= 2) {
    return (names[0]?.[0] || '') + (names[1]?.[0] || '')
  }
  return names[0]?.[0] || 'U'
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    emit('notify', { message: 'Image size should be less than 5MB', type: 'error' })
    return
  }

  if (!file.type.startsWith('image/')) {
    emit('notify', { message: 'Please select a valid image file', type: 'error' })
    return
  }

  try {
    isSaving.value = true
    
    // Upload to Supabase Storage and get public URL
    const avatarUrl = await uploadAvatarImage(file)
    
    const newProfileData = { ...props.profileData, avatar_url: avatarUrl }
    emit('update:profileData', newProfileData)
    
    emit('notify', { message: 'Profile picture updated successfully! Click "Save Changes" to keep it.', type: 'success' })
    isEditing.value = true
  } catch (error) {
    console.error('Error uploading avatar:', error)
    emit('notify', { message: 'Failed to upload profile picture', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const saveProfile = async () => {
  isSaving.value = true
  try {
    console.log('[ProfileTab] Saving profile:', {
      full_name: props.profileData.full_name,
      phone: props.profileData.phone,
      date_of_birth: props.profileData.date_of_birth,
      avatar_url: props.profileData.avatar_url ? 'present' : 'empty'
    })

    const result = await api.put('/profile', {
      full_name: props.profileData.full_name,
      phone: props.profileData.phone,
      date_of_birth: props.profileData.date_of_birth,
      avatar_url: props.profileData.avatar_url
    })

    console.log('[ProfileTab] Save response:', result)

    emit('update:originalProfileData', { ...result })
    emit('update:profileData', { ...result })
    isEditing.value = false
    emit('notify', { message: 'Profile updated successfully', type: 'success' })
  } catch (error: any) {
    console.error('Error saving profile:', error.message)
    emit('notify', { message: `Failed to update profile: ${error.message}`, type: 'error' })
  } finally {
    isSaving.value = false
  }
}

const cancelEdit = () => {
  emit('update:profileData', { ...props.originalProfileData })
  isEditing.value = false
}
</script>
