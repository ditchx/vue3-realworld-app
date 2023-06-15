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
    }

  ]
})

router.beforeEach((to, from) => {
  const store = useAuthStore()
  const guestPaths = ['login', 'register']
  
  if (store.isLoggedIn && guestPaths.includes(<string>to.name) ) {
    return '/'
  }

})



export default router
