import api from './api'
import type { 
  Memory, 
  CreateMemoryRequest, 
  UpdateMemoryRequest, 
  PaginatedResponse,
  FileUploadResponse 
} from '@/types'

export const memoriesService = {
  // Get all memories for the couple
  async getMemories(page = 1, limit = 10): Promise<PaginatedResponse<Memory>> {
    const response = await api.get(`/memories?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get single memory by ID
  async getMemory(id: string): Promise<Memory> {
    const response = await api.get(`/memories/${id}`)
    return response.data
  },

  // Create new memory
  async createMemory(data: CreateMemoryRequest): Promise<Memory> {
    const formData = new FormData()
    
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('date', data.date)
    formData.append('tags', JSON.stringify(data.tags))
    
    if (data.location) {
      formData.append('location', data.location)
    }
    
    if (data.isPrivate !== undefined) {
      formData.append('isPrivate', data.isPrivate.toString())
    }
    
    if (data.image) {
      formData.append('image', data.image)
    }

    const response = await api.post('/memories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Update memory
  async updateMemory(data: UpdateMemoryRequest): Promise<Memory> {
    const { id, ...updateData } = data
    
    const formData = new FormData()
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(value))
        } else if (key === 'image' && value instanceof File) {
          formData.append(key, value)
        } else if (key !== 'image') {
          formData.append(key, value.toString())
        }
      }
    })

    const response = await api.put(`/memories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Delete memory
  async deleteMemory(id: string): Promise<void> {
    await api.delete(`/memories/${id}`)
  },

  // Search memories
  async searchMemories(
    query: string, 
    filters?: {
      dateFrom?: string
      dateTo?: string
      tags?: string[]
      isPrivate?: boolean
    }
  ): Promise<Memory[]> {
    const params = new URLSearchParams()
    params.append('q', query)
    
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom)
    if (filters?.dateTo) params.append('dateTo', filters.dateTo)
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','))
    if (filters?.isPrivate !== undefined) params.append('isPrivate', filters.isPrivate.toString())

    const response = await api.get(`/memories/search?${params.toString()}`)
    return response.data
  },

  // Get memories by tag
  async getMemoriesByTag(tag: string): Promise<Memory[]> {
    const response = await api.get(`/memories/tag/${encodeURIComponent(tag)}`)
    return response.data
  },

  // Get popular tags
  async getPopularTags(): Promise<string[]> {
    const response = await api.get('/memories/tags')
    return response.data
  },

  // Get memories for timeline
  async getTimelineMemories(year?: number, month?: number): Promise<Memory[]> {
    const params = new URLSearchParams()
    if (year) params.append('year', year.toString())
    if (month) params.append('month', month.toString())

    const response = await api.get(`/memories/timeline?${params.toString()}`)
    return response.data
  },

  // Upload image
  async uploadImage(file: File): Promise<FileUploadResponse> {
    const formData = new FormData()
    formData.append('image', file)

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Get memory statistics
  async getStatistics(): Promise<{
    totalMemories: number
    memoriesThisMonth: number
    memoriesThisYear: number
    averagePerMonth: number
    topTags: { tag: string; count: number }[]
  }> {
    const response = await api.get('/memories/statistics')
    return response.data
  }
}
