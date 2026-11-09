import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('token')

    if (to.path === '/login') {
      if (token) {
        next('/dashboard')
      } else {
        next()
      }
      return
    }

    if (to.path === '/dashboard') {
      if (!token) {
        next('/login')
      } else {
        next()
      }
      return
    }

    next()
  })
}
