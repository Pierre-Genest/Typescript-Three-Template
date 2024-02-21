import { routes } from './routes'
import { createRouter, createWebHashHistory }  from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})