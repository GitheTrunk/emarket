<template>
  <header class="navbar">
    <!-- Logo -->
    <div class="logo">
      <img src="@/assets/logo/img.png" alt="E-Market" />
    </div>

    <!-- Menu -->
    <nav class="menu">
      <a href="#" >Home</a>
      <a href="@/views/AboutUPage.vue">About us</a>
      <a href="#">Blogs</a>
      <a href="#">Contact us</a>
    </nav>

    <div class="search-box">
      <span>
        <input type="text" placeholder="What are you looking for?" />
      </span>
    </div>

    <div class="icons">
      <span>
        <img class="pi pi-heart">
      </span>
      <span>
        <img class="pi pi-shopping-cart">
      </span>
      <span>
        <img class="pi pi-user">
      </span>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 40px;
  background: white;
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 600;
}

/* Logo */
.logo img {
  height: 80px;
  width: 80px;
}

/* Menu */
.menu {
  display: flex;
  gap: 70px;
}

.menu a {
  left: 100px;
  text-decoration: none;
  color: #FF7B00;
  font-size: 18px;
}


.search-box {
  position: relative;
  left: 50px;
}

.search-box input {
  width: 350px;
  padding: 9px 35px 9px 12px;
  border-radius: 6px;
  background: #f2f2f2;
}

/* Icons */
.icons {
  display: flex;
  gap: 15px;
  font-size: 22px;
  cursor: pointer;
  color: #FF7B00;
  ;
}


</style>


<script setup lang="ts">
</script>
