import type { RouteRecordRaw } from "vue-router";
import BuyerLayout from "@/layouts/BuyerLayout.vue";

const buyerRoutes: RouteRecordRaw[] = [
  {
    path: "/buyer",
    component: BuyerLayout,
    meta: { role: "buyer" },
    children: [
      {
        path: "dashboard",
        name: "BuyerDashboard",
        component: () => import('@/views/buyer/BuyerDashboard.vue'),
      },
      {
        path: "wishlist",
        name: "BuyerWishlist",
        component: () => import('@/views/buyer/BuyerWishlist.vue'),
      },
      {
        path: "cart",
        name: "BuyerCart",
        component: () => import('@/views/buyer/BuyerCart.vue'),
      }
    ]
  },
];

export default buyerRoutes;
