import type { Anniversary, PaginationParams } from '@/types'
import ApiService from './api'

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

    return await ApiService.get<{ anniversaries: Anniversary[], total: number }>(`${this.baseUrl}?${params.toString()}`)
  }

  async getAnniversaryById(id: string): Promise<Anniversary> {
    return await ApiService.get<Anniversary>(`${this.baseUrl}/${id}`)
  }

  async createAnniversary(data: CreateAnniversaryData): Promise<Anniversary> {
    return await ApiService.post<Anniversary>(this.baseUrl, data)
  }

  async updateAnniversary(id: string, data: UpdateAnniversaryData): Promise<Anniversary> {
    return await ApiService.put<Anniversary>(`${this.baseUrl}/${id}`, data)
  }

  async deleteAnniversary(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  async getUpcomingAnniversaries(): Promise<Anniversary[]> {
    return await ApiService.get<Anniversary[]>(`${this.baseUrl}/upcoming`)
  }

  async getAnniversariesByType(type: string): Promise<Anniversary[]> {
    return await ApiService.get<Anniversary[]>(`${this.baseUrl}/type/${type}`)
  }

  async getAnniversariesStats(): Promise<any> {
    return await ApiService.get<any>(`${this.baseUrl}/stats`)
  }
}

export const anniversariesService = new AnniversariesService() 