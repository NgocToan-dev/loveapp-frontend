import './assets/main.css'
import './assets/tooltip.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'
import tooltipPlugin from './plugins/tooltip'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize stores before router to ensure auth state is ready
import { useUserStore } from './stores/user'
import { useUIStore } from './stores/ui'
import { useCoupleStore } from './stores/couple'
import { initializeAppDataWatcher } from './utils/appInitializer'

const userStore = useUserStore()
const uiStore = useUIStore()
const coupleStore = useCoupleStore()

// Initialize authentication state BEFORE router
userStore.initializeAuth()

// Initialize theme
uiStore.initializeTheme()

// Set up data initialization watcher
initializeAppDataWatcher()

app.use(router)
app.use(i18n)
app.use(tooltipPlugin)

// Mount app
app.mount('#app')
