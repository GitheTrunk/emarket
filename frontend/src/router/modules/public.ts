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
            {path: 'forgot-password', name: 'ForgotPassword', component: () => import('@/views/auth/ForgotPassword.vue')},
            {path: 'update-password', name: 'UpdatePassword', component: () => import('@/views/auth/UpdatePassword.vue')},
        ]
    },
    
    {path: '/:catchAll(.*)', redirect: "/"},
];


export default routes;