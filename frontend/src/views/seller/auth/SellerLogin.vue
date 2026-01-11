<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">

        <div class="login-header">
          <h2 class="title">Login</h2>
          <p class="subtitle">Manage your shop and track your sales</p>
        </div>

        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label>Business Email</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your business email"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                v-model="password"
                type="password"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div class="forgot-link">
            <router-link to="/forgot-password">Forgot Password?</router-link>
          </div>

          <button type="submit" class="btn-submit">
            Log In
          </button>

          <div class="divider">
            <span>or continue with</span>
          </div>

          <button type="button" class="btn-google">
            <i class="fab fa-google"></i>
            Continue with Google
          </button>
        </form>

        <div class="login-footer">
          <p>
            Don't have an account yet?
            <router-link to="/seller/auth/register">Register</router-link>
          </p>
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

  const user = data.user;
  const role = user.user_metadata.role;

  console.log("Logged in as:", role);

  // Redirection Logic
  if (role === "buyer") router.push("/buyer/dashboard");
  else if (role === "seller") router.push("/seller/dashboard");
  else if (role === "admin") router.push("/admin/dashboard");
  else alert("Unknown role. Contact admin.");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #ffffff, #ff7b00, #ff7b00);
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #2c3e50;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
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

.forgot-link {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-link a {
  font-size: 0.85rem;
  color: #64748b;
  text-decoration: none;
}

.forgot-link a:hover {
  color: #ff7b00;
  text-decoration: underline;
}

.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: #e2e8f0;
  z-index: 1;
}

.divider span {
  position: relative;
  z-index: 2;
  background: white;
  padding: 0 15px;
  color: #94a3b8;
  font-size: 0.85rem;
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

.btn-google {
  width: 100%;
  padding: 12px;
  background: white;
  color: #2c3e50;
  border: 2px solid #f1f5f9;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.btn-google i {
  color: #4285F4;
}

.btn-google:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.login-footer {
  margin-top: 25px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.login-footer a {
  color: #ff7b00;
  font-weight: 700;
  text-decoration: none;
}

.login-footer a:hover {
  text-decoration: underline;
}

.my-6 {
  margin: 24px 0;
}
</style>