import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router): void {
  router.beforeEach((_to, _from, next) => {
    next()
  })
}