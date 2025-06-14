import type { User, AuthResponse, AuthTokens } from '@/types'
import ApiService from './api'

// Token management
const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRY: 'tokenExpiry',
  AUTH_TOKEN: 'authToken', // Keep for backward compatibility
} as const

export class AuthService {
  // Token management methods
  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, tokens.accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken)

    // Calculate expiry time (current time + expiresIn seconds)
    const expiryTime = new Date(Date.now() + tokens.expiresIn * 1000).getTime()
    localStorage.setItem(TOKEN_KEYS.TOKEN_EXPIRY, expiryTime.toString())

    // Keep backward compatibility
    localStorage.setItem(TOKEN_KEYS.AUTH_TOKEN, tokens.accessToken)
  }

  private clearTokens(): void {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.TOKEN_EXPIRY)
    localStorage.removeItem(TOKEN_KEYS.AUTH_TOKEN)
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
  }

  private isTokenExpired(): boolean {
    const expiry = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY)
    if (!expiry) return true

    return Date.now() > parseInt(expiry)
  }

  // Process user data to handle date conversions and field mapping
  private processUserData(userData: User): User {
    return {
      ...userData,
      emailVerified: userData.isEmailVerified, // Map for backward compatibility
      displayName: userData.displayName || userData.name,
      createdAt:
        typeof userData.createdAt === 'string' ? new Date(userData.createdAt) : userData.createdAt,
      updatedAt:
        typeof userData.updatedAt === 'string' ? new Date(userData.updatedAt) : userData.updatedAt,
      lastLoginAt: userData.lastLoginAt
        ? typeof userData.lastLoginAt === 'string'
          ? new Date(userData.lastLoginAt)
          : userData.lastLoginAt
        : undefined,
    }
  }

  // Refresh access token
  async refreshAccessToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) return false

      const response = await ApiService.post<AuthResponse['data']>('/auth/refresh-token', {
        refreshToken,
      })

      // ApiService already extracts .data, so response is the clean data
      if (response.tokens) {
        this.setTokens(response.tokens)
        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearTokens()
      return false
    }
  }

  // Register new user
  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const response = await ApiService.post<AuthResponse['data']>('/auth/register', {
        email,
        password,
        displayName,
      })

      if (response.tokens) {
        this.setTokens(response.tokens)
      }

      return this.processUserData(response.user)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Registration failed')
    }
  }

  // Login user
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await ApiService.post<AuthResponse['data']>('/auth/login', {
        email,
        password,
      })

      if (response.tokens) {
        this.setTokens(response.tokens)
      }

      return this.processUserData(response.user)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Login failed')
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken()
      if (refreshToken) {
        await ApiService.post('/auth/logout', { refreshToken })
      }
      this.clearTokens()
    } catch (error: unknown) {
      this.clearTokens()
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Logout failed')
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getAccessToken()
      if (!token) return null

      // Check if token is expired and try to refresh
      if (this.isTokenExpired()) {
        const refreshed = await this.refreshAccessToken()
        if (!refreshed) return null
      }

      const response = await ApiService.get<User>('/auth/profile')
      
      return this.processUserData(response)
    } catch (error: any) {
      // Only clear tokens on 401 auth errors, not on network errors
      if (error.code === 'UNAUTHORIZED' || error.response?.status === 401) {
        this.clearTokens()
      }
      // For other errors (network, server), return null but keep tokens
      return null
    }
  }

  // Update user profile
  async updateUserProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
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

  // Get auth token (for backward compatibility)
  getAuthToken(): string | null {
    return this.getAccessToken()
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    if (!token) return false

    // If token is expired, check if we can refresh
    if (this.isTokenExpired()) {
      // Return false for now, the app should call refreshAccessToken()
      return false
    }

    return true
  }

  // Get tokens info
  getTokensInfo(): { hasTokens: boolean; isExpired: boolean; expiresAt: Date | null } {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    const expiry = localStorage.getItem(TOKEN_KEYS.TOKEN_EXPIRY)

    return {
      hasTokens: !!(accessToken && refreshToken),
      isExpired: this.isTokenExpired(),
      expiresAt: expiry ? new Date(parseInt(expiry)) : null,
    }
  }
}

export default new AuthService()
