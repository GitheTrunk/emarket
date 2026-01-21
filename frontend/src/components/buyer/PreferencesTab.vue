<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Preferences</h2>
      <p class="mt-1 text-sm text-gray-500">Customize your shopping experience</p>
    </div>

    <div class="px-6 py-6 space-y-6">
      <!-- Notification Preferences -->
      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div class="space-y-4">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="preferences.emailNotifications"
              type="checkbox"
              class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
            <span>
              <p class="text-sm font-medium text-gray-900">Email Notifications</p>
              <p class="text-xs text-gray-500">Receive important updates via email</p>
            </span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="preferences.orderUpdates"
              type="checkbox"
              class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
            <span>
              <p class="text-sm font-medium text-gray-900">Order Updates</p>
              <p class="text-xs text-gray-500">Get notified about your order status</p>
            </span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="preferences.promotions"
              type="checkbox"
              class="rounded border-gray-300 text-orange-600 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
            <span>
              <p class="text-sm font-medium text-gray-900">Promotional Offers</p>
              <p class="text-xs text-gray-500">Receive exclusive deals and discounts</p>
            </span>
          </label>
        </div>
      </div>

      <!-- Language & Region -->
      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Language & Region</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="language" class="block text-sm font-medium text-gray-700">Preferred Language</label>
            <select
              id="language"
              v-model="preferences.language"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
          <div>
            <label for="currency" class="block text-sm font-medium text-gray-700">Preferred Currency</label>
            <select
              id="currency"
              v-model="preferences.currency"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CNY">CNY (¥)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Save Preferences -->
      <div class="flex justify-end">
        <button
          @click="savePreferences"
          :disabled="isSaving"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
        >
          {{ isSaving ? 'Saving...' : 'Save Preferences' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  preferences: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['notify', 'update:preferences'])

const isSaving = ref(false)

const preferences = ref({ ...props.preferences })

const savePreferences = async () => {
  isSaving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('update:preferences', { ...preferences.value })
    emit('notify', { message: 'Preferences saved successfully', type: 'success' })
  } catch (error) {
    console.error('Error saving preferences:', error)
    emit('notify', { message: 'Failed to save preferences', type: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>
