import type { RouteRecordRaw } from "vue-router";
import BuyerLayout from "@/layouts/BuyerLayout.vue";

const buyerRoutes = [
  {
    path: "/buyer",
    component: BuyerLayout,
    meta: { role: "buyer" },
    children: [
      {
        path: "dashboard",
        name: "BuyerDashboard",
        component: () => import('@/views/buyer/BuyerDashboard.vue'),
      }
    ]
  },
];

export default buyerRoutes;
