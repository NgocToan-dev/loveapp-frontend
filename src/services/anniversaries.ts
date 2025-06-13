import type { Anniversary, ApiResponse, PaginationParams } from '@/types'
import { api } from './api'

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

  async getAnniversaries(filters?: AnniversaryFilters): Promise<ApiResponse<{ anniversaries: Anniversary[], total: number }>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await api.get(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  async getAnniversaryById(id: string): Promise<ApiResponse<Anniversary>> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async createAnniversary(data: CreateAnniversaryData): Promise<ApiResponse<Anniversary>> {
    const response = await api.post(this.baseUrl, data)
    return response.data
  }

  async updateAnniversary(id: string, data: UpdateAnniversaryData): Promise<ApiResponse<Anniversary>> {
    const response = await api.put(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteAnniversary(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`${this.baseUrl}/${id}`)
    return response.data
  }

  async getUpcomingAnniversaries(): Promise<ApiResponse<Anniversary[]>> {
    const response = await api.get(`${this.baseUrl}/upcoming`)
    return response.data
  }

  async getAnniversariesByType(type: string): Promise<ApiResponse<Anniversary[]>> {
    const response = await api.get(`${this.baseUrl}/type/${type}`)
    return response.data
  }

  async getAnniversariesStats(): Promise<ApiResponse<any>> {
    const response = await api.get(`${this.baseUrl}/stats`)
    return response.data
  }
}

export const anniversariesService = new AnniversariesService() 