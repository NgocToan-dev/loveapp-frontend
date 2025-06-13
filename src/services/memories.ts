import type { Memory, ApiResponse, PaginationParams } from '@/types'
import { api } from './api'

export interface CreateMemoryData {
  title: string
  description: string
  memoryDate: string
  location?: string
  tags: string[]
  isPrivate: boolean
}

export interface UpdateMemoryData {
  title?: string
  description?: string
  memoryDate?: string
  location?: string
  tags?: string[]
  isPrivate?: boolean
}

export interface MemoryFilters extends PaginationParams {
  tags?: string
  startDate?: string
  endDate?: string
  isPrivate?: boolean
}

export interface ShareMemoryData {
  partnerId: string
  message?: string
}

class MemoriesService {
  private readonly baseUrl = '/memories'

  async getMemories(filters?: MemoryFilters): Promise<ApiResponse<{ memories: Memory[], total: number }>> {
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

  async getMemoryById(id: string): Promise<ApiResponse<Memory>> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async createMemory(data: CreateMemoryData): Promise<ApiResponse<Memory>> {
    const response = await api.post(this.baseUrl, data)
    return response.data
  }

  async updateMemory(id: string, data: UpdateMemoryData): Promise<ApiResponse<Memory>> {
    const response = await api.put(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteMemory(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`${this.baseUrl}/${id}`)
    return response.data
  }

  async shareMemory(id: string, data: ShareMemoryData): Promise<ApiResponse<void>> {
    const response = await api.post(`${this.baseUrl}/${id}/share`, data)
    return response.data
  }

  async toggleFavorite(id: string): Promise<ApiResponse<Memory>> {
    const response = await api.post(`${this.baseUrl}/${id}/favorite`)
    return response.data
  }

  async addFileToMemory(memoryId: string, fileId: string, description?: string): Promise<ApiResponse<void>> {
    const response = await api.post(`${this.baseUrl}/${memoryId}/files`, { 
      fileId, 
      description 
    })
    return response.data
  }

  async getSharedMemories(): Promise<ApiResponse<Memory[]>> {
    const response = await api.get(`${this.baseUrl}/shared`)
    return response.data
  }

  async getMemoryStats(): Promise<ApiResponse<any>> {
    const response = await api.get(`${this.baseUrl}/stats`)
    return response.data
  }
}

export const memoriesService = new MemoriesService() 