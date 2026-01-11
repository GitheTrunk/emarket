<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">

        <div class="register-header">
          <h2 class="title">Create Account</h2>
          <p class="subtitle">Open your shop and start selling today</p>
        </div>

        <form @submit.prevent="registerUser" class="register-form">

          <div class="form-group">
            <label>Business Owner Full Name</label>
            <div class="input-wrapper">
              <i class="fas fa-user-tie"></i>
              <input v-model="fullName" type="text" placeholder="Enter your full name" required />
            </div>
          </div>

          <div class="form-group">
            <label>Business Email</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input v-model="email" type="email" placeholder="shop@example.com" required />
            </div>
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input v-model="password" type="password" placeholder="••••••••" required />
            </div>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <div class="input-wrapper">
              <i class="fas fa-check-double"></i>
              <input v-model="confirmPassword" type="password" placeholder="••••••••" required />
            </div>
          </div>

          <button type="submit" class="btn-submit">
            Create Account
          </button>
        </form>

        <div class="register-footer">
          <p>
            Already have an account?
            <router-link to="/seller/auth/login">Login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import supabase from '@/lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const registerUser = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!")
    return
  }

  // Registers with 'seller' role for database logic
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        fullName: fullName.value,
        role: "seller",
      }
    }
  })

  if (error) {
    alert(error.message)
    return
  }

  alert("Seller account created! Check your email to verify.")
  // Redirects to your specific seller login path
  router.push('/seller/auth/login')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #ffffff, #ff7b00, #ff7b00);
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 450px;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.register-header {
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
  color: #ff7b00; /* Signature Orange */
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
  margin-top: 10px;
}

.btn-submit:hover {
  background: #e66e00;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 123, 0, 0.3);
}

.register-footer {
  margin-top: 25px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.register-footer a {
  color: #ff7b00;
  font-weight: 700;
  text-decoration: none;
}

.register-footer a:hover {
  text-decoration: underline;
}
</style>