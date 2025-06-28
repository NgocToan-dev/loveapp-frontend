import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { remindersService } from '@/services/reminders'

export interface Reminder {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  type: 'anniversary' | 'birthday' | 'date' | 'gift' | 'surprise' | 'other'
  recurring?: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
    interval: number
  }
  notification: {
    enabled: boolean
    advance: number // minutes before
    methods: ('email' | 'push' | 'sms')[]
  }
  isCompleted: boolean
  priority: 'low' | 'medium' | 'high'
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateReminderData {
  title: string
  description?: string
  date: string
  time?: string
  type: Reminder['type']
  recurring?: Reminder['recurring']
  notification?: Partial<Reminder['notification']>
  priority?: Reminder['priority']
}

export interface UpdateReminderData extends Partial<CreateReminderData> {
  id: string
  isCompleted?: boolean
}

export const useRemindersStore = defineStore('reminders', () => {
  // State
  const reminders = ref<Reminder[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const selectedReminder = ref<Reminder | null>(null)

  // Getters
  const upcomingReminders = computed(() => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    return reminders.value
      .filter(reminder => {
        const reminderDate = new Date(reminder.date)
        return reminderDate >= now && reminderDate <= nextWeek && !reminder.isCompleted
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  })

  const todayReminders = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return reminders.value
      .filter(reminder => reminder.date === today && !reminder.isCompleted)
      .sort((a, b) => {
        if (!a.time && !b.time) return 0
        if (!a.time) return 1
        if (!b.time) return -1
        return a.time.localeCompare(b.time)
      })
  })

  const overDueReminders = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return reminders.value
      .filter(reminder => reminder.date < today && !reminder.isCompleted)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  const completedReminders = computed(() => 
    reminders.value
      .filter(reminder => reminder.isCompleted)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  )

  const remindersByType = computed(() => {
    const grouped: Record<Reminder['type'], Reminder[]> = {
      anniversary: [],
      birthday: [],
      date: [],
      gift: [],
      surprise: [],
      other: []
    }
    
    reminders.value.forEach(reminder => {
      grouped[reminder.type].push(reminder)
    })
    
    return grouped
  })

  const highPriorityReminders = computed(() => 
    reminders.value
      .filter(reminder => reminder.priority === 'high' && !reminder.isCompleted)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  )

  const remindersCount = computed(() => reminders.value.length)
  const pendingCount = computed(() => reminders.value.filter(r => !r.isCompleted).length)
  const completedCount = computed(() => reminders.value.filter(r => r.isCompleted).length)

  // Actions
  const fetchReminders = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await remindersService.getReminders()
      reminders.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Có lỗi khi tải nhắc nhở'
      console.error('Error fetching reminders:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }
          type: 'birthday',
          recurring: {
            enabled: true,
            frequency: 'yearly',
            interval: 1
          },
          notification: {
            enabled: true,
            advance: 10080, // 1 week
            methods: ['email', 'push']
          },
          isCompleted: false,
          priority: 'high',
          createdBy: 'user1',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z'
        }
      ]

      reminders.value = mockReminders
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch reminders'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const createReminder = async (data: CreateReminderData) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await remindersService.createReminder(data)

      const newReminder: Reminder = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        type: data.type,
        recurring: data.recurring,
        notification: {
          enabled: data.notification?.enabled ?? true,
          advance: data.notification?.advance ?? 60,
          methods: data.notification?.methods ?? ['push']
        },
        isCompleted: false,
        priority: data.priority || 'medium',
        createdBy: 'user1', // TODO: Get from auth store
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      reminders.value.push(newReminder)
      return newReminder
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create reminder'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateReminder = async (data: UpdateReminderData) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // const response = await remindersService.updateReminder(data)

      const index = reminders.value.findIndex(r => r.id === data.id)
      if (index === -1) {
        throw new Error('Reminder not found')
      }

      const updatedReminder: Reminder = {
        ...reminders.value[index],
        ...data,
        notification: data.notification 
          ? { ...reminders.value[index].notification, ...data.notification }
          : reminders.value[index].notification,
        updatedAt: new Date().toISOString()
      }

      reminders.value[index] = updatedReminder
      
      if (selectedReminder.value?.id === data.id) {
        selectedReminder.value = updatedReminder
      }

      return updatedReminder
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update reminder'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteReminder = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      // TODO: Replace with actual API call
      // await remindersService.deleteReminder(id)

      const index = reminders.value.findIndex(r => r.id === id)
      if (index === -1) {
        throw new Error('Reminder not found')
      }

      reminders.value.splice(index, 1)
      
      if (selectedReminder.value?.id === id) {
        selectedReminder.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete reminder'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const toggleComplete = async (id: string) => {
    const reminder = reminders.value.find(r => r.id === id)
    if (!reminder) return

    await updateReminder({
      id,
      isCompleted: !reminder.isCompleted
    })
  }

  const markCompleted = async (id: string) => {
    await updateReminder({
      id,
      isCompleted: true
    })
  }

  const markPending = async (id: string) => {
    await updateReminder({
      id,
      isCompleted: false
    })
  }

  const setSelectedReminder = (reminder: Reminder | null) => {
    selectedReminder.value = reminder
  }

  const clearError = () => {
    error.value = null
  }

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
    highPriorityReminders,
    remindersCount,
    pendingCount,
    completedCount,

    // Actions
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    toggleComplete,
    markCompleted,
    markPending,
    setSelectedReminder,
    clearError
  }
})
