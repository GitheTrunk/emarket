import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import supabase from "@/lib/supabase";
 
// Publuic modules
import publicRoutes from "@/router/modules/public";

// Role modules
import buyerRoutes from "@/router/modules/buyer";
import sellerRoutes from "@/router/modules/seller";
import adminRoutes from "@/router/modules/admin";

const routes: RouteRecordRaw[] = [
  ...publicRoutes,
  ...buyerRoutes,
  ...sellerRoutes,
  ...adminRoutes,

  { path: "/:catchAll(.*)", redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Role Guard
router.beforeEach(async (to, _, next) => {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const requiredRole = to.meta.role;

  // Public routes
  if (!to.meta.role) return next();

  // Not logged in
  if (!user) return next("/login");

  if(!user) {
    if (requiredRole === 'buyer') return next("/buyer/login");
    if (requiredRole === 'seller') return next("/seller/login");
    if (requiredRole === 'admin') return next("/admin/login");
    return next("/login");
  }

  const role = user.user_metadata.role;

  // Wrong role
  if (role !== to.meta.role) return next("/login");

  next();
});

export default router;
