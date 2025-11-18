import type { RouteRecordRaw } from "vue-router";
import SellerDashboard from "@/views/seller/SellerDashboard.vue";
import SellerLogin from "@/views/seller/auth/SellerLogin.vue";
import SellerRegister from "@/views/seller/auth/SellerRegister.vue";

const sellerRoutes: RouteRecordRaw[] = [
  {
    path: "/seller/login",
    name: "SellerLogin",
    component: SellerLogin,
  },
  {
    path: "/seller/register",
    name: "SellerRegister",
    component: SellerRegister,
  },
  {
    path: "/seller/dashboard",
    name: "SellerDashboard",
    component: SellerDashboard,
    meta: { role: "seller" },
  },
];

export default sellerRoutes;
