import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService, type AuthResponse } from '@/services/auth'
import { storage } from '@/utils/helpers'
import type { User, LoginCredentials, RegisterCredentials } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(storage.get<User>('user'))
  const token = ref<string | null>(storage.get<string>('auth_token'))
  const refreshToken = ref<string | null>(storage.get<string>('refresh_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
  const hasPartner = computed(() => !!user.value?.coupleId)
  
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    if (user.value.displayName) return user.value.displayName
    if (user.value.firstName && user.value.lastName) {
      return `${user.value.firstName} ${user.value.lastName}`.trim()
    }
    return user.value.email // Fallback to email
  })

  const userInitials = computed(() => {
    if (!user.value) return ''
    if (user.value.firstName && user.value.lastName) {
      return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
    }
    if (user.value.displayName) {
      const names = user.value.displayName.split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      }
      return user.value.displayName.substring(0, 2).toUpperCase()
    }
    return user.value.email.substring(0, 2).toUpperCase()
  })

  const relationshipDuration = computed(() => {
    // TODO: Calculate relationship duration from coupleId data
    return 0
  })

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response: AuthResponse = await authService.login(credentials)
      
      // Transform backend user to frontend User format
      const transformedUser: User = {
        _id: response.user.id,
        id: response.user.id,
        email: response.user.email,
        displayName: response.user.displayName,
        avatarUrl: response.user.avatarUrl,
        createdAt: response.user.createdAt,
        username: '', // Default values for optional fields
        firstName: '',
        lastName: '',
        isEmailVerified: false
      }
      
      
      user.value = transformedUser
      token.value = response.token
      
      // Store in localStorage
      storage.set('user', transformedUser)
      storage.set('auth_token', response.token)
      
      if (response.refreshToken) {
        refreshToken.value = response.refreshToken
        storage.set('refresh_token', response.refreshToken)
      }
      
      if (credentials.rememberMe) {
        storage.set('remember_user', true)
      }
      
      return response
    } catch (err: any) {
      console.error('UserStore: Login error:', err)
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Ensure displayName is set if not provided
      const registerData = {
        ...credentials,
        displayName: credentials.displayName || `${credentials.firstName} ${credentials.lastName}`.trim()
      }
      
      const response: AuthResponse = await authService.register(registerData)
      
      // Transform backend user to frontend User format
      const transformedUser: User = {
        _id: response.user.id,
        id: response.user.id,
        email: response.user.email,
        displayName: response.user.displayName,
        avatarUrl: response.user.avatarUrl,
        createdAt: response.user.createdAt,
        username: credentials.username || '',
        firstName: credentials.firstName || '',
        lastName: credentials.lastName || '',
        isEmailVerified: false
      }
      
      user.value = transformedUser
      token.value = response.token
      
      // Store in localStorage
      storage.set('user', transformedUser)
      storage.set('auth_token', response.token)
      
      if (response.refreshToken) {
        refreshToken.value = response.refreshToken
        storage.set('refresh_token', response.refreshToken)
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      if (token.value) {
        await authService.logout()
      }
      
      user.value = null
      token.value = null
      refreshToken.value = null
      error.value = null
      
      // Clear localStorage
      storage.remove('user')
      storage.remove('auth_token')
      storage.remove('refresh_token')
      storage.remove('remember_user')
    } catch (err: any) {
      error.value = err.message || 'Logout failed'
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) throw new Error('User not authenticated')
    
    isLoading.value = true
    error.value = null
    
    try {
      const updatedUser = await authService.updateProfile(updates)
      user.value = updatedUser
      storage.set('user', updatedUser)
      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Update failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const connectPartner = async (partnerEmail: string) => {
    if (!user.value) throw new Error('User not authenticated')
    
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Implement partner connection API
      // For now, update coupleId locally
      const updatedUser = {
        ...user.value,
        coupleId: 'temp-couple-id', // This should come from API
        updatedAt: new Date().toISOString()
      }
      
      user.value = updatedUser
      storage.set('user', updatedUser)
      return updatedUser
    } catch (err: any) {
      error.value = err.message || 'Connection failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = () => {
    const storedUser = storage.get<User>('user')
    const storedToken = storage.get<string>('auth_token')
    
    
    if (storedUser && storedToken) {
      user.value = storedUser
      token.value = storedToken
      
      const storedRefreshToken = storage.get<string>('refresh_token')
      if (storedRefreshToken) {
        refreshToken.value = storedRefreshToken
      }

    } else {
      console.log('UserStore: No stored auth data found')
    }
  }

  const clearError = () => {
    error.value = null
  }

  const forgotPassword = async (email: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await authService.forgotPassword(email)
      return { success: true, message: 'Password reset email sent' }
    } catch (err: any) {
      error.value = err.message || 'Password reset failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await authService.resetPassword(token, newPassword)
      return { success: true, message: 'Password reset successfully' }
    } catch (err: any) {
      error.value = err.message || 'Password reset failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loginMockUser = () => {
    // Only for development environment
    if (import.meta.env.DEV) {
      const mockUser: User = {
        _id: 'mock-user-1',
        id: 'mock-user-1', 
        email: 'demo@loveapp.com',
        displayName: 'Demo User',
        firstName: 'Demo',
        lastName: 'User',
        username: 'demouser',
        avatarUrl: 'https://via.placeholder.com/150/ff6b6b/ffffff?text=DU',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        coupleId: undefined
      }
      
      const mockToken = 'mock-jwt-token-for-development'
      
      user.value = mockUser
      token.value = mockToken
      
      // Store in localStorage
      storage.set('user', mockUser)
      storage.set('auth_token', mockToken)
      
      console.log('🔧 Mock user logged in for development')
    }
  }

  return {
    // State
    user,
    token,
    refreshToken,
    isLoading,
    error,
    
    // Getters
    isAuthenticated,
    hasPartner,
    userDisplayName,
    userInitials,
    relationshipDuration,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    connectPartner,
    initializeAuth,
    clearError,
    forgotPassword,
    resetPassword,
    loginMockUser
  }
})
