import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { remindersService } from '@/services/reminders'
import type { 
  Reminder, 
  CreateReminderRequest, 
  UpdateReminderRequest 
} from '@/types'

// Export types for component usage
export type { Reminder } from '@/types'

export const useRemindersStore = defineStore('reminders', () => {
  // State
  const reminders = ref<Reminder[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedReminder = ref<Reminder | null>(null)

  // Computed properties (getters)
  const upcomingReminders = computed(() => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return reminders.value
      .filter(reminder => {
        const reminderDate = new Date(reminder.datetime)
        return reminderDate >= now && reminderDate <= nextWeek && !reminder.isCompleted
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
  })

  const todayReminders = computed(() => {
    if (!reminders.value || !Array.isArray(reminders.value)) {
      return []
    }
    const today = new Date().toISOString().split('T')[0]
    return reminders.value
      .filter(reminder => {
        const reminderDate = new Date(reminder.datetime).toISOString().split('T')[0]
        return reminderDate === today && !reminder.isCompleted
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
  })

  const overDueReminders = computed(() => {
    if (!reminders.value || !Array.isArray(reminders.value)) {
      return []
    }
    const now = new Date()
    return reminders.value
      .filter(reminder => new Date(reminder.datetime) < now && !reminder.isCompleted)
      .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
  })

  const completedReminders = computed(() => {
    if (!reminders.value || !Array.isArray(reminders.value)) {
      return []
    }
    return reminders.value
      .filter(reminder => reminder.isCompleted)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  })

  const remindersByType = computed(() => {
    const grouped: Record<Reminder['type'], Reminder[]> = {
      anniversary: [],
      birthday: [],
      date: [],
      custom: []
    }
    
    if (!reminders.value || !Array.isArray(reminders.value)) {
      return grouped
    }
    
    reminders.value.forEach(reminder => {
      grouped[reminder.type].push(reminder)
    })
    
    return grouped
  })

  const remindersCount = computed(() => {
    return Array.isArray(reminders.value) ? reminders.value.length : 0
  })

  const pendingCount = computed(() => {
    return Array.isArray(reminders.value) ? reminders.value.filter(r => !r.isCompleted).length : 0
  })

  const completedCount = computed(() => {
    return Array.isArray(reminders.value) ? reminders.value.filter(r => r.isCompleted).length : 0
  })

  const urgentReminders = computed(() => {
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    
    return reminders.value
      .filter(reminder => {
        const reminderDate = new Date(reminder.datetime)
        return reminderDate <= tomorrow && !reminder.isCompleted
      })
      .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
  })

  const remindersByMonth = computed(() => {
    const grouped: Record<string, Reminder[]> = {}
    
    if (!reminders.value || !Array.isArray(reminders.value)) {
      return grouped
    }
    
    reminders.value.forEach(reminder => {
      const month = new Date(reminder.datetime).toISOString().substring(0, 7) // YYYY-MM
      if (!grouped[month]) {
        grouped[month] = []
      }
      grouped[month].push(reminder)
    })
    
    return grouped
  })

  // Actions
  const fetchReminders = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await remindersService.getReminders()
      // The response is a PaginatedResponse, so we need response.data to get the array
      reminders.value = Array.isArray(response.data) ? response.data : []
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải nhắc nhở'
      console.error('Error fetching reminders:', err)
      // Ensure reminders is always an array even on error
      reminders.value = []
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchReminder = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const reminder = await remindersService.getReminder(id)
      selectedReminder.value = reminder
      return reminder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải nhắc nhở'
      console.error('Error fetching reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createReminder = async (data: CreateReminderRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const newReminder = await remindersService.createReminder(data)
      reminders.value.push(newReminder)
      return newReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tạo nhắc nhở'
      console.error('Error creating reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateReminder = async (data: UpdateReminderRequest) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedReminder = await remindersService.updateReminder(data)
      
      // Update reminder in the array
      const index = reminders.value.findIndex(r => r.id === updatedReminder.id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }

      // Update selected reminder if it's the same one
      if (selectedReminder.value?.id === updatedReminder.id) {
        selectedReminder.value = updatedReminder
      }

      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi cập nhật nhắc nhở'
      console.error('Error updating reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteReminder = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await remindersService.deleteReminder(id)
      
      // Remove reminder from array
      reminders.value = reminders.value.filter(r => r.id !== id)

      // Clear selected reminder if it's the one being deleted
      if (selectedReminder.value?.id === id) {
        selectedReminder.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi xóa nhắc nhở'
      console.error('Error deleting reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const markCompleted = async (id: string) => {
    const reminder = reminders.value.find(r => r.id === id)
    if (!reminder) {
      throw new Error('Reminder not found')
    }

    try {
      // Optimistically update the UI first
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = {
          ...reminders.value[index],
          isCompleted: true
        }
      }

      // Use the correct service method
      const updatedReminder = await remindersService.markCompleted(id)
      
      // Update with the actual server response
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }

      return updatedReminder
    } catch (err: any) {
      // Revert optimistic update on error
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = {
          ...reminders.value[index],
          isCompleted: false
        }
      }
      
      error.value = err.response?.data?.message || 'Có lỗi khi đánh dấu hoàn thành'
      console.error('Error marking reminder as completed:', err)
      throw err
    }
  }

  const markIncomplete = async (id: string) => {
    const reminder = reminders.value.find(r => r.id === id)
    if (!reminder) {
      throw new Error('Reminder not found')
    }

    try {
      // Optimistically update the UI first
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = {
          ...reminders.value[index],
          isCompleted: false
        }
      }

      // Use the correct service method
      const updatedReminder = await remindersService.markIncomplete(id)
      
      // Update with the actual server response
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }

      return updatedReminder
    } catch (err: any) {
      // Revert optimistic update on error
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = {
          ...reminders.value[index],
          isCompleted: true
        }
      }
      
      error.value = err.response?.data?.message || 'Có lỗi khi đánh dấu chưa hoàn thành'
      console.error('Error marking reminder as incomplete:', err)
      throw err
    }
  }

  const snoozeReminder = async (id: string, snoozeUntil: string) => {
    error.value = null
    
    try {
      const updatedReminder = await remindersService.snoozeReminder(id, snoozeUntil)
      
      // Update the reminder in the local state
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi hoãn nhắc nhở'
      console.error('Error snoozing reminder:', err)
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedReminder = () => {
    selectedReminder.value = null
  }

  const clearReminders = () => {
    reminders.value = []
  }

  // Return all state, getters, and actions
  return {
    // State
    reminders,
    isLoading,
    error,
    selectedReminder,
    
    // Getters
    upcomingReminders,
    todayReminders,
    overDueReminders,
    completedReminders,
    remindersByType,
    remindersCount,
    pendingCount,
    completedCount,
    urgentReminders,
    remindersByMonth,
    
    // Actions
    fetchReminders,
    fetchReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    markCompleted,
    markIncomplete,
    snoozeReminder,
    clearError,
    clearSelectedReminder,
    clearReminders
  }
})
