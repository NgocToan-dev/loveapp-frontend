import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { TimelineEvent, TimelineEventFilters, TimelineEventStats } from '@/types'

export const useTimelineEventsStore = defineStore('timelineEvents', () => {
  const events = ref<TimelineEvent[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<TimelineEventFilters>({
    type: 'all',
    priority: 'all'
  })

  // Computed
  const filteredEvents = computed(() => {
    return events.value.filter(event => {
      // Filter by type
      if (filters.value.type && filters.value.type !== 'all' && event.type !== filters.value.type) {
        return false
      }
      
      // Filter by priority
      if (filters.value.priority && filters.value.priority !== 'all' && event.priority !== filters.value.priority) {
        return false
      }
      
      // Filter by date range
      if (filters.value.dateRange) {
        const eventDate = new Date(event.date)
        if (eventDate < filters.value.dateRange.start || eventDate > filters.value.dateRange.end) {
          return false
        }
      }
      
      // Filter by tags
      if (filters.value.tags && filters.value.tags.length > 0) {
        if (!event.tags || !filters.value.tags.some(tag => event.tags!.includes(tag))) {
          return false
        }
      }
      
      // Filter by search query
      if (filters.value.searchQuery) {
        const query = filters.value.searchQuery.toLowerCase()
        return event.title.toLowerCase().includes(query) ||
               event.description?.toLowerCase().includes(query) ||
               event.tags?.some(tag => tag.toLowerCase().includes(query))
      }
      
      return true
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  const eventStats = computed((): TimelineEventStats => {
    return {
      total: events.value.length,
      memories: events.value.filter(e => e.type === 'memory').length,
      anniversaries: events.value.filter(e => e.type === 'anniversary').length,
      milestones: events.value.filter(e => e.type === 'milestone').length,
      recurring: events.value.filter(e => e.isRecurring).length
    }
  })

  const upcomingAnniversaries = computed(() => {
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
    
    return events.value.filter(event => {
      if (!event.isRecurring || event.type !== 'anniversary') return false
      
      const eventThisYear = new Date(now.getFullYear(), new Date(event.date).getMonth(), new Date(event.date).getDate())
      return eventThisYear >= now && eventThisYear <= futureDate
    })
  })

  // Actions
  const loadEvents = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Load from localStorage for now (will be replaced with API call)
      const savedEvents = localStorage.getItem('timelineEvents')
      if (savedEvents) {
        const parsed = JSON.parse(savedEvents).map((event: any) => ({
          ...event,
          date: new Date(event.date),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }))
        events.value = parsed
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load events'
    } finally {
      loading.value = false
    }
  }

  const saveEvents = () => {
    localStorage.setItem('timelineEvents', JSON.stringify(events.value))
  }

  const addEvent = async (eventData: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newEvent: TimelineEvent = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      events.value.push(newEvent)
      saveEvents()
      
      return newEvent
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to add event'
      throw err
    }
  }

  const updateEvent = async (id: string, updates: Partial<TimelineEvent>) => {
    try {
      const eventIndex = events.value.findIndex(e => e.id === id)
      if (eventIndex === -1) {
        throw new Error('Event not found')
      }
      
      events.value[eventIndex] = {
        ...events.value[eventIndex],
        ...updates,
        updatedAt: new Date()
      }
      
      saveEvents()
      
      return events.value[eventIndex]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update event'
      throw err
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const eventIndex = events.value.findIndex(e => e.id === id)
      if (eventIndex === -1) {
        throw new Error('Event not found')
      }
      
      events.value.splice(eventIndex, 1)
      saveEvents()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete event'
      throw err
    }
  }

  const setFilters = (newFilters: Partial<TimelineEventFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {
      type: 'all',
      priority: 'all'
    }
  }

  const getEventsByDate = (date: Date) => {
    return events.value.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    )
  }

  const getEventsByTag = (tag: string) => {
    return events.value.filter(event => 
      event.tags?.includes(tag)
    )
  }

  return {
    // State
    events: filteredEvents,
    allEvents: events,
    loading,
    error,
    filters,
    
    // Computed
    eventStats,
    upcomingAnniversaries,
    
    // Actions
    loadEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    setFilters,
    clearFilters,
    getEventsByDate,
    getEventsByTag
  }
})
