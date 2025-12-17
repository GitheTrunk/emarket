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
  try {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    const requiredRole = to.meta.role;

    console.log("User:", user, "Required role:", requiredRole);

    // Public routes
    if (!requiredRole) return next();

    if (!user) {
      if (requiredRole === 'buyer') return next("/buyer/auth/login");
      if (requiredRole === 'seller') return next("/seller/auth/login");
      if (requiredRole === 'admin') return next("/admin/login");
      return next("/");
    }

    const role = user.user_metadata?.role;

    // Wrong role
    if (role !== requiredRole) return next("/");

    next();
  } catch (error) {
    console.error("Auth error:", error);
    next();
  }
});

export default router;
