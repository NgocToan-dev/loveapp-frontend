import type { Reminder, PaginationParams } from '@/types'
import ApiService from './api'

export interface CreateReminderData {
  title: string
  description?: string
  reminderDate: Date
  priority: 'low' | 'medium' | 'high'
  repeat?: 'daily' | 'weekly' | 'monthly' | 'yearly'
}

export interface UpdateReminderData {
  title?: string
  description?: string
  reminderDate?: Date
  priority?: 'low' | 'medium' | 'high'
  repeat?: 'daily' | 'weekly' | 'monthly' | 'yearly'
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

    return await ApiService.get<{ reminders: Reminder[], total: number }>(`${this.baseUrl}?${params.toString()}`)
  }

  async getReminderById(id: string): Promise<Reminder> {
    return await ApiService.get<Reminder>(`${this.baseUrl}/${id}`)
  }

  async createReminder(data: CreateReminderData): Promise<Reminder> {
    return await ApiService.post<Reminder>(this.baseUrl, data)
  }

  async updateReminder(id: string, data: UpdateReminderData): Promise<Reminder> {
    return await ApiService.put<Reminder>(`${this.baseUrl}/${id}`, data)
  }

  async deleteReminder(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  async completeReminder(id: string): Promise<Reminder> {
    return await ApiService.patch<Reminder>(`${this.baseUrl}/${id}/complete`)
  }

  async getUpcomingReminders(): Promise<Reminder[]> {
    return await ApiService.get<Reminder[]>(`${this.baseUrl}/upcoming`)
  }

  async getOverdueReminders(): Promise<Reminder[]> {
    return await ApiService.get<Reminder[]>(`${this.baseUrl}/overdue`)
  }

  async getRemindersStats(): Promise<any> {
    return await ApiService.get<any>(`${this.baseUrl}/stats`)
  }
}

export const remindersService = new RemindersService() 