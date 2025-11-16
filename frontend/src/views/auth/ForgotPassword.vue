<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      
      <h2 class="text-3xl font-bold text-center mb-6">Forgot Password</h2>
      <p class="text-gray-600 text-center mb-6">
        Enter your email address and we will send you a reset link.
      </p>

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
          class="w-full bg-blue-600 text-white p-3 rounded text-lg hover:bg-blue-700 transition"
        >
          Send Reset Link
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Remember your password?
        <router-link to="/login" class="text-blue-600 hover:underline">
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

const sendResetEmail = async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Password reset email sent! Please check your inbox.");
  router.push("/login");
};
</script>
