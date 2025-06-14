import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse, ApiError } from '@/types'

// Event emitter for token refresh notifications
class TokenRefreshEmitter {
  private listeners: Array<() => void> = []
  
  on(callback: () => void) {
    this.listeners.push(callback)
  }
  
  off(callback: () => void) {
    this.listeners = this.listeners.filter(cb => cb !== callback)
  }
  
  emit() {
    this.listeners.forEach(cb => cb())
  }
}

export const tokenRefreshEmitter = new TokenRefreshEmitter()

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management helper
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken') || localStorage.getItem('authToken')
}

const clearAllTokens = (): void => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('tokenExpiry')
  localStorage.removeItem('authToken')
}

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Handle 401 errors (token expired/invalid) only for authentication-related endpoints
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem('refreshToken')
      const accessToken = getAccessToken()
      
      // Only attempt refresh if we have refresh token and this is not already a refresh request
      if (refreshToken && !originalRequest.url?.includes('/auth/refresh-token')) {
        try {
          console.log('Attempting token refresh...')
          // Try to refresh the token
          const refreshResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/auth/refresh-token`,
            { refreshToken },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          
          console.log('Refresh response:', refreshResponse.data)
          
          if (refreshResponse.data?.data?.tokens) {
            const tokens = refreshResponse.data.data.tokens
            localStorage.setItem('accessToken', tokens.accessToken)
            localStorage.setItem('refreshToken', tokens.refreshToken)
            
            if (tokens.expiresIn) {
              const expiryTime = new Date(Date.now() + tokens.expiresIn * 1000).getTime()
              localStorage.setItem('tokenExpiry', expiryTime.toString())
            }
            localStorage.setItem('authToken', tokens.accessToken) // Backward compatibility
            
            console.log('Token refreshed successfully, retrying original request')
            
            // Notify listeners that token was refreshed
            tokenRefreshEmitter.emit()
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
            return api(originalRequest)
          } else {
            console.warn('Refresh response missing tokens data')
            throw new Error('Invalid refresh response structure')
          }
        } catch (refreshError: any) {
          console.error('Token refresh failed:', refreshError)
          
          // Only clear tokens if refresh explicitly failed due to invalid refresh token
          if (refreshError.response?.status === 401) {
            console.log('Refresh token invalid, clearing all tokens')
            clearAllTokens()
            
            // Only redirect if we're in browser and not already on auth pages
            if (typeof window !== 'undefined' &&
                !window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')) {
              console.log('Redirecting to login due to invalid refresh token')
              window.location.href = '/login'
            }
          } else {
            console.warn('Refresh failed due to network/server error, not clearing tokens')
          }
          
          // Return the original 401 error, not the refresh error
          return Promise.reject(error)
        }
      } else if (!refreshToken) {
        // No refresh token available - clear everything and redirect
        console.log('No refresh token available, clearing auth state')
        clearAllTokens()
        
        if (typeof window !== 'undefined' &&
            !window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/register') &&
            !window.location.pathname.includes('/') && // Allow home page
            !window.location.pathname.includes('/about')) { // Allow about page
          console.log('Redirecting to login - no refresh token')
          window.location.href = '/login'
        }
      }
    }

    const apiError: ApiError = {
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || error.message || 'Đã có lỗi xảy ra',
      details: error.response?.data?.details || null,
    }

    return Promise.reject(apiError)
  }
)

// Generic API methods
export class ApiService {
  static async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<ApiResponse<T>>(url, config)
    return response.data.data as T
  }

  static async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.post<ApiResponse<T>>(url, data, config)
    return response.data.data as T
  }

  static async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.put<ApiResponse<T>>(url, data, config)
    return response.data.data as T
  }

  static async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.patch<ApiResponse<T>>(url, data, config)
    return response.data.data as T
  }

  static async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<ApiResponse<T>>(url, config)
    return response.data.data as T
  }

  // File upload with progress
  static async uploadFile<T = unknown>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data.data as T
  }

  // Download file
  static async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await api.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
}

// Export axios instance for direct use if needed
export { api }
export default ApiService