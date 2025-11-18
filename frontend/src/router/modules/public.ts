import type { RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ForgotPassword from '@/views/auth/ForgotPassword.vue';
import UpdatePassword from '@/views/auth/UpdatePassword.vue';
import NotFound from '@/shared/NotFound.vue';

const routes: RouteRecordRaw[] = [
    {path: '/', name: 'HomePage', component: HomePage},
    {path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword},
    {path: '/update-password', name: 'UpdatePassword', component: UpdatePassword},

    {path: '/:catchAll(.*)', name: 'NotFound', component: NotFound},
];


export default routes;