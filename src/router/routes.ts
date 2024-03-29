import { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { 
    path: '/', 
    name: 'home',
    component: () => import('../views/homeViews.vue')
  },
  { 
    path: '/survey', 
    name: 'survey',
    component: () => import('../views/surveyViews.vue')
  },
  {
    path: '/addPhysics',
    name: 'addPhysics',
    component: () => import('../views/AddPhysicsToObjectViews.vue')
  },
  {
    path: '/followCursor',
    name: 'followCursor',
    component: () => import('../views/FollowTheCursorView.vue')
  }
]