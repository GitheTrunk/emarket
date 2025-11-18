import type { RouteRecordRaw } from "vue-router";
import BuyerDashboard from "@/views/buyer/BuyerDashboard.vue";
import BuyerLogin from "@/views/buyer/auth/BuyerLogin.vue";
import BuyerRegister from "@/views/buyer/auth/BuyerRegister.vue";

const buyerRoutes: RouteRecordRaw[] = [
  {
    path: "/buyer/login",
    name: "BuyerLogin",
    component: BuyerLogin,
  },
  {
    path: "/buyer/register",
    name: "BuyerRegister",
    component: BuyerRegister,
  },
  {
    path: "/buyer/dashboard",
    name: "BuyerDashboard",
    component: BuyerDashboard,
    meta: { role: "buyer" },
  },
];

export default buyerRoutes;
