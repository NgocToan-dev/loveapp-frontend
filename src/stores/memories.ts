import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Memory } from '@/types'
import { memoriesService, type CreateMemoryData, type UpdateMemoryData, type MemoryFilters } from '@/services/memories'

export const useMemoriesStore = defineStore('memories', () => {
  // State
  const memories = ref<Memory[]>([])
  const currentMemory = ref<Memory | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalMemories = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filters = ref<MemoryFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  // Getters
  const favoriteMemories = computed(() => 
    memories.value.filter(memory => memory.isFavorite)
  )

  const privateMemories = computed(() => 
    memories.value.filter(memory => memory.isPrivate)
  )

  const sharedMemories = computed(() => 
    memories.value.filter(memory => memory.isShared)
  )

  const totalPages = computed(() => 
    Math.ceil(totalMemories.value / pageSize.value)
  )

  // Actions
  const fetchMemories = async (customFilters?: Partial<MemoryFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const mergedFilters = { ...filters.value, ...customFilters }
      const response = await memoriesService.getMemories(mergedFilters)
      
      memories.value = response.memories
      totalMemories.value = response.total
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch memories'
      console.error('Error fetching memories:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMemoryById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await memoriesService.getMemoryById(id)
      
      currentMemory.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch memory'
      console.error('Error fetching memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createMemory = async (data: CreateMemoryData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await memoriesService.createMemory(data)
      
      memories.value.unshift(response)
      totalMemories.value += 1
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create memory'
      console.error('Error creating memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateMemory = async (id: string, data: UpdateMemoryData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await memoriesService.updateMemory(id, data)
      
      const index = memories.value.findIndex(memory => memory.id === id)
      if (index !== -1) {
        memories.value[index] = response
      }
      if (currentMemory.value?.id === id) {
        currentMemory.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update memory'
      console.error('Error updating memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteMemory = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await memoriesService.deleteMemory(id)
      
      memories.value = memories.value.filter(memory => memory.id !== id)
      totalMemories.value -= 1
      if (currentMemory.value?.id === id) {
        currentMemory.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete memory'
      console.error('Error deleting memory:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const response = await memoriesService.toggleFavorite(id)
      
      const index = memories.value.findIndex(memory => memory.id === id)
      if (index !== -1) {
        memories.value[index] = response
      }
      if (currentMemory.value?.id === id) {
        currentMemory.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to toggle favorite'
      console.error('Error toggling favorite:', err)
      throw err
    }
  }

  const shareMemory = async (id: string, partnerId: string, message?: string) => {
    try {
      await memoriesService.shareMemory(id, { partnerId, message })
      
      // Update the memory as shared
      const index = memories.value.findIndex(memory => memory.id === id)
      if (index !== -1) {
        memories.value[index] = { ...memories.value[index], isShared: true }
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to share memory'
      console.error('Error sharing memory:', err)
      throw err
    }
  }

  const updateFilters = (newFilters: Partial<MemoryFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentMemory = () => {
    currentMemory.value = null
  }

  return {
    // State
    memories,
    currentMemory,
    isLoading,
    error,
    totalMemories,
    currentPage,
    pageSize,
    filters,
    
    // Getters
    favoriteMemories,
    privateMemories,
    sharedMemories,
    totalPages,
    
    // Actions
    fetchMemories,
    fetchMemoryById,
    createMemory,
    updateMemory,
    deleteMemory,
    toggleFavorite,
    shareMemory,
    updateFilters,
    resetFilters,
    clearError,
    clearCurrentMemory
  }
}) 