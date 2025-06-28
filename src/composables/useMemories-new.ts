import { useI18n } from 'vue-i18n'
import { useNotifications } from './useNotifications'
import { useMemoriesStore } from '@/stores/memories'
import type { CreateMemoryData, UpdateMemoryData } from '@/stores/memories'

export function useMemories() {
  const { t } = useI18n()
  const { showSuccess, showError } = useNotifications()
  const memoriesStore = useMemoriesStore()

  // Re-export store state and getters
  const {
    memories,
    isLoading,
    error,
    selectedMemory,
    filteredMemories,
    recentMemories,
    memoriesCount,
    favoritesCount,
    allTags
  } = memoriesStore

  // Wrapped actions with notifications
  const fetchMemories = async () => {
    try {
      await memoriesStore.fetchMemories()
    } catch (err: any) {
      showError(t('memories.errors.fetch_failed'), err.message)
      throw err
    }
  }

  const fetchMemory = async (id: string) => {
    try {
      return await memoriesStore.fetchMemory(id)
    } catch (err: any) {
      showError(t('memories.errors.fetch_single_failed'), err.message)
      throw err
    }
  }

  const createMemory = async (data: CreateMemoryData) => {
    try {
      const newMemory = await memoriesStore.createMemory(data)
      showSuccess(t('memories.success.created'))
      return newMemory
    } catch (err: any) {
      showError(t('memories.errors.create_failed'), err.message)
      throw err
    }
  }

  const updateMemory = async (data: UpdateMemoryData) => {
    try {
      const updatedMemory = await memoriesStore.updateMemory(data)
      showSuccess(t('memories.success.updated'))
      return updatedMemory
    } catch (err: any) {
      showError(t('memories.errors.update_failed'), err.message)
      throw err
    }
  }

  const deleteMemory = async (id: string) => {
    try {
      await memoriesStore.deleteMemory(id)
      showSuccess(t('memories.success.deleted'))
    } catch (err: any) {
      showError(t('memories.errors.delete_failed'), err.message)
      throw err
    }
  }

  const searchMemories = async (query: string, filters?: any) => {
    try {
      return await memoriesStore.searchMemories(query, filters)
    } catch (err: any) {
      showError(t('memories.errors.search_failed'), err.message)
      throw err
    }
  }

  // Helper functions
  const hasMemories = () => memoriesCount > 0

  const clearError = () => {
    memoriesStore.clearError()
  }

  const clearSelectedMemory = () => {
    memoriesStore.clearSelectedMemory()
  }

  return {
    // State
    memories,
    isLoading,
    error,
    selectedMemory,
    
    // Computed
    filteredMemories,
    recentMemories,
    memoriesCount,
    favoritesCount,
    allTags,
    
    // Actions
    fetchMemories,
    fetchMemory,
    createMemory,
    updateMemory,
    deleteMemory,
    searchMemories,
    
    // Helpers
    hasMemories,
    clearError,
    clearSelectedMemory
  }
}
