<template>
  <header class="w-full py-4 px-8 flex justify-between items-center bg-white shadow">
    <h1 class="text-2xl font-bold text-blue-600">E-Market</h1>

    <nav class="flex gap-6 items-center">
      
      <router-link to="/" class="hover:text-blue-600">Home</router-link>

      <div class="relative group">
        <button class="text-gray-700 hover:text-blue-600">
          Login
        </button>

        <div class="absolute hidden group-hover:block bg-white shadow rounded py-2 w-40">
          <router-link to="/buyer/auth/login" class="block px-4 py-2 hover:bg-gray-100">Buyer Login</router-link>
          <router-link to="/seller/auth/login" class="block px-4 py-2 hover:bg-gray-100">Seller Login</router-link>
        </div>
      </div>

      <router-link
        to="/buyer/auth/register"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Get Started
      </router-link>
    </nav>
  </header>
</template>

<script setup></script>
