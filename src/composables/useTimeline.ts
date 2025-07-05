import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { timelineService } from '@/services/timelineService'
import type { 
  TimelineItem, 
  TimelineQueryParams, 
  TimelineStats,
  TimelineFilter 
} from '@/types'

export function useTimeline() {
  const { t } = useI18n()
  
  // Simple notification function
  const showError = (message: string) => {
    console.error(message)
    // Toast notification would be implemented here
  }

  // State
  const items = ref<TimelineItem[]>([])
  const stats = ref<TimelineStats | null>(null)
  const isLoading = ref(false)
  const isLoadingMore = ref(false)
  const error = ref<string | null>(null)

  // Query parameters
  const queryParams = reactive<TimelineQueryParams>({
    page: 1,
    limit: 20,
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  })

  // Pagination state
  const pagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  // Filter options with counts
  const filterOptions = computed<TimelineFilter[]>(() => [
    { 
      value: 'all', 
      label: 'timeline.filters.all', 
      icon: '📅',
      count: (stats.value?.stats.totals.memories ?? 0) + (stats.value?.stats.totals.reminders ?? 0) + (stats.value?.stats.totals.blogPosts ?? 0)
    },
    { 
      value: 'memories', 
      label: 'timeline.filters.memories', 
      icon: '📸',
      count: stats.value?.stats.totals.memories ?? 0
    },
    { 
      value: 'reminders', 
      label: 'timeline.filters.reminders', 
      icon: '⏰',
      count: stats.value?.stats.totals.reminders ?? 0
    },
    { 
      value: 'blog', 
      label: 'timeline.filters.blog', 
      icon: '📝',
      count: stats.value?.stats.totals.blogPosts ?? 0
    },
    { 
      value: 'anniversaries', 
      label: 'timeline.filters.anniversaries', 
      icon: '💕',
      count: 0 // Anniversaries sẽ được tính từ couple data
    }
  ])

  // Computed properties
  const hasItems = computed(() => items.value.length > 0)
  const canLoadMore = computed(() => pagination.value.hasNextPage && !isLoadingMore.value)

  // Methods
  const fetchTimeline = async (resetItems = true) => {
    try {
      if (resetItems) {
        isLoading.value = true
        queryParams.page = 1
      } else {
        isLoadingMore.value = true
        queryParams.page = pagination.value.currentPage + 1
      }

      error.value = null

      const response = await timelineService.getTimeline(queryParams)

      if (resetItems) {
        items.value = response.items
      } else {
        items.value.push(...response.items)
      }

      pagination.value = response.pagination

    } catch (err: any) {
      error.value = err.message || t('timeline.errors.fetchFailed')
      if (error.value) {
        showError(error.value)
      }
    } finally {
      isLoading.value = false
      isLoadingMore.value = false
    }
  }

  const fetchTimelineStats = async () => {
    try {
      stats.value = await timelineService.getTimelineStats()
    } catch (err: any) {
      console.error('Failed to fetch timeline stats:', err)
    }
  }

  const setFilter = async (filterType: string) => {
    queryParams.type = filterType as any
    await fetchTimeline(true)
  }

  const setSortOrder = async (sortOrder: 'asc' | 'desc') => {
    queryParams.sortOrder = sortOrder
    await fetchTimeline(true)
  }

  const loadMore = async () => {
    if (canLoadMore.value) {
      await fetchTimeline(false)
    }
  }

  const refresh = async () => {
    await Promise.all([
      fetchTimeline(true),
      fetchTimelineStats()
    ])
  }

  const getTypeIcon = (type: string): string => {
    const icons = {
      memory: '📸',
      reminder: '⏰',
      blog: '📝',
      anniversary: '💕'
    }
    return icons[type as keyof typeof icons] || '✨'
  }

  const getTypeColor = (type: string): string => {
    const colors = {
      memory: 'text-green-600',
      reminder: 'text-orange-600', 
      blog: 'text-blue-600',
      anniversary: 'text-pink-600'
    }
    return colors[type as keyof typeof colors] || 'text-gray-600'
  }

  return {
    // State
    items,
    stats,
    isLoading,
    isLoadingMore,
    error,
    queryParams,
    pagination,
    
    // Computed
    filterOptions,
    hasItems,
    canLoadMore,
    
    // Methods
    fetchTimeline,
    fetchTimelineStats,
    setFilter,
    setSortOrder,
    loadMore,
    refresh,
    getTypeIcon,
    getTypeColor
  }
}
