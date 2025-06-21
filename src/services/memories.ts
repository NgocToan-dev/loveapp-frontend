import type { Memory, PaginationParams } from '@/types'
import ApiService from './api'

export interface MemoriesResponse {
  success: boolean
  message: string
  data: {
    memories: Memory[]
    pagination: PaginationParams
  }
}

export interface MemoryStatsResponse {
  totalMemories: number
  favoriteMemories: number
  sharedMemories: number
  memoriesByCategory: Record<string, number>
  recentMemories: Memory[]
  memoriesThisMonth?: number
  memoriesThisYear?: number
  averageMemoriesPerMonth?: number
  mostUsedTags?: Array<{
    tag: string
    count: number
  }>
  memoryCountByMonth?: Record<string, number>
}

export interface SharedMemoriesResponse {
  success: boolean
  message: string
  data: {
    memories: Memory[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
    filters: {
      categories: string[]
      moods: string[]
      tags: string[]
      dateRange: {
        earliest: string
        latest: string
      }
    }
  }
}

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
  isFavorite?: boolean  // Added isFavorite field
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

  async getMemories(filters?: MemoryFilters): Promise<MemoriesResponse> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await ApiService.get<MemoriesResponse>(`${this.baseUrl}?${params.toString()}`)
    return response
  }

  async getMemoryById(id: string): Promise<Memory> {
    const response = await ApiService.get<{ success: boolean; data: { memory: Memory } }>(`${this.baseUrl}/${id}`)
    return response.data.memory
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
    
    const response = await ApiService.post<{ success: boolean; data: { memory: Memory } }>(this.baseUrl, transformedData)
    return response.data.memory
  }

  async updateMemory(id: string, data: UpdateMemoryData): Promise<Memory> {
    const response = await ApiService.put<{ success: boolean; data: { memory: Memory } }>(`${this.baseUrl}/${id}`, data)
    return response.data.memory
  }

  async deleteMemory(id: string): Promise<void> {
    await ApiService.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`)
  }

  async shareMemory(id: string, data: ShareMemoryData): Promise<void> {
    await ApiService.post<{ success: boolean; message: string }>(`${this.baseUrl}/${id}/share`, data)
  }

  async toggleFavorite(id: string): Promise<Memory> {
    const response = await ApiService.post<{ success: boolean; data: { isFavorite: boolean } }>(`${this.baseUrl}/${id}/favorite`)
    // Note: This endpoint might return different structure, we may need to fetch the memory again
    // For now, we'll assume it returns the updated memory
    return await this.getMemoryById(id)
  }

  async addFileToMemory(memoryId: string, fileId: string, description?: string): Promise<void> {
    await ApiService.post<{ success: boolean; data: any }>(`${this.baseUrl}/${memoryId}/files`, {
      fileId,
      description
    })
  }

  async getSharedMemories(): Promise<Memory[]> {
    const response = await ApiService.get<SharedMemoriesResponse>(`${this.baseUrl}/shared`)
    // Extract memories array from the wrapped response
    return response.data.memories
  }

  async getSharedMemoriesWithDetails(): Promise<SharedMemoriesResponse> {
    const response = await ApiService.get<SharedMemoriesResponse>(`${this.baseUrl}/shared`)
    return response
  }

  async getMemoryStats(): Promise<MemoryStatsResponse> {
    const response = await ApiService.get<{ success: boolean; data: MemoryStatsResponse }>(`${this.baseUrl}/stats`)
    return response.data
  }
}

export const memoriesService = new MemoriesService()