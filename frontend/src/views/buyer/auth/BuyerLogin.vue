<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded shadow w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Buyer Login</h2>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full mb-3 p-3 border rounded"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-3 p-3 border rounded"
        required
      />

      <button class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
        Login
      </button>
      <p class="mt-3 text-right text-gray-400">
        <router-link to="/forgot-password" class="hover:underline">Forgot Password?</router-link>
      </p>
      <Divider text="or continue with" class="mt-2"/>

      <button class="w-full mb-3 p-3 border rounded">
        <i class="pi pi-google" style="color: red"></i>
        Continue with Google
      </button>
      <p class="text-center text-gray-600">
        Don't have an account?
        <router-link to="/buyer/register" class="text-blue-600 hover:underline">Register</router-link>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import supabase from "@/lib/supabase";
import { useRouter } from "vue-router";
import Divider from "@/components/ui/Divider.vue";
import "primeicons/primeicons.css";

const router = useRouter();

const email = ref("");
const password = ref("");

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

  // Debugging` 
  console.log("Logged in as:", role);

  if (role === "buyer") router.push("/buyer/dashboard");
  else if (role === "seller") router.push("/seller/dashboard");
  else if (role === "admin") router.push("/admin/dashboard");
  else alert("Unknown role. Contact admin.");
};
</script>
