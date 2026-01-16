<template>
  <div class="bg-white rounded-lg shadow-sm">
    <div class="px-6 py-5 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Security Settings</h2>
      <p class="mt-1 text-sm text-gray-500">Manage your password and account security</p>
    </div>

    <div class="px-6 py-6 space-y-6">
      <!-- Change Password Section -->
      <div class="border-b border-gray-200 pb-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label for="current_password" class="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              id="current_password"
              v-model="passwordForm.current"
              type="password"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div>
            <label for="new_password" class="block text-sm font-medium text-gray-700">New Password</label>
            <input
              id="new_password"
              v-model="passwordForm.new"
              type="password"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <div>
            <label for="confirm_password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirm_password"
              v-model="passwordForm.confirm"
              type="password"
              class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            :disabled="isSaving"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
          >
            {{ isSaving ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="border-b border-gray-200 pb-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
            <p class="mt-1 text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Enable
          </button>
        </div>
      </div>

      <!-- Login History -->
      <!-- <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Login History</h3>
        <div class="space-y-3">
          <div
            v-for="(login, index) in loginHistory"
            :key="index"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div class="flex items-center space-x-4">
              <div
                v-if="login.current"
                class="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100"
              >
                <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div v-else class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-300">
                <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ login.device }}</p>
                <p class="text-sm text-gray-600">{{ login.location }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ login.time }}</p>
              <p v-if="login.current" class="text-xs text-orange-600 font-medium">Current Session</p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import supabase from '@/lib/supabase'

const props = defineProps({
  loginHistory: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['notify'])

const isSaving = ref(false)

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    emit('notify', { message: 'Passwords do not match', type: 'error' })
    return
  }

  isSaving.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.new
    })

    if (error) throw error

    passwordForm.value = { current: '', new: '', confirm: '' }
    emit('notify', { message: 'Password updated successfully', type: 'success' })
  } catch (error) {
    console.error('Error changing password:', error)
    emit('notify', { message: 'Failed to update password', type: 'error' })
  } finally {
    isSaving.value = false
  }
}
</script>
