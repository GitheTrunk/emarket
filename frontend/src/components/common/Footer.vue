<template>
  <footer class="footer">

    <div class="footer-container">

      <!-- COLUMN 1: Brand + Subscribe -->
      <div class="footer-col">
        <h2 class="footer-title">E-Market</h2>

        <h3 class="footer-sub">Join us Now.</h3>
        <p class="footer-text">Give us your feedbacks.</p>

        <div class="subscribe-box">
          <input type="text" placeholder="Wrrite Here">
          <span class="send-icon">➤</span>
        </div>
      </div>

      <!-- COLUMN 2: Address -->
      <div class="footer-col">
        <h3 class="footer-sub">Address</h3>
        <ul class="footer-list">
          <li> Russian Federation Blvd, Toul Kork,<br>Phnom Penh </li>
          <li> e-market@gmail.com</li>
          <li> +855-11-601-107</li>
        </ul>

      </div>

      <!-- COLUMN 3: Account -->


      <!-- COLUMN 4: Quick Links -->
      <div class="footer-col">
        <h3 class="footer-sub">Quick Link</h3>

        <ul class="footer-list">
          <li>Privacy Policy</li>
          <li>Terms Of Use</li>
          <li>FAQ</li>
          <li>Contact</li>
        </ul>
      </div>

      <!-- COLUMN 5: Download App -->
      <div class="footer-col">
        <h3 class="footer-sub">SUPPORT US and <br> Download Now.</h3>
        <p class="footer-text-small">HELP SUPPORT US, WE ARE BROKE.</p>

        <div class="qr-section">
          <img src="@/assets/footer/qr-code.png" class="qr" alt="QR">
          <div class="app-buttons">
            <img src="@/assets/footer/google-play.png" class="app-btn" alt="Google Play">
            <img src="@/assets/footer/app-store.png" class="app-btn" alt="App Store">
          </div>
        </div>

        <div class="social">
          <span>
            <img src="@/assets/footer/facebook-icon.png" class="fb-icon" alt="Facebook Icon">
          </span>
          <span>
            <img src="@/assets/footer/twitter-icon.png" class="twit-icon" alt="Twitter Icon">
          </span>
          <span>
            <img src="@/assets/footer/instagram-icon.png" class="ig-icon" alt="Instagram Icon">
          </span>
          <span>
            <img src="@/assets/footer/linkin-icon.png" class="li-icon" alt="LinkedInIcon">
          </span>
        </div>
      </div>

    </div>

    <div class="copyright">
      © Copyright E-market 2025. All right reserved. <br> Bos Kon khmer 100%.
    </div>

  </footer>
</template>

<style scoped>
/* MAIN FOOTER */
.footer {
  background: #0d0d0d;
  color: white;
  padding: 60px 70px 20px;
  font-family: 'Roboto Condensed', sans-serif;
}

/* GRID LAYOUT */
.footer-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
}

/* COLUMN TITLES */
.footer-title {
  font-size: 28px;
  font-weight: 700;
}

.footer-sub {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 12px;
  font-weight: 600;
}

/* TEXT */
.footer-text {
  margin-bottom: 16px;
}
.footer-text-small {
  margin-bottom: 10px;
  font-size: 14px;
  opacity: 0.8;
}

/* SUBSCRIBE BOX */
.subscribe-box {
  border: 1px solid #fff;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  width: 220px;
}

.subscribe-box input {
  background: transparent;
  border: none;
  outline: none;
  color: white;
  width: 100%;
}

.send-icon {
  font-size: 18px;
  cursor: pointer;
  opacity: 0.8;
}

/* LIST STYLE */
.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 10px;
  cursor: pointer;
  opacity: 0.9;
}

.footer-list li:hover {
  opacity: 1;
}

/* QR + APP BUTTONS */
.qr-section {
  display: flex;
  gap: 15px;
  align-items: center;
}

.qr {
  width: 100px;

}

.app-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.app-btn {
  width: 140px;
}

/* SOCIAL ICONS */
.social {
  display: flex;
  gap: 18px;
  margin-top: 20px;
}

.fb-icon{
  width: 20px;
  height: 20px;
}

.twit-icon{
  width: 20px;
  height: 20px;
}

.ig-icon{
  width: 20px;
  height: 20px;
}

.li-icon{
  width: 20px;
  height: 20px;
}

/* COPYRIGHT */
.copyright {
  text-align: center;
  color: #aaa;
  margin-top: 40px;
  font-size: 14px;
  border-top: 1px solid #222;
  padding-top: 20px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .footer-container {
    flex-direction: column;
  }
}
</style>
<script setup lang="ts">
</script>
