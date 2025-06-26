import { ref, computed, readonly } from 'vue'

// UI Notification type (different from backend Notification)
interface UINotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  isRead?: boolean
  createdAt: string
}

// Global notification state
const notifications = ref<UINotification[]>([])

export const useNotifications = () => {
  
  // Add notification
  const addNotification = (notification: Omit<UINotification, 'id' | 'createdAt'>) => {
    const newNotification: UINotification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    }
    
    notifications.value.unshift(newNotification)
    
    // Auto remove after timeout
    if (notification.type === 'success' || notification.type === 'info') {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    } else if (notification.type === 'warning') {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 7000)
    }
    // Error notifications persist until manually dismissed
    
    return newNotification.id
  }
  
  // Remove notification
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  // Clear all notifications
  const clearNotifications = () => {
    notifications.value = []
  }
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.isRead = true
    }
  }
  
  // Mark all as read
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
  }
  
  // Convenience methods for different types
  const showSuccess = (title: string, message?: string) => {
    return addNotification({ type: 'success', title, message })
  }
  
  const showError = (title: string, message?: string) => {
    return addNotification({ type: 'error', title, message })
  }
  
  const showWarning = (title: string, message?: string) => {
    return addNotification({ type: 'warning', title, message })
  }
  
  const showInfo = (title: string, message?: string) => {
    return addNotification({ type: 'info', title, message })
  }
  
  // Get unread count
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.isRead).length
  )
  
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    clearNotifications,
    markAsRead,
    markAllAsRead,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    unreadCount
  }
}

// Export for global use
export default useNotifications
