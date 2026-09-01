import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory('/devkitadmin/'),
  routes,
})

export default router