import { defineStore } from 'pinia'
import { remindersService } from '@/services/reminders'
import type { 
  Reminder, 
  CreateReminderRequest, 
  UpdateReminderRequest 
} from '@/types'

// Export types for component usage
export type { Reminder } from '@/types'

export const useRemindersStore = defineStore('reminders', {
  state: () => ({
    reminders: [] as Reminder[],
    isLoading: false,
    error: null as string | null,
    selectedReminder: null as Reminder | null
  }),

  getters: {
    upcomingReminders: (state) => {
      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      
      return state.reminders
        .filter(reminder => {
          const reminderDate = new Date(reminder.reminderDate)
          return reminderDate >= now && reminderDate <= nextWeek && !reminder.isCompleted
        })
        .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
    },

    todayReminders: (state) => {
      if (!state.reminders || !Array.isArray(state.reminders)) {
        return []
      }
      const today = new Date().toISOString().split('T')[0]
      return state.reminders
        .filter(reminder => reminder.reminderDate === today && !reminder.isCompleted)
        .sort((a, b) => a.reminderTime.localeCompare(b.reminderTime))
    },

    overDueReminders: (state) => {
      if (!state.reminders || !Array.isArray(state.reminders)) {
        return []
      }
      const today = new Date().toISOString().split('T')[0]
      return state.reminders
        .filter(reminder => reminder.reminderDate < today && !reminder.isCompleted)
        .sort((a, b) => new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime())
    },

    completedReminders: (state) => {
      if (!state.reminders || !Array.isArray(state.reminders)) {
        return []
      }
      return state.reminders
        .filter(reminder => reminder.isCompleted)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },

    remindersByType: (state) => {
      const grouped: Record<Reminder['type'], Reminder[]> = {
        anniversary: [],
        birthday: [],
        date: [],
        custom: []
      }
      
      if (!state.reminders || !Array.isArray(state.reminders)) {
        return grouped
      }
      
      state.reminders.forEach(reminder => {
        grouped[reminder.type].push(reminder)
      })
      
      return grouped
    },

    remindersCount: (state) => {
      return Array.isArray(state.reminders) ? state.reminders.length : 0
    },

    pendingCount: (state) => {
      return Array.isArray(state.reminders) ? state.reminders.filter(r => !r.isCompleted).length : 0
    },

    completedCount: (state) => {
      return Array.isArray(state.reminders) ? state.reminders.filter(r => r.isCompleted).length : 0
    },

    urgentReminders: (state) => {
      const today = new Date()
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      
      return state.reminders
        .filter(reminder => {
          const reminderDate = new Date(reminder.reminderDate)
          return reminderDate <= tomorrow && !reminder.isCompleted
        })
        .sort((a, b) => new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime())
    },

    remindersByMonth: (state) => {
      const grouped: Record<string, Reminder[]> = {}
      
      if (!state.reminders || !Array.isArray(state.reminders)) {
        return grouped
      }
      
      state.reminders.forEach(reminder => {
        const month = new Date(reminder.reminderDate).toISOString().substring(0, 7) // YYYY-MM
        if (!grouped[month]) {
          grouped[month] = []
        }
        grouped[month].push(reminder)
      })
      
      return grouped
    }
  },

  actions: {
    async fetchReminders() {
      this.isLoading = true
      this.error = null

      try {
        const response = await remindersService.getReminders()
        // The response is a PaginatedResponse, so we need response.data to get the array
        this.reminders = Array.isArray(response.data) ? response.data : []
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tải nhắc nhở'
        console.error('Error fetching reminders:', err)
        // Ensure reminders is always an array even on error
        this.reminders = []
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchReminder(id: string) {
      this.isLoading = true
      this.error = null

      try {
        const reminder = await remindersService.getReminder(id)
        this.selectedReminder = reminder
        return reminder
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Không tìm thấy nhắc nhở'
        console.error('Error fetching reminder:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createReminder(data: CreateReminderRequest) {
      this.isLoading = true
      this.error = null

      try {
        const newReminder = await remindersService.createReminder(data)
        if (Array.isArray(this.reminders)) {
          this.reminders.unshift(newReminder)
        } else {
          this.reminders = [newReminder]
        }
        return newReminder
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi tạo nhắc nhở'
        console.error('Error creating reminder:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateReminder(data: UpdateReminderRequest) {
      this.isLoading = true
      this.error = null

      try {
        const updatedReminder = await remindersService.updateReminder(data)
        
        if (Array.isArray(this.reminders)) {
          const index = this.reminders.findIndex(r => r.id === data.id)
          if (index !== -1) {
            this.reminders[index] = updatedReminder
          }
        }
        
        if (this.selectedReminder?.id === data.id) {
          this.selectedReminder = updatedReminder
        }
        
        return updatedReminder
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi cập nhật nhắc nhở'
        console.error('Error updating reminder:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteReminder(id: string) {
      this.isLoading = true
      this.error = null

      try {
        await remindersService.deleteReminder(id)
        if (Array.isArray(this.reminders)) {
          this.reminders = this.reminders.filter(r => r.id !== id)
        }
        
        if (this.selectedReminder?.id === id) {
          this.selectedReminder = null
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi xóa nhắc nhở'
        console.error('Error deleting reminder:', err)
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async markCompleted(id: string) {
      try {
        const updatedReminder = await remindersService.markCompleted(id)
        
        if (Array.isArray(this.reminders)) {
          const index = this.reminders.findIndex(r => r.id === id)
          if (index !== -1) {
            this.reminders[index] = updatedReminder
          }
        }
        
        if (this.selectedReminder?.id === id) {
          this.selectedReminder = updatedReminder
        }
        
        return updatedReminder
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi đánh dấu hoàn thành'
        console.error('Error marking reminder completed:', err)
        throw err
      }
    },

    async markIncomplete(id: string) {
      try {
        const updatedReminder = await remindersService.markIncomplete(id)
        
        if (Array.isArray(this.reminders)) {
          const index = this.reminders.findIndex(r => r.id === id)
          if (index !== -1) {
            this.reminders[index] = updatedReminder
          }
        }
        
        if (this.selectedReminder?.id === id) {
          this.selectedReminder = updatedReminder
        }
        
        return updatedReminder
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Có lỗi khi đánh dấu chưa hoàn thành'
        console.error('Error marking reminder incomplete:', err)
        throw err
      }
    },

    async snoozeReminder(id: string, snoozeUntil: string) {
      try {
        const reminder = this.reminders.find(r => r.id === id)
        if (!reminder) throw new Error('Reminder not found')
        
        const snoozeDate = new Date(snoozeUntil)
        const updatedReminder = await remindersService.updateReminder({
          id,
          reminderDate: snoozeDate.toISOString().split('T')[0],
          reminderTime: snoozeDate.toTimeString().split(' ')[0].substring(0, 5)
        })
        
        // Update in local state
        const index = this.reminders.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reminders[index] = updatedReminder
        }
        
        // Update selected reminder if it's the same
        if (this.selectedReminder?.id === id) {
          this.selectedReminder = updatedReminder
        }
        
        return updatedReminder
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    async fetchUpcomingReminders(days = 7) {
      try {
        this.isLoading = true
        const endDate = new Date()
        endDate.setDate(endDate.getDate() + days)
        
        // For now, filter from existing reminders
        // In real app, this would be a separate API call
        const upcoming = this.reminders.filter(reminder => {
          const reminderDate = new Date(reminder.reminderDate)
          const now = new Date()
          return reminderDate >= now && reminderDate <= endDate && !reminder.isCompleted
        })
        
        return upcoming
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async duplicateReminder(id: string) {
      try {
        const originalReminder = this.reminders.find(r => r.id === id)
        if (!originalReminder) throw new Error('Reminder not found')
        
        const duplicateData: CreateReminderRequest = {
          title: `${originalReminder.title} (Copy)`,
          description: originalReminder.description,
          reminderDate: originalReminder.reminderDate,
          reminderTime: originalReminder.reminderTime,
          type: originalReminder.type
        }
        
        const newReminder = await this.createReminder(duplicateData)
        return newReminder
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    async bulkMarkCompleted(ids: string[]) {
      try {
        this.isLoading = true
        const promises = ids.map(id => this.markCompleted(id))
        await Promise.all(promises)
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async bulkDelete(ids: string[]) {
      try {
        this.isLoading = true
        const promises = ids.map(id => this.deleteReminder(id))
        await Promise.all(promises)
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // Filter and sort actions
    filterByType(type: Reminder['type']) {
      return this.reminders.filter(reminder => reminder.type === type)
    },

    filterByDateRange(startDate: string, endDate: string) {
      return this.reminders.filter(reminder => 
        reminder.reminderDate >= startDate && reminder.reminderDate <= endDate
      )
    },

    sortByDate(direction: 'asc' | 'desc' = 'asc') {
      const sorted = [...this.reminders].sort((a, b) => {
        const dateA = new Date(a.reminderDate).getTime()
        const dateB = new Date(b.reminderDate).getTime()
        return direction === 'asc' ? dateA - dateB : dateB - dateA
      })
      this.reminders = sorted
    },

    sortByTitle(direction: 'asc' | 'desc' = 'asc') {
      const sorted = [...this.reminders].sort((a, b) => {
        const titleA = a.title.toLowerCase()
        const titleB = b.title.toLowerCase()
        return direction === 'asc' 
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA)
      })
      this.reminders = sorted
    },

    // Search functionality
    searchReminders(query: string) {
      if (!query) return this.reminders
      
      const searchTerm = query.toLowerCase()
      return this.reminders.filter(reminder =>
        reminder.title.toLowerCase().includes(searchTerm) ||
        reminder.description?.toLowerCase().includes(searchTerm)
      )
    },

    // Utility actions
    clearError() {
      this.error = null
    },

    clearSelectedReminder() {
      this.selectedReminder = null
    },

    resetStore() {
      this.reminders = []
      this.isLoading = false
      this.error = null
      this.selectedReminder = null
    },

    // Statistics
    getStatistics() {
      const total = this.remindersCount
      const completed = this.completedCount
      const pending = this.pendingCount
      const overdue = this.overDueReminders.length
      const urgent = this.urgentReminders.length
      
      return {
        total,
        completed,
        pending,
        overdue,
        urgent,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    }
  }
})
