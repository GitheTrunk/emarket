import "@/assets/fonts.css";



<template>
  <div class="body">
    <section class="hero">
      <div class="hero-content">

        <div class="hero-image">
          <img src="@/assets/images/img.png" alt="Shopping image" />
        </div>


        <div class="hero-text">
          <h1>E-Market</h1>

          <p>
            An E-market place where buyers and sellers are in one convenient place. Discover great
            products, trusted sellers, and seamless shopping experiences. Whether you're here to buy
            or sell, our platform makes every step simple, secure, and fast.
          </p>

          <button class="join-btn">JOIN US TODAY!!
            <router-link to=""></router-link>
          </button>
        </div>
      </div>


      <div class="bottom-text">
        No more scam risks or platform overload—discover, connect, and sell across Cambodia with just
        one trusted marketplace
      </div>
    </section>
  </div>
</template>

<style scoped>

.body{
  height: 3000px;
  width: 100%;
}
.hero {
  width: 100%;
  padding: 60px 80px;
  background: linear-gradient(to bottom, #ffffff, #ff7b00, #ff7b00, #ffffff);
  color: white;
  height: 700px;
  font-family: 'Roboto Condensed', sans-serif;
}


.hero-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 60px;
  margin-bottom: 70px;

}


.hero-image img {
  width: 380px;
  max-width: 100%;
}


.hero-text {
  max-width: 500px;

}

.hero-text h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
}

.hero-text p {
  font-size: 18px;
  line-height: 1.8;
}

.join-btn {
  margin-top: 25px;
  background: white;
  color: #d9790a;
  border: none;
  padding: 14px 28px;
  font-size: 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}


.bottom-text {
  text-align: center;
  font-size: 22px;
  font-weight: 500;
  max-width: 900px;
  margin: 0 auto;
  color: white;

}
</style>


<script setup lang="ts">

</script>