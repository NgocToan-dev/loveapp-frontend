import { defineStore } from 'pinia'
import { memoriesService } from '@/services/memories'
import type { 
  Memory, 
  CreateMemoryRequest, 
  UpdateMemoryRequest 
} from '@/types'

// Export types for component usage
export type { Memory } from '@/types'

export interface CreateMemoryData {
  title: string
  description: string
  content?: string
  date: string
  images?: string[] // Changed from File[] to string[] (URLs)
  tags?: string[]
  location?: string
  mood?: Memory['mood']
  isPrivate?: boolean
}

export interface UpdateMemoryData extends Partial<CreateMemoryData> {
  id: string
  isFavorite?: boolean
}

export const useMemoriesStore = defineStore('memories', {
  state: () => ({
    memories: [] as Memory[],
    isLoading: false,
    error: null as string | null,
    selectedMemory: null as Memory | null,
    filters: {
      search: '',
      tags: [] as string[],
      mood: null as Memory['mood'] | null,
      dateRange: {
        start: null as string | null,
        end: null as string | null
      },
      showFavoritesOnly: false,
      showPrivateOnly: false,
      sortBy: {
        field: 'date',
        direction: 'desc' as 'asc' | 'desc'
      }
    },
    sortBy: 'date',
    sortDirection: 'desc' as 'asc' | 'desc'
  }),

  getters: {
    filteredMemories: (state) => {
      if (!state.memories || !Array.isArray(state.memories)) {
        return []
      }
      let filtered = [...state.memories]

      // Search filter
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase()
        filtered = filtered.filter(memory =>
          memory.title.toLowerCase().includes(searchTerm) ||
          memory.content.toLowerCase().includes(searchTerm) ||
          memory.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      }

      // Tags filter
      if (state.filters.tags.length > 0) {
        filtered = filtered.filter(memory =>
          state.filters.tags.some(tag => memory.tags?.includes(tag))
        )
      }

      // Date range filter
      if (state.filters.dateRange.start) {
        filtered = filtered.filter(memory => memory.date >= state.filters.dateRange.start!)
      }
      if (state.filters.dateRange.end) {
        filtered = filtered.filter(memory => memory.date <= state.filters.dateRange.end!)
      }

      // Private filter
      if (state.filters.showPrivateOnly) {
        filtered = filtered.filter(memory => memory.isPrivate)
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()

        return state.filters.sortBy.direction === 'desc'
          ? dateB - dateA
          : dateA - dateB
      })

      return filtered
    },

    favoriteMemories: (state) => {
      if (!state.memories || !Array.isArray(state.memories)) {
        return []
      }
      return state.memories.filter(memory => memory.isFavorite === true)
    },

    recentMemories: (state) => {
      if (!state.memories || !Array.isArray(state.memories)) {
        return []
      }
      return state.memories
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    },

    memoriesByYear: (state) => {
      if (!state.memories || !Array.isArray(state.memories)) {
        return {}
      }
      const grouped: Record<string, Memory[]> = {}
      state.memories.forEach(memory => {
        const year = new Date(memory.date).getFullYear().toString()
        if (!grouped[year]) {
          grouped[year] = []
        }
        grouped[year].push(memory)
      })
      return grouped
    },

    allTags: (state) => {
      if (!state.memories || !Array.isArray(state.memories)) {
        return []
      }
      const tagSet = new Set<string>()
      state.memories.forEach(memory => {
        memory.tags?.forEach(tag => tagSet.add(tag))
      })
      return Array.from(tagSet).sort()
    },

    memoriesCount: (state) => {
      return Array.isArray(state.memories) ? state.memories.length : 0
    },

    favoritesCount(): number {
      return Array.isArray(this.favoriteMemories) ? this.favoriteMemories.length : 0
    }
  },

  actions: {
    async fetchMemories() {
      this.isLoading = true
      this.error = null

      try {
        const response = await memoriesService.getMemories()
        // The response is a PaginatedResponse, so we need response.data to get the array
        this.memories = Array.isArray(response.data) ? response.data : []
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tải kỷ niệm'
        console.error('Error fetching memories:', err)
        // Ensure memories is always an array even on error
        this.memories = []
        throw this.error
      } finally {
        this.isLoading = false
      }
    },

    async fetchMemory(id: string) {
      this.isLoading = true
      this.error = null

      try {
        const memory = await memoriesService.getMemory(id)
        this.selectedMemory = memory
        return memory
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Không tìm thấy kỷ niệm'
        console.error('Error fetching memory:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createMemory(data: CreateMemoryData) {
      this.isLoading = true
      this.error = null

      try {
        const createData: CreateMemoryRequest = {
          title: data.title,
          description: data.description,
          content: data.content,
          date: data.date,
          tags: data.tags || [],
          location: data.location,
          mood: data.mood,
          isPrivate: data.isPrivate ?? false,
          images: data.images || [] // Send image URLs
        }
        
        console.log('Store creating memory with data:', createData)
        
        const newMemory = await memoriesService.createMemory(createData)
        if (Array.isArray(this.memories)) {
          this.memories.unshift(newMemory)
        } else {
          this.memories = [newMemory]
        }
        return newMemory
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tạo kỷ niệm'
        console.error('Error creating memory:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateMemory(data: UpdateMemoryData) {
      this.isLoading = true
      this.error = null

      try {
        const updateData: UpdateMemoryRequest = {
          id: data.id,
          title: data.title,
          description: data.description,
          content: data.content,
          date: data.date,
          tags: data.tags,
          location: data.location,
          mood: data.mood,
          isPrivate: data.isPrivate,
          images: data.images // Image URLs
        }

        console.log('Store updating memory with data:', updateData)

        const updatedMemory = await memoriesService.updateMemory(updateData)
        
        if (Array.isArray(this.memories)) {
          const index = this.memories.findIndex(m => m.id === data.id)
          if (index !== -1) {
            this.memories[index] = updatedMemory
          }
        }
        
        if (this.selectedMemory?.id === data.id) {
          this.selectedMemory = updatedMemory
        }
        
        return updatedMemory
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi cập nhật kỷ niệm'
        console.error('Error updating memory:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteMemory(id: string) {
      this.isLoading = true
      this.error = null

      try {
        await memoriesService.deleteMemory(id)
        if (Array.isArray(this.memories)) {
          this.memories = this.memories.filter(m => m.id !== id)
        }
        
        if (this.selectedMemory?.id === id) {
          this.selectedMemory = null
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi xóa kỷ niệm'
        console.error('Error deleting memory:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async searchMemories(query: string, searchFilters?: any) {
      this.isLoading = true
      this.error = null

      try {
        const results = await memoriesService.searchMemories(query, searchFilters)
        return results
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tìm kiếm kỷ niệm'
        console.error('Error searching memories:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async toggleFavorite(id: string) {
      try {
        const memory = this.memories.find(m => m.id === id)
        if (!memory) throw new Error('Memory not found')
        
        // Use the dedicated toggleFavorite API endpoint
        const updatedMemory = await memoriesService.toggleFavorite(id)
        
        // Update in local state
        const index = this.memories.findIndex(m => m.id === id)
        if (index !== -1) {
          this.memories[index] = updatedMemory
        }
        
        // Update selected memory if it's the same
        if (this.selectedMemory?.id === id) {
          this.selectedMemory = updatedMemory
        }
        
        return updatedMemory
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Có lỗi khi thay đổi trạng thái yêu thích'
        console.error('Error toggling favorite:', err)
        throw err
      }
    },

    setSortBy(field: string, direction: 'asc' | 'desc' = 'desc') {
      this.sortBy = field
      this.sortDirection = direction
      // Apply sorting to current memories
      this.applySort()
    },

    setFilters(newFilters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...newFilters }
      // Apply filters immediately
      this.applyFilters()
    },

    async loadMoreMemories(limit = 20) {
      if (this.isLoading) return []
      
      try {
        this.isLoading = true
        const offset = this.memories.length
        const response = await memoriesService.getMemories(limit, offset)
        
        // Handle paginated response
        const newMemories = Array.isArray(response) ? response : response.data || []
        
        // Append new memories
        this.memories.push(...newMemories)
        return newMemories
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // Helper methods
    applySort() {
      this.memories.sort((a, b) => {
        const aValue = a[this.sortBy as keyof Memory] || ''
        const bValue = b[this.sortBy as keyof Memory] || ''
        
        if (this.sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })
    },

    applyFilters() {
      // This would typically re-fetch from server with filters
      // For now, we'll just trigger a re-fetch
      if (this.memories.length > 0) {
        this.fetchMemories()
      }
    },

    // Filter actions
    updateFilters(newFilters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...newFilters }
    },

    clearFilters() {
      this.filters = {
        search: '',
        tags: [],
        mood: null,
        dateRange: {
          start: null,
          end: null
        },
        showFavoritesOnly: false,
        showPrivateOnly: false,
        sortBy: {
          field: 'date',
          direction: 'desc'
        }
      }
    },

    clearError() {
      this.error = null
    },

    clearSelectedMemory() {
      this.selectedMemory = null
    }
  }
})
