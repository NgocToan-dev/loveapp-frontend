import { api } from './api'
import type { TimelineEvent, TimelineEventFilters } from '@/types'

export interface CreateTimelineEventData {
  title: string
  description?: string
  date: Date
  type: 'memory' | 'anniversary' | 'milestone'
  images?: string[]
  location?: string
  tags?: string[]
  isRecurring: boolean
  recurringType?: 'yearly' | 'monthly'
  priority: 'low' | 'medium' | 'high'
}

export interface UpdateTimelineEventData extends Partial<CreateTimelineEventData> {
  id: string
}

class TimelineEventsService {
  private basePath = '/timeline-events'

  async getEvents(filters?: TimelineEventFilters): Promise<{ 
    events: TimelineEvent[]
    total: number
    hasMore: boolean 
  }> {
    const params = new URLSearchParams()
    
    if (filters) {
      if (filters.type && filters.type !== 'all') params.append('type', filters.type)
      if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority)
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start.toISOString())
        params.append('endDate', filters.dateRange.end.toISOString())
      }
      if (filters.tags?.length) params.append('tags', filters.tags.join(','))
    }

    const response = await api.get(`${this.basePath}?${params}`)
    return {
      events: response.data.events.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      })),
      total: response.data.total,
      hasMore: response.data.hasMore
    }
  }

  async getEvent(id: string): Promise<TimelineEvent> {
    const response = await api.get(`${this.basePath}/${id}`)
    return {
      ...response.data,
      date: new Date(response.data.date),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt)
    }
  }

  async createEvent(eventData: CreateTimelineEventData): Promise<TimelineEvent> {
    const requestData = {
      ...eventData,
      date: eventData.date.toISOString()
    }
    const response = await api.post(this.basePath, requestData)
    return {
      ...response.data,
      date: new Date(response.data.date),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt)
    }
  }

  async updateEvent(id: string, eventData: Partial<CreateTimelineEventData>): Promise<TimelineEvent> {
    const requestData = { ...eventData }
    if (requestData.date) {
      requestData.date = (requestData.date as Date).toISOString() as any
    }
    
    const response = await api.put(`${this.basePath}/${id}`, requestData)
    return {
      ...response.data,
      date: new Date(response.data.date),
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt)
    }
  }

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }

  async searchEvents(query: string, filters?: TimelineEventFilters): Promise<TimelineEvent[]> {
    const params = new URLSearchParams({ q: query })
    
    if (filters?.type && filters.type !== 'all') params.append('type', filters.type)
    if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority)

    const response = await api.get(`${this.basePath}/search?${params}`)
    return response.data.map((event: any) => ({
      ...event,
      date: new Date(event.date),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt)
    }))
  }

  async getUpcomingAnniversaries(days: number = 30): Promise<TimelineEvent[]> {
    const response = await api.get(`${this.basePath}/upcoming-anniversaries?days=${days}`)
    return response.data.map((event: any) => ({
      ...event,
      date: new Date(event.date),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt)
    }))
  }

  async getEventsByTag(tag: string): Promise<TimelineEvent[]> {
    const response = await api.get(`${this.basePath}/by-tag/${encodeURIComponent(tag)}`)
    return response.data.map((event: any) => ({
      ...event,
      date: new Date(event.date),
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt)
    }))
  }

  async getStats(): Promise<{
    total: number
    memories: number
    anniversaries: number
    milestones: number
    recurring: number
  }> {
    const response = await api.get(`${this.basePath}/stats`)
    return response.data
  }

  async uploadEventImage(eventId: string, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await api.post(`${this.basePath}/${eventId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data.imageUrl
  }

  async deleteEventImage(eventId: string, imageUrl: string): Promise<void> {
    await api.delete(`${this.basePath}/${eventId}/images`, {
      data: { imageUrl }
    })
  }
}

export const timelineEventsService = new TimelineEventsService()
