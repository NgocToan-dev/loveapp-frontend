import api from './api'
import type { 
  TimelineItem, 
  TimelineResponse, 
  TimelineQueryParams,
  TimelineStats 
} from '@/types'

export const timelineService = {
  /**
   * Get timeline items with filtering and pagination
   */
  async getTimeline(params: TimelineQueryParams = {}): Promise<TimelineResponse> {
    const response = await api.get('/timeline', { params })
    return response.data
  },

  /**
   * Get timeline memories only
   */
  async getTimelineMemories(params: TimelineQueryParams = {}): Promise<TimelineResponse> {
    const response = await api.get('/timeline/memories', { params })
    return response.data
  },

  /**
   * Get timeline reminders only
   */
  async getTimelineReminders(params: TimelineQueryParams = {}): Promise<TimelineResponse> {
    const response = await api.get('/timeline/reminders', { params })
    return response.data
  },

  /**
   * Get timeline blog posts only
   */
  async getTimelineBlog(params: TimelineQueryParams = {}): Promise<TimelineResponse> {
    const response = await api.get('/timeline/blog', { params })
    return response.data
  },

  /**
   * Get timeline statistics
   */
  async getTimelineStats(): Promise<TimelineStats> {
    const response = await api.get('/timeline/stats')
    return response.data
  }
}

export default timelineService
