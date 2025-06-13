import type { Reminder, ApiResponse, PaginationParams } from '@/types'
import { api } from './api'

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

  async getReminders(filters?: ReminderFilters): Promise<ApiResponse<{ reminders: Reminder[], total: number }>> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await api.get(`${this.baseUrl}?${params.toString()}`)
    return response.data
  }

  async getReminderById(id: string): Promise<ApiResponse<Reminder>> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return response.data
  }

  async createReminder(data: CreateReminderData): Promise<ApiResponse<Reminder>> {
    const response = await api.post(this.baseUrl, data)
    return response.data
  }

  async updateReminder(id: string, data: UpdateReminderData): Promise<ApiResponse<Reminder>> {
    const response = await api.put(`${this.baseUrl}/${id}`, data)
    return response.data
  }

  async deleteReminder(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`${this.baseUrl}/${id}`)
    return response.data
  }

  async completeReminder(id: string): Promise<ApiResponse<Reminder>> {
    const response = await api.patch(`${this.baseUrl}/${id}/complete`)
    return response.data
  }

  async getUpcomingReminders(): Promise<ApiResponse<Reminder[]>> {
    const response = await api.get(`${this.baseUrl}/upcoming`)
    return response.data
  }

  async getOverdueReminders(): Promise<ApiResponse<Reminder[]>> {
    const response = await api.get(`${this.baseUrl}/overdue`)
    return response.data
  }

  async getRemindersStats(): Promise<ApiResponse<any>> {
    const response = await api.get(`${this.baseUrl}/stats`)
    return response.data
  }
}

export const remindersService = new RemindersService() 