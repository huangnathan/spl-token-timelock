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
            },
            {
                path: '/invest/list',
                name: 'InvestList',
                meta: { keepAlive: true },
                component: () => import('@/views/manager/InvestList.vue')
            },
            {
                path: '/invest/create',
                name: 'CreateInvest',
                meta: { keepAlive: true },
                component: () => import('@/views/manager/CreateInvest.vue')
            }
        ]
    }
]

export const router = new createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes
})