import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@views/AboutView.vue'),
    meta: {
      title: 'About',
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
    path: '/memories',
    name: 'memories',
    component: () => import('@views/memories/MemoriesView.vue'),
    meta: {
      title: 'Memories',
      requiresAuth: true
    }
  },
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
    path: '/notes',
    name: 'notes',
    component: () => import('@views/notes/NotesView.vue'),
    meta: {
      title: 'Notes',
      requiresAuth: true
    }
  },
  {
    path: '/notes/create',
    name: 'create-note',
    component: () => import('@views/notes/CreateNoteView.vue'),
    meta: {
      title: 'Create Note',
      requiresAuth: true
    }
  },
  {
    path: '/notes/:id',
    name: 'note-detail',
    component: () => import('@views/notes/NoteDetailView.vue'),
    meta: {
      title: 'Note Detail',
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
    path: '/anniversaries',
    name: 'anniversaries',
    component: () => import('@views/anniversaries/AnniversariesView.vue'),
    meta: {
      title: 'Anniversaries',
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
