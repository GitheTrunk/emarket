import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import supabase from "@/lib/supabase";
 
// Auth pages
import Login from "@/views/auth/Login.vue";
import Register from "@/views/auth/Register.vue";
import ForgotPassword from "@/views/auth/ForgotPassword.vue";
import UpdatePassword from "@/views/auth/UpdatePassword.vue";

// Role modules
import buyerRoutes from "@/router/modules/buyer";
import sellerRoutes from "@/router/modules/seller";
import adminRoutes from "@/router/modules/admin";

const routes: RouteRecordRaw[] = [
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPassword },
  { path: "/update-password", name: "UpdatePassword", component: UpdatePassword },

  ...buyerRoutes,
  ...sellerRoutes,
  ...adminRoutes,

  { path: "/:catchAll(.*)", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Role Guard
router.beforeEach(async (to, _, next) => {
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  // Public routes
  if (!to.meta.role) return next();

  // Not logged in
  if (!user) return next("/login");

  const role = user.user_metadata.role;

  // Wrong role
  if (role !== to.meta.role) return next("/login");

  next();
});

export default router;
