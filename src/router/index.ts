import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/AuthView.vue')
    },
    {
      path: '/editor',
      name: 'create_article',
      component: () => import('../views/EditorView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/article/:slug',
      name: 'article',
      component: () => import('../views/ArticleView.vue')
    }
  ]
})

router.beforeEach((to) => {
  const store = useAuthStore()
  const guestPaths = ['login', 'register']
  const authPaths = ['settings', 'create_article']

  if (store.isLoggedIn && guestPaths.includes(<string>to.name)) {
    return '/'
  }

  if (!store.isLoggedIn && authPaths.includes(<string>to.name)) {
    return '/'
  }


})

export default router
