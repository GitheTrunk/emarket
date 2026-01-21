import type { RouteRecordRaw } from 'vue-router';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'HomePage',
                component: () => import('@/views/HomePage.vue'),
            },

            {
                path: 'about',
                name: 'AboutUs',
                component: () => import('@/views/AboutUsPage.vue'),
            },

            {
                path: 'blog',
                name: 'Blog',
                component: () => import('@/views/BlogPage.vue'),
            },

            {
                path: 'Contact-us',
                name: 'Contact-Us',
                component: () => import('@/views/ContactUsPage.vue'),
            },

            {
                path: "/buyer/auth/login",
                name: "BuyerLogin",
                component: () => import('@/views/buyer/auth/BuyerLogin.vue'),
            },
            {
                path: "/buyer/auth/register",
                name: "BuyerRegister",
                component: () => import('@/views/buyer/auth/BuyerRegister.vue'),
            },

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
                path: 'forgot-password',
                name: 'ForgotPassword',
                component: () => import('@/views/auth/ForgotPassword.vue')
            },

            {
                path: 'update-password',
                name: 'UpdatePassword',
                component: () => import('@/views/auth/UpdatePassword.vue')
            },




        ]
    },

    {path: '/:catchAll(.*)', redirect: "/"},
];

export default routes;