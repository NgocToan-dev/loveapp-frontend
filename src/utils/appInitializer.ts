import { watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCoupleStore } from '@/stores/couple'

/**
 * Initialize couple data when user is authenticated
 * This should be set up once in the app lifecycle
 */
export const initializeAppDataWatcher = () => {
  const userStore = useUserStore()
  const coupleStore = useCoupleStore()

  // Watch for authentication changes
  watch(
    () => userStore.isAuthenticated,
    async (isAuthenticated, wasAuthenticated) => {
      if (isAuthenticated && !wasAuthenticated) {
        // User just logged in - initialize couple data
        console.log('🔄 User authenticated, initializing couple data...')
        try {
          await coupleStore.initializeCoupleData()
          console.log('✅ Couple data initialized successfully')
        } catch (error) {
          console.error('❌ Failed to initialize couple data:', error)
        }
      } else if (!isAuthenticated && wasAuthenticated) {
        // User just logged out - clear couple data
        console.log('🔄 User logged out, clearing couple data...')
        coupleStore.$reset()
      }
    },
    { immediate: true } // Check immediately on setup
  )
}

/**
 * Alternative approach: Initialize couple data only when needed
 * This can be used in components that need couple data
 */
export const ensureCoupleDataInitialized = async () => {
  const userStore = useUserStore()
  const coupleStore = useCoupleStore()

  if (userStore.isAuthenticated && !coupleStore.isInitialized) {
    try {
      await coupleStore.initializeCoupleData()
    } catch (error) {
      console.error('Failed to initialize couple data:', error)
    }
  }
}
