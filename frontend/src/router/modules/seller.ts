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
      {
        path: "products",
        name: "SellerProducts",
        component: () => import("@/views/seller/SellerProducts.vue"),
      },
      {
        path: "orders",
        name: "SellerOrders",
        component: () => import("@/views/seller/SellerOrders.vue"),
      },
      {
        path: "analytics",
        name: "SellerAnalytics",
        component: () => import("@/views/seller/SellerAnalytics.vue"),
      },
    ],
  },
];

export default sellerRoutes;
