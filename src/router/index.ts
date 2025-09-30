import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { appConfig } from '@/config/env'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: `Inicio - ${appConfig.title}`
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {
        title: `Iniciar Sesión - ${appConfig.title}`,
        requiresGuest: true
      }
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('../views/ReservationsView.vue'),
      meta: {
        title: `Reservas - ${appConfig.title}`
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: `Acerca de - ${appConfig.title}`
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: `Página No Encontrada - ${appConfig.title}`
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Set page title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // Handle guest-only routes (like login)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/reservations')
    return
  }

  // Handle protected routes
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
})

export default router
