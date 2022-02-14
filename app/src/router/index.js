import { createRouter, createWebHistory } from 'vue-router'
import Page from '../views/Page.vue'

const routes = [
    {
        path: '/',
        component: Page,
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                meta: { keepAlive: true },
                component: () => import('@/views/home/index.vue')
            }
        ]
    }
]

export const router = new createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes
})