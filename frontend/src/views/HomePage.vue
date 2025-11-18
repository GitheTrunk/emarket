<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar -->
    <header class="w-full py-4 px-8 flex justify-between items-center bg-white shadow">
      <h1 class="text-2xl font-bold text-blue-600">E-Market</h1>
      <nav class="flex gap-6">
        <div class="relative group">
          <button class="text-gray-700 hover:text-blue-600">Login</button>
          <div class="absolute hidden group-hover:block bg-white shadow rounded py-2 w-40">
            <router-link
              to="/buyer/login"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Buyer Login
            </router-link>

            <router-link
              to="/seller/login"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Seller Login
            </router-link>
          </div>
        </div>
      <router-link
        to="/buyer/register"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Get Started
      </router-link>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="flex flex-col md:flex-row items-center justify-between flex-grow px-8 py-20">
      <div class="max-w-xl">
        <h2 class="text-4xl font-bold leading-tight mb-4">
          Your Modern Marketplace for Buyers & Sellers
        </h2>
        <p class="text-gray-600 mb-6">
          E-Market connects buyers, sellers, admins and accountants into a single seamless platform built for speed and convenience.
        </p>
        <router-link
          to="/register"
          class="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
        >
          Join Now
        </router-link>
      </div>

      <img
        src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
        alt="Marketplace"
        class="w-80 opacity-90 mt-10 md:mt-0"
      />
    </section>

    <!-- Features Section -->
    <section class="py-16 px-8 bg-gray-50">
      <h3 class="text-3xl font-bold text-center mb-10">Why Choose E-Market?</h3>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="p-6 bg-white rounded shadow text-center">
          <h4 class="text-xl font-bold mb-2">Fast & Secure Payments</h4>
          <p class="text-gray-600">Secure checkout with real-time order tracking.</p>
        </div>

        <div class="p-6 bg-white rounded shadow text-center">
          <h4 class="text-xl font-bold mb-2">Seller Dashboard</h4>
          <p class="text-gray-600">Manage your products, inventory and orders effortlessly.</p>
        </div>

        <div class="p-6 bg-white rounded shadow text-center">
          <h4 class="text-xl font-bold mb-2">Admin Power</h4>
          <p class="text-gray-600">Control categories, sellers, promotions and reports.</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white text-center py-4">
      © 2025 E-Market. All rights reserved.
    </footer>
  </div>
</template>

<script setup>

</script>
