import api from './api'
import type { 
  Reminder, 
  CreateReminderRequest, 
  UpdateReminderRequest, 
  PaginatedResponse 
} from '@/types'

export const remindersService = {
  // Get all reminders for the couple
  async getReminders(page = 1, limit = 10): Promise<PaginatedResponse<Reminder>> {
    const response = await api.get(`/reminders?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get single reminder by ID
  async getReminder(id: string): Promise<Reminder> {
    const response = await api.get(`/reminders/${id}`)
    return response.data
  },

  // Create new reminder
  async createReminder(data: CreateReminderRequest): Promise<Reminder> {
    const response = await api.post('/reminders', data)
    return response.data
  },

  // Update reminder
  async updateReminder(data: UpdateReminderRequest): Promise<Reminder> {
    const { id, ...updateData } = data
    const response = await api.put(`/reminders/${id}`, updateData)
    return response.data
  },

  // Delete reminder
  async deleteReminder(id: string): Promise<void> {
    await api.delete(`/reminders/${id}`)
  },

  // Mark reminder as completed
  async markCompleted(id: string): Promise<Reminder> {
    const response = await api.patch(`/reminders/${id}/complete`)
    return response.data
  },

  // Mark reminder as incomplete
  async markIncomplete(id: string): Promise<Reminder> {
    const response = await api.patch(`/reminders/${id}/incomplete`)
    return response.data
  },

  // Get upcoming reminders
  async getUpcomingReminders(days = 7): Promise<Reminder[]> {
    const response = await api.get(`/reminders/upcoming?days=${days}`)
    return response.data
  },

  // Get overdue reminders
  async getOverdueReminders(): Promise<Reminder[]> {
    const response = await api.get('/reminders/overdue')
    return response.data
  },

  // Get reminders by type
  async getRemindersByType(type: Reminder['type']): Promise<Reminder[]> {
    const response = await api.get(`/reminders/type/${type}`)
    return response.data
  },

  // Get reminders for specific date
  async getRemindersForDate(date: string): Promise<Reminder[]> {
    const response = await api.get(`/reminders/date/${date}`)
    return response.data
  },

  // Search reminders
  async searchReminders(query: string): Promise<Reminder[]> {
    const response = await api.get(`/reminders/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  // Get reminder statistics
  async getStatistics(): Promise<{
    totalReminders: number
    completedReminders: number
    upcomingReminders: number
    overdueReminders: number
    completionRate: number
    remindersByType: { type: string; count: number }[]
  }> {
    const response = await api.get('/reminders/statistics')
    return response.data
  },

  // Snooze reminder
  async snoozeReminder(id: string, snoozeUntil: string): Promise<Reminder> {
    const response = await api.patch(`/reminders/${id}/snooze`, { snoozeUntil })
    return response.data
  },

  // Get recurring reminders
  async getRecurringReminders(): Promise<Reminder[]> {
    const response = await api.get('/reminders/recurring')
    return response.data
  },

  // Update recurring pattern
  async updateRecurringPattern(
    id: string, 
    pattern: {
      isRecurring: boolean
      recurringType?: 'daily' | 'weekly' | 'monthly' | 'yearly'
    }
  ): Promise<Reminder> {
    const response = await api.patch(`/reminders/${id}/recurring`, pattern)
    return response.data
  }
}
