import api from './api'
import type { User, LoginCredentials, RegisterCredentials, CoupleConnection } from '@/types/index'

export interface AuthResponse {
  message: string
  token: string
  user: {
    id: string
    email: string
    displayName: string
    avatarUrl?: string
    createdAt: string
    // Add other fields as needed
  }
  refreshToken?: string
}

export interface BackendAuthResponse {
  success: boolean
  data: {
    user: User
    token: string
    refreshToken?: string
    couple?: CoupleConnection
  }
  message?: string
}

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {

      const response = await api.post('/auth/login', credentials)
      
      // Check if response has the expected format
      if (response.data && response.data.token && response.data.user) {
        return response.data
      } else {
        throw new Error('Invalid response format from server')
      }
    } catch (error: any) {
      console.error('AuthService: Login error:', error)
      
      // Handle different error formats
      let message = 'Login failed'
      if (error.response?.data) {
        message = error.response.data.message || 
                 error.response.data.error?.message || 
                 error.response.data.error || 
                 'Login failed'
      } else if (error.message) {
        message = error.message
      }
      
      throw new Error(message)
    }
  },

  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {

      const response = await api.post('/auth/register', credentials)
      
      // Check if response has the expected format
      if (response.data && response.data.token && response.data.user) {
        return response.data
      } else {
        throw new Error('Invalid response format from server')
      }
    } catch (error: any) {
      
      // Handle different error formats
      let message = 'Registration failed'
      if (error.response?.data) {
        message = error.response.data.message || 
                 error.response.data.error?.message || 
                 error.response.data.error || 
                 'Registration failed'
      } else if (error.message) {
        message = error.message
      }
      
      throw new Error(message)
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error: any) {
      // Don't throw on logout errors, just log them
      console.error('Logout error:', error)
    }
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile')
      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get profile'
      throw new Error(message)
    }
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.put('/auth/profile', data)
      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to update profile'
      throw new Error(message)
    }
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to change password'
      throw new Error(message)
    }
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email })
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to send reset email'
      throw new Error(message)
    }
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword })
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to reset password'
      throw new Error(message)
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/auth/verify-email', { token })
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to verify email'
      throw new Error(message)
    }
  },

  // Refresh token
  async refreshToken(): Promise<{ token: string; refreshToken?: string }> {
    try {
      const response = await api.post('/auth/refresh')
      return response.data.data || response.data
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to refresh token'
      throw new Error(message)
    }
  }
}
