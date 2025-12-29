<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      
      <h2 class="text-3xl font-bold text-center mb-6">Seller Create an Account</h2>

      <form @submit.prevent="registerUser">

        <!-- Full Name -->
        <div class="mb-4">
          <label class="block text-gray-700">Full Name</label>
          <input v-model="fullName" type="text" class="w-full p-3 border rounded" required />
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full p-3 border rounded" required />
        </div>

        <!-- Password and password input with toggle visibility-->
        <div class="mb-4 relative">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" :type="showPassword ? 'text' : 'password'" class="w-full p-3 border rounded pr-10" required />
          <button type="button" @click="toggleShowPassword" class="absolute inset-y-0 right-0 flex items-center pr-3" style="top: 1.5rem;">
            <i class="pi" :class="showPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
          </button>
        </div>

        <!-- Confirm Password password input with toggle visibility -->
        <div class="mb-4 relative">
          <label class="block text-gray-700">Confirm Password</label>
          <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" class="w-full p-3 border rounded pr-10" required />
          <button type="button" @click="toggleShowConfirmPassword" class="absolute inset-y-0 right-0 flex items-center pr-3" style="top: 1.5rem;">
            <i class="pi" :class="showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
          </button>
        </div>

        <!-- Submit Button -->
        <button class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Already have an account?
        <router-link to="/seller/auth/login" class="text-blue-600">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import supabase from '@/lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Display password input with toggle visibility functionality
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value
}

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!")
    return
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        fullName: fullName.value,
        role: "seller", 
      }
    }
  })

  if (error) {
    alert(error.message)
    return
  }

  alert("Account created! Check your email to verify.")
  router.push('/login')
}
</script>
