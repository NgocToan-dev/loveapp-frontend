import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { User } from '@/types'
import AuthService from '@/services/auth'
import { tokenRefreshEmitter } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => {
    // Check if user exists and tokens are valid
    if (!user.value) return false
    
    // Check if we have valid tokens
    const tokensInfo = AuthService.getTokensInfo()
    if (!tokensInfo.hasTokens) return false
    
    // If tokens are expired, we're not authenticated
    if (tokensInfo.isExpired) return false
    
    return true
  })
  const isEmailVerified = computed(() => user.value?.isEmailVerified || user.value?.emailVerified || false)

  // Actions
  async function register(email: string, password: string, displayName: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const userData = await AuthService.register(email, password, displayName)
      user.value = userData
      return userData
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function login(email: string, password: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const userData = await AuthService.login(email, password)
      user.value = userData
      return userData
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    error.value = null
    
    try {
      await AuthService.logout()
      user.value = null
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(updates: { displayName?: string; photoURL?: string }) {
    isLoading.value = true
    error.value = null
    
    try {
      await AuthService.updateUserProfile(updates)
      if (user.value) {
        user.value = {
          ...user.value,
          ...updates,
          updatedAt: new Date()
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function changePassword(newPassword: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await AuthService.changePassword(newPassword)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Password change failed'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function resetPassword(email: string) {
    isLoading.value = true
    error.value = null
    
    try {
      await AuthService.resetPassword(email)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function resendEmailVerification() {
    isLoading.value = true
    error.value = null
    
    try {
      await AuthService.resendEmailVerification()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Email verification failed'
      error.value = errorMessage
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function initializeAuth() {
    isLoading.value = true
    
    try {
      const currentUser = await AuthService.getCurrentUser()
      user.value = currentUser
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize auth'
      error.value = errorMessage
      console.error('Failed to initialize auth:', err)
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function setUser(userData: User | null) {
    user.value = userData
  }

  // Refresh tokens
  async function refreshTokens(): Promise<boolean> {
    try {
      const success = await AuthService.refreshAccessToken()
      if (!success && user.value) {
        user.value = null
      }
      return success
    } catch (error) {
      console.error('Token refresh failed:', error)
      user.value = null
      return false
    }
  }

  // Check authentication status
  async function checkAuthStatus() {
    const tokensInfo = AuthService.getTokensInfo()
    
    // If we have tokens but they're expired, try to refresh
    if (tokensInfo.hasTokens && tokensInfo.isExpired) {
      try {
        const refreshed = await refreshTokens()
        if (!refreshed) {
          user.value = null
          return false
        }
      } catch (error) {
        console.warn('Token refresh failed, keeping current auth state:', error)
        // Don't clear user on network errors, only on 401 auth errors
        return AuthService.isAuthenticated()
      }
    }
    
    // If we have valid tokens but no user data, try to initialize
    if (AuthService.isAuthenticated() && !user.value) {
      try {
        await initializeAuth()
      } catch (error) {
        console.warn('Failed to initialize auth, keeping current state:', error)
        // Don't fail completely on network errors
      }
    }
    // If we don't have valid tokens but have user data, clear it
    else if (!AuthService.isAuthenticated() && user.value) {
      user.value = null
    }
    
    return AuthService.isAuthenticated()
  }

  // Get token information
  function getTokensInfo() {
    return AuthService.getTokensInfo()
  }

  // Listen for token refresh events
  function setupTokenRefreshListener() {
    const handleTokenRefresh = async () => {
      console.log('Token refreshed detected, updating auth state...')
      // Re-check auth status after token refresh
      try {
        const currentUser = await AuthService.getCurrentUser()
        if (currentUser) {
          user.value = currentUser
          console.log('Auth state updated after token refresh')
        }
      } catch (error) {
        console.warn('Failed to update user after token refresh:', error)
      }
    }

    tokenRefreshEmitter.on(handleTokenRefresh)
    
    // Return cleanup function
    return () => {
      tokenRefreshEmitter.off(handleTokenRefresh)
    }
  }

  // Initialize token refresh listener
  const cleanupTokenListener = setupTokenRefreshListener()

  return {
    // State
    user,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    isEmailVerified,
    
    // Actions
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    resendEmailVerification,
    initializeAuth,
    clearError,
    setUser,
    checkAuthStatus,
    refreshTokens,
    getTokensInfo,
    setupTokenRefreshListener,
  }
})