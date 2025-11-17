<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      
      <h2 class="text-3xl font-bold text-center mb-6">Create an Account</h2>

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

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full p-3 border rounded" required />
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="block text-gray-700">Confirm Password</label>
          <input v-model="confirmPassword" type="password" class="w-full p-3 border rounded" required />
        </div>

        <!-- Role Selection -->
        <div class="mb-6">
          <label class="block text-gray-700 mb-1">Select Role</label>

          <select v-model="role" class="w-full p-3 border rounded" required>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <!-- Submit Button -->
        <button class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
          Create Account
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-600">Login</router-link>
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
const role = ref('buyer') // default role

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
        role: role.value,   // Save role here
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
