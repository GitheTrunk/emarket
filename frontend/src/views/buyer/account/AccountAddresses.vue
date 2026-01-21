<template>
  <div class="p-6">
    <AddressTab
      :addresses="addresses"
      @notify="handleNotify"
      @update:addresses="addresses = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import supabase from '@/lib/supabase'
import AddressTab from '@/components/buyer/AddressTab.vue'
import type { Address } from '@/types/database'

const notify = inject<(message: string, type: 'success' | 'error' | 'info') => void>('notify')

const addresses = ref<Address[]>([])

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
        .from('addresses')
        .select('*')
        .eq('buyer_id', user.id)
        .order('is_default', { ascending: false })

      // Handle both table not found and no data cases
      if (error) {
        console.warn('Addresses table error:', error.message)
        addresses.value = []
        return
      }

      if (data) {
        addresses.value = data
      }
    }
  } catch (error) {
    console.error('Error loading addresses:', error)
    addresses.value = []
  }
})
</script>
