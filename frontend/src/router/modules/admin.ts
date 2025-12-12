import type { RouteRecordRaw } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";

const adminRoutes: RouteRecordRaw[] = [
  {
    path: "/admin/login",
    name: "AdminLogin",
    component: () => import('@/views/admin/auth/AdminLogin.vue'),
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { role: "admin" },
    children: [
      {
        path: "",
        redirect: "dashboard",
      },
      {
        path: "dashboard",
        name: "AdminDashboard",
        component: () => import('@/views/admin/AdminDashboard.vue'),
        meta: { role: "admin" },
      },
      {
        path: "users",
        name: "AdminUsers",
        component: () => import('@/views/admin/Users.vue'),
        meta: { role: "admin" },
      },
      {
        path: "transactions",
        name: "AdminTransactions",
        component: () => import('@/views/admin/Transactions.vue'),
        meta: { role: "admin" },
      },
      {
        path: "reports",
        name: "AdminReports",
        component: () => import('@/views/admin/Reports.vue'),
        meta: { role: "admin" },
      },
    ],
  },
];

export default adminRoutes;
