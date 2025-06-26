import api from './api'
import type { User, LoginCredentials, RegisterCredentials, CoupleConnection } from '@/types/index'

export interface AuthResponse {
  user: User
  token: string
  couple?: CoupleConnection
}

export const authService = {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Register new user
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials)
    return response.data
  },

  // Logout user
  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile')
    return response.data
  },

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data)
    return response.data
  },

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
  },

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await api.post('/auth/reset-password', { token, newPassword })
  },

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token })
  },

  // Refresh token
  async refreshToken(): Promise<{ token: string }> {
    const response = await api.post('/auth/refresh')
    return response.data
  }
}
