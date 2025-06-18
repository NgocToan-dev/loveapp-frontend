import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Reminder } from '@/types'
import { remindersService, type CreateReminderData, type UpdateReminderData, type ReminderFilters } from '@/services/reminders'

export const useRemindersStore = defineStore('reminders', () => {
  // State
  const reminders = ref<Reminder[]>([])
  const currentReminder = ref<Reminder | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const totalReminders = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(10)
  const filters = ref<ReminderFilters>({
    page: 1,
    limit: 10,
    sortBy: 'reminderDate',
    sortOrder: 'asc'
  })

  // Getters
  const upcomingReminders = computed(() => {
    const today = new Date()
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    return reminders.value.filter(reminder => {
      if (reminder.isCompleted) return false
      const reminderDate = new Date(reminder.reminderDate)
      return reminderDate >= today && reminderDate <= nextWeek
    }).sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
  })

  const overdueReminders = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return reminders.value.filter(reminder => {
      if (reminder.isCompleted) return false
      const reminderDate = new Date(reminder.reminderDate)
      reminderDate.setHours(0, 0, 0, 0)
      return reminderDate < today
    }).sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
  })

  const completedReminders = computed(() => 
    reminders.value.filter(reminder => reminder.isCompleted)
  )

  const pendingReminders = computed(() => 
    reminders.value.filter(reminder => !reminder.isCompleted)
  )

  const remindersByPriority = computed(() => {
    const grouped: Record<string, Reminder[]> = {
      urgent: [],
      high: [],
      medium: [],
      low: []
    }
    reminders.value.forEach(reminder => {
      grouped[reminder.priority].push(reminder)
    })
    return grouped
  })

  const recurringReminders = computed(() => 
    reminders.value.filter(reminder => reminder.repeat)
  )

  const totalPages = computed(() => 
    Math.ceil(totalReminders.value / pageSize.value)
  )

  // Statistics
  const stats = computed(() => ({
    total: reminders.value.length,
    pending: pendingReminders.value.length,
    completed: completedReminders.value.length,
    overdue: overdueReminders.value.length,
    upcoming: upcomingReminders.value.length,
    recurring: recurringReminders.value.length,
    byPriority: {
      urgent: remindersByPriority.value.urgent.filter(r => !r.isCompleted).length,
      high: remindersByPriority.value.high.filter(r => !r.isCompleted).length,
      medium: remindersByPriority.value.medium.filter(r => !r.isCompleted).length,
      low: remindersByPriority.value.low.filter(r => !r.isCompleted).length
    }
  }))

  // Actions
  const fetchReminders = async (customFilters?: Partial<ReminderFilters>) => {
    try {
      isLoading.value = true
      error.value = null
      
      const mergedFilters = { ...filters.value, ...customFilters }
      const response = await remindersService.getReminders(mergedFilters)
      
      reminders.value = response.reminders
      totalReminders.value = response.total
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch reminders'
      console.error('Error fetching reminders:', err)
      
      // Set fallback empty data if backend is not available
      if (err.code === 'ERR_NETWORK' || err.code === 'ERR_NAME_NOT_RESOLVED') {
        reminders.value = []
        totalReminders.value = 0
        error.value = 'Backend server not available. Please check if the server is running.'
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchReminderById = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await remindersService.getReminderById(id)
      
      currentReminder.value = response
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch reminder'
      console.error('Error fetching reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createReminder = async (data: CreateReminderData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await remindersService.createReminder(data)
      
      if (!reminders.value) {
        reminders.value = []
      }
      reminders.value.unshift(response)
      totalReminders.value += 1
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to create reminder'
      console.error('Error creating reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateReminder = async (id: string, data: UpdateReminderData) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await remindersService.updateReminder(id, data)
      
      const index = (reminders.value || []).findIndex(reminder => reminder.id === id)
      if (index !== -1 && reminders.value) {
        reminders.value[index] = response
      }
      if (currentReminder.value?.id === id) {
        currentReminder.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to update reminder'
      console.error('Error updating reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteReminder = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await remindersService.deleteReminder(id)
      
      reminders.value = (reminders.value || []).filter(reminder => reminder.id !== id)
      totalReminders.value -= 1
      if (currentReminder.value?.id === id) {
        currentReminder.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete reminder'
      console.error('Error deleting reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const completeReminder = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await remindersService.completeReminder(id)
      
      const index = (reminders.value || []).findIndex(reminder => reminder.id === id)
      if (index !== -1 && reminders.value) {
        reminders.value[index] = response
      }
      if (currentReminder.value?.id === id) {
        currentReminder.value = response
      }
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to complete reminder'
      console.error('Error completing reminder:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchUpcomingReminders = async () => {
    try {
      const response = await remindersService.getUpcomingReminders()
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch upcoming reminders'
      console.error('Error fetching upcoming reminders:', err)
      throw err
    }
  }

  const fetchOverdueReminders = async () => {
    try {
      const response = await remindersService.getOverdueReminders()
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch overdue reminders'
      console.error('Error fetching overdue reminders:', err)
      throw err
    }
  }

  const fetchRemindersStats = async () => {
    try {
      const response = await remindersService.getRemindersStats()
      return response
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch reminders stats'
      console.error('Error fetching reminders stats:', err)
      throw err
    }
  }

  const updateFilters = (newFilters: Partial<ReminderFilters>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      limit: 10,
      sortBy: 'reminderDate',
      sortOrder: 'asc'
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentReminder = () => {
    currentReminder.value = null
  }

  return {
    // State
    reminders,
    currentReminder,
    isLoading,
    error,
    totalReminders,
    currentPage,
    pageSize,
    filters,
    
    // Getters
    upcomingReminders,
    overdueReminders,
    completedReminders,
    pendingReminders,
    remindersByPriority,
    recurringReminders,
    totalPages,
    stats,
    
    // Actions
    fetchReminders,
    fetchReminderById,
    createReminder,
    updateReminder,
    deleteReminder,
    completeReminder,
    fetchUpcomingReminders,
    fetchOverdueReminders,
    fetchRemindersStats,
    updateFilters,
    resetFilters,
    clearError,
    clearCurrentReminder
  }
})