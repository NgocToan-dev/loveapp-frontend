import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/theme-showcase',
    name: 'theme-showcase',
    component: () => import('@/components/ThemeShowcase.vue'),
    meta: {
      title: '🎨 Theme Showcase',
      requiresAuth: false
    }
  },
  // Auth routes
  {
    path: '/login',
    name: 'login',
    component: () => import('@views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
      hideForAuth: true // Hide when already authenticated
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@views/auth/RegisterView.vue'),
    meta: {
      title: 'Register',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@views/auth/ForgotPasswordView.vue'),
    meta: {
      title: 'Forgot Password',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  // Protected routes
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@views/dashboard/DashboardView.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true
    }
  },
  {
    path: '/files',
    name: 'files',
    component: () => import('@views/files/FilesView.vue'),
    meta: {
      title: 'Files',
      requiresAuth: true
    }
  },
  {
    path: '/files/:id',
    name: 'file-detail',
    component: () => import('@views/files/FileDetailView.vue'),
    meta: {
      title: 'File Detail',
      requiresAuth: true
    }
  },
  {
    path: '/memories',
    name: 'memories',
    component: () => import('@views/memories/MemoriesView.vue'),
    meta: {
      title: 'Memories',
      requiresAuth: true
    }
  },
  // Commented out - using dialog instead
  // {
  //   path: '/memories/create',
  //   name: 'create-memory',
  //   component: () => import('@views/memories/CreateMemoryView.vue'),
  //   meta: {
  //     title: 'Create Memory',
  //     requiresAuth: true
  //   }
  // },
  {
    path: '/memories/create',
    name: 'create-memory',
    component: () => import('@views/memories/CreateMemoryView.vue'),
    meta: {
      title: 'Create Memory',
      requiresAuth: true
    }
  },
  {
    path: '/memories/:id',
    name: 'memory-detail',
    component: () => import('@views/memories/MemoryDetailView.vue'),
    meta: {
      title: 'Memory Detail',
      requiresAuth: true
    }
  },
  {
    path: '/memories/:id/edit',
    name: 'edit-memory',
    component: () => import('@views/memories/EditMemoryView.vue'),
    meta: {
      title: 'Edit Memory',
      requiresAuth: true
    }
  },
  {
    path: '/reminders/create',
    name: 'create-reminder',
    component: () => import('@/views/reminders/CreateReminderView.vue'),
    meta: {
      title: 'Create Reminder',
      requiresAuth: true
    }
  },
  {
    path: '/reminders',
    name: 'reminders',
    component: () => import('@views/reminders/RemindersView.vue'),
    meta: {
      title: 'Reminders',
      requiresAuth: true
    }
  },
  {
    path: '/reminders/:id',
    name: 'reminder-detail',
    component: () => import('@views/reminders/ReminderDetailView.vue'),
    meta: {
      title: 'Reminder Detail',
      requiresAuth: true
    }
  },
  {
    path: '/reminders/:id/edit',
    name: 'edit-reminder',
    component: () => import('@views/reminders/EditReminderView.vue'),
    meta: {
      title: 'Edit Reminder',
      requiresAuth: true
    }
  },
  {
    path: '/anniversaries/create',
    name: 'create-anniversary',
    component: () => import('@/views/anniversaries/CreateAnniversaryView.vue'),
    meta: {
      title: 'Create Anniversary',
      requiresAuth: true
    }
  },
  {
    path: '/anniversaries',
    name: 'anniversaries',
    component: () => import('@views/anniversaries/AnniversariesView.vue'),
    meta: {
      title: 'Anniversaries',
      requiresAuth: true
    }
  },
  {
    path: '/anniversaries/:id',
    name: 'anniversary-detail',
    component: () => import('@views/anniversaries/AnniversaryDetailView.vue'),
    meta: {
      title: 'Anniversary Detail',
      requiresAuth: true
    }
  },
  {
    path: '/anniversaries/:id/edit',
    name: 'edit-anniversary',
    component: () => import('@views/anniversaries/EditAnniversaryView.vue'),
    meta: {
      title: 'Edit Anniversary',
      requiresAuth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@views/auth/ProfileView.vue'),
    meta: {
      title: 'Profile',
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@views/SettingsView.vue'),
    meta: {
      title: 'Settings',
      requiresAuth: false
    }
  },
  // Catch all route - 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@views/NotFoundView.vue'),
    meta: {
      title: '404 - Page Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_NAME || 'Project Frontend'}`
  }
  
  // Wait for auth initialization if still loading
  if (authStore.isLoading) {
    // Wait for auth to finish initializing
    const maxWait = 3000 // 3 seconds max wait
    const startTime = Date.now()
    
    while (authStore.isLoading && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  // For protected routes, check auth status more carefully
  if (to.meta.requiresAuth) {
    const tokensInfo = authStore.getTokensInfo()
    
    // If we have no tokens at all, redirect to login immediately
    if (!tokensInfo.hasTokens) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // If tokens are expired, try to refresh first
    if (tokensInfo.isExpired) {
      try {
        console.log('Tokens expired, attempting refresh before navigation...')
        const refreshed = await authStore.refreshTokens()
        if (!refreshed) {
          console.log('Token refresh failed, redirecting to login')
          next({
            name: 'login',
            query: { redirect: to.fullPath }
          })
          return
        }
        console.log('Token refresh successful, continuing navigation')
      } catch (error) {
        console.warn('Token refresh failed during navigation:', error)
        next({
          name: 'login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }
    
    // Final auth check after potential refresh
    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (to.meta.hideForAuth && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }
  
  next()
})

export default router
