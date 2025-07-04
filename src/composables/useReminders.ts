import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifications } from './useNotifications'
import { useRemindersStore } from '@/stores/reminders'
import type { CreateReminderRequest, UpdateReminderRequest } from '@/types'

export function useReminders() {
  const { t } = useI18n()
  const { showSuccess, showError } = useNotifications()
  const remindersStore = useRemindersStore()

  // Use computed properties for reactive store state
  const reminders = computed(() => remindersStore.reminders)
  const isLoading = computed(() => remindersStore.isLoading)
  const error = computed(() => remindersStore.error)
  const selectedReminder = computed(() => remindersStore.selectedReminder)
  const upcomingReminders = computed(() => remindersStore.upcomingReminders)
  const todayReminders = computed(() => remindersStore.todayReminders)
  const overDueReminders = computed(() => remindersStore.overDueReminders)
  const completedReminders = computed(() => remindersStore.completedReminders)
  const remindersByType = computed(() => remindersStore.remindersByType)
  const remindersCount = computed(() => remindersStore.remindersCount)
  const pendingCount = computed(() => remindersStore.pendingCount)
  const completedCount = computed(() => remindersStore.completedCount)

  // Wrapped actions with notifications
  const fetchReminders = async () => {
    try {
      await remindersStore.fetchReminders()
    } catch (err: any) {
      showError(t('reminders.errors.fetch_failed'), err.message)
      throw err
    }
  }

  const fetchReminder = async (id: string) => {
    try {
      return await remindersStore.fetchReminder(id)
    } catch (err: any) {
      showError(t('reminders.errors.fetch_single_failed'), err.message)
      throw err
    }
  }

  const createReminder = async (data: CreateReminderRequest) => {
    try {
      const newReminder = await remindersStore.createReminder(data)
      showSuccess(t('reminders.success.created'))
      return newReminder
    } catch (err: any) {
      showError(t('reminders.errors.create_failed'), err.message)
      throw err
    }
  }

  const updateReminder = async (data: UpdateReminderRequest) => {
    try {
      const updatedReminder = await remindersStore.updateReminder(data)
      showSuccess(t('reminders.success.updated'))
      return updatedReminder
    } catch (err: any) {
      showError(t('reminders.errors.update_failed'), err.message)
      throw err
    }
  }

  const deleteReminder = async (id: string) => {
    try {
      await remindersStore.deleteReminder(id)
      showSuccess(t('reminders.success.deleted'))
    } catch (err: any) {
      showError(t('reminders.errors.delete_failed'), err.message)
      throw err
    }
  }

  const markCompleted = async (id: string) => {
    try {
      const updatedReminder = await remindersStore.markCompleted(id)
      showSuccess(t('reminders.success.marked_completed'))
      return updatedReminder
    } catch (err: any) {
      showError(t('reminders.errors.mark_completed_failed'), err.message)
      throw err
    }
  }

  const markIncomplete = async (id: string) => {
    try {
      const updatedReminder = await remindersStore.markIncomplete(id)
      showSuccess(t('reminders.success.marked_incomplete'))
      return updatedReminder
    } catch (err: any) {
      showError(t('reminders.errors.mark_incomplete_failed'), err.message)
      throw err
    }
  }

  const snoozeReminder = async (id: string, snoozeUntil: string) => {
    try {
      const updatedReminder = await remindersStore.snoozeReminder(id, snoozeUntil)
      showSuccess(t('reminders.success.snoozed'))
      return updatedReminder
    } catch (err: any) {
      showError(t('reminders.errors.snooze_failed'), err.message)
      throw err
    }
  }

  // Helper functions
  const hasReminders = () => remindersCount.value > 0
  const hasUpcomingReminders = () => upcomingReminders.value.length > 0
  const hasTodayReminders = () => todayReminders.value.length > 0
  const hasOverdueReminders = () => overDueReminders.value.length > 0

  const getReminderStatusColor = (reminder: any) => {
    if (reminder.isCompleted) return 'text-green-600'
    
    const reminderDate = new Date(reminder.reminderDate)
    const today = new Date()
    
    if (reminderDate < today) return 'text-red-600' // Overdue
    if (reminderDate.toDateString() === today.toDateString()) return 'text-orange-600' // Today
    return 'text-blue-600' // Upcoming
  }

  const getReminderTypeIcon = (type: string) => {
    const icons = {
      anniversary: '💕',
      birthday: '🎂',
      date: '📅',
      custom: '⭐'
    }
    return icons[type as keyof typeof icons] || '📌'
  }

  const clearError = () => {
    remindersStore.clearError()
  }

  const clearSelectedReminder = () => {
    remindersStore.clearSelectedReminder()
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
    snoozeReminder,
    
    // Helpers
    hasReminders,
    hasUpcomingReminders,
    hasTodayReminders,
    hasOverdueReminders,
    getReminderStatusColor,
    getReminderTypeIcon,
    clearError,
    clearSelectedReminder
  }
}
