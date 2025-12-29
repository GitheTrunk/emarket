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
    const requiredRole = to.meta.role;

    console.log("Navigating to:", to.path, "Required role:", requiredRole);

    // Public routes - no authentication required
    if (!requiredRole) return next();

    // For protected routes, check authentication
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user) {
      // User not authenticated
      if (requiredRole === 'buyer') return next("/buyer/auth/login");
      if (requiredRole === 'seller') return next("/seller/auth/login");
      if (requiredRole === 'admin') return next("/admin/login");
      return next("/");
    }

    const userRole = user.user_metadata?.role;
    
    console.log("User role:", userRole, "Required role:", requiredRole);

    // Check if user has required role
    if (userRole !== requiredRole) {
      console.warn(`Access denied: User role ${userRole} doesn't match required role ${requiredRole}`);
      return next("/");
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    next();
  }
});

export default router;
