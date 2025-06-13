import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import AuthService from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isEmailVerified = computed(() => user.value?.emailVerified || false)

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

  // Check authentication status
  function checkAuthStatus() {
    if (AuthService.isAuthenticated() && !user.value) {
      initializeAuth()
    } else if (!AuthService.isAuthenticated() && user.value) {
      user.value = null
    }
  }

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
  }
})