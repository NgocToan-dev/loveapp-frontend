import { ref, computed, onMounted, readonly } from 'vue'
import { timelineEventsService, type CreateTimelineEventData } from '@/services/timelineEvents'
import type { TimelineEvent, TimelineEventFilters, TimelineEventStats } from '@/types'

export function useTimelineEvents() {
  const events = ref<TimelineEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<TimelineEventFilters>({})
  const searchQuery = ref('')
  const currentPage = ref(1)
  const hasMore = ref(false)
  const total = ref(0)

  // Load events with filters
  const loadEvents = async (reset = false) => {
    try {
      loading.value = true
      error.value = null

      const page = reset ? 1 : currentPage.value
      const result = await timelineEventsService.getEvents({
        ...filters.value,
        ...(searchQuery.value && { search: searchQuery.value })
      })

      if (reset) {
        events.value = result.events
        currentPage.value = 1
      } else {
        events.value.push(...result.events)
      }

      hasMore.value = result.hasMore
      total.value = result.total
      
      if (!reset) {
        currentPage.value++
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Đã có lỗi xảy ra'
      console.error('Error loading timeline events:', err)
    } finally {
      loading.value = false
    }
  }

  // Load more events (pagination)
  const loadMoreEvents = async () => {
    if (!hasMore.value || loading.value) return
    await loadEvents(false)
  }

  // Add new event
  const addEvent = async (eventData: CreateTimelineEventData) => {
    try {
      loading.value = true
      const newEvent = await timelineEventsService.createEvent(eventData)
      events.value.unshift(newEvent)
      total.value++
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Không thể tạo sự kiện'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update event
  const updateEvent = async (id: string, eventData: Partial<CreateTimelineEventData>) => {
    try {
      loading.value = true
      const updatedEvent = await timelineEventsService.updateEvent(id, eventData)
      
      const index = events.value.findIndex(event => event.id === id)
      if (index !== -1) {
        events.value[index] = updatedEvent
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Không thể cập nhật sự kiện'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete event
  const deleteEvent = async (id: string) => {
    try {
      loading.value = true
      await timelineEventsService.deleteEvent(id)
      
      events.value = events.value.filter(event => event.id !== id)
      total.value--
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Không thể xóa sự kiện'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Set filters and reload
  const setFilters = async (newFilters: TimelineEventFilters) => {
    filters.value = { ...newFilters }
    await loadEvents(true)
  }

  // Set search query and reload
  const setSearchQuery = async (query: string) => {
    searchQuery.value = query
    await loadEvents(true)
  }

  // Get upcoming anniversaries
  const getUpcomingAnniversaries = async (days = 30): Promise<TimelineEvent[]> => {
    try {
      return await timelineEventsService.getUpcomingAnniversaries(days)
    } catch (err) {
      console.error('Error loading upcoming anniversaries:', err)
      return []
    }
  }

  // Get event statistics
  const getEventStats = async (): Promise<TimelineEventStats | null> => {
    try {
      return await timelineEventsService.getStats()
    } catch (err) {
      console.error('Error loading event stats:', err)
      return null
    }
  }

  // Search events
  const searchEvents = async (query: string, searchFilters?: TimelineEventFilters): Promise<TimelineEvent[]> => {
    try {
      return await timelineEventsService.searchEvents(query, searchFilters)
    } catch (err) {
      console.error('Error searching events:', err)
      return []
    }
  }

  // Computed properties
  const filteredEvents = computed(() => {
    let result = [...events.value]

    // Apply local filters if needed
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return result.sort((a, b) => b.date.getTime() - a.date.getTime())
  })

  const eventStats = computed(() => {
    const memories = events.value.filter(e => e.type === 'memory').length
    const anniversaries = events.value.filter(e => e.type === 'anniversary').length
    const milestones = events.value.filter(e => e.type === 'milestone').length
    const recurring = events.value.filter(e => e.isRecurring).length

    return {
      total: events.value.length,
      memories,
      anniversaries,
      milestones,
      recurring
    }
  })

  // Memory-specific helpers
  const getMemoriesByDate = (date: Date) => {
    return events.value.filter(event => 
      event.date.toDateString() === date.toDateString() &&
      event.type === 'memory'
    )
  }

  const getAnniversariesThisMonth = () => {
    const now = new Date()
    return events.value.filter(event => 
      event.type === 'anniversary' &&
      event.date.getMonth() === now.getMonth()
    )
  }

  // Load events on mount
  onMounted(() => {
    loadEvents(true)
  })

  return {
    // State
    events: filteredEvents,
    allEvents: events,
    loading: readonly(loading),
    error: readonly(error),
    filters: readonly(filters),
    searchQuery: readonly(searchQuery),
    hasMore: readonly(hasMore),
    total: readonly(total),
    eventStats,

    // Actions
    loadEvents,
    loadMoreEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    setFilters,
    setSearchQuery,
    getUpcomingAnniversaries,
    getEventStats,
    searchEvents,

    // Helpers
    getMemoriesByDate,
    getAnniversariesThisMonth
  }
}

// Helper function for local storage (fallback)
export function useTimelineEventsLocal() {
  const STORAGE_KEY = 'timeline_events'
  const events = ref<TimelineEvent[]>([])
  const loading = ref(false)

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        events.value = parsed.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }))
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err)
    }
  }

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events.value))
    } catch (err) {
      console.error('Error saving to localStorage:', err)
    }
  }

  const addEvent = (eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    events.value.unshift(newEvent)
    saveToStorage()
  }

  const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
    const index = events.value.findIndex(event => event.id === id)
    if (index !== -1) {
      events.value[index] = {
        ...events.value[index],
        ...updates,
        updatedAt: new Date()
      }
      saveToStorage()
    }
  }

  const deleteEvent = (id: string) => {
    events.value = events.value.filter(event => event.id !== id)
    saveToStorage()
  }

  onMounted(() => {
    loadFromStorage()
  })

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  }
}
