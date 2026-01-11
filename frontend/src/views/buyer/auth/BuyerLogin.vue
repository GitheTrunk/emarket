<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">

        <div class="login-header">
          <h2 class="title">Login</h2>
          <p class="subtitle">Fill in the required information.</p>
        </div>

        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <label>Username or Email</label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input
                v-model="username"
                type="text"
                placeholder="Enter your username or email"
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

          <div class="options">
            <label class="remember-me">
              <input type="checkbox" v-model="remember" />
              <span>Remember me</span>
            </label>
            <router-link to="/forgot-password" class="forgot">Forgot password?</router-link>
          </div>

          <button type="submit" class="btn-submit" @click="navigateToRegister('buyer-dashboard')">
            Log In
          </button>


          <div class="divider">
            <span>or continue with</span>
          </div>

          <button type="button" class="btn-google" >
            <i class="fab fa-google"></i>
            Continue with Google
          </button>


        </form>

        <div class="login-footer">
          <p>
            Don't have an account?
            <router-link to="/buyer/auth/register">Sign Up</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupplierLogin",
  data() {
    return {
      username: "",
      password: "",
      remember: false,
    };
  },
  methods: {

    navigateToRegister(type) {
      switch (type) {

        case 'buyer-dashboard':
          this.$router.push('/buyer/dashboard');
          break;

        default:
          console.warn("Navigation type not recognized:", type);
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Matching Home Page Hero Gradient */
  background: linear-gradient(to bottom, #ffffff, #ff7b00, #ff7b00);
  font-family: 'Inter', sans-serif;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
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
  line-height: 1.4;
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
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.input-wrapper input:focus {
  border-color: #ff7b00;
  box-shadow: 0 0 0 4px rgba(255, 123, 0, 0.1);
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  cursor: pointer;
}

.forgot {
  color: #ff7b00;
  text-decoration: none;
  font-weight: 600;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #ff7b00;
  color: white;
  border: none;
  border-radius: 10px;
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

.btn-google {
  width: 100%;
  padding: 12px;
  background: white;
  color: #2c3e50;
  border: 2px solid #f1f5f9;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.btn-google img {
  width: 20px;
}

.btn-google:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.login-footer {
  margin-top: 30px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

.login-footer a {
  color: #ff7b00;
  font-weight: 700;
  text-decoration: none;
}
</style>