import type { RouteRecordRaw } from "vue-router";
import SellerLayout from "@/layouts/SellerLayout.vue";

const sellerRoutes: RouteRecordRaw[] = [
  {
    path: "/seller/auth/login",
    name: "SellerLogin",
    component: () => import('@/views/seller/auth/SellerLogin.vue') ,
  },
  {
    path: "/seller/auth/register",
    name: "SellerRegister",
    component: () => import('@/views/seller/auth/SellerRegister.vue') ,
  },
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
