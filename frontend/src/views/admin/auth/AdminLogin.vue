<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Admin Login</h2>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-3 p-3 border rounded"
        required
      />
      
      <!-- Display password input with toggle visibility -->
      <div class="relative w-full mb-3">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          class="w-full p-3 border rounded pr-10"
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

      <button class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
        Login
      </button>
      <p class="mt-3 text-right text-gray-400">
        <router-link to="/forgot-password" class="hover:underline">Forgot Password?</router-link>
      </p>=
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import supabase from "@/lib/supabase";
import { useRouter } from "vue-router";
import "primeicons/primeicons.css";

const router = useRouter();

const email = ref("");
const password = ref("");

// Display password input with toggle visibility funtionality
const showPassword = ref(false);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (error) {
    alert(error.message);
    return;
  }

  // data.user exists when login succeeds
  const user = data.user;
  const role = user.user_metadata.role;

  // Debugging
  console.log("Logged in as:", role);

  if (role === "admin") router.push("/admin/dashboard");
  else alert("You are not authorized to access admin panel.");
};
</script>
