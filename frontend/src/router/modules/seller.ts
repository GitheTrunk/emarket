import type { RouteRecordRaw } from "vue-router";
import SellerDashboard from "@/views/seller/SellerDashboard.vue";

const sellerRoutes: RouteRecordRaw[] = [
  {
    path: "/seller/dashboard",
    name: "SellerDashboard",
    component: SellerDashboard,
    meta: { role: "seller" },
  },
];

export default sellerRoutes;
