<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="max-w-3xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
        <!-- Left illustration area -->
        <div class="hidden md:flex items-center justify-center bg-white">
          <img src="@/assets/logo/login.png" alt="login" class="max-w-40 h-auto transform transition-transform duration-300 hover:scale-105 hover:rotate-1 hover:brightness-110 hover:shadow-lg" />
        </div>

        <!-- Right orange panel -->
        <div class="flex items-center justify-center bg-orange-500 text-white p-6">
          <div class="w-full max-w-sm">
            <h2 class="text-xl font-semibold text-center mb-4">Log in as Supplier</h2>

            <form @submit.prevent="login" class="space-y-4">
              <div>
                <label class="text-sm text-orange-100">Username or Email</label>
                <input v-model="email" type="email" required class="w-full mt-1 p-2 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200" />
              </div>

              <div>
                <label class="text-sm text-orange-100">Password</label>
                <input v-model="password" type="password" required class="w-full mt-1 p-2 rounded bg-orange-50 text-orange-700 placeholder-orange-400 border border-orange-200" />
              </div>

              <div class="flex items-center justify-between text-xs text-orange-100">
                <label class="flex items-center gap-2">
                  <input type="checkbox" class="accent-orange-600" />
                  Remember me!
                </label>
                <router-link to="/seller/auth/forgot" class="underline">Forget password?</router-link>
              </div>

              <button type="submit" class="w-full bg-white text-orange-600 font-semibold py-2.5 rounded">Log In</button>

              <button type="button" class="w-full mt-2 bg-orange-600/20 text-white border border-white/30 py-2.5 rounded flex items-center justify-center gap-3">
                <i class="pi pi-google text-white"></i>
                Sign up with Google
              </button>

              <p class="text-center text-orange-100 text-xs mt-3">If You don't have account, <router-link to="/seller/auth/register" class="underline">Please Sign Up</router-link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import supabase from "@/lib/supabase";
import { useRouter } from "vue-router";
import Divider from "@/components/ui/Divider.vue";
import "primeicons/primeicons.css";
import logo from '../../../assets/logo/E-Market.png'

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

  // Debugging
  console.log("Logged in as:", role);

  if (role === "buyer") router.push("/buyer/dashboard");
  else if (role === "seller") router.push("/seller/dashboard");
  else if (role === "admin") router.push("/admin/dashboard");
  else alert("Unknown role. Contact admin.");
};

// expose logo to template
const logoRef = logo;
</script>
