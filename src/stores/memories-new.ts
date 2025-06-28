import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { memoriesService } from '@/services/memories'
import type { 
  Memory, 
  CreateMemoryRequest, 
  UpdateMemoryRequest 
} from '@/types'

export interface CreateMemoryData {
  title: string
  content: string
  date: string
  images?: File[]
  tags?: string[]
  location?: string
  isPrivate?: boolean
}

export interface UpdateMemoryData extends Partial<CreateMemoryData> {
  id: string
  isFavorite?: boolean
}

export const useMemoriesStore = defineStore('memories', () => {
  // State
  const memories = ref<Memory[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedMemory = ref<Memory | null>(null)
  const filters = ref({
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
  })

  // Getters
  const filteredMemories = computed(() => {
    let filtered = [...memories.value]

    // Search filter
    if (filters.value.search) {
      const searchTerm = filters.value.search.toLowerCase()
      filtered = filtered.filter(memory =>
        memory.title.toLowerCase().includes(searchTerm) ||
        memory.content.toLowerCase().includes(searchTerm) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Tags filter
    if (filters.value.tags.length > 0) {
      filtered = filtered.filter(memory =>
        filters.value.tags.some(tag => memory.tags.includes(tag))
      )
    }

    // Mood filter - skip since mood property is optional
    // if (filters.value.mood) {
    //   filtered = filtered.filter(memory => memory.mood === filters.value.mood)
    // }

    // Date range filter
    if (filters.value.dateRange.start) {
      filtered = filtered.filter(memory => memory.date >= filters.value.dateRange.start!)
    }
    if (filters.value.dateRange.end) {
      filtered = filtered.filter(memory => memory.date <= filters.value.dateRange.end!)
    }

    // Favorites filter - skip since isFavorite is optional
    // if (filters.value.showFavoritesOnly) {
    //   filtered = filtered.filter(memory => memory.isFavorite)
    // }

    // Private filter
    if (filters.value.showPrivateOnly) {
      filtered = filtered.filter(memory => memory.isPrivate)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()

      return filters.value.sortBy.direction === 'desc'
        ? dateB - dateA
        : dateA - dateB
    })

    return filtered
  })

  const favoriteMemories = computed(() => 
    memories.value.filter(memory => memory.isFavorite === true)
  )

  const recentMemories = computed(() => 
    memories.value
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  )

  const memoriesByYear = computed(() => {
    const grouped: Record<string, Memory[]> = {}
    memories.value.forEach(memory => {
      const year = new Date(memory.date).getFullYear().toString()
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(memory)
    })
    return grouped
  })

  const allTags = computed(() => {
    const tagSet = new Set<string>()
    memories.value.forEach(memory => {
      memory.tags.forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const memoriesCount = computed(() => memories.value.length)
  const favoritesCount = computed(() => favoriteMemories.value.length)

  // Actions
  const fetchMemories = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await memoriesService.getMemories()
      memories.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải kỷ niệm'
      console.error('Error fetching memories:', err)
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const fetchMemory = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const memory = await memoriesService.getMemory(id)
      selectedMemory.value = memory
      return memory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Không tìm thấy kỷ niệm'
      console.error('Error fetching memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createMemory = async (data: CreateMemoryData) => {
    isLoading.value = true
    error.value = null

    try {
      const createData: CreateMemoryRequest = {
        title: data.title,
        content: data.content,
        date: data.date,
        tags: data.tags || [],
        location: data.location,
        isPrivate: data.isPrivate ?? false,
        image: data.images?.[0] // Take first image if any
      }
      
      const newMemory = await memoriesService.createMemory(createData)
      memories.value.unshift(newMemory)
      return newMemory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tạo kỷ niệm'
      console.error('Error creating memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateMemory = async (data: UpdateMemoryData) => {
    isLoading.value = true
    error.value = null

    try {
      const updateData: UpdateMemoryRequest = {
        id: data.id,
        title: data.title,
        content: data.content,
        date: data.date,
        tags: data.tags,
        location: data.location,
        isPrivate: data.isPrivate,
        image: data.images?.[0]
      }

      const updatedMemory = await memoriesService.updateMemory(updateData)
      
      const index = memories.value.findIndex(m => m.id === data.id)
      if (index !== -1) {
        memories.value[index] = updatedMemory
      }
      
      if (selectedMemory.value?.id === data.id) {
        selectedMemory.value = updatedMemory
      }
      
      return updatedMemory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi cập nhật kỷ niệm'
      console.error('Error updating memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteMemory = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await memoriesService.deleteMemory(id)
      memories.value = memories.value.filter(m => m.id !== id)
      
      if (selectedMemory.value?.id === id) {
        selectedMemory.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi xóa kỷ niệm'
      console.error('Error deleting memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const searchMemories = async (query: string, searchFilters?: any) => {
    isLoading.value = true
    error.value = null

    try {
      const results = await memoriesService.searchMemories(query, searchFilters)
      return results
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tìm kiếm kỷ niệm'
      console.error('Error searching memories:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Filter actions
  const updateFilters = (newFilters: Partial<typeof filters.value>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
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
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedMemory = () => {
    selectedMemory.value = null
  }

  return {
    // State
    memories,
    isLoading,
    error,
    selectedMemory,
    filters,
    
    // Computed
    filteredMemories,
    favoriteMemories,
    recentMemories,
    memoriesByYear,
    allTags,
    memoriesCount,
    favoritesCount,
    
    // Actions
    fetchMemories,
    fetchMemory,
    createMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    updateFilters,
    clearFilters,
    clearError,
    clearSelectedMemory
  }
})
