import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import i18n from './plugins/i18n/i18n'
import App from './App.vue'
import router from './router'

// Import global styles
import '@/assets/styles/main.scss'
import 'animate.css'

const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)

// Initialize auth state before mounting
import { useAuthStore } from '@/stores/auth'

async function initializeApp() {
  // Initialize auth store
  const authStore = useAuthStore()
  
  // Check auth status and initialize if needed
  await authStore.checkAuthStatus()
  
  // Mount the app
  app.mount('#app')
}

// Initialize and mount the app
initializeApp().catch((error) => {
  console.error('Failed to initialize app:', error)
  // Mount anyway to show error state
  app.mount('#app')
})
