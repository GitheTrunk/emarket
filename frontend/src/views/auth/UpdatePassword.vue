<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
      
      <h2 class="text-3xl font-bold text-center mb-6">Reset Your Password</h2>
      <p class="text-gray-600 text-center mb-6">
        Enter your new password below.
      </p>

      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="updatePassword">

        <div class="mb-4">
          <label class="block text-gray-700 mb-1">New Password</label>
          <div class="relative w-full mb-3">
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Password"
              class="w-full p-3 border rounded pr-10"
              :class="{
                'border-red-500': newPassword && passwordStrength === 'weak',
                'border-yellow-500': newPassword && passwordStrength === 'medium',
                'border-green-500': newPassword && passwordStrength === 'strong'
              }"
              required
            />
            <button
              type="button"
              @click="toggleShowNewPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
            <i class="pi" :class="showNewPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
            </button>
          </div>
          <!-- Password Strength Indicator -->
          <div v-if="newPassword" class="mb-2">
            <div class="flex gap-1 mb-1">
              <div class="h-2 flex-1 rounded" :class="{
                'bg-red-500': passwordStrength === 'weak',
                'bg-gray-200': passwordStrength !== 'weak'
              }"></div>
              <div class="h-2 flex-1 rounded" :class="{
                'bg-yellow-500': passwordStrength === 'medium' || passwordStrength === 'strong',
                'bg-gray-200': passwordStrength === 'weak'
              }"></div>
              <div class="h-2 flex-1 rounded" :class="{
                'bg-green-500': passwordStrength === 'strong',
                'bg-gray-200': passwordStrength !== 'strong'
              }"></div>
            </div>
            <p class="text-sm" :class="{
              'text-red-600': passwordStrength === 'weak',
              'text-yellow-600': passwordStrength === 'medium',
              'text-green-600': passwordStrength === 'strong'
            }">
              Password strength: <span class="font-semibold capitalize">{{ passwordStrength }}</span>
            </p>
            <p class="text-xs text-gray-600 mt-1">
              Use at least 8 characters with uppercase, lowercase, numbers, and symbols.
            </p>
          </div>
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-1">Confirm Password</label>
          <div class="relative w-full mb-3">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm Password"
              class="w-full p-3 border rounded pr-10"
              :class="{
                'border-red-500': confirmPassword && !passwordsMatch,
                'border-green-500': confirmPassword && passwordsMatch && newPassword
              }"
              required
            />
            <button
              type="button"
              @click="toggleShowConfirmPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
            <i class="pi" :class="showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'"></i>
            </button>
          </div>
          <!-- Password Match Indicator -->
          <p v-if="confirmPassword" class="text-sm" :class="{
            'text-red-600': !passwordsMatch,
            'text-green-600': passwordsMatch && newPassword
          }">
            <i class="pi" :class="passwordsMatch && newPassword ? 'pi-check-circle' : 'pi-times-circle'"></i>
            {{ passwordsMatch && newPassword ? 'Passwords match' : 'Passwords do not match' }}
          </p>
        </div>

        <button
          type="submit"
          :disabled="loading || !passwordsMatch || passwordStrength === 'weak'"
          class="w-full bg-blue-600 text-white p-3 rounded text-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span v-if="loading" class="mr-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          {{ loading ? 'Updating...' : 'Update Password' }}
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
import { ref, computed } from "vue";
import supabase from "@/lib/supabase";
import { useRouter } from "vue-router";

const router = useRouter();
const newPassword = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const toggleShowNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleShowConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Password strength calculator
const passwordStrength = computed(() => {
  const password = newPassword.value;
  if (!password) return "";
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  
  if (strength <= 2) return "weak";
  if (strength <= 4) return "medium";
  return "strong";
});

// Check if passwords match
const passwordsMatch = computed(() => {
  return newPassword.value === confirmPassword.value;
});

const updatePassword = async () => {
  // Clear previous messages
  errorMessage.value = "";
  successMessage.value = "";

  // Validate passwords match
  if (!passwordsMatch.value) {
    errorMessage.value = "Passwords do not match!";
    return;
  }

  // Validate password strength
  if (passwordStrength.value === "weak") {
    errorMessage.value = "Password is too weak. Please use a stronger password.";
    return;
  }

  loading.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value,
    });

    if (error) {
      errorMessage.value = error.message;
      return;
    }

    successMessage.value = "Password updated successfully!";
    
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
