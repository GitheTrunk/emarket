<template>
  <header class="navbar">
    <div class="logo">
      <img src="@/assets/logo/img.png" alt="E-Market" />
    </div>

    <nav class="menu">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About us</router-link>
      <a href="/blog">Blogs</a>
      <a href="/contact-us">Contact us</a>
    </nav>

    <div class="search-box">
      <input type="text" placeholder="What are you looking for?" />
    </div>

  </header>
</template>

<style scoped>
.navbar {
  /* This makes it sticky */
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensures it stays above other content */

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 40px;
  background: white;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1); /* Optional: adds depth when scrolling */
}

/* Logo */
.logo img {
  height: 80px;
  width: 80px;
  object-fit: contain;
}

/* Menu */
.menu {
  display: flex;
  gap: 50px; /* Reduced from 70px to fit better */
}

.menu a {
  text-decoration: none;
  color: #FF7B00;
  font-size: 18px;
  transition: color 0.3s;
}

.menu a:hover, .router-link-active {
  color: #e66e00;
  text-decoration: underline;
}

.search-box input {
  width: 300px;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: #f2f2f2;
  outline: none;
}

.search-box input:focus {
  border-color: #FF7B00;
}

/* Icons */
.icons {
  display: flex;
  gap: 20px;
  font-size: 22px;
  cursor: pointer;
  color: #FF7B00;
}

.icons i:hover {
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>
<script setup lang="ts">
</script>