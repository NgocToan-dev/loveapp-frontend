import type { User } from '@/types'
import ApiService from './api'

interface AuthResponse {
  data: {
    user: User
    token: string
  }
}

interface UserResponse {
  data: {
    user: User
  }
}

export class AuthService {
  // Register new user
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/register', {
        email,
        password,
        displayName
      })
      
      if ((response as AuthResponse).data?.token) {
        localStorage.setItem('authToken', (response as AuthResponse).data.token)
      }
      
      return (response as AuthResponse).data.user
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Registration failed')
    }
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await ApiService.post<AuthResponse>('/auth/login', {
        email,
        password
      })
      
      if ((response as AuthResponse).data?.token) {
        localStorage.setItem('authToken', (response as AuthResponse).data.token)
      }
      
      return (response as AuthResponse).data.user
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Login failed')
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await ApiService.post('/auth/logout')
      localStorage.removeItem('authToken')
    } catch (error: unknown) {
      localStorage.removeItem('authToken')
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Logout failed')
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return null
      
      const response = await ApiService.get<UserResponse>('/auth/me')
      return (response as UserResponse).data.user
    } catch {
      localStorage.removeItem('authToken')
      return null
    }
  }

  // Update user profile
  async updateUserProfile(updates: {
    displayName?: string
    photoURL?: string
  }): Promise<void> {
    try {
      await ApiService.put('/auth/profile', updates)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Profile update failed')
    }
  }

  // Change password
  async changePassword(newPassword: string): Promise<void> {
    try {
      await ApiService.put('/auth/password', { newPassword })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Password change failed')
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      await ApiService.post('/auth/reset-password', { email })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Password reset failed')
    }
  }

  // Resend email verification
  async resendEmailVerification(): Promise<void> {
    try {
      await ApiService.post('/auth/resend-verification')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Email verification failed')
    }
  }

  // Get auth token
  getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken')
  }
}

export default new AuthService()