<template>
  <div class="p-6">
    <ProfileTab
      :profile-data="profileData"
      :original-profile-data="originalProfileData"
      @notify="handleNotify"
      @update:profile-data="profileData = $event"
      @update:original-profile-data="originalProfileData = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { api } from '@/services/api'
import ProfileTab from '@/components/buyer/ProfileTab.vue'

const notify = inject<(message: string, type: 'success' | 'error' | 'info') => void>('notify')

const profileData = ref({
  full_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  avatar_url: ''
})

const originalProfileData = ref({
  full_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  avatar_url: ''
})

const handleNotify = (payload: { message: string; type: 'success' | 'error' | 'info' }) => {
  if (notify) {
    notify(payload.message, payload.type)
  }
}

onMounted(async () => {
  try {
    // Fetch profile from backend API
    const profile = await api.get('/profile')
    
    const data = {
      full_name: profile.full_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      date_of_birth: profile.date_of_birth || '',
      avatar_url: profile.avatar_url || ''
    }
    profileData.value = data
    originalProfileData.value = { ...data }
  } catch (error: any) {
    console.error('Error loading profile:', error.message)
    
    // If it's a 401, user is not authenticated
    if (error.message.includes('401')) {
      if (notify) {
        notify('Please login to view your profile', 'error')
      }
    } else {
      if (notify) {
        notify('Error loading profile data', 'error')
      }
    }
  }
})
</script>
