import { createRouter, createWebHistory } from 'vue-router'
import Index from '../pages/index.vue'
import Saved from '../pages/saved.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/saved',
    name: 'Saved',
    component: Saved
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
