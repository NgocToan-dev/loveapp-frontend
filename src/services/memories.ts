import type { Memory, PaginationParams } from '@/types'
import ApiService from './api'

export interface CreateMemoryData {
  title: string
  description: string
  date: string  // Changed from memoryDate to date
  location?: {   // Changed from string to object
    name: string
    coordinates?: {
      lat: number
      lng: number
    }
  } | string  // Support both for backward compatibility
  category: string  // Added required category field
  tags: string[]
  isPrivate: boolean
}

export interface UpdateMemoryData {
  title?: string
  description?: string
  date?: string  // Changed from memoryDate to date
  location?: {   // Changed from string to object
    name: string
    coordinates?: {
      lat: number
      lng: number
    }
  } | string  // Support both for backward compatibility
  category?: string  // Added category field
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

  async getMemories(filters?: MemoryFilters): Promise<{ memories: Memory[], total: number }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    return await ApiService.get<{ memories: Memory[], total: number }>(`${this.baseUrl}?${params.toString()}`)
  }

  async getMemoryById(id: string): Promise<Memory> {
    return await ApiService.get<Memory>(`${this.baseUrl}/${id}`)
  }

  async createMemory(data: CreateMemoryData): Promise<Memory> {
    // Transform data to match backend expectations
    const transformedData = {
      ...data,
      // Ensure location is an object if it's a string
      location: typeof data.location === 'string'
        ? { name: data.location }
        : data.location
    }
    
    console.log('Creating memory with data:', transformedData)
    
    return await ApiService.post<Memory>(this.baseUrl, transformedData)
  }

  async updateMemory(id: string, data: UpdateMemoryData): Promise<Memory> {
    return await ApiService.put<Memory>(`${this.baseUrl}/${id}`, data)
  }

  async deleteMemory(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  async shareMemory(id: string, data: ShareMemoryData): Promise<void> {
    return await ApiService.post<void>(`${this.baseUrl}/${id}/share`, data)
  }

  async toggleFavorite(id: string): Promise<Memory> {
    return await ApiService.post<Memory>(`${this.baseUrl}/${id}/favorite`)
  }

  async addFileToMemory(memoryId: string, fileId: string, description?: string): Promise<void> {
    return await ApiService.post<void>(`${this.baseUrl}/${memoryId}/files`, {
      fileId,
      description
    })
  }

  async getSharedMemories(): Promise<Memory[]> {
    return await ApiService.get<Memory[]>(`${this.baseUrl}/shared`)
  }

  async getMemoryStats(): Promise<any> {
    return await ApiService.get<any>(`${this.baseUrl}/stats`)
  }
}

export const memoriesService = new MemoriesService() 