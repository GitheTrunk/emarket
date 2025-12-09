<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Log in as Supplier</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <input type="text" placeholder="Username or Email" v-model="username" required />
        </div>
        <div class="input-group">
          <input type="password" placeholder="Password" v-model="password" required />
        </div>
        <div class="options">
          <label>
            <input type="checkbox" v-model="remember" /> Remember me!
          </label>
          <a href="#" class="forgot">Forget password?</a>
        </div>
        <button type="submit" class="login-btn">Log In</button>
        <button type="button" class="google-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
          Sign up with Google
        </button>
      </form>
      <p class="signup-text">
        If You don't have account, <a href="#">Please Sign Up</a>
      </p>
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
    login() {
      alert(`Logging in as: ${this.username}`);
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100vh;
  background-color: #fff;
}

.login-box {
  background: #FF7B00;
  color: #fff;
  padding: 40px;
  width: 50%;
  height: 650px;
  border-radius: 50px 0 0 50px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.login-box h2 {
  text-align: center;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  color: #fff;
  font-size: 14px;
}

.input-group input::placeholder {
  color: #fff;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 20px;
}

.options .forgot {
  color: #eee;
  text-decoration: underline;
}

.login-btn, .google-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
}

.login-btn {
  background-color: #fff;
  color: #e58c3a;
}

.google-btn {
  background-color: transparent;
  border: 1px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  gap: 10px;
}

.signup-text {
  text-align: center;
  font-size: 12px;
  margin-top: 10px;
}

.signup-text a {
  color: #fff;
  text-decoration: underline;
}
</style>

