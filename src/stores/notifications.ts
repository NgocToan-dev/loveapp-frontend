import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { 
  Notification, 
  NotificationFilters, 
  CreateNotificationData, 
  UpdateNotificationDeliveryData,
  NotificationStats 
} from '@/types'
import { notificationsService } from '@/services/notifications'

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([])
  const currentNotification = ref<Notification | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalNotifications = ref(0)
  const unreadCount = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const stats = ref<NotificationStats | null>(null)
  const filters = ref<NotificationFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  // Getters
  const unreadNotifications = computed(() => {
    if (!notifications.value) return []
    return notifications.value.filter(notification => !notification.readAt)
  })

  const readNotifications = computed(() => {
    if (!notifications.value) return []
    return notifications.value.filter(notification => !!notification.readAt)
  })

  const archivedNotifications = computed(() => {
    if (!notifications.value) return []
    return notifications.value.filter(notification => !!notification.archivedAt)
  })

  const unarchivedNotifications = computed(() => {
    if (!notifications.value) return []
    return notifications.value.filter(notification => !notification.archivedAt)
  })
  const notificationsByType = computed(() => {
    const grouped: Record<string, Notification[]> = {
      anniversary: [],
      memory: [],
      reminder: [],
      couple: [],
      system: [],
      general: []
    }
    
    if (!notifications.value) return grouped
    
    notifications.value.forEach(notification => {
      if (grouped[notification.type]) {
        grouped[notification.type].push(notification)
      }
    })
    return grouped
  })
  const notificationsByDeliveryStatus = computed(() => {
    const grouped: Record<string, Notification[]> = {
      pending: [],
      sent: [],
      delivered: [],
      failed: []
    }
    if (!notifications.value) return grouped
    
    notifications.value.forEach(notification => {
      if (notification.deliveryStatus) {
        grouped[notification.deliveryStatus].push(notification)
      }
    })
    return grouped
  })
  const recentNotifications = computed(() => {
    if (!notifications.value) return []
    return notifications.value
      .filter(n => !n.archivedAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
  })

  const pendingNotifications = computed(() => {
    if (!notifications.value) return []
    return notifications.value.filter(notification =>
      notification.deliveryStatus === 'pending'
    )
  })

  const failedNotifications = computed(() => {
    if (!notifications.value) return []
    return notifications.value.filter(notification =>
      notification.deliveryStatus === 'failed'
    )
  })

  const totalPages = computed(() => 
    Math.ceil(totalNotifications.value / pageSize.value)
  )
  // Computed statistics from local data
  const localStats = computed(() => ({
    total: notifications.value?.length || 0,
    unread: unreadNotifications.value?.length || 0,
    pending: pendingNotifications.value?.length || 0,
    byType: {      anniversary: notificationsByType.value.anniversary?.length || 0,
      memory: notificationsByType.value.memory?.length || 0,
      reminder: notificationsByType.value.reminder?.length || 0,
      couple: notificationsByType.value.couple?.length || 0,
      system: notificationsByType.value.system?.length || 0,
      general: notificationsByType.value.general?.length || 0
    },
    byDeliveryStatus: {
      pending: notificationsByDeliveryStatus.value?.pending?.length || 0,
      sent: notificationsByDeliveryStatus.value?.sent?.length || 0,
      delivered: notificationsByDeliveryStatus.value?.delivered?.length || 0,
      failed: notificationsByDeliveryStatus.value?.failed?.length || 0
    }
  }))

  // Computed unread count based on readAt field
  const computedUnreadCount = computed(() => {
    if (!notifications.value) return 0
    return notifications.value.filter(notification => !notification.readAt).length
  })

  // Update unreadCount whenever notifications change
  watch(computedUnreadCount, (newCount) => {
    unreadCount.value = newCount
  })

  // Actions
  const fetchNotifications = async (customFilters?: Partial<NotificationFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const mergedFilters = { ...filters.value, ...customFilters }
      const response = await notificationsService.getNotifications(mergedFilters)
      
      notifications.value = response.notifications
      totalNotifications.value = response.total
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notifications'
      console.error('Error fetching notifications:', err)
      
      // Set fallback empty data if backend is not available
      if (err.code === 'ERR_NETWORK' || err.code === 'ERR_NAME_NOT_RESOLVED') {
        notifications.value = []
        totalNotifications.value = 0
        error.value = 'Backend server not available. Please check if the server is running.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchNotificationById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notificationsService.getNotificationById(id)
      
      currentNotification.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notification'
      console.error('Error fetching notification:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsService.getUnreadCount()
      unreadCount.value = response.count
      return response.count
    } catch (err: any) {
      console.error('Error fetching unread count:', err)
      // Don't throw error for unread count as it's not critical
      return unreadCount.value
    }
  }

  const fetchStats = async () => {
    try {
      const response = await notificationsService.getNotificationStats()
      stats.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notification stats'
      console.error('Error fetching notification stats:', err)
      throw err
    }
  }
  const markAsRead = async (id: string) => {
    try {
      const response = await notificationsService.markAsRead(id)
      
      const index = notifications.value.findIndex(notification => notification.id === id)
      if (index !== -1) {
        notifications.value[index] = response
      }
      if (currentNotification.value?.id === id) {
        currentNotification.value = response
      }
      
      // Update unread count if notification was marked as read
      if (response.readAt && !notifications.value[index]?.readAt) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to mark notification as read'
      console.error('Error marking notification as read:', err)
      throw err
    }
  }
  const markAllAsRead = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notificationsService.markAllAsRead()
      
      // Update all notifications to read status
      notifications.value = notifications.value.map(notification => ({
        ...notification,
        readAt: notification.readAt || new Date().toISOString()
      }))
      
      unreadCount.value = 0
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to mark all notifications as read'
      console.error('Error marking all notifications as read:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const archiveNotification = async (id: string) => {
    try {
      const response = await notificationsService.archiveNotification(id)
      
      const index = notifications.value.findIndex(notification => notification.id === id)
      if (index !== -1) {
        notifications.value[index] = response
      }
      if (currentNotification.value?.id === id) {
        currentNotification.value = response
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to archive notification'
      console.error('Error archiving notification:', err)
      throw err
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await notificationsService.deleteNotification(id)
      
      notifications.value = notifications.value.filter(notification => notification.id !== id)
      totalNotifications.value -= 1
      if (currentNotification.value?.id === id) {
        currentNotification.value = null
      }
        // Update unread count if deleted notification was unread
      const deletedNotification = notifications.value.find(n => n.id === id)
      if (deletedNotification && !deletedNotification.readAt) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete notification'
      console.error('Error deleting notification:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createNotification = async (data: CreateNotificationData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await notificationsService.createNotification(data)
      
      if (!notifications.value) {
        notifications.value = []
      }
      notifications.value.unshift(response)
      totalNotifications.value += 1
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create notification'
      console.error('Error creating notification:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchNotificationsByType = async (
    type: 'anniversary' | 'memory' | 'reminder' | 'couple' | 'system' | 'general',
    customFilters?: Partial<NotificationFilters>
  ) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Ensure filters have required fields
      const mergedFilters = customFilters ? {
        page: 1,
        limit: 10,
        ...customFilters
      } : undefined
      
      const response = await notificationsService.getNotificationsByType(type, mergedFilters)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch notifications by type'
      console.error('Error fetching notifications by type:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchPendingNotifications = async (customFilters?: Partial<NotificationFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      // Ensure filters have required fields
      const mergedFilters = customFilters ? {
        page: 1,
        limit: 10,
        ...customFilters
      } : undefined
      
      const response = await notificationsService.getPendingNotifications(mergedFilters)
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch pending notifications'
      console.error('Error fetching pending notifications:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateDeliveryStatus = async (id: string, data: UpdateNotificationDeliveryData) => {
    try {
      const response = await notificationsService.updateDeliveryStatus(id, data)
      
      const index = notifications.value.findIndex(notification => notification.id === id)
      if (index !== -1) {
        notifications.value[index] = response
      }
      if (currentNotification.value?.id === id) {
        currentNotification.value = response
      }
      
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update delivery status'
      console.error('Error updating delivery status:', err)
      throw err
    }
  }

  const fetchRecentNotifications = async (limit: number = 5) => {
    try {
      const response = await notificationsService.getRecentNotifications(limit)
      return response
    } catch (err: any) {
      console.error('Error fetching recent notifications:', err)
      return []
    }
  }

  const updateFilters = (newFilters: Partial<NotificationFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentNotification = () => {
    currentNotification.value = null
  }

  // Initialize unread count on store creation
  // Temporarily disabled until backend implements notifications API
  // fetchUnreadCount()

  return {
    // State
    notifications,
    currentNotification,
    isLoading,
    error,
    totalNotifications,
    unreadCount,
    currentPage,
    pageSize,
    stats,
    filters,
    
    // Getters
    unreadNotifications,
    readNotifications,
    archivedNotifications,
    unarchivedNotifications,
    notificationsByType,
    notificationsByDeliveryStatus,
    recentNotifications,
    pendingNotifications,
    failedNotifications,
    totalPages,
    localStats,
    
    // Actions
    fetchNotifications,
    fetchNotificationById,
    fetchUnreadCount,
    fetchStats,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    createNotification,
    fetchNotificationsByType,
    fetchPendingNotifications,
    updateDeliveryStatus,
    fetchRecentNotifications,
    updateFilters,
    resetFilters,
    clearError,
    clearCurrentNotification
  }
})