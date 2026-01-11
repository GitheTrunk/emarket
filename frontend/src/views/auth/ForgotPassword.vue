<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">

        <div class="auth-header">
          <h2 class="title">Forgot Password</h2>
          <p class="subtitle">
            Enter your email and we'll send you a link to get back into your account.
          </p>
        </div>

        <form @submit.prevent="sendResetEmail" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                v-model="email"
                type="email"
                placeholder="example@mail.com"
                required
              />
            </div>
          </div>

          <button type="submit" class="btn-submit">
            <i class="fas fa-paper-plane"></i> Send Reset Link
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Remember your password?
            <router-link to="/buyer/auth/login">Back to Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>


const sendResetEmail = async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${window.location.origin}/update-password`,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Password reset email sent! Please check your inbox.");
  router.push("/buyer/auth/login"); // Redirect back to login
};
</script>

<style scoped>


.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Signature Brand Gradient */
  background: linear-gradient(to bottom, #ffffff, #ff7b00, #ff7b00);
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 12px;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 15px;
  color: #ff7b00;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  border: 2px solid #f1f5f9;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  border-color: #ff7b00;
  box-shadow: 0 0 0 4px rgba(255, 123, 0, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #ff7b00;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #e66e00;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 123, 0, 0.3);
}

.auth-footer {
  margin-top: 25px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #ff7b00;
  font-weight: 700;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>