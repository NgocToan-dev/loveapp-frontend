import type { Reminder, PaginationParams, FirebaseTimestamp } from '@/types'
import ApiService from './api'

export interface RemindersResponse {
  data: any[]
  meta: {
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

// Helper function to convert Firebase timestamp to Date
const convertFirebaseTimestamp = (timestamp: FirebaseTimestamp | Date | string): Date => {
  if (timestamp && typeof timestamp === 'object' && '_seconds' in timestamp) {
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)
  }
  return new Date(timestamp)
}

// Helper function to normalize reminder data
const normalizeReminder = (reminder: any): Reminder => {
  return {
    ...reminder,
    reminderDate: typeof reminder.reminderDate === 'string' ? reminder.reminderDate : convertFirebaseTimestamp(reminder.reminderDate),
    createdAt: convertFirebaseTimestamp(reminder.createdAt),
    updatedAt: convertFirebaseTimestamp(reminder.updatedAt),
    completedAt: reminder.completedAt ? convertFirebaseTimestamp(reminder.completedAt) : null
  }
}
export interface ReminderFilters extends PaginationParams {
  priority?: 'low' | 'medium' | 'high'
  isCompleted?: boolean
  startDate?: string
  endDate?: string
}

class RemindersService {
  private readonly baseUrl = '/reminders'

  async getReminders(filters?: ReminderFilters): Promise<{ reminders: Reminder[], total: number }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await ApiService.get<RemindersResponse>(`${this.baseUrl}?${params.toString()}`)

    // Transform API response to expected format
    return {
      reminders: (response.data || []).map(normalizeReminder),
      total: response.meta?.pagination?.total || 0
    }
  }

  async getReminderById(id: string): Promise<Reminder> {
    const response = await ApiService.get<any>(`${this.baseUrl}/${id}`)
    return normalizeReminder(response.data)
  }

  async createReminder(data: Partial<Reminder>): Promise<Reminder> {
    const response = await ApiService.post<any>(this.baseUrl, data)
    return normalizeReminder(response.data)
  }

  async updateReminder(id: string, data: Partial<Reminder>): Promise<Reminder> {
    const response = await ApiService.put<any>(`${this.baseUrl}/${id}`, data)
    return normalizeReminder(response.data)
  }

  async deleteReminder(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  async completeReminder(id: string): Promise<Reminder> {
    const response = await ApiService.patch<any>(`${this.baseUrl}/${id}/complete`)
    return normalizeReminder(response.data)
  }

  async getUpcomingReminders(): Promise<Reminder[]> {
    const response = await ApiService.get<any>(`${this.baseUrl}/upcoming`)
    return (response.data || []).map(normalizeReminder)
  }

  async getOverdueReminders(): Promise<Reminder[]> {
    const response = await ApiService.get<any>(`${this.baseUrl}/overdue`)
    return (response.data || []).map(normalizeReminder)
  }

  async getRemindersStats(): Promise<any> {
    return await ApiService.get<any>(`${this.baseUrl}/stats`)
  }
}

export const remindersService = new RemindersService() 