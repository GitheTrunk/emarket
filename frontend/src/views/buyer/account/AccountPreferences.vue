<template>
  <div class="p-6">
    <PreferencesTab
      :preferences="preferences"
      @notify="handleNotify"
      @update:preferences="preferences = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import supabase from '@/lib/supabase'
import PreferencesTab from '@/components/buyer/PreferencesTab.vue'

const notify = inject<(message: string, type: 'success' | 'error' | 'info') => void>('notify')

const preferences = ref({
  emailNotifications: true,
  orderUpdates: true,
  promotions: false,
  language: 'en',
  currency: 'USD'
})

const handleNotify = (payload: { message: string; type: 'success' | 'error' | 'info' }) => {
  if (notify) {
    notify(payload.message, payload.type)
  }
}

onMounted(async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)

      // Handle both table not found and no data cases gracefully
      if (error) {
        console.warn('User preferences table error:', error.message)
        // Use default preferences
        return
      }

      if (data && data.length > 0) {
        preferences.value = {
          emailNotifications: data[0].email_notifications ?? true,
          orderUpdates: data[0].order_updates ?? true,
          promotions: data[0].promotions ?? false,
          language: data[0].language || 'en',
          currency: data[0].currency || 'USD'
        }
      }
    }
  } catch (error) {
    console.error('Error loading preferences:', error)
    // Use default preferences
  }
})
</script>
