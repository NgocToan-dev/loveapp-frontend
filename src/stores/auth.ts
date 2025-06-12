import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, AuthState } from '@/types'
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
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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
    } catch (err: any) {
      error.value = err.message
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

  // Setup auth state listener
  function setupAuthListener() {
    return AuthService.onAuthStateChanged((userData) => {
      user.value = userData
    })
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
    setupAuthListener,
  }
})