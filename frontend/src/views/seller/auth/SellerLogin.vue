
<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Seller Login</h2>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full mb-3 p-3 border rounded"
          :disabled="loading"
          required
      />

      <div class="relative w-full mb-3">
        <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            class="w-full p-3 border rounded pr-10"
            :disabled="loading"
            required
        />
        <button
          type="button"
          @click="toggleShowPassword"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <i class="pi" :class="showPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
        </button>
      </div>

      <button 
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <span v-if="loading" class="mr-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p class="mt-3 text-right text-gray-400">
        <router-link to="/forgot-password" class="hover:underline">Forgot Password?</router-link>
      </p>
      <Divider text="or continue with" class="mt-2"/>

      <button class="w-full mb-3 p-3 border rounded">
        <i class="pi pi-google" style="color: green"></i>
        Continue with Google
      </button>
      <p class="text-center text-gray-600">
        Don't have an account?
        <router-link to="/seller/register" class="text-blue-600 hover:underline">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import supabase from "@/lib/supabase";
import { useRouter } from "vue-router";
import Divider from "@/components/ui/divider.vue";
import "primeicons/primeicons.css";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  // Clear previous messages
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorMessage.value = error.message;
      return;
    }

    // data.user exists when login succeeds
    const user = data.user;
    const role = user.user_metadata.role;

    // Debugging
    console.log("Logged in as:", role);

    successMessage.value = "Login successful! Redirecting...";

    if (role === "buyer") router.push("/buyer/dashboard");
    else if (role === "seller") router.push("/seller/dashboard");
    else if (role === "admin") router.push("/admin/dashboard");
    else errorMessage.value = "Unknown role. Contact admin.";
  } catch (err) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
