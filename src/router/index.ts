import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/AuthPage.vue'),
      meta: { guest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/AuthPage.vue'),
      meta: { guest: true }
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('@/pages/BlogPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/blog/:id',
      name: 'blog-detail',
      component: () => import('@/pages/BlogDetailPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/blog/:id/edit',
      name: 'blog-edit',
      component: () => import('@/pages/BlogPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/memories',
      name: 'memories',
      component: () => import('@/pages/MemoriesPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/memories/:id',
      name: 'memory-detail',
      component: () => import('@/pages/MemoryDetailPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reminders',
      name: 'reminders', 
      component: () => import('@/pages/ReminderPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('@/pages/TimelinePage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/combo-test',
      name: 'combo-test',
      component: () => import('@/views/ComboBoxTestView.vue')
    },
    {
      path: '/couple-time-demo',
      name: 'couple-time-demo',
      component: () => import('@/pages/CoupleTimeDemo.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Route guards
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.guest && userStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
