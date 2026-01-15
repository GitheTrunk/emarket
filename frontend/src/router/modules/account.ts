import type { RouteRecordRaw } from "vue-router";
import AccountLayout from "@/layouts/AccountLayout.vue";

const accountRoutes: RouteRecordRaw[] = [
    {
        path: "/account",
        component: () => import('@/layouts/AccountLayout.vue'),
        meta: { role: "buyer" },
        children: [
            {
                path: "profile",
                name: "BuyerProfile",
                component: () => import('@/views/buyer/account/AccountProfile.vue'),
            },
            {
                path: "addresses",
                name: "BuyerAddresses",
                component: () => import('@/views/buyer/account/AccountAddresses.vue'), 
            },
            {
                path: "security",
                name: "BuyerSecurity",
                component: () => import('@/views/buyer/account/AccountSecurity.vue'),
            },
            {
                path: "preferences",
                name: "BuyerPreferences",
                component: () => import('@/views/buyer/account/AccountPreferences.vue'),
            }
        ]
    }
]

export default accountRoutes;