import type { RouteRecordRaw } from "vue-router";
import SellerLayout from "@/layouts/SellerLayout.vue";


const sellerRoutes: RouteRecordRaw[] = [
  {
    path: "/seller",
    component: SellerLayout,
    meta: { role: "seller" },
    children: [
      {
        path: "dashboard",
        name: "SellerDashboard",
        component: () => import("@/views/seller/SellerDashboard.vue"),
      },
    ],
  },
];

export default sellerRoutes;
