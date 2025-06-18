import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Anniversary } from '@/types'
import { anniversariesService, type CreateAnniversaryData, type UpdateAnniversaryData, type AnniversaryFilters } from '@/services/anniversaries'

export const useAnniversariesStore = defineStore('anniversaries', () => {
  // State
  const anniversaries = ref<Anniversary[]>([])
  const currentAnniversary = ref<Anniversary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalAnniversaries = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filters = ref<AnniversaryFilters>({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'asc'
  })

  // Getters
  const upcomingAnniversaries = computed(() => {
    if (!anniversaries.value) return []
    
    const today = new Date()
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    
    return anniversaries.value.filter(anniversary => {
      const anniversaryDate = new Date(anniversary.date)
      return anniversaryDate >= today && anniversaryDate <= nextMonth
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  const recurringAnniversaries = computed(() => {
    if (!anniversaries.value) return []
    return anniversaries.value.filter(anniversary => anniversary.isRecurring)
  })

  const anniversariesByType = computed(() => {
    const grouped: Record<string, Anniversary[]> = {}
    if (!anniversaries.value) return grouped
    
    anniversaries.value.forEach(anniversary => {
      if (!grouped[anniversary.type]) {
        grouped[anniversary.type] = []
      }
      grouped[anniversary.type].push(anniversary)
    })
    return grouped
  })

  const totalPages = computed(() => 
    Math.ceil(totalAnniversaries.value / pageSize.value)
  )

  // Actions
  const fetchAnniversaries = async (customFilters?: Partial<AnniversaryFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const mergedFilters = { ...filters.value, ...customFilters }
      const response = await anniversariesService.getAnniversaries(mergedFilters)
      
      anniversaries.value = response.anniversaries
      totalAnniversaries.value = response.total
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch anniversaries'
      console.error('Error fetching anniversaries:', err)
      
      // Set fallback empty data for various error types
      if (err.code === 'ERR_NETWORK' ||
          err.code === 'ERR_NAME_NOT_RESOLVED' ||
          err.message?.includes('500') ||
          err.message?.includes('Internal Server Error')) {
        anniversaries.value = []
        totalAnniversaries.value = 0
        error.value = 'Server error occurred. Backend may have authentication issues.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchAnniversaryById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await anniversariesService.getAnniversaryById(id)
      
      currentAnniversary.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch anniversary'
      console.error('Error fetching anniversary:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createAnniversary = async (data: CreateAnniversaryData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await anniversariesService.createAnniversary(data)
      
      if (!anniversaries.value) {
        anniversaries.value = []
      }
      anniversaries.value.unshift(response)
      totalAnniversaries.value += 1
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create anniversary'
      console.error('Error creating anniversary:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateAnniversary = async (id: string, data: UpdateAnniversaryData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await anniversariesService.updateAnniversary(id, data)
      
      const index = (anniversaries.value || []).findIndex(anniversary => anniversary.id === id)
      if (index !== -1 && anniversaries.value) {
        anniversaries.value[index] = response
      }
      if (currentAnniversary.value?.id === id) {
        currentAnniversary.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update anniversary'
      console.error('Error updating anniversary:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteAnniversary = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await anniversariesService.deleteAnniversary(id)
      
      anniversaries.value = (anniversaries.value || []).filter(anniversary => anniversary.id !== id)
      totalAnniversaries.value -= 1
      if (currentAnniversary.value?.id === id) {
        currentAnniversary.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete anniversary'
      console.error('Error deleting anniversary:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchUpcomingAnniversaries = async () => {
    try {
      const response = await anniversariesService.getUpcomingAnniversaries()
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch upcoming anniversaries'
      console.error('Error fetching upcoming anniversaries:', err)
      throw err
    }
  }

  const fetchAnniversariesByType = async (type: string) => {
    try {
      const response = await anniversariesService.getAnniversariesByType(type)
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch anniversaries by type'
      console.error('Error fetching anniversaries by type:', err)
      throw err
    }
  }

  const fetchAnniversariesStats = async () => {
    try {
      const response = await anniversariesService.getAnniversariesStats()
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch anniversaries stats'
      console.error('Error fetching anniversaries stats:', err)
      throw err
    }
  }

  const updateFilters = (newFilters: Partial<AnniversaryFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      limit: 10,
      sortBy: 'date',
      sortOrder: 'asc'
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentAnniversary = () => {
    currentAnniversary.value = null
  }

  return {
    // State
    anniversaries,
    currentAnniversary,
    isLoading,
    error,
    totalAnniversaries,
    currentPage,
    pageSize,
    filters,
    
    // Getters
    upcomingAnniversaries,
    recurringAnniversaries,
    anniversariesByType,
    totalPages,
    
    // Actions
    fetchAnniversaries,
    fetchAnniversaryById,
    createAnniversary,
    updateAnniversary,
    deleteAnniversary,
    fetchUpcomingAnniversaries,
    fetchAnniversariesByType,
    fetchAnniversariesStats,
    updateFilters,
    resetFilters,
    clearError,
    clearCurrentAnniversary
  }
})