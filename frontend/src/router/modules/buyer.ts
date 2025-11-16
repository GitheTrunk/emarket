import type { RouteRecordRaw } from "vue-router";
import BuyerDashboard from "@/views/buyer/BuyerDashboard.vue";

const buyerRoutes: RouteRecordRaw[] = [
  {
    path: "/buyer/dashboard",
    name: "BuyerDashboard",
    component: BuyerDashboard,
    meta: { role: "buyer" },
  },
];

export default buyerRoutes;
