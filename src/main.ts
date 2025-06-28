import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize stores before router to ensure auth state is ready
import { useUserStore } from './stores/user'
import { useUIStore } from './stores/ui'

const userStore = useUserStore()
const uiStore = useUIStore()

// Initialize authentication state BEFORE router
userStore.initializeAuth()

// Initialize theme
uiStore.initializeTheme()

app.use(router)
app.use(i18n)

// Mount app
app.mount('#app')
