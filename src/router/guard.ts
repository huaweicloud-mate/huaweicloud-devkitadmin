import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router): void {
  router.beforeEach((to, _from, next) => {
    next()
  })
}
