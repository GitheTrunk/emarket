<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-3xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl overflow-hidden shadow-lg">
        <!-- Illustration / left side -->
        <div class="hidden md:flex items-center justify-center bg-white p-4">
          <img src="@/assets/logo/register.png" alt="register" class="max-w-xs h-auto transform transition-transform duration-300 hover:scale-105 hover:rotate-1 hover:brightness-110 hover:shadow-lg" />
        </div>

        <!-- Right orange sign-up panel -->
        <div class="bg-orange-500 text-white p-6 md:p-8 relative">
          <div class="max-w-sm mx-auto">
            <h2 class="text-xl font-semibold text-center mb-4 underline decoration-white/30 decoration-2">Sign Up as Supplier</h2>

            <form @submit.prevent="registerUser" class="space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-orange-100">First Name</label>
                  <input v-model="firstName" type="text" required class="w-full mt-1 p-1 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200 text-sm" />
                </div>
                <div>
                  <label class="text-xs text-orange-100">Last Name</label>
                  <input v-model="lastName" type="text" required class="w-full mt-1 p-1 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200 text-sm" />
                </div>
              </div>

              <div>
                <label class="text-xs text-orange-100">Phone Number</label>
                <input v-model="phone" type="tel" required class="w-full mt-1 p-1 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200 text-sm" />
              </div>

              <div>
                <label class="text-xs text-orange-100">Email</label>
                <input v-model="email" type="email" required class="w-full mt-1 p-1 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200 text-sm" />
              </div>

              <div>
                <label class="text-xs text-orange-100">Password</label>
                <input v-model="password" type="password" required class="w-full mt-1 p-1 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200 text-sm" />
              </div>

              <div>
                <label class="text-xs text-orange-100">Confirm Password</label>
                <input v-model="confirmPassword" type="password" required class="w-full mt-1 p-1 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200 text-sm" />
              </div>

              <div>
                <label class="text-xs text-orange-100">Shop Address</label>
                <input v-model="shopAddress" type="text" class="w-full mt-1 p-1 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200 text-sm" />
              </div>

              <button type="submit" class="w-full bg-white text-orange-600 font-semibold py-2 rounded">Sign Up</button>

              <button type="button" class="w-full mt-2 bg-orange-600/20 text-white border border-white/30 py-2 rounded flex items-center justify-center gap-3">
                <i class="pi pi-google text-white"></i>
                Sign up with Google
              </button>

              <p class="text-center text-orange-100 text-xs mt-2">If You Already have account, <router-link to="/seller/auth/login" class="underline">Please Sign In</router-link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import supabase from '@/lib/supabase'
import { useRouter } from 'vue-router'
import illustration from '../../../assets/logo/register.png'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const shopAddress = ref('')

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
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        shopAddress: shopAddress.value,
        role: 'seller'
      }
    }
  })

  if (error) {
    alert(error.message)
    return
  }

  alert('Account created! Check your email to verify.')
  router.push('/seller/auth/login')
}
</script>
