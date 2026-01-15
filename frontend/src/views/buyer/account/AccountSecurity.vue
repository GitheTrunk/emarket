<template>
  <div class="p-6">
    <SecurityTab
      :login-history="loginHistory"
      @notify="handleNotify"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import SecurityTab from '@/components/buyer/SecurityTab.vue'

const notify = inject<(message: string, type: 'success' | 'error' | 'info') => void>('notify')

const loginHistory = ref([
  {
    device: 'Chrome on Windows',
    location: 'New York, USA',
    time: '2 hours ago',
    current: true
  },
  {
    device: 'Safari on iPhone',
    location: 'New York, USA',
    time: '1 day ago',
    current: false
  }
])

const handleNotify = (payload: { message: string; type: 'success' | 'error' | 'info' }) => {
  if (notify) {
    notify(payload.message, payload.type)
  }
}
</script>
