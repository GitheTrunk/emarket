<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      
      <h2 class="text-3xl font-bold text-center mb-6">Forgot Password</h2>
      <p class="text-gray-600 text-center mb-6">
        Enter your email address and we will send you a reset link.
      </p>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="sendResetEmail">
        
        <!-- EMAIL -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Email Address</label>
          <input
            v-model="email"
            type="email"
            class="w-full p-3 border rounded focus:ring focus:ring-blue-200"
            placeholder="example@mail.com"
            required
          />
        </div>

        <!-- SUBMIT -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white p-3 rounded text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Remember your password?
        <router-link to="/" class="text-blue-600 hover:underline">
          Back to Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import supabase from "@/lib/supabase";
import { useRouter } from "vue-router";

const email = ref("");
const router = useRouter();
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const sendResetEmail = async () => {
  // Clear previous messages
  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      errorMessage.value = error.message;
      return;
    }

    successMessage.value = "Password reset email sent! Please check your inbox.";
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err) {
    errorMessage.value = "An unexpected error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
