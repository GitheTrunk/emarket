import type { RouteRecordRaw } from "vue-router";
import AdminDashboard from "@/views/admin/AdminDashboard.vue";

const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: AdminDashboard,
    meta: { role: "admin" },
  },
];

export default adminRoutes;
