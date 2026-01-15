<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="px-6 py-5 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">My Addresses</h2>
        <button
          @click="addNewAddress"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-orange-600 hover:bg-orange-700"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Address
        </button>
      </div>
    </div>

    <div class="px-6 py-6">
      <div v-if="addresses.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="mt-4 text-gray-600">No addresses added yet</p>
        <button
          @click="addNewAddress"
          class="mt-4 text-orange-600 hover:text-orange-700 font-medium"
        >
          Add your first address
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(address, index) in addresses"
          :key="index"
          class="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-lg font-semibold text-gray-900">{{ address.label }}</h3>
                <span v-if="address.is_default" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Default
                </span>
              </div>
              <p class="mt-2 text-gray-600">{{ address.street }}</p>
              <p class="text-gray-600">{{ address.city }}, {{ address.state }} {{ address.postal_code }}</p>
              <p class="text-gray-600">{{ address.country }}</p>
              <p class="mt-2 text-sm text-gray-500">Phone: {{ address.phone_number }}</p>
            </div>
            <div class="flex items-center space-x-3 ml-4">
              <button
                @click="editAddress(index)"
                class="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="deleteAddress(index)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                v-if="!address.is_default"
                @click="setDefaultAddress(index)"
                class="px-3 py-1 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              >
                Set as Default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Address } from '@/types/database'

const props = defineProps({
  addresses: {
    type: Array as () => Address[],
    required: true
  }
})

const emit = defineEmits(['notify', 'update:addresses'])

const addNewAddress = () => {
  const newAddresses = [
    ...props.addresses,
    {
      label: 'New Address',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      phone: '',
      is_default: false
    }
  ]
  emit('update:addresses', newAddresses)
}

const editAddress = (index: number) => {
  console.log('Edit address:', index)
}

const deleteAddress = (index: number) => {
  if (confirm('Are you sure you want to delete this address?')) {
    const newAddresses = props.addresses.filter((_: any, i: number) => i !== index)
    emit('update:addresses', newAddresses)
    emit('notify', { message: 'Address deleted successfully', type: 'success' })
  }
}

const setDefaultAddress = (index: number) => {
  const newAddresses = props.addresses.map((addr: any, i: number) => ({
    ...addr,
    is_default: i === index
  }))
  emit('update:addresses', newAddresses)
  emit('notify', { message: 'Default address updated', type: 'success' })
}
</script>
