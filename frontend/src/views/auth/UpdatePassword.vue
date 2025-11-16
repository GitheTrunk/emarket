<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      
      <h2 class="text-3xl font-bold text-center mb-6">Reset Your Password</h2>
      <p class="text-gray-600 text-center mb-6">
        Enter your new password below.
      </p>

      <form @submit.prevent="updatePassword">

        <div class="mb-4">
          <label class="block text-gray-700 mb-1">New Password</label>
          <input
            v-model="newPassword"
            type="password"
            class="w-full p-3 border rounded focus:ring focus:ring-blue-200"
            placeholder="••••••••"
            required
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-1">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full p-3 border rounded focus:ring focus:ring-blue-200"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          class="w-full bg-blue-600 text-white p-3 rounded text-lg hover:bg-blue-700 transition"
        >
          Update Password
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Back to 
        <router-link to="/login" class="text-blue-600 hover:underline">
          Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import supabase from "@/lib/supabase";
import { useRouter } from "vue-router";

const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword.value,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Password updated successfully!");
  router.push("/login");
};
</script>
