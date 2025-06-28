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
  mood?: 'happy' | 'love' | 'excited' | 'romantic' | 'nostalgic' | 'grateful'
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

    // Mood filter
    if (filters.value.mood) {
      filtered = filtered.filter(memory => memory.mood === filters.value.mood)
    }

    // Date range filter
    if (filters.value.dateRange.start) {
      filtered = filtered.filter(memory => memory.date >= filters.value.dateRange.start!)
    }
    if (filters.value.dateRange.end) {
      filtered = filtered.filter(memory => memory.date <= filters.value.dateRange.end!)
    }

    // Favorites filter
    if (filters.value.showFavoritesOnly) {
      filtered = filtered.filter(memory => memory.isFavorite)
    }

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
    memories.value.filter(memory => memory.isFavorite)
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

  const createMemory = async (data: CreateMemoryData) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await memoriesService.createMemory(data)

      const newMemory: Memory = {
        id: Date.now().toString(),
        title: data.title,
        content: data.content,
        date: data.date,
        images: [], // TODO: Handle image upload
        tags: data.tags || [],
        location: data.location,
        mood: data.mood,
        isPrivate: data.isPrivate || false,
        isFavorite: false,
        createdBy: 'user1', // TODO: Get from auth store
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      memories.value.unshift(newMemory)
      return newMemory
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create memory'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateMemory = async (data: UpdateMemoryData) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await memoriesService.updateMemory(data)

      const index = memories.value.findIndex(m => m.id === data.id)
      if (index === -1) {
        throw new Error('Memory not found')
      }

      const updatedMemory: Memory = {
        ...memories.value[index],
        ...data,
        images: data.images ? [] : memories.value[index].images, // TODO: Handle image upload properly
        updatedAt: new Date().toISOString()
      }

      memories.value[index] = updatedMemory
      
      if (selectedMemory.value?.id === data.id) {
        selectedMemory.value = updatedMemory
      }

      return updatedMemory
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update memory'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteMemory = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // await memoriesService.deleteMemory(id)

      const index = memories.value.findIndex(m => m.id === id)
      if (index === -1) {
        throw new Error('Memory not found')
      }

      memories.value.splice(index, 1)
      
      if (selectedMemory.value?.id === id) {
        selectedMemory.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete memory'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const toggleFavorite = async (id: string) => {
    const memory = memories.value.find(m => m.id === id)
    if (!memory) return

    await updateMemory({
      id,
      isFavorite: !memory.isFavorite
    })
  }

  const setSelectedMemory = (memory: Memory | null) => {
    selectedMemory.value = memory
  }

  const setFilters = (newFilters: Partial<typeof filters.value>) => {
    filters.value = {
      ...filters.value,
      ...newFilters
    }
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
        direction: 'desc' as 'asc' | 'desc'
      }
    }
  }

  const clearError = () => {
    error.value = null
  }

  const setSortBy = (field: string, direction: 'asc' | 'desc') => {
    // This would normally be handled by the filteredMemories computed
    // For now, we can store it in filters or implement sorting logic
    setFilters({ sortBy: { field, direction } })
  }

  const loadMoreMemories = async () => {
    // For pagination - would fetch more memories from API
    // For now, this is a placeholder
    return Promise.resolve()
  }

  return {
    // State
    memories,
    isLoading,
    error,
    selectedMemory,
    filters,

    // Getters
    filteredMemories,
    favoriteMemories,
    memoriesByYear,
    allTags,
    memoriesCount,
    favoritesCount,

    // Actions
    fetchMemories,
    createMemory,
    updateMemory,
    deleteMemory,
    toggleFavorite,
    setSelectedMemory,
    setFilters,
    clearFilters,
    clearError,
    setSortBy,
    loadMoreMemories
  }
})
