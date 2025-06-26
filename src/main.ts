import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

// Initialize stores after mounting
app.mount('#app')

// Initialize user authentication and UI theme
import { useUserStore } from './stores/user'
import { useUIStore } from './stores/ui'

const userStore = useUserStore()
const uiStore = useUIStore()

// Initialize authentication state
userStore.initializeAuth()

// Initialize theme
uiStore.initializeTheme()
