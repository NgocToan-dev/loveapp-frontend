import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  partnerId?: string
  partnerName?: string
  partnerAvatar?: string
  relationshipStartDate?: string
  isConnected: boolean
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: 'en' | 'vi'
    notifications: {
      email: boolean
      push: boolean
      reminders: boolean
      anniversaries: boolean
    }
  }
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = ref(false)

  // Getters
  const hasPartner = computed(() => !!user.value?.partnerId)
  const relationshipDuration = computed(() => {
    if (!user.value?.relationshipStartDate) return null
    
    const startDate = new Date(user.value.relationshipStartDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return {
      days: diffDays,
      months: Math.floor(diffDays / 30),
      years: Math.floor(diffDays / 365)
    }
  })

  const userInitials = computed(() => {
    if (!user.value?.name) return ''
    return user.value.name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  })

  // Actions
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      // const response = await authService.login(credentials)
      
      // Mock user data for development
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
        avatar: '',
        partnerId: '2',
        partnerName: 'Jane Doe',
        partnerAvatar: '',
        relationshipStartDate: '2023-02-14',
        isConnected: true,
        preferences: {
          theme: 'light',
          language: 'vi',
          notifications: {
            email: true,
            push: true,
            reminders: true,
            anniversaries: true
          }
        },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      }
      
      user.value = mockUser
      isAuthenticated.value = true
      
      // Store in localStorage
      localStorage.setItem('loveapp_user', JSON.stringify(mockUser))
      localStorage.setItem('loveapp_authenticated', 'true')
      
      return mockUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      // const response = await authService.register(data)
      
      // Mock registration
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        isConnected: false,
        preferences: {
          theme: 'light',
          language: 'vi',
          notifications: {
            email: true,
            push: true,
            reminders: true,
            anniversaries: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      user.value = newUser
      isAuthenticated.value = true
      
      // Store in localStorage
      localStorage.setItem('loveapp_user', JSON.stringify(newUser))
      localStorage.setItem('loveapp_authenticated', 'true')
      
      return newUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      // TODO: Replace with actual API call
      // await authService.logout()
      
      user.value = null
      isAuthenticated.value = false
      error.value = null
      
      // Clear localStorage
      localStorage.removeItem('loveapp_user')
      localStorage.removeItem('loveapp_authenticated')
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) return
    
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      // const response = await userService.updateProfile(updates)
      
      user.value = {
        ...user.value,
        ...updates,
        updatedAt: new Date().toISOString()
      }
      
      // Update localStorage
      localStorage.setItem('loveapp_user', JSON.stringify(user.value))
      
      return user.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Update failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const connectPartner = async (partnerEmail: string) => {
    if (!user.value) return
    
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Replace with actual API call
      // const response = await userService.connectPartner(partnerEmail)
      
      // Mock partner connection
      user.value = {
        ...user.value,
        partnerId: '2',
        partnerName: 'Partner Name',
        partnerAvatar: '',
        relationshipStartDate: new Date().toISOString().split('T')[0],
        isConnected: true,
        updatedAt: new Date().toISOString()
      }
      
      // Update localStorage
      localStorage.setItem('loveapp_user', JSON.stringify(user.value))
      
      return user.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Connection failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const initializeAuth = () => {
    const storedUser = localStorage.getItem('loveapp_user')
    const storedAuth = localStorage.getItem('loveapp_authenticated')
    
    if (storedUser && storedAuth === 'true') {
      try {
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      } catch (err) {
        // Clear invalid data
        localStorage.removeItem('loveapp_user')
        localStorage.removeItem('loveapp_authenticated')
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Implement Google OAuth
      const mockUser: User = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        isConnected: false,
        preferences: {
          theme: 'light',
          language: 'vi',
          notifications: {
            email: true,
            push: true,
            reminders: true,
            anniversaries: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      user.value = mockUser
      isAuthenticated.value = true
      
      localStorage.setItem('loveapp_user', JSON.stringify(mockUser))
      localStorage.setItem('loveapp_authenticated', 'true')
      
      return mockUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Google login failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const loginWithFacebook = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Implement Facebook OAuth
      const mockUser: User = {
        id: 'facebook_' + Date.now(),
        email: 'user@facebook.com',
        name: 'Facebook User',
        isConnected: false,
        preferences: {
          theme: 'light',
          language: 'vi',
          notifications: {
            email: true,
            push: true,
            reminders: true,
            anniversaries: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      user.value = mockUser
      isAuthenticated.value = true
      
      localStorage.setItem('loveapp_user', JSON.stringify(mockUser))
      localStorage.setItem('loveapp_authenticated', 'true')
      
      return mockUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Facebook login failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // TODO: Implement password reset
      // await authService.resetPassword(email)
      
      // Mock success
      return { success: true, message: 'Password reset email sent' }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Password reset failed'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    
    // Getters
    hasPartner,
    relationshipDuration,
    userInitials,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    connectPartner,
    initializeAuth,
    clearError,
    loginWithGoogle,
    loginWithFacebook,
    resetPassword
  }
})
