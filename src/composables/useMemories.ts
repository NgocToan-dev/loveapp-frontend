import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from './useNotifications'
import { memoriesService } from '@/services/memories'
import type { Memory, CreateMemoryRequest, UpdateMemoryRequest } from '@/types'

export function useMemories() {
  const { t } = useI18n()
  const { showSuccess, showError } = useNotifications()
  
  // State
  const memories = ref<Memory[]>([])
  const currentMemory = ref<Memory | null>(null)
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)
  const currentPage = ref(1)
  const popularTags = ref<string[]>([])

  // Computed
  const memoriesCount = computed(() => memories.value.length)
  const hasMemories = computed(() => memories.value.length > 0)
  const recentMemories = computed(() => 
    memories.value
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  )

  // Methods
  const fetchMemories = async (page = 1, limit = 10) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await memoriesService.getMemories(page, limit)
      
      if (page === 1) {
        memories.value = response.data
      } else {
        memories.value.push(...response.data)
      }
      
      totalPages.value = response.pagination.totalPages
      currentPage.value = page
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.fetch_failed')
      showError(t('memories.errors.fetch_failed'), error.value || undefined)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMemory = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      currentMemory.value = await memoriesService.getMemory(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.fetch_single_failed')
      showError(t('memories.errors.fetch_single_failed'), error.value || undefined)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createMemory = async (data: CreateMemoryRequest) => {
    isCreating.value = true
    error.value = null
    
    try {
      const newMemory = await memoriesService.createMemory(data)
      memories.value.unshift(newMemory)
      showSuccess(t('memories.success.created'))
      return newMemory
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.create_failed')
      showError(t('memories.errors.create_failed'), error.value || undefined)
      throw err
    } finally {
      isCreating.value = false
    }
  }

  const updateMemory = async (data: UpdateMemoryRequest) => {
    isUpdating.value = true
    error.value = null
    
    try {
      const updatedMemory = await memoriesService.updateMemory(data)
      
      // Update in memories list
      const index = memories.value.findIndex(m => m.id === data.id)
      if (index !== -1) {
        memories.value[index] = updatedMemory
      }
      
      // Update current memory if it's the same
      if (currentMemory.value?.id === data.id) {
        currentMemory.value = updatedMemory
      }
      
      showSuccess(t('memories.success.updated'))
      return updatedMemory
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.update_failed')
      showError(t('memories.errors.update_failed'), error.value || undefined)
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const deleteMemory = async (id: string) => {
    isDeleting.value = true
    error.value = null
    
    try {
      await memoriesService.deleteMemory(id)
      
      // Remove from memories list
      memories.value = memories.value.filter(m => m.id !== id)
      
      // Clear current memory if it was deleted
      if (currentMemory.value?.id === id) {
        currentMemory.value = null
      }
      
      showSuccess(t('memories.success.deleted'))
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.delete_failed')
      showError(t('memories.errors.delete_failed'), error.value || undefined)
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  const searchMemories = async (
    query: string,
    filters?: {
      dateFrom?: string
      dateTo?: string
      tags?: string[]
      isPrivate?: boolean
    }
  ) => {
    isLoading.value = true
    error.value = null
    
    try {
      const results = await memoriesService.searchMemories(query, filters)
      memories.value = results
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.search_failed')
      showError(t('memories.errors.search_failed'), error.value || undefined)
    } finally {
      isLoading.value = false
    }
  }

  const fetchMemoriesByTag = async (tag: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const results = await memoriesService.getMemoriesByTag(tag)
      memories.value = results
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.fetch_by_tag_failed')
      showError(t('memories.errors.fetch_by_tag_failed'), error.value || undefined)
    } finally {
      isLoading.value = false
    }
  }

  const fetchPopularTags = async () => {
    try {
      popularTags.value = await memoriesService.getPopularTags()
    } catch (err: any) {
      console.error('Failed to fetch popular tags:', err)
    }
  }

  const fetchTimelineMemories = async (year?: number, month?: number) => {
    isLoading.value = true
    error.value = null
    
    try {
      const results = await memoriesService.getTimelineMemories(year, month)
      memories.value = results
    } catch (err: any) {
      error.value = err.response?.data?.message || t('memories.errors.fetch_timeline_failed')
      showError(t('memories.errors.fetch_timeline_failed'), error.value || undefined)
    } finally {
      isLoading.value = false
    }
  }

  const loadMoreMemories = async () => {
    if (currentPage.value < totalPages.value) {
      await fetchMemories(currentPage.value + 1)
    }
  }

  const refreshMemories = async () => {
    currentPage.value = 1
    await fetchMemories(1)
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentMemory = () => {
    currentMemory.value = null
  }

  const getMemoryById = (id: string) => {
    return memories.value.find(m => m.id === id) || null
  }

  const getMemoriesByYear = (year: number) => {
    return memories.value.filter(memory => {
      const memoryYear = new Date(memory.date).getFullYear()
      return memoryYear === year
    })
  }

  const getMemoriesByMonth = (year: number, month: number) => {
    return memories.value.filter(memory => {
      const memoryDate = new Date(memory.date)
      return memoryDate.getFullYear() === year && memoryDate.getMonth() === month
    })
  }

  return {
    // State
    memories: computed(() => memories.value),
    currentMemory: computed(() => currentMemory.value),
    isLoading: computed(() => isLoading.value),
    isCreating: computed(() => isCreating.value),
    isUpdating: computed(() => isUpdating.value),
    isDeleting: computed(() => isDeleting.value),
    error: computed(() => error.value),
    popularTags: computed(() => popularTags.value),
    totalPages: computed(() => totalPages.value),
    currentPage: computed(() => currentPage.value),
    
    // Computed
    memoriesCount,
    hasMemories,
    recentMemories,
    
    // Methods
    fetchMemories,
    fetchMemory,
    createMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    fetchMemoriesByTag,
    fetchPopularTags,
    fetchTimelineMemories,
    loadMoreMemories,
    refreshMemories,
    clearError,
    clearCurrentMemory,
    getMemoryById,
    getMemoriesByYear,
    getMemoriesByMonth
  }
}
