<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      
      <h2 class="text-3xl font-bold text-center mb-6"> Buyer Create an Account</h2>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <form @submit.prevent="registerUser">

        <!-- Full Name -->
        <div class="mb-4">
          <label class="block text-gray-700">Full Name</label>
          <input v-model="fullName" type="text" class="w-full p-3 border rounded" :disabled="loading" required />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full p-3 border rounded" :disabled="loading" required />
        </div>

        <!-- Password and password input with toggle visibility-->
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <div class="relative">
            <input v-model="password" :type="showPassword ? 'text' : 'password'" class="w-full p-3 border rounded pr-10" :disabled="loading" :class="{
              'border-red-500': password && passwordStrength === 'weak',
              'border-yellow-500': password && passwordStrength === 'medium',
              'border-green-500': password && passwordStrength === 'strong'
            }" required />
            <button type="button" @click="toggleShowPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <i class="pi" :class="showPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
            </button>
          </div>
          <!-- Password Strength Indicator -->
          <div v-if="password" class="mt-2">
            <div class="flex gap-1 mb-1">
              <div class="h-2 flex-1 rounded" :class="{
                'bg-red-500': passwordStrength === 'weak',
                'bg-gray-200': passwordStrength !== 'weak'
              }"></div>
              <div class="h-2 flex-1 rounded" :class="{
                'bg-yellow-500': passwordStrength === 'medium' || passwordStrength === 'strong',
                'bg-gray-200': passwordStrength === 'weak'
              }"></div>
              <div class="h-2 flex-1 rounded" :class="{
                'bg-green-500': passwordStrength === 'strong',
                'bg-gray-200': passwordStrength !== 'strong'
              }"></div>
            </div>
            <p class="text-sm" :class="{
              'text-red-600': passwordStrength === 'weak',
              'text-yellow-600': passwordStrength === 'medium',
              'text-green-600': passwordStrength === 'strong'
            }">
              Strength: <span class="font-semibold capitalize">{{ passwordStrength }}</span>
            </p>
          </div>
        </div>

        <!-- Confirm Password and password input with toggle visibility-->
        <div class="mb-4">
          <label class="block text-gray-700">Confirm Password</label>
          <div class="relative">
            <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="w-full p-3 border rounded pr-10" :disabled="loading" :class="{
              'border-red-500': confirmPassword && !passwordsMatch,
              'border-green-500': confirmPassword && passwordsMatch && password
            }" required />
            <button type="button" @click="toggleShowConfirmPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <i class="pi" :class="showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
            </button>
          </div>
          <!-- Password Match Indicator -->
          <p v-if="confirmPassword" class="text-sm mt-2" :class="{
            'text-red-600': !passwordsMatch,
            'text-green-600': passwordsMatch && password
          }">
            <i class="pi" :class="passwordsMatch && password ? 'pi-check-circle' : 'pi-times-circle'"></i>
            {{ passwordsMatch && password ? 'Passwords match' : 'Passwords do not match' }}
          </p>
        </div>

        <!-- Submit Button -->
        <button 
          type="submit"
          :disabled="loading || !passwordsMatch || passwordStrength === 'weak'"
          class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Already have an account?
        <router-link to="/buyer/auth/login" class="text-blue-600">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import supabase from '@/lib/supabase'
import { useRouter } from 'vue-router'
import 'primeicons/primeicons.css'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Display password input with toggle visibility
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

// Password strength calculator
const passwordStrength = computed(() => {
  const pwd = password.value
  if (!pwd) return ''
  
  let strength = 0
  if (pwd.length >= 8) strength++
  if (pwd.length >= 12) strength++
  if (/[a-z]/.test(pwd)) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++
  
  if (strength <= 2) return 'weak'
  if (strength <= 4) return 'medium'
  return 'strong'
})

// Check if passwords match
const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value
})

const registerUser = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''

  // Validate passwords match
  if (!passwordsMatch.value) {
    errorMessage.value = 'Passwords do not match!'
    return
  }

  // Validate password strength
  if (passwordStrength.value === 'weak') {
    errorMessage.value = 'Password is too weak. Please use a stronger password.'
    return
  }

  loading.value = true

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          fullName: fullName.value,
          role: "buyer",   
        }
      }
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    successMessage.value = 'Account created! Check your email to verify.'
    setTimeout(() => {
      router.push('/buyer/auth/login')
    }, 2000)
  } catch (err) {
    errorMessage.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
