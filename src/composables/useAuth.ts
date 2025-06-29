import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { authService } from '@/services/auth'
import { storage } from '@/utils/helpers'
import type { IUser, LoginCredentials, RegisterCredentials } from '@/types'

export function useAuth() {
  const { t } = useI18n()
  
  // State
  const user = ref<IUser | null>(storage.get<IUser>('user'))
  const token = ref<string | null>(storage.get<string>('auth_token'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userDisplayName = computed(() => {
    if (!user.value) return ''
    return `${user.value.displayName}`.trim()
  })

  // Methods
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      
      // Transform response.user to match User interface
      const userData = {
        ...response.user,
        _id: response.user.id || (response.user as any)._id || response.user.id
      }
      
      user.value = userData
      token.value = response.token
      
      // Store in localStorage
      storage.set('user', userData)
      storage.set('auth_token', response.token)
      
      if (credentials.rememberMe) {
        storage.set('remember_user', true)
      }
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || t('auth.errors.login_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.register(credentials)
      
      // Transform response.user to match User interface
      const userData = {
        ...response.user,
        _id: response.user.id || (response.user as any)._id || response.user.id
      }
      
      user.value = userData
      token.value = response.token
      
      // Store in localStorage
      storage.set('user', userData)
      storage.set('auth_token', response.token)
      
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || t('auth.errors.register_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear state regardless of API call result
      user.value = null
      token.value = null
      
      // Clear localStorage
      storage.remove('user')
      storage.remove('auth_token')
      storage.remove('remember_user')
      
      isLoading.value = false
    }
  }

  const updateProfile = async (data: Partial<IUser>) => {
    if (!user.value) throw new Error('User not authenticated')
    
    isLoading.value = true
    error.value = null
    
    try {
      const updatedUser = await authService.updateProfile(data)
      user.value = updatedUser
      storage.set('user', updatedUser)
      return updatedUser
    } catch (err: any) {
      error.value = err.response?.data?.message || t('auth.errors.update_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await authService.changePassword(currentPassword, newPassword)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('auth.errors.password_change_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const forgotPassword = async (email: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      await authService.forgotPassword(email)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('auth.errors.forgot_password_failed')
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
    } catch (err: any) {
      error.value = err.response?.data?.message || t('auth.errors.reset_password_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const refreshUserProfile = async () => {
    if (!token.value) return
    
    try {
      const updatedUser = await authService.getProfile()
      user.value = updatedUser
      storage.set('user', updatedUser)
    } catch (err) {
      console.error('Failed to refresh user profile:', err)
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state on mount
  const initializeAuth = async () => {
    const savedToken = storage.get<string>('auth_token')
    const savedUser = storage.get<IUser>('user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      
      // Refresh user profile to get latest data
      await refreshUserProfile()
    }
  }

  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    
    // Computed
    isAuthenticated,
    userDisplayName,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshUserProfile,
    clearError,
    initializeAuth
  }
}
