import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { remindersService } from '@/services/reminders'
import type { Reminder, CreateReminderRequest, UpdateReminderRequest } from '@/types'

export function useReminders() {
  const { t } = useI18n()
  
  // State
  const reminders = ref<Reminder[]>([])
  const currentReminder = ref<Reminder | null>(null)
  const upcomingReminders = ref<Reminder[]>([])
  const overdueReminders = ref<Reminder[]>([])
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const error = ref<string | null>(null)
  const totalPages = ref(0)
  const currentPage = ref(1)

  // Computed
  const remindersCount = computed(() => reminders.value.length)
  const hasReminders = computed(() => reminders.value.length > 0)
  const completedReminders = computed(() => 
    reminders.value.filter(r => r.isCompleted)
  )
  const activeReminders = computed(() => 
    reminders.value.filter(r => !r.isCompleted)
  )
  const completionRate = computed(() => {
    if (remindersCount.value === 0) return 0
    return Math.round((completedReminders.value.length / remindersCount.value) * 100)
  })

  // Methods
  const fetchReminders = async (page = 1, limit = 10) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await remindersService.getReminders(page, limit)
      
      if (page === 1) {
        reminders.value = response.data
      } else {
        reminders.value.push(...response.data)
      }
      
      totalPages.value = response.pagination.totalPages
      currentPage.value = page
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.fetch_failed')
    } finally {
      isLoading.value = false
    }
  }

  const fetchReminder = async (id: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      currentReminder.value = await remindersService.getReminder(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.fetch_single_failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createReminder = async (data: CreateReminderRequest) => {
    isCreating.value = true
    error.value = null
    
    try {
      const newReminder = await remindersService.createReminder(data)
      reminders.value.unshift(newReminder)
      return newReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.create_failed')
      throw err
    } finally {
      isCreating.value = false
    }
  }

  const updateReminder = async (data: UpdateReminderRequest) => {
    isUpdating.value = true
    error.value = null
    
    try {
      const updatedReminder = await remindersService.updateReminder(data)
      
      // Update in reminders list
      const index = reminders.value.findIndex(r => r.id === data.id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }
      
      // Update current reminder if it's the same
      if (currentReminder.value?.id === data.id) {
        currentReminder.value = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.update_failed')
      throw err
    } finally {
      isUpdating.value = false
    }
  }

  const deleteReminder = async (id: string) => {
    isDeleting.value = true
    error.value = null
    
    try {
      await remindersService.deleteReminder(id)
      
      // Remove from reminders list
      reminders.value = reminders.value.filter(r => r.id !== id)
      
      // Remove from upcoming reminders
      upcomingReminders.value = upcomingReminders.value.filter(r => r.id !== id)
      
      // Clear current reminder if it was deleted
      if (currentReminder.value?.id === id) {
        currentReminder.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.delete_failed')
      throw err
    } finally {
      isDeleting.value = false
    }
  }

  const markCompleted = async (id: string) => {
    error.value = null
    
    try {
      const updatedReminder = await remindersService.markCompleted(id)
      
      // Update in reminders list
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }
      
      // Update current reminder if it's the same
      if (currentReminder.value?.id === id) {
        currentReminder.value = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.complete_failed')
      throw err
    }
  }

  const markIncomplete = async (id: string) => {
    error.value = null
    
    try {
      const updatedReminder = await remindersService.markIncomplete(id)
      
      // Update in reminders list
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }
      
      // Update current reminder if it's the same
      if (currentReminder.value?.id === id) {
        currentReminder.value = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.incomplete_failed')
      throw err
    }
  }

  const fetchUpcomingReminders = async (days = 7) => {
    isLoading.value = true
    error.value = null
    
    try {
      upcomingReminders.value = await remindersService.getUpcomingReminders(days)
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.fetch_upcoming_failed')
    } finally {
      isLoading.value = false
    }
  }

  const fetchOverdueReminders = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      overdueReminders.value = await remindersService.getOverdueReminders()
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.fetch_overdue_failed')
    } finally {
      isLoading.value = false
    }
  }

  const fetchRemindersByType = async (type: Reminder['type']) => {
    isLoading.value = true
    error.value = null
    
    try {
      const results = await remindersService.getRemindersByType(type)
      reminders.value = results
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.fetch_by_type_failed')
    } finally {
      isLoading.value = false
    }
  }

  const searchReminders = async (query: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      const results = await remindersService.searchReminders(query)
      reminders.value = results
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.search_failed')
    } finally {
      isLoading.value = false
    }
  }

  const snoozeReminder = async (id: string, snoozeUntil: string) => {
    error.value = null
    
    try {
      const updatedReminder = await remindersService.snoozeReminder(id, snoozeUntil)
      
      // Update in reminders list
      const index = reminders.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reminders.value[index] = updatedReminder
      }
      
      return updatedReminder
    } catch (err: any) {
      error.value = err.response?.data?.message || t('reminders.errors.snooze_failed')
      throw err
    }
  }

  const loadMoreReminders = async () => {
    if (currentPage.value < totalPages.value) {
      await fetchReminders(currentPage.value + 1)
    }
  }

  const refreshReminders = async () => {
    currentPage.value = 1
    await fetchReminders(1)
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentReminder = () => {
    currentReminder.value = null
  }

  const getReminderById = (id: string) => {
    return reminders.value.find(r => r.id === id) || null
  }

  const getRemindersForToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return reminders.value.filter(reminder => {
      const reminderDate = reminder.reminderDate.split('T')[0]
      return reminderDate === today && !reminder.isCompleted
    })
  }

  const getRemindersForDate = (date: string) => {
    return reminders.value.filter(reminder => {
      const reminderDate = reminder.reminderDate.split('T')[0]
      return reminderDate === date
    })
  }

  return {
    // State
    reminders: computed(() => reminders.value),
    currentReminder: computed(() => currentReminder.value),
    upcomingReminders: computed(() => upcomingReminders.value),
    overdueReminders: computed(() => overdueReminders.value),
    isLoading: computed(() => isLoading.value),
    isCreating: computed(() => isCreating.value),
    isUpdating: computed(() => isUpdating.value),
    isDeleting: computed(() => isDeleting.value),
    error: computed(() => error.value),
    totalPages: computed(() => totalPages.value),
    currentPage: computed(() => currentPage.value),
    
    // Computed
    remindersCount,
    hasReminders,
    completedReminders,
    activeReminders,
    completionRate,
    
    // Methods
    fetchReminders,
    fetchReminder,
    createReminder,
    updateReminder,
    deleteReminder,
    markCompleted,
    markIncomplete,
    fetchUpcomingReminders,
    fetchOverdueReminders,
    fetchRemindersByType,
    searchReminders,
    snoozeReminder,
    loadMoreReminders,
    refreshReminders,
    clearError,
    clearCurrentReminder,
    getReminderById,
    getRemindersForToday,
    getRemindersForDate
  }
}
