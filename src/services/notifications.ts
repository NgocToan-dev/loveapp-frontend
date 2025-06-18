import type { 
  Notification, 
  NotificationFilters, 
  CreateNotificationData, 
  UpdateNotificationDeliveryData,
  NotificationStats,
  PaginationParams 
} from '@/types'
import ApiService from './api'

export interface NotificationsApiResponse {
  data: Notification[]
  meta?: {
    pagination?: {
      total: number
      page: number
      limit: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface NotificationsResponse {
  notifications: Notification[]
  total: number
}

export interface UnreadCountResponse {
  count: number
}

class NotificationsService {
  private readonly baseUrl = '/notifications'  // 1. GET /notifications - Get notifications
  async getNotifications(filters?: NotificationFilters): Promise<{ notifications: Notification[], total: number }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await ApiService.get<NotificationsApiResponse>(`${this.baseUrl}?${params.toString()}`)
    
    // Transform the response to match expected format
    return {
      notifications: response.data || [],
      total: response.meta?.pagination?.total || 0
    }
  }

  // 2. GET /notifications/unread-count - Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    return await ApiService.get<UnreadCountResponse>(`${this.baseUrl}/unread-count`)
  }

  // 3. GET /notifications/stats - Get notification stats
  async getNotificationStats(): Promise<NotificationStats> {
    return await ApiService.get<NotificationStats>(`${this.baseUrl}/stats`)
  }

  // 4. PATCH /notifications/mark-all-read - Mark all as read
  async markAllAsRead(): Promise<{ updated: number }> {
    return await ApiService.patch<{ updated: number }>(`${this.baseUrl}/mark-all-read`)
  }

  // 5. GET /notifications/type/{type} - Get notifications by type
  async getNotificationsByType(
    type: 'anniversary' | 'memory' | 'reminder' | 'couple' | 'system' | 'general',
    filters?: NotificationFilters
  ): Promise<{ notifications: Notification[], total: number }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    return await ApiService.get<{ notifications: Notification[], total: number }>(`${this.baseUrl}/type/${type}?${params.toString()}`)
  }

  // 6. GET /notifications/pending - Get pending notifications (Admin)
  async getPendingNotifications(filters?: NotificationFilters): Promise<{ notifications: Notification[], total: number }> {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    return await ApiService.get<{ notifications: Notification[], total: number }>(`${this.baseUrl}/pending?${params.toString()}`)
  }

  // 7. POST /notifications - Create notification (Admin)
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    return await ApiService.post<Notification>(this.baseUrl, data)
  }

  // 8. GET /notifications/{id} - Get notification by ID
  async getNotificationById(id: string): Promise<Notification> {
    return await ApiService.get<Notification>(`${this.baseUrl}/${id}`)
  }

  // 9. PATCH /notifications/{id}/read - Mark notification as read
  async markAsRead(id: string): Promise<Notification> {
    return await ApiService.patch<Notification>(`${this.baseUrl}/${id}/read`)
  }

  // 10. PUT /notifications/{id}/archive - Archive notification
  async archiveNotification(id: string): Promise<Notification> {
    return await ApiService.put<Notification>(`${this.baseUrl}/${id}/archive`)
  }

  // 11. DELETE /notifications/{id} - Delete notification
  async deleteNotification(id: string): Promise<void> {
    return await ApiService.delete<void>(`${this.baseUrl}/${id}`)
  }

  // 12. PUT /notifications/{id}/delivery-status - Update delivery status (Admin)
  async updateDeliveryStatus(id: string, data: UpdateNotificationDeliveryData): Promise<Notification> {
    return await ApiService.put<Notification>(`${this.baseUrl}/${id}/delivery-status`, data)
  }

  // Helper methods for common operations
  async getRecentNotifications(limit: number = 5): Promise<Notification[]> {
    const response = await this.getNotifications({
      page: 1,
      limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    return response.notifications
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    const response = await this.getNotifications({
      isRead: false,
      page: 1,
      limit: 50,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    return response.notifications
  }
}

export const notificationsService = new NotificationsService()