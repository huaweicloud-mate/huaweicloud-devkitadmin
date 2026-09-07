import type { RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login/index.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/index.vue'),
  },
]
export default routes
