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

  // Computed
  const upcomingReminders = computed(() => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return reminders.value
      .filter(reminder => {
        const reminderDate = new Date(reminder.reminderDate)
        return reminderDate >= now && reminderDate <= nextWeek && !reminder.isCompleted
      })
      .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
  })

  const todayReminders = computed(() => {
    if (!reminders.value || !Array.isArray(reminders.value)) {
      return []
    }
    const today = new Date().toISOString().split('T')[0]
    return reminders.value
      .filter(reminder => reminder.reminderDate === today && !reminder.isCompleted)
      .sort((a, b) => a.reminderTime.localeCompare(b.reminderTime))
  })

  const overDueReminders = computed(() => {
    if (!reminders.value || !Array.isArray(reminders.value)) {
      return []
    }
    const today = new Date().toISOString().split('T')[0]
    return reminders.value
      .filter(reminder => reminder.reminderDate < today && !reminder.isCompleted)
      .sort((a, b) => new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime())
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
      error.value = err.response?.data?.message || 'Không tìm thấy nhắc nhở'
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
      if (Array.isArray(reminders.value)) {
        reminders.value.unshift(newReminder)
      } else {
        reminders.value = [newReminder]
      }
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
      
      if (Array.isArray(reminders.value)) {
        const index = reminders.value.findIndex(r => r.id === data.id)
        if (index !== -1) {
          reminders.value[index] = updatedReminder
        }
      }
      
      if (selectedReminder.value?.id === data.id) {
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
      if (Array.isArray(reminders.value)) {
        reminders.value = reminders.value.filter(r => r.id !== id)
      }
      
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
    try {
      const updatedReminder = await remindersService.markCompleted(id)
      
      if (Array.isArray(reminders.value)) {
        const index = reminders.value.findIndex(r => r.id === id)
        if (index !== -1) {
          reminders.value[index] = updatedReminder
        }
      }
      
      if (selectedReminder.value?.id === id) {
        selectedReminder.value = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi đánh dấu hoàn thành'
      console.error('Error marking reminder completed:', err)
      throw err
    }
  }

  const markIncomplete = async (id: string) => {
    try {
      const updatedReminder = await remindersService.markIncomplete(id)
      
      if (Array.isArray(reminders.value)) {
        const index = reminders.value.findIndex(r => r.id === id)
        if (index !== -1) {
          reminders.value[index] = updatedReminder
        }
      }
      
      if (selectedReminder.value?.id === id) {
        selectedReminder.value = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi đánh dấu chưa hoàn thành'
      console.error('Error marking reminder incomplete:', err)
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedReminder = () => {
    selectedReminder.value = null
  }

  // Missing methods implementation
  const snoozeReminder = async (id: string, snoozeUntil: string) => {
    try {
      const reminder = reminders.value.find(r => r.id === id)
      if (!reminder) throw new Error('Reminder not found')
      
      const snoozeDate = new Date(snoozeUntil)
      const updatedReminder = await remindersService.updateReminder({
        id,
        reminderDate: snoozeDate.toISOString().split('T')[0],
        reminderTime: snoozeDate.toTimeString().split(' ')[0].substring(0, 5)
      })
      
      // Update in local state
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }
      
      // Update selected reminder if it's the same
      if (selectedReminder.value?.id === id) {
        selectedReminder.value = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.message
      throw err
    }
  }

  const fetchUpcomingReminders = async (days = 7) => {
    try {
      isLoading.value = true
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + days)
      
      // For now, filter from existing reminders
      // In real app, this would be a separate API call
      const upcoming = reminders.value.filter(reminder => {
        const reminderDate = new Date(reminder.reminderDate)
        const now = new Date()
        return reminderDate >= now && reminderDate <= endDate && !reminder.isCompleted
      })
      
      return upcoming
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    reminders,
    isLoading,
    error,
    selectedReminder,
    
    // Computed
    upcomingReminders,
    todayReminders,
    overDueReminders,
    completedReminders,
    remindersByType,
    remindersCount,
    pendingCount,
    completedCount,
    
    // Actions
    fetchReminders,
    fetchReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    markCompleted,
    markIncomplete,
    clearError,
    clearSelectedReminder,
    
    // New methods
    snoozeReminder,
    fetchUpcomingReminders
  }
})
