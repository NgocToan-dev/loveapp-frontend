import api from './api'
import type { 
  Reminder, 
  CreateReminderRequest, 
  UpdateReminderRequest, 
  PaginatedResponse 
} from '@/types'

// Normalize reminder data from backend to frontend format
const normalizeReminder = (reminder: any): Reminder => {
  return {
    ...reminder,
    id: reminder.id || reminder._id?.toString() || reminder._id,
    userId: reminder.userId ? {
      _id: reminder.userId._id || reminder.userId,
      displayName: reminder.userId.displayName || '',
      avatarUrl: reminder.userId.avatarUrl || ''
    } : undefined,
    description: reminder.description || '',
    repeat: reminder.repeat || 'none',
    recurringType: reminder.recurringType || 'none',
    notified: reminder.notified || false
  }
}

// Normalize array of reminders
const normalizeReminders = (reminders: any[]): Reminder[] => {
  return reminders.map(normalizeReminder)
}

export const remindersService = {
  // Get all reminders for the couple
  async getReminders(page = 1, limit = 10): Promise<PaginatedResponse<Reminder>> {
    const response = await api.get(`/reminders?page=${page}&limit=${limit}`)
    // Transform the backend response to match our PaginatedResponse interface
    return {
      success: true,
      data: normalizeReminders(response.data.reminders || []),
      pagination: {
        page: response.data.pagination?.currentPage || page,
        limit: limit,
        total: response.data.pagination?.totalReminders || 0,
        totalPages: response.data.pagination?.totalPages || 1
      }
    }
  },

  // Get all reminders without pagination (for full view)
  async getAllReminders(): Promise<Reminder[]> {
    const response = await api.get('/reminders?limit=1000') // Get a large number to get all
    return normalizeReminders(response.data.reminders || [])
  },

  // Get single reminder by ID
  async getReminder(id: string): Promise<Reminder> {
    const response = await api.get(`/reminders/${id}`)
    return normalizeReminder(response.data.reminder || response.data)
  },

  // Create new reminder
  async createReminder(data: CreateReminderRequest): Promise<Reminder> {
    const response = await api.post('/reminders', data)
    return normalizeReminder(response.data.reminder || response.data)
  },

  // Update reminder
  async updateReminder(data: UpdateReminderRequest): Promise<Reminder> {
    const { id, ...updateData } = data
    const response = await api.put(`/reminders/${id}`, updateData)
    return normalizeReminder(response.data.reminder || response.data)
  },

  // Delete reminder
  async deleteReminder(id: string): Promise<void> {
    await api.delete(`/reminders/${id}`)
  },

  // Mark reminder as completed
  async markCompleted(id: string): Promise<Reminder> {
    const response = await api.patch(`/reminders/${id}/complete`)
    return normalizeReminder(response.data.reminder || response.data)
  },

  // Mark reminder as incomplete
  async markIncomplete(id: string): Promise<Reminder> {
    const response = await api.patch(`/reminders/${id}/incomplete`)
    return normalizeReminder(response.data.reminder || response.data)
  },

  // Get upcoming reminders
  async getUpcomingReminders(days = 7): Promise<Reminder[]> {
    const response = await api.get(`/reminders/upcoming?days=${days}`)
    return normalizeReminders(response.data.reminders || response.data)
  },

  // Get overdue reminders
  async getOverdueReminders(): Promise<Reminder[]> {
    const response = await api.get('/reminders/overdue')
    return normalizeReminders(response.data.reminders || response.data)
  },

  // Get reminders by type
  async getRemindersByType(type: Reminder['type']): Promise<Reminder[]> {
    const response = await api.get(`/reminders/type/${type}`)
    return normalizeReminders(response.data.reminders || response.data)
  },

  // Get reminders for specific date
  async getRemindersForDate(date: string): Promise<Reminder[]> {
    const response = await api.get(`/reminders/date/${date}`)
    return normalizeReminders(response.data.reminders || response.data)
  },

  // Search reminders
  async searchReminders(query: string): Promise<Reminder[]> {
    const response = await api.get(`/reminders/search?q=${encodeURIComponent(query)}`)
    return normalizeReminders(response.data.reminders || response.data)
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
    return normalizeReminder(response.data.reminder || response.data)
  },

  // Get recurring reminders
  async getRecurringReminders(): Promise<Reminder[]> {
    const response = await api.get('/reminders/recurring')
    return normalizeReminders(response.data.reminders || response.data)
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
    return normalizeReminder(response.data.reminder || response.data)
  }
}
