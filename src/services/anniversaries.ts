import type { Anniversary, PaginationParams } from '@/types'
import ApiService from './api'

// Helper function to convert Firebase timestamp to Date
const convertFirebaseTimestamp = (timestamp: any): Date => {
  if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
    return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000)
  }
  return new Date(timestamp)
}

// Helper function to normalize anniversary data  
const normalizeAnniversary = (anniversary: any): Anniversary => {
  return {
    ...anniversary,
    createdAt: convertFirebaseTimestamp(anniversary.createdAt),
    updatedAt: convertFirebaseTimestamp(anniversary.updatedAt),
    date: typeof anniversary.date === 'string' ? anniversary.date : new Date(anniversary.date).toISOString().split('T')[0]
  }
}

export interface AnniversariesApiResponse {
  data: Anniversary[]
  meta: {
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface AnniversariesResponse {
  anniversaries: Anniversary[]
  total: number
}

export interface AnniversaryStatsResponse {
  total: number
  byType: Record<string, number>
  upcoming: Anniversary[]
  recurring: number
}

export interface CreateAnniversaryData {
  title: string
  description?: string
  date: string
  type: 'relationship' | 'milestone' | 'birthday' | 'other'
  isRecurring: boolean
  frequency?: 'yearly' | 'monthly'
}

export interface UpdateAnniversaryData {
  title?: string
  description?: string
  date?: string
  type?: 'relationship' | 'milestone' | 'birthday' | 'other'
  isRecurring?: boolean
  frequency?: 'yearly' | 'monthly'
}

export interface AnniversaryFilters extends PaginationParams {
  type?: 'relationship' | 'milestone' | 'birthday' | 'other'
  isRecurring?: boolean
  startDate?: string
  endDate?: string
}

class AnniversariesService {
  private readonly baseUrl = '/anniversaries'

  async getAnniversaries(filters?: AnniversaryFilters): Promise<{ anniversaries: Anniversary[], total: number }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await ApiService.get<AnniversariesApiResponse>(`${this.baseUrl}?${params.toString()}`)
    
    // Transform the response to match expected format
    return {
      anniversaries: (response.data || []).map(normalizeAnniversary),
      total: response.meta?.pagination?.total || 0
    }
  }

  async getAnniversaryById(id: string): Promise<Anniversary> {
    const response = await ApiService.get<any>(`${this.baseUrl}/${id}`)
    return normalizeAnniversary(response)
  }

  async createAnniversary(data: CreateAnniversaryData): Promise<Anniversary> {
    const response = await ApiService.post<any>(this.baseUrl, data)
    return normalizeAnniversary(response)
  }

  async updateAnniversary(id: string, data: UpdateAnniversaryData): Promise<Anniversary> {
    const response = await ApiService.put<any>(`${this.baseUrl}/${id}`, data)
    return normalizeAnniversary(response)
  }

  async deleteAnniversary(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  async getUpcomingAnniversaries(): Promise<Anniversary[]> {
    const response = await ApiService.get<any[]>(`${this.baseUrl}/upcoming`)
    return response.map(normalizeAnniversary)
  }

  async getAnniversariesByType(type: string): Promise<Anniversary[]> {
    const response = await ApiService.get<any[]>(`${this.baseUrl}/type/${type}`)
    return response.map(normalizeAnniversary)
  }

  async getAnniversariesStats(): Promise<AnniversaryStatsResponse> {
    return await ApiService.get<AnniversaryStatsResponse>(`${this.baseUrl}/stats`)
  }
}

export const anniversariesService = new AnniversariesService() 