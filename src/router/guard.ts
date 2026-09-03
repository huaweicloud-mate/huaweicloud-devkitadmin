import type { Router } from 'vue-router'
export function setupRouterGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
      next('/login')
    } else if (to.path === '/login' && token) {
      next('/dashboard')
    } else {
      next()
    }
  })
}
